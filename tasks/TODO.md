# TODO - Micro-Commit Pipeline (Always Small, Always Shippable)

Updated: 2026-02-21 18:20 UTC

Priority: High → Low. Pick the top unchecked item each run.

- [x] API: Expose /api/status that serves heartbeat-state.json (runsToday, totalRuns, lastRunAt) for dashboard consumption. (2026-02-21 12:40 UTC)
- [ ] Dashboard: Read /api/status and display counters in the header (text-only placeholder).
- [ ] README: Add a short "How status works" section linking to /api/status once available.

Done
- [x] SKILLS: Add a stub SKILL.md for a future "scheduler" skill with a simple contract (create/update cron entries). No external actions. (2026-02-21 18:20 UTC)
- [x] CRON-LOG: Create logs/CRON-LOG.md and append one line per cron run. (2026-02-21 13:10 UTC)
- [x] README: Add a tiny "Cadence" badge + last-run timestamp placeholder (no external services). File-only change. (2026-02-21 12:06-12:36 UTC)
- [x] STATUS.md: Create minimal status file with sections: KPIs, Last Run (UTC), RunsToday, TotalRuns. Keep it text-only. (2026-02-21 12:08-12:36 UTC)
- [x] heartbeat-state.json: Initialize and keep counters/timestamps in sync each run. (2026-02-21 12:08-12:36 UTC)
- [x] logs/HEARTBEAT-LOG.md: Create and append one line per run. (2026-02-21 12:08-12:36 UTC)

Notes
- Keep every change local-only until Boss authorizes external pushes/posts.
- If a file exists, update minimally; do not restructure without reason.
- One run = one file touch. Stay fast.
