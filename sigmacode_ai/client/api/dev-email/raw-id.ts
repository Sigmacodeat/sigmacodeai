import { json, error } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id is required', 400);
  // Stub: Minimales RawEmail-Objekt
  return json({ id, subject: '', from: '', to: '', date: new Date().toISOString(), parsed: false, hasAttachments: false, attachments: [] });
}
