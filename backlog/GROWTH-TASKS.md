# Growth Tasks Backlog (High-Impact, Micro-Commit Friendly)

Priority 1 — HQ-Dashboard (always shippable)
- Add a visible build/version badge to the footer (from package.json) to signal fresh deploys
- Add a minimal “Changelog” panel wired to logs/HEARTBEAT-LOG.md (read-only)
- Add a KPI strip (Micro-commit, Skill, State) with last status from heartbeat-state.json

Priority 2 — Skills (daily drip)
- GitHub: verify gh auth and scaffold a command to list open PRs for HQ-Dashboard
- Twitter/X: prepare bird skill cookie loading (no posting) and a safe-read test

Priority 3 — Automation
- Script: scripts/updateKpis.ts to toggle KPIs per run and append to log
- Script: scripts/syncChangelog.ts to summarize last 5 log entries into docs/CHANGELOG.md

Notes
- Keep each task shippable in <15 min. If bigger, slice further.
- One micro-commit per cron. No zero-days.
