import { ImapFlow } from 'imapflow';
import prisma from './db';
import { loadEnv } from '../config/env';
import { parseDMARCAggregateXML, persistParsedAggregateToDB } from './parser';
import * as zlib from 'zlib';
import unzipper from 'unzipper';
/**
 * Minimaler IMAP-Fetcher (MVP)
 * - nutzt ENV: IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS, IMAP_TLS
 * - holt bis zu N neueste Mails aus INBOX
 * - speichert Basisinfos als RawEmail (subject, receivedAt)
 * - Attachments/Parsing folgen in späteren Iterationen
 */
export async function runImapFetch(limit = 10) {
    const env = loadEnv();
    const { IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS, IMAP_TLS } = env;
    const notes = [];
    if (!IMAP_HOST || !IMAP_PORT || !IMAP_USER || !IMAP_PASS) {
        return { fetched: 0, saved: 0, errors: 0, notes: ['IMAP env incomplete; skipping.'] };
    }
    // Helper to create a client with given connection parameters
    const createClient = (host, port, secure) => new ImapFlow({
        host,
        port,
        secure,
        auth: { user: IMAP_USER, pass: IMAP_PASS },
        // Timeouts/Hardening
        socketTimeout: 60_000,
        // Enable logging to aid debugging (visible in server console)
        logger: console,
    });
    let client = createClient(IMAP_HOST, IMAP_PORT, !!IMAP_TLS);
    client.on('error', (err) => {
        console.warn('[ImapFlow] client error (backfill):', err?.message || err);
    });
    client.on('error', (err) => {
        console.warn('[ImapFlow] client error (fetch):', err?.message || err);
    });
    let fetched = 0;
    let saved = 0;
    let errors = 0;
    try {
        try {
            await client.connect();
        }
        catch (e) {
            const err = e;
            notes.push(`connect failed (host=${IMAP_HOST} port=${IMAP_PORT} secure=${!!IMAP_TLS}) name=${err.name || ''} message=${err.message}`);
            // Fallback: try STARTTLS on 143 if first attempt fails
            try {
                try {
                    await client.logout();
                }
                catch { }
                try {
                    await client.close();
                }
                catch { }
                client = createClient(IMAP_HOST, 143, false);
                client.on('error', (err) => {
                    console.warn('[ImapFlow] client error (fetch:fallback):', err?.message || err);
                });
                await client.connect();
                notes.push('fallback connect succeeded (port=143 STARTTLS)');
            }
            catch (e2) {
                const err2 = e2;
                notes.push(`fallback connect failed (host=${IMAP_HOST} port=143 secure=false) name=${err2.name || ''} message=${err2.message}`);
                throw e2; // give up
            }
        }
        await client.mailboxOpen('INBOX');
        // Suche: letzte Mails (nach UID absteigend)
        const status = await client.status('INBOX', { messages: true, uidNext: true });
        const maxUid = Number(status.uidNext || 1) - 1;
        const startUid = Math.max(1, maxUid - limit + 1);
        const range = `${startUid}:${maxUid}`;
        const lock = await client.getMailboxLock('INBOX');
        try {
            for await (const msg of client.fetch(range, { envelope: true, internalDate: true, bodyStructure: true, uid: true })) {
                fetched += 1;
                try {
                    const subject = msg.envelope?.subject || undefined;
                    const internalDate = msg.internalDate ? new Date(msg.internalDate) : new Date();
                    const imapUid = Number(msg.uid || 0) || undefined;
                    // Envelope.messageId kann <> sein (Array/ string). Normalisieren auf string | undefined
                    const messageId = normalizeMessageId(msg.envelope?.messageId);
                    // Idempotenz: existiert diese Mail schon?
                    if (messageId) {
                        const existsByMsgId = await prisma.rawEmail.findUnique({ where: { messageId } }).catch(() => null);
                        if (existsByMsgId) {
                            notes.push(`skip existing messageId=${messageId}`);
                            continue;
                        }
                    }
                    if (imapUid) {
                        const existsByUid = await prisma.rawEmail.findFirst({ where: { imapUid } }).catch(() => null);
                        if (existsByUid) {
                            notes.push(`skip existing imapUid=${imapUid}`);
                            continue;
                        }
                    }
                    // Sammle Attachments (nur Metadaten + ggf. Inhalt für DMARC)
                    const attachmentsMeta = [];
                    let parsed = false;
                    let parseError;
                    let rawEmailId;
                    const parts = flattenParts(msg.bodyStructure);
                    const attachParts = parts.filter(p => !!p.disposition && p.disposition.type?.toLowerCase() === 'attachment');
                    // Zuerst RawEmail anlegen (wir können später updaten)
                    const raw = await prisma.rawEmail.create({
                        data: {
                            source: 'imap:fetch',
                            subject,
                            receivedAt: internalDate,
                            parsed: false,
                            imapUid,
                            messageId,
                        },
                    });
                    rawEmailId = raw.id;
                    for (const part of attachParts) {
                        const filename = part.disposition?.params?.filename || part.parameters?.name || 'attachment';
                        const subtype = part.subtype || 'octet-stream';
                        const mime = `${part.type}/${subtype}`.toLowerCase();
                        const size = Number(part.size || 0);
                        attachmentsMeta.push({ filename, mime, size });
                        // Nur wenn DMARC-relevant: xml/zip/gz.
                        const isXML = filename.toLowerCase().endsWith('.xml') || mime.includes('xml');
                        const isGZ = filename.toLowerCase().endsWith('.gz') || mime.includes('gzip');
                        const isZIP = filename.toLowerCase().endsWith('.zip') || mime.includes('zip');
                        if (!(isXML || isGZ || isZIP))
                            continue;
                        // Attachment herunterladen
                        const { content } = await client.download(msg.uid, part.part);
                        const buf = await streamToBuffer(content);
                        try {
                            if (isXML) {
                                const xml = buf.toString('utf8');
                                await parseAndPersist(xml, rawEmailId);
                                parsed = true;
                            }
                            else if (isGZ) {
                                const unzipped = await gunzipBuffer(buf);
                                const xml = unzipped.toString('utf8');
                                await parseAndPersist(xml, rawEmailId);
                                parsed = true;
                            }
                            else if (isZIP) {
                                const xmls = await extractZipXMLs(buf);
                                for (const xml of xmls) {
                                    await parseAndPersist(xml, rawEmailId);
                                    parsed = true;
                                }
                            }
                        }
                        catch (e) {
                            parseError = e.message;
                            notes.push(`parse error uid=${msg.uid}: ${parseError}`);
                        }
                    }
                    await prisma.rawEmail.update({
                        where: { id: rawEmailId },
                        data: {
                            attachments: JSON.stringify(attachmentsMeta),
                            parsed,
                            error: parseError,
                        },
                    });
                    saved += 1;
                }
                catch (e) {
                    errors += 1;
                    notes.push(`save error: ${e.message}`);
                }
            }
        }
        finally {
            lock.release();
        }
    }
    catch (e) {
        errors += 1;
        notes.push(`imap error: ${e.message}`);
    }
    finally {
        try {
            await client.logout();
        }
        catch { }
        try {
            await client.close();
        }
        catch { }
    }
    return { fetched, saved, errors, notes };
}
/**
 * Backfill-Parser: Parst bereits gespeicherte RawEmails (parsed=false) anhand der imapUid erneut
 * und schreibt DMARC-Reports nach. Nützlich, wenn Parsing nachträglich aktiviert wurde.
 */
