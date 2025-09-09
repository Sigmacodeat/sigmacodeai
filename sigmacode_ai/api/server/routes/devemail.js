const express = require('express');
const axios = require('axios');
const { requireJwtAuth } = require('~/server/middleware');
const checkAdmin = require('~/server/middleware/roles/admin');

const router = express.Router();

// Config
const BASE = process.env.PROVIDER_PROXY_URL || 'http://localhost:8787';
const FORWARD_BASE = `${BASE.replace(/\/$/, '')}/api/dev/email`;
const ADMIN_TOKEN = process.env.ADMIN_DEV_TOKEN || '';
const ENABLED = (process.env.ENABLE_DEV_EMAIL_GATEWAY || 'true').toLowerCase() === 'true';

// Guard route enablement
router.use((req, res, next) => {
  if (!ENABLED) {
    return res.status(404).json({ message: 'Not Found' });
  }
  next();
});

// RBAC: JWT + Admin
router.use(requireJwtAuth);
router.use(checkAdmin);

// Helper to forward requests
async function forward(req, res, method, subpath) {
  try {
    const url = `${FORWARD_BASE}${subpath}`;

    const headers = {
      // Forward minimal safe headers
      'content-type': req.headers['content-type'] || undefined,
      'x-admin-dev-token': ADMIN_TOKEN || undefined,
    };

    const axiosCfg = {
      url,
      method,
      headers,
      // pass query
      params: req.query,
      // timeouts reasonable for analytics
      timeout: 30000,
      // include body for POST
      data: ['post', 'put', 'patch'].includes(method) ? req.body : undefined,
      // Do not follow redirects implicitly
      maxRedirects: 0,
      validateStatus: () => true,
    };

    const response = await axios(axiosCfg);

    // proxy status and headers
    res.status(response.status);
    // copy selected headers
    const contentType = response.headers['content-type'];
    if (contentType) res.setHeader('content-type', contentType);

    return res.send(response.data);
  } catch (err) {
    const status = err.response?.status || 502;
    const data = err.response?.data || { message: 'Bad Gateway', error: err.message };
    return res.status(status).json(data);
  }
}

// Routes mapping
router.get('/raw', (req, res) => forward(req, res, 'get', '/raw'));
router.get('/raw/:id', (req, res) => forward(req, res, 'get', `/raw/${encodeURIComponent(req.params.id)}`));
router.get('/raw/:id/attachments/:filename', (req, res) =>
  forward(
    req,
    res,
    'get',
    `/raw/${encodeURIComponent(req.params.id)}/attachments/${encodeURIComponent(req.params.filename)}`,
  ),
);

router.get('/dmarc', (req, res) => forward(req, res, 'get', '/dmarc'));
router.get('/dmarc/reports', (req, res) => forward(req, res, 'get', '/dmarc/reports'));
router.get('/dmarc/:id', (req, res) => forward(req, res, 'get', `/dmarc/${encodeURIComponent(req.params.id)}`));

router.post('/actions/refresh', (req, res) => forward(req, res, 'post', '/actions/refresh'));
router.post('/actions/backfill', (req, res) => forward(req, res, 'post', '/actions/backfill'));
// Aliases expected by frontend hooks
router.post('/refresh', (req, res) => forward(req, res, 'post', '/refresh'));
router.post('/backfill', (req, res) => forward(req, res, 'post', '/backfill'));

module.exports = router;
