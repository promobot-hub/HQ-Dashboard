# TASKS.md - PromoteBot Backlog (Micro-commit friendly)

## TODO (next 24-48h)
- Verify GitHub skill auth and link local workspace to HQ-Dashboard repo (git init, remote add, first commit)
- Add a simple CLI script `pnpm task:new` to append tasks and auto-stamp timestamps
- Draft growth experiments backlog (SEO, X automation, funnels) and pick 1 to run this week

## Roadmap – Scheduler + Observability (2026-02-21)
- [ ] Deploy/Cache: Force redeploy + edge cache break so new /api/scheduler/* and /scheduler are live
- [ ] Scheduler UI polish: /scheduler page visible in Navbar, jobs list, run due now, history table
- [ ] Executor wiring: OpenClaw 5m cron → /api/scheduler/execute then /api/cron/trigger (verify history writes)
- [ ] Seed job: Evolution Cycle (every 10m, action=trigger) — verify next/last timestamps update
- [ ] Sessions & Agents tile on Overview (reads /api/sessions) with freshness tooltip/ampel
- [ ] ActivityFeed: auto-scroll, type filters (All/Improve/Snapshot/Kanban/Status), soft “New” fade-in
- [ ] Health: GitHub-Mode badge + data freshness (snapshot/logs/heartbeat) ampels
- [ ] RAW fetch hardening: optional ?t=<timestamp> if CF/SWR too sticky
- [ ] Logs seed/append: ensure data/logs.ndjson append path exists via /api/ingest/logs or GH put (ordered)
- [ ] Improve via Git flow: optional job every 15m (action=improve) → Core reacts to improve_trigger-*.json

## Longer-term
- [ ] Core: generate_snapshots() + git push every 5m (heartbeat, logs.ndjson append, tasks, metrics, skills, sessions)
- [ ] Metrics mini-sparklines + trend deltas
- [ ] Kanban a11y keyboard + mobile swipe polish
- [ ] Gateway Scheduler parity (if WS target configurable later)

## DONE
- Seeded TASKS.md backlog with concrete, small, growth-focused items (2026-02-21 UTC)
- Implemented scripts/updateHeartbeatState.js to update lastRun and optional lastChecks.<field> (2026-02-21 UTC)
- Created /docs/ROADMAP.md with Q1 priorities for HQ-Dashboard (Release 0.1 scope) (2026-02-21 08:10 UTC)
