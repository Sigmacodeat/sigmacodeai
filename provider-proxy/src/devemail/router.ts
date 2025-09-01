import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './db';
import { z } from 'zod';
import { parseDMARCAggregateXML, persistParsedAggregateToDB } from './parser';
import { runImapFetch, runImapBackfill, downloadAttachmentByFilename } from './imap';
import { loadEnv } from '../config/env';
import crypto from 'crypto';

/**
 * Dev Email Analytics Router (MVP)
 * - Admin-Guard via Header `x-admin-dev-token`
 * - File-basierter Stub-Speicher unter provider-proxy/data/devemail/
 * - Endpunkte:
 *   GET   /raw                      -> Liste der Raw-Items (Pagination/Filter)
 *   GET   /raw/:id                  -> Raw-Details (Body/Headers/Attachments)
 *   GET   /dmarc/reports            -> Liste geparster DMARC-Reports (Pagination/Filter)
 *   GET   /dmarc/:id                -> Einzelreport (Stub)
 *   POST  /refresh                  -> Trigger für zukünftigen IMAP-Fetch (Stub)
 */

export interface BuildDevEmailOptions {
  adminToken: string;
}

// __dirname Ersatz für ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data/devemail');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const PARSED_DIR = path.join(DATA_DIR, 'parsed');

async function ensureDirs() {
  await fs.mkdir(RAW_DIR, { recursive: true }).catch(() => {});
  await fs.mkdir(PARSED_DIR, { recursive: true }).catch(() => {});
}

function adminGuard(token: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!token) {
      // In DEV we allow missing token but show a warning once
      console.warn('[DevEmail] ADMIN_DEV_TOKEN not set. Using open dev access.');
      return next();
    }
    const provided = (req.headers['x-admin-dev-token'] as string) || '';
    if (provided && provided === token) return next();
    return res.status(401).json({ error: 'unauthorized', message: 'Admin token required' });
  };
}

