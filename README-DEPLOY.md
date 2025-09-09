# Deployment auf Vercel (Sigmacodeat/betcockpit)

Dieses Repo enthält die Next.js App im Unterordner `sigmacode_ai/`. So deployst du sie auf Vercel:

## 1) Projekt verbinden
- Vercel Dashboard → Add New → Project → GitHub → Repo `Sigmacodeat/betcockpit` auswählen
- Root Directory: `sigmacode_ai`
- Framework Preset: automatisch "Next.js"

## 2) Build-/Install-Settings
- Package Manager: passend wählen (pnpm oder npm). Beispiele:
  - Install Command (pnpm): `pnpm i --frozen-lockfile`
  - Build Command (pnpm): `pnpm build`
  - Alternativ npm: `npm ci` / `npm run build`
- Output Directory: automatisch (Next.js auf Vercel)

## 3) Environment Variables (wichtig)
Lege alle benötigten Variablen in Vercel an (nicht im Repo commiten). Als Vorlage dient `sigmacode_ai/.env.example`.
Typische Variablen (abhängig von deiner Konfiguration):
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `PERPLEXITY_API_KEY`
- `MONGODB_URI`, `MONGODB_DB`, `REDIS_URL`, `MEILI_HOST`, `MEILI_MASTER_KEY`
- `DOMAIN_CLIENT`, `DOMAIN_SERVER`, `VITE_API_TARGET`
- OAuth (optional): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## 4) Optional: GitHub Actions für Vercel deaktivieren
Wenn du ausschließlich die Vercel GitHub-App nutzt, brauchst du keine Vercel-Actions im Repo. (In diesem Repo gibt es aktuell keine Vercel-Workflows im Ordner `.github/workflows/`.)

## 5) Deploy & Previews
- Jeder Push auf `master` triggert einen Production Deploy (je nach Vercel-Einstellung)
- Jeder Pull Request/Branch erzeugt automatisch eine Preview URL

## Hinweise
- Große lokale Daten (z. B. `LibreChat_fresh/`) sind per `.gitignore` ausgeschlossen und werden nicht gebaut
- Secrets gehören in Vercel ENV, nicht in `.env`-Dateien im Repo

Viel Erfolg!

---

## ENV-Referenz (Beispiele aus `sigmacode_ai/.env.example`)

| Variable | Zweck | Hinweis |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API Zugriff | In Vercel als Secret setzen |
| `ANTHROPIC_API_KEY` | Anthropic API Zugriff | Optional, in Vercel setzen |
| `GROQ_API_KEY` | Groq API Zugriff | Optional |
| `PERPLEXITY_API_KEY` | Perplexity API Zugriff | Optional |
| `MONGODB_URI` | MongoDB Connection String | z. B. Atlas/Compose; nicht ins Repo |
| `MONGODB_DB` | Datenbankname | falls benötigt |
| `REDIS_URL` | Redis Connection URL | Upstash/Redis Cloud |
| `MEILI_HOST` | Meilisearch Host | falls genutzt |
| `MEILI_MASTER_KEY` | Meilisearch Key | falls genutzt |
| `DOMAIN_CLIENT` | Client-URL | z. B. Production-Domain |
| `DOMAIN_SERVER` | Server-URL | API-Basis für SSR/Proxy |
| `VITE_API_TARGET` | Proxy-Ziel | Client-seitige API-Calls |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | nur in Vercel, nicht im Repo |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | nur in Vercel |

> Setze nur Werte, die du wirklich brauchst. Secrets gehören ausschließlich in Vercel.

## Monorepo-Hinweis

- Dieses Repo ist ein Monorepo mit dem App-Code unter `sigmacode_ai/`.
- In Vercel muss das Root Directory auf `sigmacode_ai` zeigen, sonst wird nur der Repo-Root (statisch) gebaut.
- GitHub Actions (`.github/workflows/ci.yml`) sind so konfiguriert, dass nur Änderungen in `sigmacode_ai/**` die CI auslösen.
