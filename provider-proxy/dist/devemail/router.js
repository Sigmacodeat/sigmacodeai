import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './db';
import { z } from 'zod';
import { parseDMARCAggregateXML, persistParsedAggregateToDB } from './parser';
import { runImapFetch, runImapBackfill, downloadAttachmentByFilename } from './imap';
import { loadEnv } from '../config/env';
// __dirname Ersatz für ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data/devemail');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const PARSED_DIR = path.join(DATA_DIR, 'parsed');
async function ensureDirs() {
    await fs.mkdir(RAW_DIR, { recursive: true }).catch(() => { });
    await fs.mkdir(PARSED_DIR, { recursive: true }).catch(() => { });
}
function adminGuard(token) {
    return (req, res, next) => {
        if (!token) {
            // In DEV we allow missing token but show a warning once
            console.warn('[DevEmail] ADMIN_DEV_TOKEN not set. Using open dev access.');
            return next();
        }
        const provided = req.headers['x-admin-dev-token'] || '';
        if (provided && provided === token)
            return next();
        return res.status(401).json({ error: 'unauthorized', message: 'Admin token required' });
    };
}
async function readJsonFiles(dir) {
    try {
        const files = await fs.readdir(dir).catch(() => []);
        const jsons = await Promise.all(files
            .filter((f) => f.toLowerCase().endsWith('.json'))
            .map(async (f) => {
            try {
                const raw = await fs.readFile(path.join(dir, f), 'utf8');
                return JSON.parse(raw);
            }
            catch {
                return null;
            }
        }));
        return jsons.filter(Boolean);
    }
    catch {
        return [];
    }
}
export function buildDevEmailRouter(opts) {
    const router = Router();
    const guard = adminGuard(opts.adminToken);
    const env = loadEnv();
    const ATT_LIMIT_BYTES = Math.max(1, (env.ATTACHMENT_MAX_MB ?? 25)) * 1024 * 1024;
    // Ensure directories exist at startup
    void ensureDirs();
    // Helper: seed minimal demo data into DB if empty (one-time best-effort)
    async function seedIfEmpty() {
        const rawCount = await prisma.rawEmail.count();
        if (rawCount === 0) {
            const raw = await prisma.rawEmail.create({
                data: {
                    source: 'imap:stub',
                    subject: 'DMARC Aggregate Report (stub)',
                    rawHeaders: undefined,
                    rawBody: undefined,
                    attachments: JSON.stringify([{ filename: 'report.xml', mime: 'application/xml', size: 1024 }]),
                    parsed: true,
                },
            });
            // Download Attachment by filename for a raw email (requires imapUid)
            router.get('/raw/:id/attachments/:filename', guard, async (req, res, next) => {
                try {
                    const id = req.params.id;
                    const filename = req.params.filename || '';
                    // Basic filename validation to avoid traversal
                    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
                        return res.status(400).json({ error: 'bad_request', message: 'invalid filename' });
                    }
                    const raw = await prisma.rawEmail.findUnique({ where: { id } });
                    if (!raw) {
                        return res.status(404).json({ error: 'not_found', message: 'Raw email not found' });
                    }
                    const atts = raw.attachments ? JSON.parse(raw.attachments) : [];
                    const meta = atts.find((a) => (a.filename || '').toLowerCase() === filename.toLowerCase());
                    if (!meta) {
                        return res.status(404).json({ error: 'not_found', message: 'Attachment not found' });
                    }
                    // Size guard (configurable via ATTACHMENT_MAX_MB)
                    if (typeof meta.size === 'number' && meta.size > ATT_LIMIT_BYTES) {
                        return res.status(413).json({ error: 'too_large', message: 'Attachment exceeds size limit' });
                    }
                    if (!raw.imapUid) {
                        // Future: optionally read from disk-based seed storage
                        return res.status(501).json({ error: 'not_implemented', message: 'Attachment storage not available for this item' });
                    }
                    const { buffer, mime, dispositionFilename } = await downloadAttachmentByFilename(raw.imapUid, filename);
                    // Final size check if meta.size was missing
                    if (buffer.length > ATT_LIMIT_BYTES) {
                        return res.status(413).json({ error: 'too_large', message: 'Attachment exceeds size limit' });
                    }
                    res.setHeader('Content-Type', mime || 'application/octet-stream');
                    res.setHeader('Content-Disposition', `attachment; filename="${dispositionFilename}"`);
                    res.setHeader('Content-Length', String(buffer.length));
                    res.setHeader('Cache-Control', 'private, max-age=60');
                    return res.status(200).send(buffer);
                }
                catch (err) {
                    return next(err);
                }
            });
            const report = await prisma.dMARCReport.create({
                data: {
                    rawEmailId: raw.id,
                    org: 'example.net',
                    reportId: 'rep-2025-08-27-0001',
                    domain: 'sigmacode.ai',
                    dateBegin: 1727308800,
                    dateEnd: 1727395200,
                    policyAdkim: 'r',
                    policyAspf: 'r',
                    policyP: 'none',
                },
            });
            await prisma.dMARCRecord.create({
                data: {
                    reportId: report.id,
                    sourceIp: '203.0.113.9',
                    count: 10,
                    disposition: 'none',
                    dkim: 'pass',
                    spf: 'pass',
                    headerFrom: 'sigmacode.ai',
                    authDkim: 'pass',
                    authSpf: 'pass',
                },
            });
        }
    }
    // Raw items from DB with Pagination/Filter (fallback: file stubs if DB empty)
    router.get('/raw', guard, async (req, res, next) => {
        try {
            await seedIfEmpty();
            const QuerySchema = z.object({
                page: z.coerce.number().int().min(1).default(1),
                pageSize: z.coerce.number().int().min(1).max(100).default(20),
                q: z.string().trim().min(1).max(200).optional(),
                parsed: z.union([z.literal('true'), z.literal('false')]).optional(),
                hasAttachments: z.union([z.literal('true'), z.literal('false')]).optional(),
                from: z.string().trim().min(1).max(200).optional(),
                to: z.string().trim().min(1).max(200).optional(),
                dateFrom: z.string().datetime().optional(),
                dateTo: z.string().datetime().optional(),
                sort: z
                    .enum(['receivedAt_desc', 'receivedAt_asc', 'size_desc', 'size_asc'])
                    .default('receivedAt_desc')
                    .optional(),
            });
            const qp = QuerySchema.parse(req.query);
            const where = {};
            if (qp.parsed === 'true')
                where.parsed = true;
            if (qp.parsed === 'false')
                where.parsed = false;
            if (qp.hasAttachments === 'true')
                where.hasAttachments = true;
            if (qp.hasAttachments === 'false')
                where.hasAttachments = false;
            if (qp.from)
                where.from = { contains: qp.from, mode: 'insensitive' };
            if (qp.to)
                where.to = { contains: qp.to, mode: 'insensitive' };
            if (qp.q) {
                where.OR = [
                    { subject: { contains: qp.q, mode: 'insensitive' } },
                    { source: { contains: qp.q, mode: 'insensitive' } },
                    { messageId: { contains: qp.q, mode: 'insensitive' } },
                ];
            }
            if (qp.dateFrom || qp.dateTo) {
                where.receivedAt = {};
                if (qp.dateFrom)
                    where.receivedAt.gte = new Date(qp.dateFrom);
                if (qp.dateTo)
                    where.receivedAt.lte = new Date(qp.dateTo);
            }
            const orderBy = (() => {
                if (qp.sort === 'receivedAt_asc')
                    return { receivedAt: 'asc' };
                if (qp.sort === 'size_desc')
                    return { size: 'desc' };
                if (qp.sort === 'size_asc')
                    return { size: 'asc' };
                return { receivedAt: 'desc' };
            })();
            const skip = (qp.page - 1) * qp.pageSize;
            const [count, raws] = await Promise.all([
                prisma.rawEmail.count({ where }),
                prisma.rawEmail.findMany({
                    where,
                    orderBy: orderBy,
                    skip,
                    take: qp.pageSize,
                }),
            ]);
            if (raws.length > 0) {
                const items = raws.map((r) => {
                    const atts = r.attachments ? JSON.parse(r.attachments) : undefined;
                    const hasAttachments = Array.isArray(atts) ? atts.length > 0 : false;
                    return { ...r, attachments: atts, hasAttachments };
                });
                return res.json({ items, count, page: qp.page, pageSize: qp.pageSize });
            }
            // fallback (should rarely happen due to seed)
            const items = await readJsonFiles(RAW_DIR);
            return res.json({ items, count: items.length, page: 1, pageSize: items.length });
        }
        catch (err) {
            return next(err);
        }
    });
    // Raw detail by id
    router.get('/raw/:id', guard, async (req, res, next) => {
        try {
            const id = req.params.id;
            const found = await prisma.rawEmail.findUnique({ where: { id } });
            if (found) {
                const attachments = found.attachments ? JSON.parse(found.attachments) : undefined;
                const headers = found.headers ?? found.rawHeaders ?? undefined;
                return res.json({ ...found, attachments, headers });
            }
            try {
                const file = path.join(RAW_DIR, `${id}.json`);
                const raw = await fs.readFile(file, 'utf8');
                const json = JSON.parse(raw);
                return res.json(json);
            }
            catch {
                return res.status(404).json({ error: 'not_found', message: 'Raw email not found' });
            }
        }
        catch (err) {
            return next(err);
        }
    });
    // DMARC reports (from DB, with records) with Pagination/Filter
    router.get('/dmarc/reports', guard, async (req, res, next) => {
        try {
            await seedIfEmpty();
            const QuerySchema = z.object({
                page: z.coerce.number().int().min(1).default(1),
                pageSize: z.coerce.number().int().min(1).max(100).default(20),
                domain: z.string().trim().min(1).max(200).optional(),
                policyP: z.enum(['none', 'quarantine', 'reject']).optional(),
                dateFrom: z.string().datetime().optional(),
                dateTo: z.string().datetime().optional(),
                q: z.string().trim().min(1).max(200).optional(),
                sort: z.enum(['createdAt_desc', 'createdAt_asc']).optional().default('createdAt_desc'),
            });
            const qp = QuerySchema.parse(req.query);
            const where = {};
            if (qp.domain)
                where.domain = { contains: qp.domain, mode: 'insensitive' };
            if (qp.policyP)
                where.policyP = qp.policyP;
            if (qp.q) {
                where.OR = [
                    { org: { contains: qp.q, mode: 'insensitive' } },
                    { reportId: { contains: qp.q, mode: 'insensitive' } },
                    { domain: { contains: qp.q, mode: 'insensitive' } },
                ];
            }
            if (qp.dateFrom || qp.dateTo) {
                where.createdAt = {};
                if (qp.dateFrom)
                    where.createdAt.gte = new Date(qp.dateFrom);
                if (qp.dateTo)
                    where.createdAt.lte = new Date(qp.dateTo);
            }
            const orderBy = qp.sort === 'createdAt_asc' ? { createdAt: 'asc' } : { createdAt: 'desc' };
            const skip = (qp.page - 1) * qp.pageSize;
            const [count, reports] = await Promise.all([
                prisma.dMARCReport.count({ where }),
                prisma.dMARCReport.findMany({ where, orderBy, skip, take: qp.pageSize, include: { records: true } }),
            ]);
            if (reports.length > 0) {
                const items = reports.map((r) => ({
                    id: r.id,
                    org: r.org ?? undefined,
                    reportId: r.reportId ?? undefined,
                    domain: r.domain ?? undefined,
                    dateBegin: r.dateBegin ?? undefined,
                    dateEnd: r.dateEnd ?? undefined,
                    policyAdkim: r.policyAdkim ?? undefined,
                    policyAspf: r.policyAspf ?? undefined,
                    policyP: r.policyP ?? undefined,
                    records: r.records,
                }));
                return res.json({ items, count, page: qp.page, pageSize: qp.pageSize });
            }
            const items = await readJsonFiles(PARSED_DIR);
            return res.json({ items, count: items.length, page: 1, pageSize: items.length });
        }
        catch (err) {
            return next(err);
        }
    });
    // DMARC single report by id (DB first, fallback file)
    router.get('/dmarc/:id', guard, async (req, res, next) => {
        try {
            const id = req.params.id;
            const found = await prisma.dMARCReport.findUnique({ where: { id }, include: { records: true } });
            if (found)
                return res.json(found);
            try {
                const file = path.join(PARSED_DIR, `${id}.json`);
                const raw = await fs.readFile(file, 'utf8');
                const json = JSON.parse(raw);
                return res.json(json);
            }
            catch {
                return res.status(404).json({ error: 'not_found', message: 'Report not found' });
            }
        }
        catch (err) {
            return next(err);
        }
    });
    // DMARC parse endpoint: accepts { xml: string }
    router.post('/dmarc/parse', guard, async (req, res, next) => {
        try {
            const BodySchema = z.object({ xml: z.string().min(10) });
            const { xml } = BodySchema.parse(req.body);
            const parsed = parseDMARCAggregateXML(xml);
            const report = await persistParsedAggregateToDB(parsed);
            const full = await prisma.dMARCReport.findUnique({ where: { id: report.id }, include: { records: true } });
            return res.status(201).json(full);
        }
        catch (err) {
            return next(err);
        }
    });
    // Trigger refresh (IMAP fetcher)
    router.post('/refresh', guard, async (_req, res, next) => {
        try {
            const result = await runImapFetch(10);
            return res.status(202).json({ ok: true, ...result });
        }
        catch (err) {
            return next(err);
        }
    });
    // Trigger backfill (parse existing unparsed raws)
    router.post('/backfill', guard, async (_req, res, next) => {
        try {
            const result = await runImapBackfill(50);
            return res.status(202).json({ ok: true, ...result });
        }
        catch (err) {
            return next(err);
        }
    });
    return router;
}
