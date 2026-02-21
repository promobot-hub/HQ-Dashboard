# Contributing

This repo runs on micro-PRs and relentless iteration. Keep changes tiny, focused, and shippable.

Principles
- Single-purpose PRs (one task, one file-set, < ~200 LOC diff)
- Prefer additive changes; refactors behind small, reviewable steps
- No external actions (posts/emails) without explicit approval
- Automate repetitive work; commit scripts/utilities instead of manual steps
- Respect privacy and secrets. Never commit tokens or private data

Workflow
1) Create a short-lived branch from main
2) Do ONE small, growth-impacting change
3) Update CHANGELOG.md succinctly
4) If applicable, add or tick an item in TASKS.md
5) Open PR using the provided template; ensure checklist is green
6) Merge fast after review/CI

Formatting & Style
- EditorConfig in repo; use LF, UTF-8, trim trailing whitespace
- Keep docs terse; bullets > prose; action > theory
- Commit messages: imperative, < 72 chars subject, include context in body only if needed

Security
- Do not run destructive commands without confirmation
- Prefer `trash` over `rm` when possible
- Keep environment-specific configs out of git unless explicitly needed

Scope
- HQ-Dashboard improvements, automation scripts, skills, and internal docs are fair game
- External platform actions require an OK from the human first

Remember: Small steps, shipped daily. Growth > perfection.