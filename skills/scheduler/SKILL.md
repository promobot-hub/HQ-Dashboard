# Scheduler Skill (Stub)

Description: Manage simple scheduled tasks (cron-like) within the workspace. No external actions. Pure file-based state.

Capabilities:
- Define tasks with: id, description, schedule (cron string or "every N minutes"), and action note (what to do manually)
- Store tasks in skills/scheduler/tasks.json
- Provide helper scripts/notes to be picked up by cron runners

Contract:
- Input: Read tasks.json, pick due tasks, append execution notes to logs/SCHEDULER-LOG.md
- Output: Update lastRun timestamp per task in tasks.json

Safety:
- No network, no external side-effects. File writes only.

Next Steps:
- Implement tasks.json schema and a tiny runner script (optional)
