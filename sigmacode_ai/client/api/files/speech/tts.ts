export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  // Stub: liefert leeren MP3-Stream, um 404 zu vermeiden
  const headers = new Headers({ 'content-type': 'audio/mpeg' });
  return new Response(new ReadableStream({ start(controller) { controller.close(); } }), {
    status: 200,
    headers,
  });
}
