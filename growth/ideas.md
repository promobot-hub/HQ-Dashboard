HQ-Dashboard – Quick Win Backlog (Commit-Sized Tasks)

1) Add Netlify deploy status badge to README
   - Add: [![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com/sites/clinquant-kataifi-388453/deploys)
   - Acceptance: Badge renders in README, links to deploys

2) Add simple uptime/health check widget (mock data)
   - Component: components/widgets/HealthCard.tsx
   - Shows: "Gateway", "Netlify", "GitHub Actions" with green/yellow/red dots (static for now)
   - Acceptance: Widget visible on dashboard grid

3) Create scripts/dev: seed demo data
   - File: scripts/seed-demo.ts (Node)
   - Seeds: sample KPIs (visitors, signups, CTR)
   - Acceptance: `pnpm tsx scripts/seed-demo.ts` runs without errors

4) Add GitHub Actions status badge to README
   - Add: ![CI](https://github.com/<owner>/HQ-Dashboard/actions/workflows/ci.yml/badge.svg)
   - Acceptance: Badge renders; placeholder owner to replace

5) Add /api/ping route for health
   - File: app/api/ping/route.ts
   - Returns: { ok: true, ts: ISO-string }
   - Acceptance: GET /api/ping returns 200 JSON locally

6) Create CONTRIBUTING.md (short)
   - Include: setup, pnpm commands, commit style
   - Acceptance: File present and referenced from README

7) Add .nvmrc with Node 22
   - Content: 22
   - Acceptance: `nvm use` selects Node 22

8) Add ENV example file
   - File: .env.example
   - Keys: NEXT_PUBLIC_APP_NAME, BROWSERLESS_TOKEN (commented)
   - Acceptance: Exists; no secrets committed

9) Add Prettier + lint scripts
   - package.json: "format": "prettier --write .", "lint": "next lint"
   - Acceptance: Commands run locally

10) Add Telegram alert stub function
   - File: lib/alerts.ts
   - Exports: sendAlert(message: string) that logs to console for now
   - Acceptance: Imported in one place without build errors

Notes
- Replace placeholders (<owner>, Netlify badge ID) during implementation.
- Each task can be completed independently in <15 minutes.
