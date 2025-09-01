import request from 'supertest';
import { createApp } from '../app';

/**
 * Basic health endpoint test to validate app bootstrapping and ESM/ts-jest setup.
 */

describe('health endpoint', () => {
  const originalEnv = process.env;

  beforeAll(() => {
    // Ensure deterministic test env
    process.env = { ...originalEnv, NODE_ENV: 'test' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('GET /health returns ok: true', async () => {
    const app = createApp();
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