export async function runImapBackfill(limit = 50) {
    const env = loadEnv();
    const { IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS, IMAP_TLS } = env;
    const notes = [];
    if (!IMAP_HOST || !IMAP_PORT || !IMAP_USER || !IMAP_PASS) {
        return { fetched: 0, saved: 0, errors: 0, notes: ['IMAP env incomplete; skipping.'] };
    }
    const createClient = (host, port, secure) => new ImapFlow({
        host,
        port,
        secure,
        auth: { user: IMAP_USER, pass: IMAP_PASS },
        socketTimeout: 60_000,
        logger: console,
    });
    let client = createClient(IMAP_HOST, IMAP_PORT, !!IMAP_TLS);
    let fetched = 0;
    let saved = 0;
    let errors = 0;
    try {
        try {
            await client.connect();
        }
        catch (e) {
            try {
                await client.logout();
            }
            catch { }
            try {
                await client.close();
            }
            catch { }
            client = createClient(IMAP_HOST, 143, false);
            client.on('error', (err) => {
                console.warn('[ImapFlow] client error (backfill:fallback):', err?.message || err);
            });
            await client.connect();
            notes.push('fallback connect succeeded (port=143 STARTTLS)');
        }
        await client.mailboxOpen('INBOX');
        const raws = await prisma.rawEmail.findMany({
            where: { parsed: false, imapUid: { not: null } },
            orderBy: { receivedAt: 'desc' },
            take: limit,
        });
        const lock = await client.getMailboxLock('INBOX');
        try {
            for (const r of raws) {
                if (!r.imapUid)
                    continue;
                fetched += 1;
                try {
                    const uid = r.imapUid;
                    // fetch single message structure by UID (use fetchOne to avoid open iterators)
                    const msg = await client.fetchOne(uid, { bodyStructure: true, uid: true }).catch(() => undefined);
                    if (!msg) {
                        notes.push(`uid ${uid} not found`);
                        continue;
                    }
                    const attachmentsMeta = [];
                    let parsed = false;
                    let parseError;
                    const parts = flattenParts(msg.bodyStructure);
                    const attachParts = parts.filter(p => !!p.disposition && p.disposition.type?.toLowerCase() === 'attachment');
                    for (const part of attachParts) {
                        const filename = part.disposition?.params?.filename || part.parameters?.name || 'attachment';
                        const subtype = part.subtype || 'octet-stream';
                        const mime = `${part.type}/${subtype}`.toLowerCase();
                        const size = Number(part.size || 0);
                        attachmentsMeta.push({ filename, mime, size });
                        const isXML = filename.toLowerCase().endsWith('.xml') || mime.includes('xml');
                        const isGZ = filename.toLowerCase().endsWith('.gz') || mime.includes('gzip');
                        const isZIP = filename.toLowerCase().endsWith('.zip') || mime.includes('zip');
                        if (!(isXML || isGZ || isZIP))
                            continue;
                        const { content } = await client.download(uid, part.part);
                        const buf = await streamToBuffer(content);
                        try {
                            if (isXML) {
                                const xml = buf.toString('utf8');
                                await parseAndPersist(xml, r.id);
                                parsed = true;
                            }
                            else if (isGZ) {
                                const unzipped = await gunzipBuffer(buf);
                                const xml = unzipped.toString('utf8');
                                await parseAndPersist(xml, r.id);
                                parsed = true;
                            }
                            else if (isZIP) {
                                const xmls = await extractZipXMLs(buf);
                                for (const xml of xmls) {
                                    await parseAndPersist(xml, r.id);
                                    parsed = true;
                                }
                            }
                        }
                        catch (e) {
                            parseError = e.message;
                            notes.push(`parse error (backfill) uid=${uid}: ${parseError}`);
                        }
                    }
                    await prisma.rawEmail.update({
                        where: { id: r.id },
                        data: { attachments: JSON.stringify(attachmentsMeta), parsed, error: parseError },
                    });
                    saved += 1;
                }
                catch (e) {
                    errors += 1;
                    notes.push(`backfill save error: ${e.message}`);
                }
            }
        }
        finally {
            lock.release();
        }
    }
    catch (e) {
        errors += 1;
        notes.push(`imap error: ${e.message}`);
    }
    finally {
        try {
            await client.logout();
        }
        catch { }
        try {
            await client.close();
        }
        catch { }
    }
    return { fetched, saved, errors, notes };
}
function flattenParts(node) {
    if (!node)
        return [];
    const arr = Array.isArray(node) ? node : [node];
    const out = [];
    for (const n of arr) {
        out.push(n);
        if (n.childNodes?.length) {
            out.push(...flattenParts(n.childNodes));
        }
    }
    return out;
}
async function streamToBuffer(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (d) => chunks.push(d));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}
async function gunzipBuffer(buf) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(buf, (err, out) => (err ? reject(err) : resolve(out)));
    });
}
async function extractZipXMLs(buf) {
    const xmls = [];
    const directory = await unzipper.Open.buffer(buf);
    for (const entry of directory.files) {
        if (entry.type === 'File' && entry.path.toLowerCase().endsWith('.xml')) {
            const content = await entry.buffer();
            xmls.push(content.toString('utf8'));
        }
    }
    return xmls;
}
async function parseAndPersist(xml, rawEmailId) {
    const parsed = parseDMARCAggregateXML(xml);
    const report = await persistParsedAggregateToDB(parsed);
    if (rawEmailId) {
        await prisma.dMARCReport.update({ where: { id: report.id }, data: { rawEmailId } });
    }
}
function normalizeMessageId(input) {
    if (!input)
        return undefined;
    const first = Array.isArray(input) ? input[0] : input;
    const s = String(first).trim();
    return s.length ? s : undefined;
}
/**
 * Download eines Attachments anhand von UID und Dateinamen.
 * Sucht in der Body-Structure nach einem Attachment-Part mit passendem Filename.
 */
