import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import helmet from 'helmet';
import cors from 'cors';
import Stripe from 'stripe';
import Redis from 'ioredis';
import { loadEnv } from './config/env';
// Basic config (validated)
const ENV = loadEnv();
const PORT = ENV.PORT || 8787;
const BILLING_ENABLED = ENV.flags.billingEnabled;
const QUOTA_DEFAULT_DAILY_TOKENS = ENV.QUOTA_DEFAULT_DAILY_TOKENS || 100_000;
const REDIS_URL = ENV.REDIS_URL;
const IMAP_FETCH_INTERVAL_SEC = ENV.IMAP_FETCH_INTERVAL_SEC || 900;
// Optional Redis client for quotas
const redis = REDIS_URL ? new Redis(REDIS_URL, { lazyConnect: true }) : null;
if (redis) {
    redis.connect().catch((e) => {
        const err = e;
        console.warn('Redis connect error (quota disabled):', err?.message || e);
    });
}
// Very simple cost map (USD per 1k tokens). Extend as needed.
const COSTS_PER_1K = {
    'openai:gpt-4o-mini': { input: 0.15, output: 0.6 },
    'openai:gpt-4o': { input: 5, output: 15 },
    'openai:gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    'anthropic:claude-3-5-sonnet': { input: 3, output: 15 },
    'anthropic:claude-3-opus': { input: 15, output: 75 },
    'anthropic:claude-3-haiku': { input: 0.25, output: 1.25 },
    'google:gemini-1.5-pro': { input: 1.25, output: 5 },
    'google:gemini-1.5-flash': { input: 0.075, output: 0.3 },
    'groq:llama-3.1-70b': { input: 0.59, output: 0.79 },
    'mistral:mistral-large': { input: 4, output: 12 },
    'openrouter:any': { input: 1, output: 2 },
    'perplexity:any': { input: 1, output: 2 },
};
function computeCostUsd(provider, model, inputTokens, outputTokens) {
    const key = `${provider}:${(model || 'any').toLowerCase()}`;
    const entry = COSTS_PER_1K[key] || COSTS_PER_1K[`${provider}:any`];
    if (!entry)
        return undefined;
    const inK = (inputTokens || 0) / 1000;
    const outK = (outputTokens || 0) / 1000;
    const inputCost = inK * entry.input;
    const outputCost = outK * (entry.output ?? entry.input);
    const total = inputCost + outputCost;
    return Math.round(total * 10000) / 10000; // 4 decimals
}
// Provider targets and header injectors
const PROVIDERS = {
    openai: {
        target: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        authHeader: () => ({ Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}` }),
    },
    anthropic: {
        target: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
        authHeader: () => ({ 'x-api-key': `${process.env.ANTHROPIC_API_KEY || ''}` }),
    },
    google: {
        target: process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com',
        authHeader: () => ({}), // API key typically via query param; we inject if missing
    },
    groq: {
        target: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
        authHeader: () => ({ Authorization: `Bearer ${process.env.GROQ_API_KEY || ''}` }),
    },
    mistral: {
        target: process.env.MISTRAL_BASE_URL || 'https://api.mistral.ai/v1',
        authHeader: () => ({ Authorization: `Bearer ${process.env.MISTRAL_API_KEY || ''}` }),
    },
    openrouter: {
        target: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
        authHeader: () => ({ Authorization: `Bearer ${process.env.OPENROUTER_KEY || ''}` }),
    },
    perplexity: {
        target: process.env.PERPLEXITY_BASE_URL || 'https://api.perplexity.ai',
        authHeader: () => ({ Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY || ''}` }),
    },
};
// OpenMeter emit helper (non-blocking)
async function emitUsage(event) {
    try {
        if (!ENV.flags.billingEnabled)
            return;
        const endpoint = ENV.OPENMETER_ENDPOINT;
        const token = ENV.OPENMETER_TOKEN;
        if (!endpoint || !token)
            return;
        await fetch(`${endpoint.replace(/\/$/, '')}/ingest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                type: 'llm_usage',
                time: new Date().toISOString(),
                properties: event,
            }),
        }).catch(() => { });
    }
    catch { }
}
const app = express();
// Security headers
app.use(helmet());
// Conditional CORS by ENV.CORS_ORIGINS (comma-separated). If empty, skip CORS.
const corsOrigins = (ENV.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
if (corsOrigins.length > 0) {
    app.use(cors({ origin: corsOrigins, credentials: true }));
}
// Stripe webhook must use raw body before JSON parser
const stripeSecret = ENV.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null;
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (stripe && whSecret && typeof sig === 'string') {
            const event = stripe.webhooks.constructEvent(req.body, sig, whSecret);
            // Minimal handling: log and ack
            console.log('Stripe event:', event.type);
            return res.json({ received: true });
        }
        // If not configured, accept to avoid retries during dev
        return res.status(202).json({ ok: true });
    }
    catch (err) {
        const message = err.message;
        console.error('Stripe webhook error:', message);
        return res.status(400).send(`Webhook Error: ${message}`);
    }
});
// JSON parser for all other routes
app.use(express.json({ limit: '5mb' }));
app.use(morgan('tiny'));
// Health
app.get('/health', (_req, res) => res.json({ ok: true }));
// DEV mode router (email analytics) — mounted only if DEV_MODE is true
if (ENV.flags.devMode) {
    // Lazy import to avoid build-time dependency when DEV_MODE is off
    import('./devemail/router')
        .then(({ buildDevEmailRouter }) => {
        const adminToken = ENV.ADMIN_DEV_TOKEN || '';
        const basePath = '/api/dev/email';
        app.use(basePath, buildDevEmailRouter({
            adminToken,
        }));
        console.log(`Dev Email Analytics router mounted at ${basePath}`);
        // Schedule periodic IMAP fetches in DEV mode (configurable interval)
        const scheduleLabel = `IMAP fetch every ${IMAP_FETCH_INTERVAL_SEC}s`;
        const runScheduledFetch = async () => {
            try {
                const { runImapFetch } = await import('./devemail/imap');
                const result = await runImapFetch(10);
                console.log(`[Scheduler] ${scheduleLabel} ->`, result);
            }
            catch (e) {
                console.warn('[Scheduler] IMAP fetch failed:', e?.message || e);
            }
        };
        // First run shortly after boot to avoid overlapping with server start
        setTimeout(runScheduledFetch, Math.min(30, IMAP_FETCH_INTERVAL_SEC) * 1000);
        setInterval(runScheduledFetch, IMAP_FETCH_INTERVAL_SEC * 1000);
    })
        .catch((e) => {
        console.warn('Dev Email Analytics router failed to mount:', e?.message || e);
    });
}
// Factory to mount a provider prefix
function mountProvider(prefix) {
    const provider = PROVIDERS[prefix];
    if (!provider)
        return;
    const basePath = `/${prefix}`;
    // Pre-quota check middleware
    app.use(basePath, async (req, res, next) => {
        try {
            if (!BILLING_ENABLED || !redis)
                return next();
            const tenantId = req.headers['x-tenant-id'] || 'anon';
            const limit = QUOTA_DEFAULT_DAILY_TOKENS > 0 ? QUOTA_DEFAULT_DAILY_TOKENS : Number.MAX_SAFE_INTEGER;
            // estimate input tokens: prefer content-length; fallback to body length if JSON
            let est = 0;
            if (req.headers['content-length']) {
                const inLen = Number(req.headers['content-length']);
                est = Number.isFinite(inLen) && inLen > 0 ? Math.max(1, Math.round(inLen / 4)) : 0;
            }
            else if (req.body) {
                try {
                    const s = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
                    est = s ? Math.max(1, Math.round(Buffer.byteLength(s, 'utf8') / 4)) : 0;
                }
                catch { }
            }
            const key = quotaKey(tenantId);
            const used = Number((await redis.get(key)) || '0');
            if (used + est > limit) {
                return res.status(402).json({ error: 'quota_exceeded', message: 'Daily token quota exceeded' });
            }
            // Reserve
            const now = await redis.incrby(key, est);
            if (now === est) {
                // first set: set TTL until end of day
                const ttl = secondsUntilEndOfDay();
                await redis.expire(key, ttl);
            }
            req._reservedTokens = est;
            return next();
        }
        catch (e) {
            // Fail-open on quota to not block traffic if Redis issues occur
            return next();
        }
    });
    app.use(`/${prefix}`, createProxyMiddleware({
        target: provider.target,
        changeOrigin: true,
        pathRewrite: {
            [`^/${prefix}`]: '',
        },
        selfHandleResponse: true,
        on: {
            proxyReq(proxyReq, req, _res) {
                // Inject auth headers
                const headers = provider.authHeader ? provider.authHeader() : {};
                for (const [k, v] of Object.entries(headers)) {
                    if (v)
                        proxyReq.setHeader(k, v);
                }
                // Google API key as query if not present
                if (prefix === 'google') {
                    try {
                        const url = new URL(proxyReq.path, 'http://placeholder');
                        if (!url.searchParams.get('key') && process.env.GOOGLE_KEY) {
                            url.searchParams.set('key', process.env.GOOGLE_KEY);
                            proxyReq.path = `${url.pathname}${url.search}`;
                        }
                    }
                    catch { }
                }
                // Start time for latency
                req._start = Date.now();
            },
            proxyRes(proxyRes, req, res) {
                const start = req._start;
                const latencyMs = start ? Date.now() - start : undefined;
                // Best-effort model extraction from request body if available
                let model;
                try {
                    const body = req.body;
                    if (body && typeof body === 'object' && 'model' in body) {
                        model = body.model;
                    }
                }
                catch { }
                // Lightweight token estimation using Content-Length (bytes/4 heuristic)
                const inLen = req.headers?.['content-length'] ? Number(req.headers['content-length']) : undefined;
                const outLen = proxyRes.headers?.['content-length'] ? Number(proxyRes.headers['content-length']) : undefined;
                const estimate = (bytes) => (bytes && bytes > 0 ? Math.max(1, Math.round(bytes / 4)) : undefined);
                let inputTokens = estimate(inLen);
                let outputTokens = estimate(outLen);
                const costUsd = computeCostUsd(prefix, model, inputTokens, outputTokens);
                const tenantId = (req.headers || {})['x-tenant-id'] || 'anon';
                void emitUsage({
                    tenantId,
                    userId: undefined,
                    provider: prefix,
                    model,
                    inputTokens,
                    outputTokens,
                    latencyMs,
                    success: proxyRes.statusCode ? proxyRes.statusCode < 500 : true,
                    costUsd,
                });
                // Adjust quota with actual tokens (best-effort)
                if (BILLING_ENABLED && redis && tenantId) {
                    const actual = (inputTokens || 0) + (outputTokens || 0);
                    const reserved = Number(req._reservedTokens || 0);
                    if (actual > reserved) {
                        const delta = actual - reserved;
                        void redis.incrby(quotaKey(tenantId), delta).catch(() => { });
                    }
                }
            },
        },
    }));
}
function quotaKey(tenantId) {
    const d = new Date();
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `quota:${tenantId}:${y}-${m}-${day}`;
}
function secondsUntilEndOfDay() {
    const now = new Date();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    return Math.max(60, Math.floor((end.getTime() - now.getTime()) / 1000));
}
Object.keys(PROVIDERS).forEach(mountProvider);
// Globaler Error-Handler (JSON)
app.use((err, _req, res, _next) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = (err && (err.message || err.toString())) || 'Internal Server Error';
    if (status >= 500)
        console.error('Unhandled error:', err);
    return res.status(status).json({ error: 'internal_error', message });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Provider Proxy listening on :${PORT}`);
});
