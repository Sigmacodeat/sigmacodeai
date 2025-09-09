import { json } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(_req: Request) {
  // Stub: einfache Metriken
  return json({ totalInvites: 0, accepted: 0, pending: 0 });
}
