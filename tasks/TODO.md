# TODO - Micro-Commit Pipeline (Always Small, Always Shippable)

Updated: 2026-02-21 12:34 UTC

Priority: High → Low. Pick the top unchecked item each run.

- [ ] README: Add a tiny "Cadence" badge + last-run timestamp placeholder (no external services). File-only change.
- [ ] STATUS.md: Create minimal status file with sections: KPIs, Last Run (UTC), RunsToday, TotalRuns. Keep it text-only.
- [ ] heartbeat-state.json: Initialize with { "lastChecks": { "email": null, "calendar": null, "weather": null }, "counters": { "runsToday": 0, "totalRuns": 0 }, "lastUpdated": ISO8601 }.
- [ ] logs/HEARTBEAT-LOG.md: Create and append one line per run: "YYYY-MM-DDTHH:MM:SSZ | micro-commit: <short> | KPIs: mc=<0/1>, skill=<0/1>, state=<0/1>".
- [ ] SKILLS: Add a stub SKILL.md for a future "scheduler" skill with a simple contract (create/update cron entries). No external actions.

Notes
- Keep every change local-only until Boss authorizes external pushes/posts.
- If a file exists, update minimally; do not restructure without reason.
- One run = one file touch. Stay fast.
