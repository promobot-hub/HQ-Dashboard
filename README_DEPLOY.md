# Clawbot HQ – Production Deploy Guide

This is the production-ready static UI bundle (Vanilla JS + Tailwind CDN) and the Next.js app (hq-dashboard). Choose your path.

Option A: Serve static frontend (Python server)
1) Copy the `frontend/` folder to your server (e.g., `/var/www/clawbot-ui`).
2) Start a simple Python server in that folder:
   - `cd frontend && python3 -m http.server 8080`
   - Visit http://localhost:8080
3) Backends expected by the UI (same origin):
   - GET /api/status → { runsToday, totalRuns, lastRunAt }
   - GET /api/tasks → { tasks: [ { id, title, status: 'pending'|'progress'|'done', progress, created_at, updated_at, log_link } ] }
   - GET /api/logs?limit=20 → { items: [ { ts, message } ] }
   - POST /api/improve → triggers improve cycle
4) Reverse-proxy these endpoints from your Python service or serve them directly.

Option B: Deploy Next.js app (hq-dashboard)
1) Requirements: Node 22, yarn/pnpm/npm; environment variable GH_TOKEN optional (server-side writes).
2) Install & run locally:
   - `cd hq-dashboard && npm i`
   - `npm run dev` (dev server)
   - `npm run build && npm start` (production)
3) Configure a host (Render/Netlify/Vercel) with Root Dir = `hq-dashboard`.

Performance & Production Notes
- Tailwind via CDN; scripts are `defer`.
- Polling intervals moderate; concurrency limited to 2 parallel fetches.
- Particle background capped at 30fps with page-visibility pause.
- Accessibility: aria labels, focus rings, keyboard shortcuts.
- Mobile: Kanban stacks vertically; sidebar becomes bottom bar under 768px.

Files to copy for static hosting
- `frontend/`
  - index.html, layout.html, globals.css
  - components/: modals.js, toasts.js, charts.js, reference html components
  - js/: kanban.js, live.js, particles.js

Troubleshooting
- If /api/* endpoints are missing, UI shows graceful fallbacks and offline indicator.
- Strict CSP may require allowing inline Tailwind config script (or prebuild Tailwind CSS).
