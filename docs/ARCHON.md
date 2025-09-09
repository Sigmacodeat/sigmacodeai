# Archon – Integration in Sigmacode AI

Archon ist ein MCP-gestütztes „Command Center“ für AI-Coding-Assistenten. Wir nutzen Archon als zentrale Wissensbasis (Docs-Crawling, Datei-Upload, semantische Suche) und als MCP-Server, damit unsere Agenten (z. B. Windsurf/Cascade, Cursor, Claude Code) auf identischen Kontext und Tasks zugreifen.


## Warum Archon bei uns?
- Gemeinsame Wissensquelle für Agents und Entwickler (Docs, Runbooks, ADRs, APIs).
- Schnelles RAG-Setup mit Web-Crawler, PDF/Doc Upload und PGVector-Suche.
- MCP-Integration: Einheitlicher Zugriff aus IDE-Assistants.
- Unabhängige, containerisierte Services – keine Port-Konflikte mit unserer App.

Lizenzhinweis: Archon Community License (ACL) v1.2. Interne Nutzung/Fork/Anpassung ist ok; nicht „as-a-service“ weiterverkaufen.


## Architektur-Übersicht
- UI (React+Vite): Port 3737
- Server (FastAPI+Socket.IO): Port 8181
- MCP-Server (HTTP Wrapper): Port 8051
- Agents (PydanticAI): Port 8052
- DB: Supabase (Postgres + PGVector)

Unsere App-Ports (aus `docker-compose.yml`): API 3080 (exposed 3081), Client-Vite 3092, MongoDB 27017 (exposed 27018), Redis, Meilisearch. → Keine Konflikte mit Archon-Standardports.


## Vorgehen: Fork + Submodule
1) Fork auf GitHub anlegen
- Fork `coleam00/Archon` unter eurer Organisation (z. B. `my-org/archon`).
- Alternativ zunächst Upstream einbinden und später remote auf euren Fork umstellen.

2) Submodule in dieses Repo einbinden
- Zielpfad: `external/archon/`
- Vorschlag (Shell):

```bash
# Submodule (zunächst Upstream). Später kann auf Fork-URL gewechselt werden.
git submodule add https://github.com/coleam00/Archon external/archon

git submodule update --init --recursive

git add .gitmodules external/archon

git commit -m "chore: add Archon as git submodule"
```

- Nach dem Fork könnt ihr die Submodule-Remote umstellen:

```bash
cd external/archon

git remote set-url origin https://github.com/<your-org>/archon.git

git fetch origin

git checkout main

cd -
```

Hinweis: CI/Clone-Schritte benötigen künftig `git submodule update --init --recursive`.


## Lokales Setup (Empfohlen: separat betreiben)
Voraussetzungen:
- Docker Desktop
- Supabase (Cloud-Projekt oder lokal) – tragt die Werte in `.env` ein
- LLM-Key (OpenAI/Gemini/Ollama)

Schnellstart (aus `external/archon/`):
```bash
cp .env.example .env
# .env editieren (SUPABASE_URL, SUPABASE_SERVICE_KEY, optional Ports)

# Supabase Migrationen im SQL-Editor ausführen:
#   migration/complete_setup.sql

# Services starten (Full Docker Mode)
docker compose up --build -d
```

Standard-Endpoints:
- UI: http://localhost:3737
- Server API: http://localhost:8181
- MCP Server: http://localhost:8051
- Agents: http://localhost:8052


## Wissensquellen hinzufügen
- Web Crawling: UI → Knowledge Base → Crawl Website → z. B. eure Doku-URL
- Dokumente: UI → Knowledge Base → Upload PDF/DOC/MD/TXT
- Quellen taggen und Projekten zuordnen


## MCP-Integration in unsere Agenten
1) UI öffnen → MCP Dashboard → passende Client-Konfiguration kopieren (z. B. für Windsurf/Cascade/Cursor/Claude Code).
2) In der IDE den MCP-Endpoint eintragen (Standard: `http://localhost:8051`).
3) Test: Eine RAG-Abfrage gegen einen zuvor gecrawlten/hochgeladenen Inhalt stellen.


## Betrieb & Sicherheit
- API Keys in `.env` (OpenAI/Gemini/Ollama). Keys nicht ins Repo commiten.
- Optional vor Archon einen Reverse Proxy (Auth/Rate Limit/HTTPS) schalten.
- MCP-Port 8051 intern halten, falls nur Team-intern genutzt.
- Logs ansehen: `docker compose logs -f` (UI/Server/MCP/Agents getrennt).


## Optional: Sync unserer Inhalte
- Docs-Verzeichnis (`docs/`, `pitchdeck/`) periodisch in Archon einspeisen (Crawler/Webhooks).
- Build-Step/CI-Job denkbar, der neue Doku-Pages automatisch indiziert.


## Troubleshooting (Kurz)
- Port belegt: `.env` Ports anpassen, Container neu starten.
- Frontend kann nicht verbinden: `curl http://localhost:8181/health` prüfen, ENV-Ports abgleichen.
- Docker hängt: `docker compose down --remove-orphans && docker system prune -f`.
- Supabase Keys: Legacy Service Role Key (länger) verwenden; lokal: `SUPABASE_URL=http://host.docker.internal:8000`.


## Wartung
- Upgrades: In `external/archon/` `git pull` (oder auf Fork `main`) und ggf. neue SQL-Migrationen aus `migration/` einspielen.
- Submodule aktualisieren (in Root-Repo):

```bash
git submodule update --remote --merge external/archon

git commit -am "chore(archon): submodule update"
```
