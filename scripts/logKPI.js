#!/usr/bin/env node
/**
 * Simple KPI logger
 * Usage:
 *   node scripts/logKPI.js "Micro-Commit: yes" "Skill-Fortschritt: no" "State aktualisiert: yes"
 * Writes/updates kpis/YYYY-MM-DD.json with a timestamped entry.
 */
const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function today() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nowISO() {
  return new Date().toISOString();
}

function main() {
  const args = process.argv.slice(2);
  const date = today();
  const dir = path.join(process.cwd(), 'kpis');
  ensureDir(dir);
  const file = path.join(dir, `${date}.json`);

  let data = [];
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!Array.isArray(data)) data = [];
    } catch (_) {
      data = [];
    }
  }

  data.push({
    ts: nowISO(),
    notes: args
  });

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`Logged KPI to ${file}`);
}

if (require.main === module) {
  main();
}
