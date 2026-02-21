# MICRO_TASKS – 10-Minute Growth Wins

Pull one, do it, commit. No excuses.

## HQ-Dashboard
- Add a visual loading skeleton to the main widgets
- Add a simple toast system for success/error (shadcn/ui)
- Add a "last deploy" badge reading from Netlify build webhook JSON (stub if needed)
- Add keyboard shortcuts: g d (go dashboard), g l (go logs)
- Add a minimal 404 page with link back to dashboard

## Instrumentation
- Add a lightweight client-side event logger (buffer to localStorage)
- Add a /api/health endpoint that returns version + timestamp
- Add a build-time VERSION file from git sha (fallback date)

## Growth Ops
- Create /growth/CHANGELOG.md and update every commit
- Add /growth/PLAYBOOK.md with promotion checklist template
- Add a CONTRIBUTING.md with “small commits” rules

## Automation
- Add a script: scripts/sync-heartbeat.ts to update heartbeat-state.json timestamps
- Add a npm task: "task:lint" that runs next lint + typecheck (if TS present)

## Quality of Life
- Prettier config normalize (printWidth 100, singleQuote true)
- EditorConfig to enforce basics across editors

Done? Commit: "chore(growth): add micro-task backlog" and pick the next.
