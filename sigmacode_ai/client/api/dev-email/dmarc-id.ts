import { json, error } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id is required', 400);
  // Stub: Minimaler DMARC-Report
  return json({ id, domain: 'example.com', dateRange: { from: new Date().toISOString(), to: new Date().toISOString() }, totalCount: 0, passCount: 0, failCount: 0, records: [] });
}
