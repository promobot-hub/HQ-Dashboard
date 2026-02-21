#!/usr/bin/env node
/* Repo hygiene guardrails for heartbeat: remove/ignore files that break CI/deploy */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const removals = [
  'hq-dashboard/package-lock.json',
];

let changed = false;
for (const rel of removals) {
  const p = path.join(ROOT, rel);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); changed = true; console.log('[repoHygiene] removed', rel); } catch (e) { console.error('[repoHygiene] failed to remove', rel, e.message); }
  }
}

// ensure .gitignore blocks reintroduction
const giPath = path.join(ROOT, '.gitignore');
const ignoreAdds = [
  'hq-dashboard/package-lock.json',
];
try {
  let gi = fs.existsSync(giPath) ? fs.readFileSync(giPath, 'utf8') : '';
  for (const line of ignoreAdds) {
    if (!gi.split(/\r?\n/).includes(line)) { gi += (gi.endsWith('\n') ? '' : '\n') + line + '\n'; changed = true; }
  }
  fs.writeFileSync(giPath, gi);
} catch {}

if (!changed) {
  console.log('[repoHygiene] no changes');
}
