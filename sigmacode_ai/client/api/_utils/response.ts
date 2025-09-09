// Lightweight helpers for consistent JSON responses
// State of the art: typed, minimal, cache-control headers, CORS-safe defaults if needed

export type JsonData = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

export function json(data: JsonData, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  // Reasonable default to avoid CDN caching dynamic endpoints unless specified
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(message: string, status = 400, details?: unknown): Response {
  return json({ error: { message, status, details } }, { status });
}
