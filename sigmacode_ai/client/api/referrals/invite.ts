import { json, error } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return error('Method Not Allowed', 405);
  }
  // Stub: akzeptiert E-Mail und gibt eine pseudo ID zurück
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email : undefined;
    if (!email) return error('email is required', 400);
    const id = `inv_${Math.random().toString(36).slice(2, 10)}`;
    return json({ ok: true, id });
  } catch (e) {
    return error('Bad Request', 400);
  }
}
