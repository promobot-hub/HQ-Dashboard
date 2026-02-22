#!/usr/bin/env bash
set -euo pipefail
# Run log scan and rotate routinely; can be called from system cron or OpenClaw scheduler
DIR_ROOT=$(pwd)
node "$DIR_ROOT/scripts/logscan.js" || true
node "$DIR_ROOT/scripts/validate-scheduler.js" || true
bash "$DIR_ROOT/scripts/log-rotate.sh" "$DIR_ROOT/logs" 1048576 || true
