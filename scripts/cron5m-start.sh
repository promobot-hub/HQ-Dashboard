#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
if [ -f logs/cron5m.pid ] && ps -p "$(cat logs/cron5m.pid)" >/dev/null 2>&1; then
  echo "cron5m already running (pid $(cat logs/cron5m.pid))"
  exit 0
fi
nohup env -u NODE_OPTIONS DASHBOARD_URL="${DASHBOARD_URL:-https://hq-dashboard-z74i.onrender.com}" node scripts/cron5m.js >> logs/cron5m.log 2>&1 & echo $! > logs/cron5m.pid
sleep 0.5
echo "cron5m started (pid $(cat logs/cron5m.pid))"
