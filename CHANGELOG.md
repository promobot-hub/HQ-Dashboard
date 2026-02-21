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

### Changed
- README: Added Netlify Deploy and Docs badges; linked quick-access URLs.
- STATUS.md: Logged KPIs for the last run; updated after implementing heartbeat bump script.
