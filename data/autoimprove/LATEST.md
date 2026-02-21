=== AutoImproveBot Run @ 2026-02-21T19:58:29Z ===

Commit: 9ff1cae

Recent commits:

```
9ff1cae chore(heartbeat): auto-update state/logs/badges [skip ci]
57110d8 chore(heartbeat): auto-update state/logs/badges [skip ci]
290c2c0 chore(heartbeat): sync hq-dashboard subtree [skip ci]
ae8891e chore: restore local changes after merge window
8dc02e2 feat(ingest): add HMAC-signed ingest endpoints (tasks/heartbeat/logs) with optional GitHub commit persistence
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
