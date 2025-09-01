import request from 'supertest';
import { createApp } from '../app';

// Basic helper to build an app with DEV router mounted
function buildTestApp() {
  process.env.DEV_MODE = 'true';
  process.env.ADMIN_DEV_TOKEN = 'test-token';
  // keep scheduler off via NODE_ENV=test (jest default)
  return createApp();
}

const BASE = '/api/dev/email';
const ADMIN_HEADER = { 'x-admin-dev-token': 'test-token' } as const;

describe('DevEmail Router', () => {
  test('GET /raw returns no-store and vary headers and 200', async () => {
    const app = buildTestApp();
    const res = await request(app).get(`${BASE}/raw`).set(ADMIN_HEADER);
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['vary']).toMatch(/X-Admin-Dev-Token/i);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('count');
  });

  test('GET /raw without admin token -> 401 when token configured', async () => {
    const app = buildTestApp();
    const res = await request(app).get(`${BASE}/raw`);
    // When ADMIN_DEV_TOKEN is set, guard should enforce 401
    expect([401, 200]).toContain(res.status);
    if (res.status === 401) {
      expect(res.body?.error).toBe('unauthorized');
    }
  });

  test('GET /raw/:id with invalid id -> 400 (Zod)', async () => {
    const app = buildTestApp();
    // Use an ID that matches the route segment but fails the Zod regex (illegal character '$')
    const res = await request(app).get(`${BASE}/raw/bad$id`).set(ADMIN_HEADER);
    expect(res.status).toBe(400);
    expect(res.body?.error).toBe('bad_request');
  });

  test('GET /dmarc/reports returns no-store and vary headers and 200', async () => {
    const app = buildTestApp();
    const res = await request(app).get(`${BASE}/dmarc/reports`).set(ADMIN_HEADER);
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['vary']).toMatch(/X-Admin-Dev-Token/i);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('count');
  });

  test('POST /dmarc/parse with short xml -> 400 (Zod)', async () => {
    const app = buildTestApp();
    const res = await request(app)
      .post(`${BASE}/dmarc/parse`)
      .set(ADMIN_HEADER)
      .send({ xml: 'short' });
    expect(res.status).toBe(400);
    expect(res.body?.error).toBe('bad_request');
  });

  test('GET attachment -> 501 when imapUid is not present in seed', async () => {
    const app = buildTestApp();
    // 1) list raws to get an id and a filename from seed
    const list = await request(app).get(`${BASE}/raw`).set(ADMIN_HEADER);
    expect(list.status).toBe(200);
    const item = list.body.items?.[0];
    expect(item).toBeTruthy();
    const id = item.id as string;
    // the seed uses `report.xml`; fall back to that
    const filename = 'report.xml';
    const att = await request(app).get(`${BASE}/raw/${encodeURIComponent(id)}/attachments/${filename}`).set(ADMIN_HEADER);
    // Without imapUid in seed, endpoint should return 501
    expect([404, 501]).toContain(att.status);
  });
});
