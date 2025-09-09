import { json, error } from './_utils/response';
import { parseQuery, meQuerySchema } from './_utils/validation';

export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  try {
    const { verbose = false } = parseQuery(req.url, meQuerySchema);

    // Placeholder: unauthenticated guest. Later integrate real auth/session.
    const base = {
      authenticated: false,
      role: 'guest' as const,
    };

    if (!verbose) return json(base);

    // Edge/Browser-safe: no process.env. Try platform headers first, then Vite env, then fallback.
    const regionHeader = req.headers.get('x-vercel-region') || req.headers.get('x-vercel-id') || undefined;
    const region =
      (regionHeader ? regionHeader.split(':')[0] : undefined) ||
      // Vite build-time env var (define VITE_VERCEL_REGION if desired)
      ((import.meta as any)?.env?.VITE_VERCEL_REGION as string | undefined) ||
      'unknown';
    const time = new Date().toISOString();

    return json({ ...base, time, region, userAgent: req.headers.get('user-agent') });
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Bad Request', 400);
  }
}
