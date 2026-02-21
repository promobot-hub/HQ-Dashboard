# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning (where applicable).

## [Unreleased]
- Pending small UI polish for HQ-Dashboard

## [2026-02-21]
### Added
- CHANGELOG.md skeleton to track micro-commits and progress.
- `heartbeat-state.json` to track last checks and KPIs for cron/heartbeat runs.
- `scripts/bumpHeartbeatState.js` to auto-bump timestamps and KPIs on cron.
- `scripts/logKPI.js` and seeded `kpis/2026-02-21.json` for lightweight KPI logging.
- `docs/MICRO-COMMITS.md`, `docs/QUICK-WINS.md`, `docs/ONE-STEP-TASKS.md`, and `docs/CRON-ONE-LINERS.md` to accelerate micro-commit cadence.

### Changed
- README: Added Netlify Deploy and Docs badges; linked quick-access URLs.
- STATUS.md: Logged KPIs for the last run; updated after implementing heartbeat bump script.

### Maintenance
- 08:46 UTC: Heartbeat micro-commit — updated heartbeat-state timestamp and logged progress.
- 08:47 UTC: Cron DENKE — bumped heartbeat-state timestamp and logged memory/changelog.
- 08:49 UTC: Logged KPI entry; updated heartbeat-state (repo, skills); updated STATUS.md and HEARTBEAT-LOG.
- 08:50 UTC: Added KPI tick; bumped heartbeat-state; updated STATUS.md and HEARTBEAT-LOG.
- 08:53 UTC: Ran bumpHeartbeatState.js; updated heartbeat-state and logged HEARTBEAT-LOG.
- 09:02 UTC: Cron micro-commit — added CRON-ONE-LINERS, updated STATUS.md, bumped state and logs.
