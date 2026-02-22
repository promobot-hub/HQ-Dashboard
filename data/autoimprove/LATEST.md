=== AutoImproveBot Run @ 2026-02-22T15:50:39Z ===

Commit: d4fc98c

Recent commits:

```
d4fc98c chore(autoimprove): update report [skip ci]
f7564c0 merge: fix drizzle devDeps for build
a65a222 fix(build): add drizzle-kit and drizzle-orm as devDeps to satisfy TS in drizzle.config.ts and schema
7ff65d8 chore(autoimprove): update report [skip ci]
2bce34f docs(prompts): add Cron_Monitor.md (auto-heal + debug for all cron jobs)
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
