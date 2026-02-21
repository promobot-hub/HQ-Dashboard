#!/usr/bin/env node
/*
Updates a structured JSON ledger with:
- lastRunUTC, runsToday, totalRuns
- completed: append an entry for this heartbeat
- pending: parsed from TASKS.md and TODO.md in priority order
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const statePath = path.join(ROOT, 'heartbeat-state.json');
const tasksMdPath = path.join(ROOT, 'TASKS.md');
const todoMdPath = path.join(ROOT, 'TODO.md');
const outDir = path.join(ROOT, 'data');
const outPath = path.join(outDir, 'heartbeat-ledger.json');

function readJSONSafe(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}
function readTextSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function parseTodos(md) {
  // simple bullets starting with - or * or numbered list 1) or 1.
  const lines = md.split(/\r?\n/);
  const items = [];
  for (const line of lines) {
    const m = line.match(/^\s*(?:[-*]|\d+[\).])\s+(.*)\s*$/);
    if (m) {
      let title = m[1].trim();
      if (!title) continue;
      // detect priority markers [P0]/[P1]/[P2]
      let prio = 'normal';
      const pm = title.match(/\[(P[0-2])\]/i);
      if (pm) {
        prio = pm[1].toUpperCase();
        title = title.replace(pm[0], '').trim();
      }
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);
      items.push({ id, title, priority: prio, source: 'md' });
    }
  }
  return items;
}

function uniqueById(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) { if (!seen.has(it.id)) { seen.add(it.id); out.push(it); } }
  return out;
}

(function main(){
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const state = readJSONSafe(statePath, {});
  const runsToday = state.runsToday || 0;
  const totalRuns = state.totalRuns || 0;

  const tasksMd = readTextSafe(tasksMdPath);
  const todoMd = readTextSafe(todoMdPath);

  const pendingFromTasks = parseTodos(tasksMd);
  const pendingFromTodo = parseTodos(todoMd);
  // TODO.md should come first (higher priority), then TASKS.md
  let pending = uniqueById([...pendingFromTodo, ...pendingFromTasks]);
  // sort by priority P0 > P1 > P2 > normal, keep original order within same priority
  const rank = { P0: 0, P1: 1, P2: 2, normal: 3 };
  pending = pending.sort((a,b)=> (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9));

  ensureDir(outDir);
  const ledger = readJSONSafe(outPath, {
    lastRunUTC: null,
    runsToday: 0,
    totalRuns: 0,
    completed: [],
    pending: []
  });

  // append completed heartbeat action
  ledger.completed = ledger.completed || [];
  ledger.completed.unshift({
    timeUTC: now,
    type: 'heartbeat-sync',
    summary: 'Auto-update state/logs/badges',
  });
  // cap history
  if (ledger.completed.length > 200) ledger.completed = ledger.completed.slice(0,200);

  ledger.lastRunUTC = now;
  ledger.runsToday = runsToday;
  ledger.totalRuns = totalRuns;
  ledger.pending = pending;

  fs.writeFileSync(outPath, JSON.stringify(ledger, null, 2));
  console.log(`Updated ${outPath}`);
})();
