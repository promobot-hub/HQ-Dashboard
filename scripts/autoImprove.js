#!/usr/bin/env node
/* AutoImproveBot — simple analyzer producing a Markdown report.
Scans hq-dashboard for potential issues and writes to data/autoimprove/LATEST.md
Heuristics-based (fast, safe) — not a compiler.
*/
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, 'hq-dashboard');
const OUT_DIR = path.join(ROOT, 'data', 'autoimprove');
const OUT_LATEST = path.join(OUT_DIR, 'LATEST.md');
const HIST_DIR = path.join(OUT_DIR, 'history');

function sh(cmd, cwd=ROOT) {
  try { return execSync(cmd, { encoding: 'utf8', cwd }); } catch(e) { return String(e.message||e); }
}

function listFiles(dir, exts) {
  const out = [];
  function walk(d) {
    const ents = fs.readdirSync(d, { withFileTypes: true });
    for (const ent of ents) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (exts.includes(path.extname(ent.name))) out.push(p);
    }
  }
  walk(dir);
  return out;
}

function detectImplicitAnyInDestructuredParams(content) {
  // looks for function foo({ a, b }) {  or  export default function X({ a }) {
  const re = /(export\s+default\s+)?function\s+[A-Za-z0-9_]*\s*\(\s*\{[^:}]+\}\s*\)/g;
  const matches = [];
  let m;
  while ((m = re.exec(content))) matches.push({ index: m.index, snippet: content.slice(m.index, m.index+100) });
  return matches;
}

function needsUseClient(content) {
  const first = content.split(/\r?\n/,1)[0] || '';
  if (/^"use client";/.test(first) || /^'use client';/.test(first)) return false;
  if (/useState\s*\(|useEffect\s*\(|useRef\s*\(/.test(content)) return true;
  return false;
}

function main(){
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const head = sh('git rev-parse --short HEAD').trim();
  const lastCommits = sh('git log --oneline -5');
  const prList = sh('gh pr list -R promobot-hub/HQ-Dashboard --limit 10 --state open');

  const files = listFiles(APP_DIR, ['.tsx','.ts']);
  const findings = [];

  for (const f of files) {
    const rel = path.relative(ROOT, f);
    const txt = fs.readFileSync(f,'utf8');

    // 1) implicit any in destructured params
    const imps = detectImplicitAnyInDestructuredParams(txt);
    if (imps.length) {
      findings.push({ type: 'ts-implicit-any', file: rel, detail: `destructured param without type`, sample: imps[0].snippet });
    }

    // 2) client hooks without use client
    if (/components\//.test(rel) || /app\//.test(rel)) {
      if (needsUseClient(txt)) findings.push({ type: 'missing-use-client', file: rel, detail: 'uses hooks but missing "use client" directive' });
    }

    // 3) require() usage in app/api/components (should be ESM import)
    if (/require\(/.test(txt) && /(app\/|components\/|api\/)/.test(rel)) {
      findings.push({ type: 'cjs-require', file: rel, detail: 'require() found; prefer ESM import' });
    }
  }

  const critical = findings.filter(f => f.type==='ts-implicit-any' || f.type==='cjs-require');
  const high = findings.filter(f => f.type==='missing-use-client');

  const lines = [];
  lines.push(`=== AutoImproveBot Run @ ${now} ===`);
  lines.push('');
  lines.push(`Commit: ${head}`);
  lines.push('');
  lines.push('Recent commits:');
  lines.push('');
  lines.push('```');
  lines.push(lastCommits.trim());
  lines.push('```');
  lines.push('');
  lines.push('Open PRs:');
  lines.push('');
  lines.push('```');
  lines.push(prList.trim());
  lines.push('```');
  lines.push('');
  lines.push('Findings:');
  lines.push('');
  if (!findings.length) {
    lines.push('- No issues detected by heuristics.');
  } else {
    for (const f of findings) {
      lines.push(`- [${f.type}] ${f.file} — ${f.detail}${f.sample?`\n  sample: \`${f.sample.replace(/`/g,'\u0060')}\``:''}`);
    }
  }
  lines.push('');
  lines.push('Priorities:');
  lines.push('');
  lines.push(`- Critical: ${critical.length}`);
  lines.push(`- High: ${high.length}`);
  lines.push('');

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(HIST_DIR)) fs.mkdirSync(HIST_DIR, { recursive: true });
  fs.writeFileSync(OUT_LATEST, lines.join('\n'));
  const day = new Date().toISOString().slice(0,10);
  const histFile = path.join(HIST_DIR, `${day}.md`);
  fs.appendFileSync(histFile, lines.join('\n')+"\n\n");
  console.log(`Wrote ${OUT_LATEST} and appended to history.`);
}

main();
