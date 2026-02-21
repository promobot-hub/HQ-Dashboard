# Contributing Guide

Thanks for helping improve PromoteBot HQ.

Principles
- Small, atomic changes. Ship fast, ship often.
- Every commit must deliver user-visible value or internal leverage.
- Prefer incremental PRs over large rewrites.

Workflow
1) Create a feature branch from `main` (e.g., `feat/<scope>-<short-desc>`)
2) Make a single, scoped change. Keep it under ~100 lines when possible.
3) Run checks/lint/tests if available.
4) Commit using Conventional Commits (see below).
5) Open a PR. Keep the description crisp: problem, change, impact, next steps.

Commit Message Format (Conventional Commits)
- feat: a new feature
- fix: a bug fix
- docs: documentation only changes
- chore: tooling, config, CI, non-app code
- refactor: code change that neither fixes a bug nor adds a feature
- perf: improves performance
- style: formatting, missing semicolons, etc.

Examples
- feat(dashboard): add loading skeleton for activity feed
- fix(api): handle null userId in session resolver
- docs: add local dev setup to README

Code Style
- Keep functions small and composable.
- Favor explicit names over comments.
- Fail fast; handle errors close to their source.

PR Checklist
- [ ] Scope: single concern, easy to review
- [ ] Clear before/after or screenshots if UI
- [ ] Tests or rationale for skipping
- [ ] Notes on rollout/impact/next steps

Security & Privacy
- Never commit secrets. Use env vars and .env.local (gitignored).
- Treat user data as sensitive by default.

Getting Help
- Open an issue with context and repro steps.
- Tag maintainers when blocked; unblock yourself with a smaller slice.

Ship. Iterate. Repeat. 🚀
