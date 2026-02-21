# HQ-Dashboard Roadmap (Q1 2026)

Goal: Ship a lean, reliable v0.1 that proves value and unblocks rapid iteration.

## v0.1 (Release 0.1) — Scope Lock
Target: End of February 2026

Must-haves:
- Core UI shell (Next.js + shadcn/ui) with Navbar, Sidebar, and Content area
- Live Logs panel (tail from memory/daily + key process outputs)
- Heartbeat status widget (reads heartbeat-state.json)
- Task list viewer (from TASKS.md / tasks.json)
- Deploy on Netlify (auto from GitHub main)

Quality bar:
- Zero-crash load (SSR + client)
- Lighthouse 90+ Performance on dashboard route
- Basic smoke tests (render, widgets mount)

## v0.1.1 — Stability + Feedback
- Error boundaries and fallback UI for each widget
- Log truncation + virtualization for big files
- Quick action buttons: “HB Update”, “Sync Tasks”, “Open Logs”

## v0.2 — Integrations
- GitHub: PRs + Runs via gh API (read-only)
- X/Twitter mentions: lightweight display (bird skill)
- Calendar digest (24–48h)

## v0.3 — Control Surface
- Trigger background jobs (cron nudge, deploy kick)
- Config editor (ENV + tokens masked)
- Notification routing (Telegram presets)

## Principles
- Small, commit-friendly changes daily
- Ship defaults that work offline; enhance with tokens when present
- No dead code; everything on screen has an owner and a purpose

## Metrics That Matter
- Commits/week
- Time-to-deploy (commit → live)
- Widget uptime (no red boxes)

— Maintain this file. Keep it brutally honest and scope-tight.
