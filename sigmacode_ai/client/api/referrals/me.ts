import { json } from '../_utils/response';

export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  // Stub: liefert einen stabilen Referral-Code; später aus echter DB/Session ableiten
  const code = 'WELCOME-1234';
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const shareUrl = `${origin}/signup?ref=${encodeURIComponent(code)}`;
  return json({ code, shareUrl });
}
