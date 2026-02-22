#!/usr/bin/env bash
# Simple supervisor loop for website audit and improve scripts
ROOT="/data/workspace"
AUDIT_INTERVAL=7200    # 2 hours in seconds
IMPROVE_INTERVAL=600   # 10 minutes in seconds

LAST_AUDIT=0
LAST_IMPROVE=0
GATEWAY_SUPERVISOR="${ROOT}/scripts/gateway-supervisor.sh"

start_gateway() {
  if ! curl -sSf http://127.0.0.1:8080/ >/dev/null 2>&1; then
    echo "[\$(date -Is)] Gateway not responding, restarting..."
    bash "$GATEWAY_SUPERVISOR"
  fi
}

now() {
  date +%s
}

while true; do
  TS=$(now)
  if (( TS - LAST_AUDIT >= AUDIT_INTERVAL )); then
    echo "[$(date -Is)] Running website audit script..."
    bash "${ROOT}/scripts/website-audit.sh" &
    LAST_AUDIT=$TS
  fi

  if (( TS - LAST_IMPROVE >= IMPROVE_INTERVAL )); then
    echo "[$(date -Is)] Running website improve script..."
    bash "${ROOT}/scripts/website-improve.sh" &
    LAST_IMPROVE=$TS
  fi

  start_gateway

  sleep 30
 done