async function readJsonFiles(dir: string): Promise<any[]> {
  try {
    const files = await fs.readdir(dir).catch(() => []);
    const jsons = await Promise.all(
      files
        .filter((f) => f.toLowerCase().endsWith('.json'))
        .map(async (f) => {
          try {
            const raw = await fs.readFile(path.join(dir, f), 'utf8');
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })
    );
    return jsons.filter(Boolean);
  } catch {
    return [];
  }
}

// Helpers: Zod error handling and filename sanitization
function isZodError(err: unknown): err is z.ZodError {
  return !!err && typeof err === 'object' && 'issues' in (err as any);
}

function sendZodError(res: Response, err: z.ZodError) {
  return res.status(400).json({ error: 'bad_request', message: 'Invalid request parameters', issues: err.issues });
}

function sanitizeFilename(name: string, fallback = 'file') {
  const base = (name || '').replace(/[\r\n\t"']/g, ' ').trim();
  const safe = base.match(/^[A-Za-z0-9._-]{1,200}$/) ? base : fallback;
  return safe || fallback;
}

// DRY helper for JSON responses that must not be cached and vary by admin token
function setNoStore(res: Response, vary: string = 'X-Admin-Dev-Token') {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', vary);
}

export function buildDevEmailRouter(opts: BuildDevEmailOptions) {
  const router = Router();
  const guard = adminGuard(opts.adminToken);
  const env = loadEnv();
  const ATT_LIMIT_BYTES = Math.max(1, (env.ATTACHMENT_MAX_MB ?? 25)) * 1024 * 1024;

  // Rate limiting for attachment downloads (per IP)
  const downloadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 downloads/minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'rate_limited', message: 'Too many download requests, please try again later.' },
  });

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
  router.get('/raw', guard, async (req: Request, res: Response, next: NextFunction) => {
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
      const parsed = QuerySchema.safeParse(req.query);
      if (!parsed.success) return sendZodError(res, parsed.error);
      const qp = parsed.data;

      const where: any = {};
      if (qp.parsed === 'true') where.parsed = true;
      if (qp.parsed === 'false') where.parsed = false;
      if (qp.hasAttachments === 'true') where.hasAttachments = true;
      if (qp.hasAttachments === 'false') where.hasAttachments = false;
      if (qp.from) where.from = { contains: qp.from, mode: 'insensitive' };
      if (qp.to) where.to = { contains: qp.to, mode: 'insensitive' };
      if (qp.q) {
        where.OR = [
          { subject: { contains: qp.q, mode: 'insensitive' } },
          { source: { contains: qp.q, mode: 'insensitive' } },
          { messageId: { contains: qp.q, mode: 'insensitive' } },
        ];
      }
      if (qp.dateFrom || qp.dateTo) {
        where.receivedAt = {};
        if (qp.dateFrom) (where.receivedAt as any).gte = new Date(qp.dateFrom);
        if (qp.dateTo) (where.receivedAt as any).lte = new Date(qp.dateTo);
      }

      const orderBy = (() => {
        if (qp.sort === 'receivedAt_asc') return { receivedAt: 'asc' as const };
        if (qp.sort === 'size_desc') return { size: 'desc' } as any;
        if (qp.sort === 'size_asc') return { size: 'asc' } as any;
        return { receivedAt: 'desc' as const };
      })();

      const skip = (qp.page - 1) * qp.pageSize;
      const [count, raws] = await Promise.all([
        prisma.rawEmail.count({ where }),
        prisma.rawEmail.findMany({
          where,
          orderBy: orderBy as any,
          skip,
          take: qp.pageSize,
        }),
      ]);
      if (raws.length > 0) {
        const items = raws.map((r) => {
          let atts: any[] | undefined = undefined;
          if (r.attachments) {
            try {
              atts = JSON.parse(r.attachments);
            } catch {
              atts = undefined;
            }
          }
          const hasAttachments = Array.isArray(atts) ? atts.length > 0 : false;
          return { ...r, attachments: atts, hasAttachments } as any;
        });
        setNoStore(res);
        return res.json({ items, count, page: qp.page, pageSize: qp.pageSize });
      }
      // fallback (should rarely happen due to seed)
      const items = await readJsonFiles(RAW_DIR);
      setNoStore(res);
      return res.json({ items, count: items.length, page: 1, pageSize: items.length });
    } catch (err) {
      if (isZodError(err)) return sendZodError(res, err);
      return next(err);
    }
  });

  // Raw detail by id
  router.get('/raw/:id', guard, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ParamIdSchema = z.object({ id: z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/) });
      const parsedParams = ParamIdSchema.safeParse(req.params);
      if (!parsedParams.success) return sendZodError(res, parsedParams.error);
      const { id } = parsedParams.data;
      const found = await prisma.rawEmail.findUnique({ where: { id } });
      if (found) {
        let attachments: any[] | undefined = undefined;
        if (found.attachments) {
          try {
            attachments = JSON.parse(found.attachments);
          } catch {
            attachments = undefined;
          }
        }
        const headers = (found as any).headers ?? found.rawHeaders ?? undefined;
        setNoStore(res);
        return res.json({ ...found, attachments, headers });
      }
      try {
        const file = path.join(RAW_DIR, `${id}.json`);
        const raw = await fs.readFile(file, 'utf8');
        const json = JSON.parse(raw);
        setNoStore(res);
        return res.json(json);
      } catch {
        return res.status(404).json({ error: 'not_found', message: 'Raw email not found' });
      }
    } catch (err) {
      return next(err);
    }
  });

  // Download Attachment by filename for a raw email (requires imapUid)
  router.get(
    '/raw/:id/attachments/:filename',
    downloadLimiter,
    guard,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ParamSchema = z.object({
          id: z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/),
          filename: z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9._-]+$/),
        });
        const parsedParams = ParamSchema.safeParse(req.params);
        if (!parsedParams.success) return sendZodError(res, parsedParams.error);
        const { id, filename } = parsedParams.data;

        // Basic filename validation to avoid traversal
        // already validated via Zod regex

        const raw = await prisma.rawEmail.findUnique({ where: { id } });
        if (!raw) {
          return res.status(404).json({ error: 'not_found', message: 'Raw email not found' });
        }

        let atts: Array<{ filename: string; size?: number; mime?: string }> = [];
        if (raw.attachments) {
          try {
            atts = JSON.parse(raw.attachments) as Array<{ filename: string; size?: number; mime?: string }>;
          } catch {
            atts = [];
          }
        }
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

        // ETag for conditional GET
        const etag = 'W/"' + crypto.createHash('sha1').update(buffer).digest('hex') + '"';
        if (req.headers['if-none-match'] === etag) {
          res.setHeader('ETag', etag);
          res.setHeader('Cache-Control', 'private, max-age=60');
          res.setHeader('Vary', 'X-Admin-Dev-Token, If-None-Match');
          return res.sendStatus(304);
        }

        // Final size check if meta.size was missing
        if (buffer.length > ATT_LIMIT_BYTES) {
          return res.status(413).json({ error: 'too_large', message: 'Attachment exceeds size limit' });
        }

        const safeDisp = sanitizeFilename(dispositionFilename || meta.filename || filename, 'download');
        res.setHeader('Content-Type', mime || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${safeDisp}"`);
        res.setHeader('Content-Length', String(buffer.length));
        res.setHeader('Cache-Control', 'private, max-age=60');
        res.setHeader('ETag', etag);
        res.setHeader('Vary', 'X-Admin-Dev-Token, If-None-Match');
        // Security hardening headers for binary download
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Content-Security-Policy', "default-src 'none'");
        res.setHeader('Accept-Ranges', 'none');
        return res.status(200).send(buffer);
      } catch (err) {
        return next(err);
      }
    }
  );

  // DMARC reports (from DB, with records) with Pagination/Filter
  router.get('/dmarc/reports', guard, async (req: Request, res: Response, next: NextFunction) => {
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
      const parsed = QuerySchema.safeParse(req.query);
      if (!parsed.success) return sendZodError(res, parsed.error);
      const qp = parsed.data;

      const where: any = {};
      if (qp.domain) where.domain = { contains: qp.domain, mode: 'insensitive' };
      if (qp.policyP) where.policyP = qp.policyP;
      if (qp.q) {
        where.OR = [
          { org: { contains: qp.q, mode: 'insensitive' } },
          { reportId: { contains: qp.q, mode: 'insensitive' } },
          { domain: { contains: qp.q, mode: 'insensitive' } },
        ];
      }
      if (qp.dateFrom || qp.dateTo) {
        where.createdAt = {};
        if (qp.dateFrom) (where.createdAt as any).gte = new Date(qp.dateFrom);
        if (qp.dateTo) (where.createdAt as any).lte = new Date(qp.dateTo);
      }

      const orderBy = qp.sort === 'createdAt_asc' ? { createdAt: 'asc' as const } : { createdAt: 'desc' as const };
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
        setNoStore(res);
        return res.json({ items, count, page: qp.page, pageSize: qp.pageSize });
      }
      const items = await readJsonFiles(PARSED_DIR);
      setNoStore(res);
      return res.json({ items, count: items.length, page: 1, pageSize: items.length });
    } catch (err) {
      if (isZodError(err)) return sendZodError(res, err);
      return next(err);
    }
  });

  // DMARC single report by id (DB first, fallback file)
  router.get('/dmarc/:id', guard, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ParamIdSchema = z.object({ id: z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/) });
      const parsedParams = ParamIdSchema.safeParse(req.params);
      if (!parsedParams.success) return sendZodError(res, parsedParams.error);
      const { id } = parsedParams.data;
      const found = await prisma.dMARCReport.findUnique({ where: { id }, include: { records: true } });
      if (found) {
        setNoStore(res);
        return res.json(found);
      }
      try {
        const file = path.join(PARSED_DIR, `${id}.json`);
        const raw = await fs.readFile(file, 'utf8');
        const json = JSON.parse(raw);
        setNoStore(res);
        return res.json(json);
      } catch {
        return res.status(404).json({ error: 'not_found', message: 'Report not found' });
      }
    } catch (err) {
      return next(err);
    }
  });

  // DMARC parse endpoint: accepts { xml: string }
  router.post('/dmarc/parse', guard, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const BodySchema = z.object({ xml: z.string().min(10) });
      const bodyParsed = BodySchema.safeParse(req.body);
      if (!bodyParsed.success) return sendZodError(res, bodyParsed.error);
      const { xml } = bodyParsed.data;
      const parsed = parseDMARCAggregateXML(xml);
      const report = await persistParsedAggregateToDB(parsed);
      const full = await prisma.dMARCReport.findUnique({ where: { id: report.id }, include: { records: true } });
      setNoStore(res);
      return res.status(201).json(full);
    } catch (err) {
      if (isZodError(err)) return sendZodError(res, err);
      return next(err);
    }
  });

  // Trigger refresh (IMAP fetcher)
  router.post('/refresh', guard, async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await runImapFetch(10);
      setNoStore(res);
      return res.status(202).json({ ok: true, ...result });
    } catch (err) {
      return next(err);
    }
  });

  // Trigger backfill (parse existing unparsed raws)
  router.post('/backfill', guard, async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await runImapBackfill(50);
      setNoStore(res);
      return res.status(202).json({ ok: true, ...result });
    } catch (err) {
      return next(err);
    }
  });

  return router;
}
