# HQ-Dashboard (Next.js App Router)

Production-Ready UI, live verbunden mit dem Clawbot Python Core.

Quick Start
- Install: `cd hq-dashboard && npm i`
- Dev: `npm run dev`
- Build: `npm run build`
- Start (prod): `npm start`

Env
- NEXT_PUBLIC_CLAWBOT_API_BASE (optional; default: http://localhost:8000)
- GH_TOKEN (optional, nur Server): GitHub Token für Snapshots
- GH_REPO  (optional, nur Server): z. B. promobot-hub/HQ-Dashboard

Architektur
- App Router unter `app/`
  - `app/layout.tsx` – Root-Layout (Dark Theme, Navbar/Sidebar)
  - `app/page.tsx` – Landing (Hero + Heartbeat + Kanban + Improve + Activity)
  - `app/components/` – UI-Komponenten (KanbanBoard, TaskCard, HeartbeatWidget, SelfImproveWidget, ActivityFeed)
  - `app/api/*` – Proxy-API-Routen zu ${CLAWBOT_API_BASE}; `app/api/snapshot` schreibt Snapshots ins Repo (wenn GH_TOKEN/GH_REPO gesetzt)

API-Proxies (Server)
- GET /api/tasks → ${CLAWBOT_API_BASE}/api/tasks
- POST /api/tasks (body: { id, status }) → PATCH /api/tasks/{id} (fallback POST /api/tasks)
- GET /api/heartbeat → ${CLAWBOT_API_BASE}/api/heartbeat
- GET /api/logs?limit=20 → ${CLAWBOT_API_BASE}/api/logs?limit=20
- POST /api/improve → ${CLAWBOT_API_BASE}/api/improve
- POST /api/snapshot → zieht Tasks/Heartbeat/Logs und committet `data/snapshots/<ts>.json` + `data/tasks.json` (wenn GH_TOKEN/GH_REPO)

Live-UI
- HeartbeatWidget: Poll 4s
- KanbanBoard: Poll 4s; HTML5 Drag & Drop; Optimistic Updates
- SelfImproveWidget: Trigger + „Clawbot is thinking…“ Loading-State
- ActivityFeed: Poll 4s; Auto-Scroll-Bereich

Deploy-Hinweise
- Setze `NEXT_PUBLIC_CLAWBOT_API_BASE` in deiner Plattform (Render/Vercel/etc.)
- Für Snapshot-Commits: `GH_TOKEN` + `GH_REPO`
- Node 22 empfohlen; Tailwind v4 ist konfiguriert
- Fallbacks: Bei Core-Ausfall bleibt UI bedienbar (reduzierte Ansichten)
