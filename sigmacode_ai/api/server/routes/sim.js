const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { z } = require('zod');
const { requireJwtAuth } = require('~/server/middleware');
const { logger } = require('@librechat/data-schemas');

const router = express.Router();

const { SIM_BASE_URL, SIM_API_KEY, SIM_SIGNING_SECRET } = process.env;

// Lightweight in-memory per-user rate limiter (leaky bucket)
// NOTE: For multi-instance, replace with Redis-backed limiter.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 req/min per user
const buckets = new Map(); // key -> { tokens, updatedAt }

function rateLimitCheck(key) {
  const now = Date.now();
  const bucket = buckets.get(key) || { tokens: RATE_LIMIT_MAX, updatedAt: now };
  // Refill based on elapsed time proportionally
  const elapsed = now - bucket.updatedAt;
  const refill = (elapsed / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_MAX;
  bucket.tokens = Math.min(RATE_LIMIT_MAX, bucket.tokens + refill);
  bucket.updatedAt = now;
  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

function assertSimConfigured(res) {
  if (!SIM_BASE_URL) {
    res.status(503).json({
      error: 'Sim integration is not configured',
      details: 'Set SIM_BASE_URL in environment to enable the Sim adapter.',
    });
    return false;
  }
  return true;
}

function simHeaders(extra = {}, bodyForSig = null) {
  const headers = { ...extra };
  if (SIM_API_KEY) headers['Authorization'] = `Bearer ${SIM_API_KEY}`;
  // Optional HMAC signing of outbound requests for upstream verification
  if (SIM_SIGNING_SECRET) {
    const ts = Date.now().toString();
    const payload = bodyForSig != null ? JSON.stringify(bodyForSig) : '';
    const base = `${ts}.${payload}`;
    const sig = crypto.createHmac('sha256', SIM_SIGNING_SECRET).update(base).digest('hex');
    headers['x-sigmacode-timestamp'] = ts;
    headers['x-sigmacode-signature'] = sig;
  }
  return headers;
}

// Basic retry with exponential backoff for transient upstream errors
async function forward(method, path, data, params, reqHeaders, attempt = 0) {
  const url = `${SIM_BASE_URL}${path}`;
  const headers = simHeaders({
    'Content-Type': 'application/json',
    // Forward trace/user context minimally (do NOT forward cookies)
    'x-sigmacode-user-id': reqHeaders['x-user-id'] || reqHeaders['x-sigmacode-user-id'] || '',
    'x-sigmacode-request-id': reqHeaders['x-request-id'] || '',
  }, data);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const resp = await axios.request({ method, url, data, params, headers, timeout: 30_000, signal: controller.signal });
    clearTimeout(timeout);
    return resp.data;
  } catch (err) {
    const status = err?.response?.status;
    // Retry on 429/502/503/504 up to 3 attempts
    if (attempt < 3 && [429, 502, 503, 504].includes(Number(status))) {
      const backoff = Math.min(1000 * 2 ** attempt, 4000);
      await new Promise((r) => setTimeout(r, backoff));
      return forward(method, path, data, params, reqHeaders, attempt + 1);
    }
    throw err;
  }
}

// Schemas
const FlowCreateSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  description: z.string().max(1024).optional(),
  agent_id: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  tools: z.array(z.any()).max(200).optional(),
  knowledge_files: z.array(z.any()).max(500).optional(),
  context_files: z.array(z.any()).max(500).optional(),
  code_files: z.array(z.any()).max(200).optional(),
});

const ProxySchema = z.object({
  path: z.string().regex(/^\/(api\/flows|api\/runs)(\/.*)?$/),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional().default('GET'),
  params: z.record(z.any()).optional(),
  data: z.any().optional(),
});

