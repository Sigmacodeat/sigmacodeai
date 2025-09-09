# Vercel Deployment (Vite SPA + Vercel Functions)

## Architektur
- Frontend: Vite SPA unter `sigmacode_ai/client/` → wird als statische Seite gebaut (`dist/`).
- API: Vercel Serverless/Edge Functions unter `sigmacode_ai/client/api/*` (gleiche Domain wie das Frontend).

Bereits vorhanden:
- `api/health.ts` → `GET /api/health`
- `api/me.ts` → `GET /api/me?verbose=true|false`
- `vercel.json` (im `client/`-Ordner) priorisiert `/api/*` vor der SPA-Fallback-Route.

## Voraussetzungen
- Vercel Account + CLI (optional): `npm i -g vercel`
- Node 18+ (Vercel Runtime)

## ENV Variablen (optional)
Setze je nach Bedarf im Vercel Projekt unter Settings → Environment Variables:
- `VITE_ANALYTICS_ENABLED`: `true|false`
- `VITE_GTM_ID`: `GTM-XXXXXXX` (nur wenn Analytics aktiv)
- `VITE_ANALYTICS_DEBUG`: `true|false`
- `VITE_ENABLE_LOGGER`: `true|false`
- `VITE_LOGGER_FILTER`: z. B. leer oder `network,api`

## Deploy-Schritte
1. Projekt in Vercel importieren und als Root den Ordner `sigmacode_ai/client` auswählen.
2. Vercel erkennt Vite anhand `client/vercel.json`:
   - `buildCommand`: `npm run build`
   - `outputDirectory`: `dist`
   - `routes`: `/api/*` → Functions, `/assets/*` → immutable Cache, sonst `/index.html`
3. Deploy auslösen (Dashboard oder CLI):
   ```bash
   vercel --cwd sigmacode_ai/client         # Preview
   vercel --cwd sigmacode_ai/client --prod  # Production
   ```

## Verifikation
- Healthcheck:
  ```bash
  curl -s https://<deine-domain>/api/health | jq
  ```
- User-Stub:
  ```bash
  curl -s "https://<deine-domain>/api/me?verbose=true" | jq
  ```

## Erweiterung der API
- Neue Endpunkte in `client/api/<name>.ts` anlegen.
- Gemeinsame Helfer:
  - `api/_utils/response.ts` (konsistente JSON- und Fehler-Responses)
  - `api/_utils/validation.ts` (Zod-Validierung, Query-Parsing)

## Hinweise
- Dieses Setup nutzt keine Next.js API Routes, da das Projekt Vite verwendet. Vercel Functions sind die empfohlene Lösung für SPA + API auf einer Domain.
- Für komplexere Backends kann später eine externe API angebunden werden; die Frontend-Calls bleiben `/api/*` und können via Vercel-Rewrites umgebogen werden.
