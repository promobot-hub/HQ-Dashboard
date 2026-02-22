# TASKS.md - PromoteBot Backlog (Micro-commit friendly)

## TODO (next 24-48h)
- GitHub Issues → Tasks Importer: /api/tasks/import/github?repo=<owner/repo> + Scheduler job */15m (action: importTasks)
- Skills Aktivitätspulse: /api/skills/train sammelt Commits/PR‑Titel; UI zeigt „Letzte Aktivität“ + Level‑Pulse
- Admin Seed Endpoint: /api/admin/seed → schreibt minimale data/* in GH_REPO (wenn leer), nur mit GH_TOKEN/GH_REPO
- Optional: Fallback-Badge in UI anzeigen, wenn Daten aus Fallback‑Repo statt ENV kommen (Transparenz)

## Roadmap – Scheduler + Observability (2026-02-21)
- [x] Deploy/Cache: Force redeploy + edge cache break so new /api/scheduler/* and /scheduler are live
- [x] Scheduler UI polish: /scheduler page visible in Navbar, jobs list, run due now, history table
- [x] Executor wiring: OpenClaw 5m cron → /api/scheduler/execute then /api/cron/trigger (verify history writes)
- [x] Seed job: Evolution Cycle (every 10m, action=trigger) — verify next/last timestamps update
- [x] Sessions & Agents tile on Overview (reads /api/sessions) with freshness tooltip/ampel
- [x] ActivityFeed: auto-scroll, type filters (All/Improve/Snapshot/Kanban/Status), soft “New” fade-in
- [x] Health: GitHub-Mode badge + data freshness (snapshot/logs/heartbeat) ampels
- [x] RAW fetch hardening: optional ?t=<timestamp> if CF/SWR too sticky
- [x] Logs seed/append: ensure data/logs.ndjson append path exists via /api/ingest/logs or GH put (ordered)
- [x] Improve via Git flow: optional job every 15m (action=improve) → Core reacts to improve_trigger-*.json

## Longer-term
- [ ] Core: generate_snapshots() + git push every 5m (heartbeat, logs.ndjson append, tasks, metrics, skills, sessions)
- [ ] Metrics mini-sparklines + trend deltas
- [ ] Kanban a11y keyboard + mobile swipe polish
- [ ] Gateway Scheduler parity (if WS target configurable later)

## DONE
- Seeded TASKS.md backlog with concrete, small, growth-focused items (2026-02-21 UTC)
- Implemented scripts/updateHeartbeatState.js to update lastRun and optional lastChecks.<field> (2026-02-21 UTC)
- Created /docs/ROADMAP.md with Q1 priorities for HQ-Dashboard (Release 0.1 scope) (2026-02-21 08:10 UTC)
