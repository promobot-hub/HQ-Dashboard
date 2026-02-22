# Project Structure (Core vs Website)

- ROOT (/data/workspace) → Clawbot Core
  - Purpose: Agents, Cron, Skills, Scripts, Logs, Data snapshots
  - Notable dirs: scripts/, worker/, skills/, logs/, data/, memory/
  - Note: Root also contains some legacy Next.js files (app/, components/, public/, next.config.ts). These are NOT used for the website build.

- Website (Next.js App Router) → /data/workspace/hq-dashboard/
  - App code: hq-dashboard/app/*, hq-dashboard/components/*, hq-dashboard/app/api/*
  - Build: Render rootDir points to hq-dashboard (render.yaml)
  - Data: Consumes GitHub RAW (data/* at repo root), HMAC ingest endpoints under app/api/ingest/*, Scheduler/Debug/Health etc.

Guidelines
- All website work lives strictly under hq-dashboard/.
- Core/worker/scripts remain at ROOT.
- Render deploy builds only hq-dashboard; worker service runs from ROOT.

