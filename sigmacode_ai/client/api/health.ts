import { json } from './_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(_req: Request) {
  // Basic health info; avoid Node-specific globals for Edge runtime compatibility
  const now = new Date().toISOString();
  return json({ ok: true, time: now });
}
