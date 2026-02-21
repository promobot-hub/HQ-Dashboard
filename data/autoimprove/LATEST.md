=== AutoImproveBot Run @ 2026-02-21T21:58:47Z ===

Commit: eee1775

Recent commits:

```
eee1775 chore(heartbeat): auto-update state/logs/badges [skip ci]
1c05a1d chore(autoimprove): update report [skip ci]
73a8d9e chore(heartbeat): auto-update state/logs/badges [skip ci]
ef10abb chore(heartbeat): sync hq-dashboard subtree [skip ci]
b6ad44a seed(scheduler): data/scheduler/jobs.json
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
