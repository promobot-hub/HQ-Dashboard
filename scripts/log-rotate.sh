#!/usr/bin/env bash
set -euo pipefail
DIR=${1:-logs}
MAX=${2:-1048576} # 1MB default

mkdir -p "$DIR"
for f in "$DIR"/*.log "$DIR"/*.ndjson; do
  [ -f "$f" ] || continue
  size=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")
  if [ "$size" -gt "$MAX" ]; then
    ts=$(date +%s)
    mv "$f" "$f.$ts"
    : > "$f"
    echo "rotated $f ($size bytes)"
  fi
done
