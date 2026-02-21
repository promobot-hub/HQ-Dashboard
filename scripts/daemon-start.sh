#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
if [ -f logs/local-daemon.pid ] && ps -p "$(cat logs/local-daemon.pid)" >/dev/null 2>&1; then
  echo "local-daemon already running (pid $(cat logs/local-daemon.pid))"
  exit 0
fi
nohup env -u NODE_OPTIONS node scripts/local-daemon.js >> logs/local-daemon.log 2>&1 & echo $! > logs/local-daemon.pid
sleep 0.5
echo "local-daemon started (pid $(cat logs/local-daemon.pid))"
