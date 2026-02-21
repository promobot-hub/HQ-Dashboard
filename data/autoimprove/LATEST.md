=== AutoImproveBot Run @ 2026-02-21T20:51:32Z ===

Commit: c177165

Recent commits:

```
c177165 feat(cron prompt): forward prompt body through /api/improve; embed new Evolution prompt in cron cycle to drive concrete features each run
142cc0d cron(DENKE): micro-commit @ 20:45 UTC — bump counters, update README/STATUS, heartbeat-state; log changelog
7050591 chore(render): add NEXT_PUBLIC_CLAWBOT_API_BASE (secret) and CRON_SELF_URL to web service to enable cron + core proxy; trigger redeploy
68d6b53 chore(heartbeat): auto-update state/logs/badges [skip ci]
ff7ef91 chore(heartbeat): sync hq-dashboard subtree [skip ci]
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
