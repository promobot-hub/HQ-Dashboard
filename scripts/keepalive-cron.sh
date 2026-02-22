#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
LOG_DIR="logs"
mkdir -p "$LOG_DIR"
PID_FILE="$LOG_DIR/keepalive-cron.pid"
LOG_FILE="$LOG_DIR/keepalive-cron.log"

if [[ -f "$PID_FILE" ]]; then
  old=$(cat "$PID_FILE" || true)
  if [[ -n "$old" ]] && kill -0 "$old" 2>/dev/null; then
    echo "keepalive-cron already running (pid $old)" | tee -a "$LOG_FILE"
    exit 0
  fi
fi

echo "[$(date -Is)] starting keepalive-cron..." | tee -a "$LOG_FILE"
(
  echo $$ > "$PID_FILE"
  while true; do
    # local-daemon
    if ! bash scripts/daemon-status.sh >/dev/null 2>&1; then
      echo "[$(date -Is)] restarting local-daemon" | tee -a "$LOG_FILE"
      bash scripts/daemon-start.sh >> "$LOG_FILE" 2>&1 || true
    fi
    # cron5m
    if ! bash scripts/cron5m-status.sh >/dev/null 2>&1; then
      echo "[$(date -Is)] restarting cron5m" | tee -a "$LOG_FILE"
      bash scripts/cron5m-start.sh >> "$LOG_FILE" 2>&1 || true
    fi
    # website cron-supervisor (audit/improve)
    if ! pgrep -f "scripts/cron-supervisor.sh" >/dev/null 2>&1; then
      echo "[$(date -Is)] starting cron-supervisor" | tee -a "$LOG_FILE"
      nohup bash scripts/cron-supervisor.sh >> "$LOG_FILE" 2>&1 &
    fi
    sleep 60
  done
) & disown

echo "keepalive-cron started (pid $(cat "$PID_FILE"))"