# TODO - Micro-Commits Pipeline (High-Impact, Low-Effort)

1) Add heartbeat-state.json scaffold
- File: /heartbeat-state.json
- Fields: { "lastRun": ISO8601, "lastChecks": { "email": null, "calendar": null, "weather": null } }
- KPI: Enables lightweight heartbeats without token burn

2) Create logs/HEARTBEAT-LOG.md and log each run
- Format: "YYYY-MM-DD HH:MM UTC | microCommit=yes/no | skillProgress=yes/no | notes"
- KPI: Visible momentum; easy audit trail

3) Add STATUS.md (runsToday/totalRuns), auto-updated per heartbeat
- Fields: timestamp, runsToday, totalRuns, lastKPIs
- KPI: One-glance health check; boosts perceived velocity

Notes:
- Keep commits tiny and frequent (one file/change per commit)
- Avoid external calls; internal only until Boss approves outreach
- If blocked: document in STATUS.md and propose workaround
