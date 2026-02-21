#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -f logs/local-daemon.pid ]; then
  pid=$(cat logs/local-daemon.pid || true)
  if [ -n "${pid}" ] && kill -0 "$pid" >/dev/null 2>&1; then
    echo "local-daemon running (pid $pid)"
    exit 0
  fi
fi
echo "local-daemon not running"
exit 1
