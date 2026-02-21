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
- `scripts/utils.js` with shared UTC/KPI helpers for heartbeat tooling.
- `scripts/incrementRunCounters.js` to maintain runsToday/totalRuns counters.

### Changed
- README: Added Netlify Deploy and Docs badges; linked quick-access URLs.
- STATUS.md: Logged KPIs for the last run; updated after implementing heartbeat bump script.
- STATUS.md: Added counters section (runsToday, totalRuns).

### Maintenance
- 08:46 UTC: Heartbeat micro-commit — updated heartbeat-state timestamp and logged progress.
- 08:47 UTC: Cron DENKE — bumped heartbeat-state timestamp and logged memory/changelog.
- 08:49 UTC: Logged KPI entry; updated heartbeat-state (repo, skills); updated STATUS.md and HEARTBEAT-LOG.
- 08:50 UTC: Added KPI tick; bumped heartbeat-state; updated STATUS.md and HEARTBEAT-LOG.
- 08:53 UTC: Ran bumpHeartbeatState.js; updated heartbeat-state and logged HEARTBEAT-LOG.
- 09:02 UTC: Cron micro-commit — added CRON-ONE-LINERS, updated STATUS.md, bumped state and logs.
- 09:09 UTC: Synced STATUS.md, bumped heartbeat-state.json, appended HEARTBEAT-LOG entry.
- 09:11 UTC: Auto-bumped heartbeat-state via script; updated STATUS.md; appended HEARTBEAT logs.
- 09:23 UTC: hq-dashboard/README.md updated (Netlify Deploy link); STATUS/HEARTBEAT-LOG updated; heartbeat-state.json bumped.
- 09:26 UTC: scripts/utils.js added; HEARTBEAT-LOG and STATUS updated; heartbeat-state.json bumped.
- 09:30 UTC: Cron micro-commit — synced logs (HEARTBEAT-LOG), state (heartbeat-state.json), and STATUS.md.
- 10:02 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; appended HEARTBEAT-LOG entry.
- 10:08 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; appended HEARTBEAT-LOG entry.
- 10:15 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:17 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:20 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:22 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:24 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:26 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:28 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:32 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:34 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:42 UTC: Cron micro-commit — synced heartbeat-state counters and STATUS; updated README badges/time; appended HEARTBEAT-LOG entry.
- 10:51 UTC: Cron micro-commit — synced heartbeat-state counters to 38, refreshed STATUS.md, and updated README badges/time; appended HEARTBEAT-LOG entry.
- 11:03 UTC: Cron micro-commit — bumped counters to runsToday=44/totalRuns=44; updated heartbeat-state.json, STATUS.md, README badges/time; appended HEARTBEAT-LOG entry.
- 11:05 UTC: Cron micro-commit — bumped counters to runsToday=45/totalRuns=45; updated STATUS.md, README badges/time; appended HEARTBEAT-LOG entry.
- 11:08 UTC: Cron micro-commit — bumped counters to runsToday=47/totalRuns=47; updated heartbeat-state.json, STATUS.md, README badges/time; appended HEARTBEAT-LOG entry.
- 11:12 UTC: Cron micro-commit — bumped counters to runsToday=48/totalRuns=48; updated heartbeat-state.json, STATUS.md, README badges/time; appended HEARTBEAT-LOG entry.

## 2026-02-21 09:31 UTC
- Cron micro-commit: synced heartbeat-state, HEARTBEAT-LOG, STATUS.md

## 2026-02-21 09:39 UTC
- Added HQ-Dashboard Footer component showing Last updated via /api/status; wired into index and monitor pages.

## 2026-02-21 09:55 UTC
- Cron micro-commit: synced heartbeat-state, HEARTBEAT-LOG, STATUS.md.

## 2026-02-21 09:59 UTC
- Cron micro-commit: added run counters + updated STATUS and HEARTBEAT-LOG.
