# Dev Email Analytics API (DEV_MODE)

Dieser Router wird nur in DEV aktiviert und unter dem Pfad `/api/dev/email` gemountet.
Admin-Guard via Header `x-admin-dev-token` (Wert aus `.env`: `ADMIN_DEV_TOKEN`).

## Voraussetzungen
- `.env`
  - `DEV_MODE=true`
  - `PORT=3080` (oder eigener Port)
  - `ADMIN_DEV_TOKEN=...`
  - Optionale IMAP-Settings: `IMAP_HOST`, `IMAP_PORT`, `IMAP_USER`, `IMAP_PASS`, `IMAP_TLS`
- Prisma Client generiert: `npm run prisma:generate`
- Start: `npm run dev`

## Basis-URL
```
http://localhost:3080/api/dev/email
```

## Endpunkte

### 1) GET /raw
Listet Raw-Mails mit Pagination/Filter/Sortierung.

Query-Parameter:
- `page` (int, ≥1, default 1)
- `pageSize` (int, 1–100, default 20)
- `q` (string) – Volltextsuche über `subject`, `source`, `messageId`
- `parsed` ('true' | 'false')
- `hasAttachments` ('true' | 'false')
- `from`, `to` (string, contains, case-insensitive)
- `dateFrom`, `dateTo` (ISO-Datetime)
- `sort` ('receivedAt_desc' | 'receivedAt_asc' | 'size_desc' | 'size_asc')

Beispiel:
```bash
curl -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/raw?page=1&pageSize=5'
```

Response:
```json
{
  "items": [ { "id": "...", "subject": "...", "parsed": true, "attachments": [ ... ], ... } ],
  "count": 42,
  "page": 1,
  "pageSize": 5
}
```

### 2) GET /raw/:id
Liefert Details zu einer Raw-Mail inkl. `attachments` und ggf. `headers`.

```bash
curl -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/raw/<id>'
```

### 3) GET /dmarc/reports
Listet geparste DMARC-Reports inkl. zugehöriger `records` (Pagination/Filter/Sortierung).

Query-Parameter:
- `page`, `pageSize`
- `domain` (contains)
- `policyP` ('none' | 'quarantine' | 'reject')
- `dateFrom`, `dateTo` (ISO-Datetime)
- `q` (string; durchsucht `org`, `reportId`, `domain`)
- `sort` ('createdAt_desc' | 'createdAt_asc')

```bash
curl -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/dmarc/reports?page=1&pageSize=5'
```

### 4) GET /dmarc/:id
Einzelnen DMARC-Report inkl. `records` abrufen.

```bash
curl -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/dmarc/<id>'
```

### 5) POST /dmarc/parse
Parst ein DMARC Aggregate XML und persistiert Report + Records.

Body:
```json
{ "xml": "<feedback>...</feedback>" }
```

Beispiel:
```bash
curl -X POST -H 'Content-Type: application/json' -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/dmarc/parse' \
  --data '{"xml":"<?xml version=\"1.0\"?><feedback>...</feedback>"}'
```

### 6) POST /refresh
Startet sofort einen IMAP-Fetch (best effort) und speichert neue Raw-Mails.

```bash
curl -X POST -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/refresh'
```

### 7) POST /backfill
Parst vorhandene, noch ungeparste Raw-Mails rückwirkend (Batch).

```bash
curl -X POST -H 'x-admin-dev-token: dev-local-admin' \
  'http://localhost:3080/api/dev/email/backfill'
```

## Hinweise & Edge-Cases
- In DEV wird beim ersten Aufruf seed-artig Demo-Daten erzeugt, falls DB leer ist.
- Fallback auf Datei-Stubs in `provider-proxy/data/devemail/`, wenn DB keine passenden Einträge hat.
- Fehlerfälle liefern JSON-Errorschema `{ error, message }` mit passenden HTTP-Statuscodes.
- Für Sicherheit: Dieser Router ist nur in DEV aktiv. Nicht in Staging/Prod mounten.
