#!/usr/bin/env bash
set -euo pipefail
LOG_DIR="/data/workspace/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/gateway.out"

PORT=${OPENCLAW_PORT:-8080}
CHECK_URL="http://127.0.0.1:${PORT}/"

is_up() {
  curl -sS --max-time 2 "$CHECK_URL" >/dev/null 2>&1
}

start_gateway() {
  echo "[$(date -Is)] starting OpenClaw gateway on port ${PORT}..." | tee -a "$LOG_FILE"
  ( nohup openclaw gateway >> "$LOG_FILE" 2>&1 & echo $! > "$LOG_DIR/gateway.pid" )
}

# Try gentle stop if PID file exists
if [[ -f "$LOG_DIR/gateway.pid" ]]; then
  PID=$(cat "$LOG_DIR/gateway.pid" || true)
  if [[ -n "${PID}" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "[$(date -Is)] stopping previous gateway pid=$PID" | tee -a "$LOG_FILE"
    kill "$PID" || true
    sleep 2
  fi
fi

# If port appears occupied, warn but try anyway (container lacks lsof)
if is_up; then
  echo "[$(date -Is)] Gateway appears up on ${CHECK_URL}; no action." | tee -a "$LOG_FILE"
  exit 0
fi

start_gateway

# Wait for readiness
for i in {1..20}; do
  if is_up; then
    echo "[$(date -Is)] Gateway is online on ${CHECK_URL}" | tee -a "$LOG_FILE"
    exit 0
  fi
  sleep 1
done

echo "[$(date -Is)] Gateway failed to come up on ${CHECK_URL} (timeout)" | tee -a "$LOG_FILE"
exit 1
