#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -f logs/cron5m.pid ]; then
  pid=$(cat logs/cron5m.pid || true)
  if [ -n "${pid}" ] && kill -0 "$pid" >/dev/null 2>&1; then
    echo "cron5m running (pid $pid)"
    exit 0
  fi
fi
echo "cron5m not running"
exit 1