export async function downloadAttachmentByFilename(imapUid, filename) {
    const env = loadEnv();
    const { IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS, IMAP_TLS } = env;
    if (!IMAP_HOST || !IMAP_PORT || !IMAP_USER || !IMAP_PASS) {
        throw new Error('IMAP configuration incomplete');
    }
    const createClient = (host, port, secure) => new ImapFlow({ host, port, secure, auth: { user: IMAP_USER, pass: IMAP_PASS }, socketTimeout: 60_000, logger: console });
    let client = createClient(IMAP_HOST, IMAP_PORT, !!IMAP_TLS);
    try {
        try {
            await client.connect();
        }
        catch {
            try {
                await client.logout();
            }
            catch { }
            try {
                await client.close();
            }
            catch { }
            client = createClient(IMAP_HOST, 143, false);
            await client.connect();
        }
        await client.mailboxOpen('INBOX');
        const msg = await client.fetchOne(imapUid, { bodyStructure: true, uid: true }).catch(() => undefined);
        if (!msg)
            throw new Error('message not found');
        const parts = flattenParts(msg.bodyStructure);
        const lower = filename.toLowerCase();
        const attach = parts.find((p) => {
            const disp = p.disposition;
            const name = disp?.params?.filename || p.parameters?.name;
            if (!disp || (disp.type || '').toLowerCase() !== 'attachment')
                return false;
            return String(name || '').toLowerCase() === lower;
        });
        if (!attach)
            throw new Error('attachment not found');
        const subtype = attach.subtype || 'octet-stream';
        const mime = `${attach.type}/${subtype}`.toLowerCase();
        const { content } = await client.download(imapUid, attach.part);
        const buffer = await streamToBuffer(content);
        const dispName = attach.disposition?.params?.filename || filename;
        return { buffer, mime, dispositionFilename: dispName };
    }
    finally {
        try {
            await client.logout();
        }
        catch { }
        try {
            await client.close();
        }
        catch { }
    }
}
