=== AutoImproveBot Run @ 2026-02-25T20:01:18Z ===

Commit: 04580ef

Recent commits:

```
04580ef chore(heartbeat): auto-update state/logs/badges [skip ci]
30c4532 chore(autoimprove): update report [skip ci]
d20f53b chore(heartbeat): auto-update state/logs/badges [skip ci]
98e2fad chore(autoimprove): update report [skip ci]
bd7b916 chore(heartbeat): auto-update state/logs/badges [skip ci]
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
