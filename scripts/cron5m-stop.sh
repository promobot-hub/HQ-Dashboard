#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -f logs/cron5m.pid ]; then
  pid=$(cat logs/cron5m.pid || true)
  if [ -n "${pid}" ] && ps -p "$pid" >/dev/null 2>&1; then
    kill "$pid" || true
    echo "stopped cron5m (pid $pid)"
  else
    echo "no running cron5m found"
  fi
  rm -f logs/cron5m.pid
else
  echo "no pidfile"
fi
