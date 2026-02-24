=== AutoImproveBot Run @ 2026-02-24T07:58:04Z ===

Commit: 56d04a2

Recent commits:

```
56d04a2 chore(heartbeat): auto-update state/logs/badges [skip ci]
553f421 chore(autoimprove): update report [skip ci]
eb06531 chore(heartbeat): auto-update state/logs/badges [skip ci]
29562cd chore(autoimprove): update report [skip ci]
1d3f722 chore(autoimprove): update report [skip ci]
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
