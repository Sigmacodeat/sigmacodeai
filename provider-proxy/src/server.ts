import 'dotenv/config';
import type { Request, Response } from 'express';
import { createApp } from './app.js';
import { loadEnv } from './config/env.js';

// Basic config (validated)
const ENV = loadEnv();
const PORT = ENV.PORT || 8787;

const app = createApp();
app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Provider Proxy listening on :${PORT}`);
});
