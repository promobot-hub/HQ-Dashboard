#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'heartbeat-state.json');
const now = new Date().toISOString();

let data = {
  lastRun: now,
  lastChecks: { email: null, calendar: null, weather: null, mentions: null, heartbeat: now },
  kpi: { microCommit: false, skillProgress: false, stateUpdated: true, backlogUpdated: false }
};

try {
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = raw ? JSON.parse(raw) : {};
    data = {
      ...parsed,
      lastRun: now,
      lastChecks: { ...(parsed.lastChecks || {}), heartbeat: now },
      kpi: { ...(parsed.kpi || {}), stateUpdated: true }
    };
  }
} catch (e) {
  // fallback to defaults already set
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`heartbeat-state updated: ${now}`);
