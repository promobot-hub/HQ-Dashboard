=== AutoImproveBot Run @ 2026-02-22T19:04:27Z ===

Commit: 2488a3c

Recent commits:

```
2488a3c chore(heartbeat): auto-update state/logs/badges [skip ci]
20b7285 chore(heartbeat): sync hq-dashboard subtree [skip ci]
1f79399 fix(cron+health): enable local fallbacks for cron ok + health aggregation (#11)
408477a chore(heartbeat): auto-update state/logs/badges [skip ci]
fd8cb00 chore(heartbeat): auto-update state/logs/badges [skip ci]
```

Open PRs:

```
Command failed: gh pr list -R promobot-hub/HQ-Dashboard --limit 10 --state open
gh: To use GitHub CLI in a GitHub Actions workflow, set the GH_TOKEN environment variable. Example:
  env:
    GH_TOKEN: ${{ github.token }}
```

Findings:

- [cjs-require] hq-dashboard/app/agents/page.tsx — require() found; prefer ESM import
- [cjs-require] hq-dashboard/app/api/ingest/utils.ts — require() found; prefer ESM import
- [cjs-require] hq-dashboard/app/components/QuickStats.tsx — require() found; prefer ESM import
- [cjs-require] hq-dashboard/app/debug/page.tsx — require() found; prefer ESM import
- [cjs-require] hq-dashboard/app/health/page.tsx — require() found; prefer ESM import
- [cjs-require] hq-dashboard/app/layout.tsx — require() found; prefer ESM import
- [cjs-require] hq-dashboard/app/page.tsx — require() found; prefer ESM import

Priorities:

- Critical: 7
- High: 0
