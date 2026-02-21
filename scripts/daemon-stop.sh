#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -f logs/local-daemon.pid ]; then
  pid=$(cat logs/local-daemon.pid || true)
  if [ -n "${pid}" ] && ps -p "$pid" >/dev/null 2>&1; then
    kill "$pid" || true
    echo "stopped local-daemon (pid $pid)"
  else
    echo "no running daemon found"
  fi
  rm -f logs/local-daemon.pid
else
  echo "no pidfile"
fi
