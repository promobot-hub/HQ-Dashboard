#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "${GREEN}OK${NC}  $1"; }
warn() { echo -e "${YELLOW}WARN${NC} $1"; }
fail() { echo -e "${RED}FAIL${NC} $1"; }

status=0

# 1) Required core files
for f in SOUL.md IDENTITY.md USER.md HEARTBEAT.md MEMORY.md; do
  if [[ -f "$f" ]]; then ok "Found $f"; else fail "Missing $f"; status=1; fi
done

# 2) Heartbeat state sanity
if [[ -f "heartbeat-state.json" ]]; then
  if command -v jq >/dev/null 2>&1; then
    if jq -e . >/dev/null 2>&1 < heartbeat-state.json; then
      ok "heartbeat-state.json is valid JSON"
    else
      fail "heartbeat-state.json is invalid JSON"
      status=1
    fi
  else
    warn "jq not found; skipping JSON validation for heartbeat-state.json"
  fi
else
  warn "heartbeat-state.json not found"
fi

# 3) Growth logs present
if [[ -d growth ]]; then
  ok "growth/ directory exists"
  [[ -f growth/MICRO_TASKS.md ]] && ok "growth/MICRO_TASKS.md exists" || warn "growth/MICRO_TASKS.md missing"
else
  warn "growth/ directory missing"
fi

# 4) Git repo presence
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  ok "Git repository detected"
else
  warn "Not inside a Git repository"
fi

# 5) Node/toolchain basic checks
if command -v node >/dev/null 2>&1; then ok "node $(node -v)"; else warn "node not found"; fi
if command -v npm  >/dev/null 2>&1; then ok "npm $(npm -v)";  else warn "npm not found"; fi
if command -v gh   >/dev/null 2>&1; then ok "gh $(gh --version | head -n1)"; else warn "gh not found"; fi

# Summary
if [[ $status -eq 0 ]]; then
  echo -e "\n${GREEN}Health check passed${NC}"
else
  echo -e "\n${RED}Health check encountered issues${NC}"
fi
exit $status
