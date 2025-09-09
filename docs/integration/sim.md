# Sim Integration (Workflow Engine)

Dieses Dokument beschreibt die modulare Integration von Sim (simstudioai/sim) in die SIGMACODE AI Umgebung.

## Überblick
- LibreChat-Fork bleibt das Chat-/Agenten-Frontend (`sigmacode_ai/`).
- Sim ist die visuelle Workflow-/Job-Orchestrierung (Flows, Runs, Realtime, pgvector).
- Kopplung erfolgt über einen schlanken Adapter unter `/api/sim` (Proxy zu Sim).

## ENV
Trage in `sigmacode_ai/.env` folgende Variablen ein (siehe `.env.example`):

- `SIM_BASE_URL` (z. B. `http://localhost:3000` oder interner Service `http://sim:3000`)
- `SIM_PUBLIC_WS_URL` (optional, für Live-Status via Socket.io)
- `SIM_API_KEY` (optional, falls Sim geschützt ist)
- `SIM_SIGNING_SECRET` (optional, signierte Requests LibreChat → Sim)

## Endpunkte (Adapter)
Die Express-Route ist in `sigmacode_ai/api/server/routes/sim.js` implementiert und im Server gemountet:

- `GET /api/sim/health` – Erreichbarkeit von Sim prüfen
- `POST /api/sim/flows/create` – Draft-Flow in Sim anlegen (Payload passt Sim-spezifisch durch)
- `POST /api/sim/flows/:id/run` – Flow ausführen
- `GET /api/sim/runs/:runId/status` – Run-Status abrufen
- `POST /api/sim/proxy` – Whitelist-Proxy für `/api/flows` und `/api/runs`

Alle Routen sind JWT-geschützt (nutzen `requireJwtAuth`).

## UI-Hooks (Vorschlag)
- Agent Panel (`client/src/components/SidePanel/Agents/AgentConfig.tsx`): Button „In Sim als Entwurf anlegen“ → `POST /api/sim/flows/create`.
- Chat-Action: „Flow starten“ → `POST /api/sim/flows/:id/run`, Status als Karten im Chat.

## Wissensbasis (später)
- Sim nutzt PostgreSQL + `pgvector`. Für gemeinsame RAG-KB: kleinen Read-Only Gateway bereitstellen, den LibreChat nutzen kann.

## Deployment
- Sim separat deployen (self-hosted nach Readme des Projekts oder Cloud). In Compose kann Sim als eigener Stack laufen; LibreChat greift über `SIM_BASE_URL` zu.
- Keine harten Abhängigkeiten zwischen Containern nötig; Netzwerk-Kopplung optional.

## Eigener Fork & Branding (sigmacodeai/sigmacode_workflow)

Ziel: Eigene Images mit SIGMACODE-Branding bauen und in `docker-compose.sim.yml` nutzen.

1. Fork anlegen
   - GitHub-Repo: `simstudioai/sim` → forken nach `sigmacodeai/sigmacode_workflow`.
   - Alternativ via GitHub CLI:

     ```bash
     gh repo fork simstudioai/sim \
       --org sigmacodeai \
       --name sigmacode_workflow \
       --clone=true
     ```

2. Branding im Fork
   - Passe App-Titel, Favicons, Logos, Meta-Images, Farben an (Next.js-Layouts/Assets im Fork).
   - Optional: Env-gestütztes Branding (z. B. `NEXT_PUBLIC_BRAND_*`), falls im Fork implementiert.

3. CI/CD (GitHub Actions im Fork)
   - Baue drei Images und pushe sie nach GHCR:
     - `ghcr.io/sigmacodeai/sigmacode_workflow/simstudio:latest`
     - `ghcr.io/sigmacodeai/sigmacode_workflow/realtime:latest`
     - `ghcr.io/sigmacodeai/sigmacode_workflow/migrations:latest`
   - Erzeuge GitHub Secrets: `CR_PAT` (oder nutze GITHUB_TOKEN mit permissions packages: write), `GHCR_NAMESPACE`.

4. Images in Compose verwenden (in diesem Repo)
   - In `.env` setzen (siehe `env.example`):

     ```env
     SIMSTUDIO_IMAGE=ghcr.io/sigmacodeai/sigmacode_workflow/simstudio:latest
     SIMREALTIME_IMAGE=ghcr.io/sigmacodeai/sigmacode_workflow/realtime:latest
     SIMMIGRATIONS_IMAGE=ghcr.io/sigmacodeai/sigmacode_workflow/migrations:latest
     
     # Optionales Branding (wirkt im Fork)
     NEXT_PUBLIC_BRAND_NAME=SIGMACODE AI Workflow
     NEXT_PUBLIC_BRAND_TAGLINE=Build and deploy AI agent workflows
     NEXT_PUBLIC_BRAND_PRIMARY_COLOR=#701FFC
     NEXT_PUBLIC_BRAND_LOGO_URL=
     ```

5. Stack starten

   ```bash
   docker compose --env-file .env -f docker-compose.sim.yml up -d
   ```

> Hinweis: Ohne gesetzte `SIM*IMAGE`-Variablen werden die Upstream-Images von `simstudioai` verwendet.

## Sicherheit & Limits
- Requests werden serverseitig signiert/autorisiert (optional über `SIM_API_KEY`/`SIM_SIGNING_SECRET`).
- Rate-Limits und Plan-Gates verbleiben in LibreChat-API, bevor an Sim weitergeleitet wird.

## Nächste Schritte
- Buttons/UX im Client ergänzen.
- Optional: Socket.io-Streaming anbinden über `SIM_PUBLIC_WS_URL`.
- Später: Export-Konverter AgentChain → Sim-Flow (nur für definierte Templates).
