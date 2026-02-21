#!/usr/bin/env bash
set -euo pipefail

# Quick GitHub status for HQ-Dashboard repo
# Requires: gh CLI authenticated (see skills/github)

REPO="promobot-hub/HQ-Dashboard"

echo "=== PRs (open) ==="
gh pr list -R "$REPO" --limit 10 --state open --json number,title,headRefName,updatedAt --jq '.[] | "#\(.number) [\(.headRefName)] \(.title) — updated \(.updatedAt)"'

echo
echo "=== Latest CI Runs (default branch) ==="
gh run list -R "$REPO" --limit 5 --json databaseId,displayTitle,workflowName,conclusion,createdAt --jq '.[] | "[\(.workflowName)] \(.displayTitle) — \(.conclusion // "IN_PROGRESS") @ \(.createdAt) (#\(.databaseId))"'

echo
echo "Tip: Use \"gh run view -R $REPO <id> --log\" to inspect logs."
