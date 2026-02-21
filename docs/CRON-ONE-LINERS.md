# CRON ONE-LINERS

Tiny, safe, one-step tasks for momentum during cron runs.

- Touch state: jq '.lastRun="$(date -u +%Y-%m-%dT%H:%M:00Z)"' heartbeat-state.json > tmp && mv tmp heartbeat-state.json
- Append heartbeat log: echo "$(date -u "+%Y-%m-%d %H:%M UTC") — Micro-commit: housekeeping (state+log)." >> logs/HEARTBEAT-LOG.md
- Bump STATUS: sed -i "s/^Last Run:.*/Last Run: $(date -u "+%Y-%m-%d %H:%M UTC")/" STATUS.md
- Create daily note (idempotent): test -f memory/$(date -u +%Y-%m-%d).md || echo "# $(date -u +%Y-%m-%d)" > memory/$(date -u +%Y-%m-%d).md
- Track KPI: jq '.kpis.microCommit=true | .kpis.stateUpdated=true' heartbeat-state.json > tmp && mv tmp heartbeat-state.json

Notes:
- Prefer jq for JSON safety. If missing, fall back to simple sed/awk with caution.
