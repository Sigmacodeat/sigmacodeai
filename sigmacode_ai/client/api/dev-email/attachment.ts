export const config = { runtime: 'edge' } as const;

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const filename = url.searchParams.get('filename') || 'file.bin';
  const headers = new Headers({
    'content-type': 'application/octet-stream',
    'content-disposition': `attachment; filename="${filename}"`,
  });
  return new Response(new Uint8Array(), { status: 200, headers });
}
