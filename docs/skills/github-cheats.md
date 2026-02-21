# GitHub CLI Cheats (gh)

- Auth Status: `gh auth status`
- Issues:
  - List: `gh issue list --limit 20`
  - View: `gh issue view <number>`
  - Create: `gh issue create -t "title" -b "body" -l bug,help wanted`
- PRs:
  - List: `gh pr list --limit 20`
  - View: `gh pr view <number>`
  - Checkout: `gh pr checkout <number>`
  - Create: `gh pr create -t "title" -b "body" -B main -H feature/branch`
  - Merge: `gh pr merge <number> --merge`
- Runs (CI):
  - List runs: `gh run list --limit 20`
  - View run: `gh run view <run-id> --log`
  - Rerun: `gh run rerun <run-id>`
- API (advanced):
  - GET: `gh api repos/<owner>/<repo>/commits --jq '.[0].sha'`
  - POST: `gh api --method POST repos/<owner>/<repo>/dispatches -f event_type=deploy`

Tips:
- Add `--json` and `--jq` to parse output.
- Use `GH_TOKEN` env var for headless auth.