// Health check to verify connectivity to Sim
router.get('/health', requireJwtAuth, async (req, res) => {
  if (!assertSimConfigured(res)) return;
  // Per-user rate limit
  const key = req.headers['x-sigmacode-user-id'] || req.user?._id || req.ip;
  if (!rateLimitCheck(String(key))) {
    return res.status(429).json({ error: 'rate_limited', details: 'Too many requests to /api/sim/health' });
  }
  try {
    // Try a generic health path; fallback to base GET
    let data;
    try {
      data = await forward('GET', '/api/health', null, null, {});
    } catch {
      data = await forward('GET', '/', null, null, {});
    }
    res.json({ ok: true, sim: data ?? 'reachable' });
  } catch (err) {
    logger.error('[SimAdapter] health error', err?.response?.data || err?.message || err);
    res.status(err?.response?.status || 502).json({ ok: false, error: 'upstream_unreachable', details: err?.response?.data || String(err?.message || err) });
  }
});

// Create a draft flow in Sim (schema depends on Sim). We pass through a generic payload.
router.post('/flows/create', requireJwtAuth, async (req, res) => {
  if (!assertSimConfigured(res)) return;
  const key = req.headers['x-sigmacode-user-id'] || req.user?._id || req.ip;
  if (!rateLimitCheck(String(key))) {
    return res.status(429).json({ error: 'rate_limited', details: 'Too many requests to /api/sim/flows/create' });
  }
  try {
    const payload = FlowCreateSchema.parse(req.body || {});
    const data = await forward('POST', '/api/flows', payload, null, req.headers);
    res.status(201).json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'invalid_request', details: err.issues });
    }
    logger.error('[SimAdapter] create flow error', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 502;
    res.status(status).json({ error: 'upstream_error', details: err?.response?.data || String(err?.message || err) });
  }
});

// Run a flow in Sim
router.post('/flows/:id/run', requireJwtAuth, async (req, res) => {
  if (!assertSimConfigured(res)) return;
  const key = req.headers['x-sigmacode-user-id'] || req.user?._id || req.ip;
  if (!rateLimitCheck(String(key))) {
    return res.status(429).json({ error: 'rate_limited', details: 'Too many requests to /api/sim/flows/:id/run' });
  }
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const data = await forward('POST', `/api/flows/${encodeURIComponent(id)}/run`, payload, null, req.headers);
    res.status(202).json(data);
  } catch (err) {
    logger.error('[SimAdapter] run flow error', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 502;
    res.status(status).json({ error: 'upstream_error', details: err?.response?.data || String(err?.message || err) });
  }
});

// Get run status
router.get('/runs/:runId/status', requireJwtAuth, async (req, res) => {
  if (!assertSimConfigured(res)) return;
  const key = req.headers['x-sigmacode-user-id'] || req.user?._id || req.ip;
  if (!rateLimitCheck(String(key))) {
    return res.status(429).json({ error: 'rate_limited', details: 'Too many requests to /api/sim/runs/:runId/status' });
  }
  try {
    const { runId } = req.params;
    const data = await forward('GET', `/api/runs/${encodeURIComponent(runId)}`, null, null, req.headers);
    res.json(data);
  } catch (err) {
    logger.error('[SimAdapter] run status error', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 502;
    res.status(status).json({ error: 'upstream_error', details: err?.response?.data || String(err?.message || err) });
  }
});

// Generic proxy (whitelist certain paths for safety)
const WHITELIST = [/^\/api\/flows(\/.*)?$/, /^\/api\/runs(\/.*)?$/];
router.all('/proxy', requireJwtAuth, async (req, res) => {
  if (!assertSimConfigured(res)) return;
  try {
    const key = req.headers['x-sigmacode-user-id'] || req.user?._id || req.ip;
    if (!rateLimitCheck(String(key))) {
      return res.status(429).json({ error: 'rate_limited', details: 'Too many requests to /api/sim/proxy' });
    }
    const parsed = ProxySchema.parse(req.body || {});
    if (!WHITELIST.some((re) => re.test(parsed.path))) {
      return res.status(400).json({ error: 'path_not_allowed', path: parsed.path });
    }
    const result = await forward(parsed.method, parsed.path, parsed.data, parsed.params, req.headers);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'invalid_request', details: err.issues });
    }
    logger.error('[SimAdapter] proxy error', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 502;
    res.status(status).json({ error: 'upstream_error', details: err?.response?.data || String(err?.message || err) });
  }
});

module.exports = router;
