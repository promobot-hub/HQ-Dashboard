#!/usr/bin/env bash
set -euo pipefail
ROOT="/data/workspace"
APP="${ROOT}/hq-dashboard"
TS=$(date -Is)
mkdir -p "$APP/data"

# Define a micro-improvement proposal (safe + deploy-trigger)
IMPROVE_MSG="auto-micro: keep deploy fresh; append improve log + bump marker"
LINE="{\"ts\":\"$TS\",\"kind\":\"improve\",\"msg\":\"$IMPROVE_MSG\"}"
printf "%s\n" "$LINE" >> "$APP/data/improve.ndjson"

# Bump a tiny deploy marker to allow CDN caches to refresh on next push
printf "%s\n" "$TS" > "$APP/.deploy-bump"

echo "[$TS] Website improve: appended improve.ndjson and bumped .deploy-bump"
