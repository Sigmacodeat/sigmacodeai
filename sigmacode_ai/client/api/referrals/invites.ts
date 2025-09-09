import { json } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(_req: Request) {
  // Stub: Liste ausstehender Einladungen
  return json({ items: [] });
}
