# INTERNAL-NOTES

## GitHub Skill — Quick Ops (via gh CLI)

Set once per session (adjust owner/repo):
- export GH_REPO="owner/HQ-Dashboard"

Common tasks:
- Recent workflow runs: gh run list --repo "$GH_REPO" --limit 10
- View run details: gh run view <run-id> --repo "$GH_REPO"
- Failed step logs only: gh run view <run-id> --repo "$GH_REPO" --log-failed
- PR checks for PR #N: gh pr checks N --repo "$GH_REPO"
- Issues (number + title): gh issue list --repo "$GH_REPO" --json number,title --jq '.[] | "\(.number): \(.title)"'
- Get PR fields via API: gh api repos/$GH_REPO/pulls/<pr-number> --jq '.title, .state, .user.login'

Notes:
- Always provide --repo when outside a git repo.
- Prefer --json and --jq for scripts and dashboards.
- If gh is missing, install via apt: sudo apt-get install gh (or brew on macOS).
