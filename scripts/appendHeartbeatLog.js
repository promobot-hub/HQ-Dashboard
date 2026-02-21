#!/usr/bin/env node
/**
 * appendHeartbeatLog.js
 * Quick helper to append a standardized heartbeat log entry.
 * Usage: node scripts/appendHeartbeatLog.js "Micro-Commit=yes" "Skill-Fortschritt=no" "State-Update=yes" "Notes: ..."
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const defaults = {
  micro: 'yes',
  skill: 'no',
  state: 'yes',
  notes: 'Automated append'
};

function nowUtc() {
  const d = new Date();
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z')
    .replace('T', ' ')
    .replace(':00Z', 'Z') // keep seconds if needed; simple cleanup
    .replace(/:([0-5]\d)Z$/, ':$1 UTC').replace('Z', ' UTC');
}

function parseArgs(a) {
  const out = { ...defaults };
  a.forEach((item) => {
    const lower = item.toLowerCase();
    if (lower.startsWith('micro-commit=')) out.micro = item.split('=')[1];
    else if (lower.startsWith('skill-fortschritt=')) out.skill = item.split('=')[1];
    else if (lower.startsWith('state-update=')) out.state = item.split('=')[1];
    else if (lower.startsWith('notes:') || lower.startsWith('notes=')) out.notes = item.split(/[:=]/).slice(1).join(':').trim();
  });
  return out;
}

(function main(){
  const { micro, skill, state, notes } = parseArgs(args);
  const line = `- ${nowUtc()} — KPIs: Micro-Commit=${micro}, Skill-Fortschritt=${skill}, State-Update=${state}. Notes: ${notes}.`;
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'HEARTBEAT-LOG.md');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '# HEARTBEAT-LOG\n\n');
  fs.appendFileSync(logFile, `${line}\n`);
  console.log('Appended:', line);
})();
