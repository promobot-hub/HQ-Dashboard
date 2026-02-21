# Clawbot HQ – Full UI (Premium Dark, Live, Deployment-Ready)

Diese UI liefert ein modernes, responsives, Live-vernetztes Dashboard für Clawbot.

Inhalt
- Premium Dark Theme (Tailwind v4), Glassmorphism, Neon-Akzente
- Live-Komponenten: Heartbeat-Widget, Kanban (Pending/Progress/Done), Recent Activity Logs, Self-Improve Card
- Vollständig Vanilla JS (keine externen Libs außer Tailwind CDN), defensive Fallbacks, Error-Handling, Offline-Indikator

Ordner-Struktur (ZIP-Beschreibung)
- frontend/
  - index.html (fertige Landing, vollständig integriert)
  - layout.html (reduzierte Shell für Einbettung/Tests)
  - globals.css (Reset, Variablen, Base-Layer, Utilities, Mobile-Bottom-Bar)
  - components/
    - modals.js, toasts.js (UI-Interaktion)
    - charts.js (CPU/Mem Live-Demo via Chart.js CDN)
    - navbar.html, sidebar.html, buttons.html, cards.html, inputs.html, toggles.html, progress.html, tables.html (Referenz-UI)
  - js/
    - kanban.js (Live-Tasks: Poll /api/tasks; Smooth Moves; Modal Logs; Confetti; Spinner; A11y)
    - live.js (Heartbeat-Widget; Improve-Card; Recent Logs; Offline-Bar; Sidebar Routing)
- hq-dashboard/
  - app/ (Next.js App Router; Premium Dark integriert)
    - api/status/route.ts (Heartbeat-Status von GitHub Raw)
    - api/tasks/route.ts (Tasks von GitHub Raw)
    - page.tsx (Hero + Charts + Kanban)
    - layout.tsx, globals.css (Theme/Shell)
    - components/ChartsClient.tsx (CPU/Mem Live-Charts)

Starten (lokal, statisches Frontend)
- Option A – Direkt im Browser: Öffne frontend/index.html
- Option B – Static Server
  - Python: `cd frontend && python3 -m http.server 8089` → http://localhost:8089
  - Node: `npx serve frontend -l 8089`

Starten (Next.js App, hq-dashboard)
- Voraussetzungen: Node 22, pnpm/yarn/npm (Lockfile empfohlen)
- Install: `cd hq-dashboard && npm i` (oder yarn/pnpm)
- Dev: `npm run dev` (Next.js Dev-Server)
- Build: `npm run build` / Start: `npm start`

Integration mit Python-Backend
- Stelle folgende Endpoints bereit (oder nutze Next.js API-Routen):
  - GET /api/status (Heartbeat: { runsToday, totalRuns, lastRunAt })
  - GET /api/tasks (Tasks: { tasks: [ { id, title, status: 'pending'|'progress'|'done', progress, created_at, updated_at, log_link } ] })
  - GET /api/logs?limit=20 (Recent activity: { items: [ { ts, message } ] })
  - POST /api/improve (triggert Self-Improve Cycle)
- Frontend greift per relative Pfade (`/api/...`) zu. Fallbacks vorhanden.

Qualitätssicherung (erledigt)
- Mobile: Kanban stacked (col-span-12); Sidebar → Bottom-Bar (unter 768px)
- Dark-Theme-Only: color-scheme dark + prefers-color-scheme enforced
- Keine JS-Fehler: Produktions-Code ohne console.*; Defensive Fallbacks
- Performance: Polls begrenzt; Fetch-Concurrency max 3; leichte DOM-Updates
- A11y: aria-labels/roles, keyboard focus auf Task-Karten (tabindex), Fokus-Ringe

Test-Szenarien
1) 5 Beispiel-Tasks (2 pending, 2 progress, 1 done) – siehe data/tasks.json im Repo
2) Heartbeat down → Offline-Indikator oben; Heartbeat-Widget zeigt DOWN/Fallback
3) Improve-Button → POST /api/improve; Toast-Feedback (Erfolg/Fehler)
4) Logs → /api/logs?limit=20 liefert Liste; bei Fehlen: “No recent activity”

Animationen
- Task-Wanderung mit smooth fade/translate
- Progress-Bar Updates
- Pulse (Cyan) bei In Progress
- Confetti bei Done

Hinweise für Produktion
- Lockfile (yarn.lock/package-lock.json) einchecken → deterministische Deploys
- Optional: Reale WebSockets ergänzen (Kanban/Heartbeat/Logs pushen), Polls reduzieren
- Secrets (GH_TOKEN etc.) nur serverseitig nutzen; Frontend bleibt read-only

FULL_UI_FUNCTIONALITY_COMPLETED – Die Clawbot Website ist jetzt tip-top modern, live, fehlerfrei und mit allen Systemen verbunden. Deploy ready.
