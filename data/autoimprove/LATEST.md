=== AutoImproveBot Run @ 2026-02-21T23:45:04Z ===

Commit: 3bd6ae8

Recent commits:

```
3bd6ae8 chore(heartbeat): auto-update state/logs/badges [skip ci]
8bcef9f chore(heartbeat): auto-update state/logs/badges [skip ci]
15ae0e8 chore(heartbeat): auto-update state/logs/badges [skip ci]
fa3d8d0 chore(autoimprove): update report [skip ci]
2c9667d chore(heartbeat): auto-update state/logs/badges [skip ci]
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
