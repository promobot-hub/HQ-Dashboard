=== AutoImproveBot Run @ 2026-02-21T21:42:23Z ===

Commit: 73a8d9e

Recent commits:

```
73a8d9e chore(heartbeat): auto-update state/logs/badges [skip ci]
ef10abb chore(heartbeat): sync hq-dashboard subtree [skip ci]
b6ad44a seed(scheduler): data/scheduler/jobs.json
259f972 feat(scheduler): GH-backed scheduler (jobs/history/execute) + UI page; link in Navbar; OpenClaw cron executes scheduler each cycle
e4a6a33 cron(DENKE): micro-commit @ 21:25 UTC — bump heartbeat-state, counters (runsToday=31/totalRuns=31), STATUS, README; update CHANGELOG
```

Open PRs:

```
Command failed: gh pr list -R promobot-hub/HQ-Dashboard --limit 10 --state open
gh: To use GitHub CLI in a GitHub Actions workflow, set the GH_TOKEN environment variable. Example:
  env:
    GH_TOKEN: ${{ github.token }}
```

Findings:

- [cjs-require] hq-dashboard/app/api/ingest/utils.ts — require() found; prefer ESM import

Priorities:

- Critical: 1
- High: 0
