#!/usr/bin/env bash
set -euo pipefail
ROOT="/data/workspace"
APP="${ROOT}/hq-dashboard"
LOG_DIR="${ROOT}/logs"
mkdir -p "$LOG_DIR" "$APP/data"
TS=$(date -Is)
LOG_FILE="$LOG_DIR/hq-build-${TS}.log"

cd "$APP"
STATUS="ok"
MSG="build ok"

echo "[$TS] Website audit: start" | tee -a "$LOG_FILE"
NODE_V=$(node -v 2>/dev/null || echo "node-missing")
NPM_V=$(npm -v 2>/dev/null || echo "npm-missing")
echo "node=${NODE_V} npm=${NPM_V}" | tee -a "$LOG_FILE"

if [[ ! -d node_modules ]]; then
  echo "[$TS] node_modules missing → npm install (this may take a while)" | tee -a "$LOG_FILE"
  if ! npm install --no-audit --no-fund >> "$LOG_FILE" 2>&1; then
    STATUS="fail"; MSG="npm install failed"; echo "install failed" | tee -a "$LOG_FILE"
  fi
fi

if [[ "$STATUS" == "ok" ]]; then
  if ! npm run build >> "$LOG_FILE" 2>&1; then
    STATUS="fail"; MSG="next build failed"; echo "build failed" | tee -a "$LOG_FILE"
  fi
fi

# Append audit record
LINE=$(jq -nc --arg ts "$TS" --arg status "$STATUS" --arg msg "$MSG" '{ts:$ts,kind:"audit",status:$status,msg:$msg}')
printf "%s\n" "$LINE" >> "$APP/data/audit.ndjson"

echo "[$TS] Website audit: $STATUS — $MSG" | tee -a "$LOG_FILE"
exit 0
