import { json } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(_req: Request) {
  // Stub: leere Liste mit Pagination
  return json({ items: [], pagination: { page: 0, pageSize: 50, total: 0 } });
}
