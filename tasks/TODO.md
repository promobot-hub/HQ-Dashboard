# TODO - Micro-Commits Pipeline (Always Tiny, Always Shippable)

- Create heartbeat-state.json skeleton with lastChecks (email, calendar, weather) + lastRun timestamp.
- Add STATUS.md scaffold showing: lastRun UTC, runsToday, totalRuns, lastKPIs (microCommit, skillProgress, stateUpdated).
- Initialize logs/HEARTBEAT-LOG.md and append entry per run (UTC timestamp + brief KPIs).
- README: add small badges (Runs Today, Total Runs, Last Run UTC) — pure text placeholders if shields.io blocked.
- Ensure tasks/ directory is referenced in README for visibility.
- Set up counters.json to track runsToday and totalRuns; bump safely per run.
- Add a minimal CHANGELOG.md and record each micro-commit with 1–2 lines.
- Add heartbeat-state update script stub (no external calls) to sync STATUS.md + LOG.md + counters.
- Create .gitkeep files for empty dirs (logs/, tasks/) if needed.
- Add ALARMS.md with the single line template: "🚨 Zu langsam – pushen! (awaiting approval)" and reference when pace < 9/10.
- Add KPI badges to README via shields.io (text-only fallback if blocked).
