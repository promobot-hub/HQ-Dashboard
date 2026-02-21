=== AutoImproveBot Run @ 2026-02-21T22:55:19Z ===

Commit: 2c9667d

Recent commits:

```
2c9667d chore(heartbeat): auto-update state/logs/badges [skip ci]
c58b4ee chore(heartbeat): auto-update state/logs/badges [skip ci]
e87a2f3 chore(heartbeat): auto-update state/logs/badges [skip ci]
abd3fb1 chore(heartbeat): sync hq-dashboard subtree [skip ci]
ad7458f feat(debug): add flat /debug route (UI) and point Navbar there; ensure website debug visible; prepare deploy/cache-break
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
