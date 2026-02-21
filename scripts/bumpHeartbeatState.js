#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const statePath = path.resolve(process.cwd(), 'heartbeat-state.json');

function isoNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function main() {
  let state = {
    lastRun: null,
    lastChecks: {},
    kpis: { microCommit: false, skillProgress: false, stateUpdated: false },
    updatedAt: null,
  };

  try {
    if (fs.existsSync(statePath)) {
      const raw = fs.readFileSync(statePath, 'utf8');
      state = { ...state, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to read heartbeat-state.json:', e.message);
  }

  const now = isoNow();
  state.lastRun = now;
  state.updatedAt = now;
  state.kpis = {
    ...state.kpis,
    microCommit: true,
    stateUpdated: true,
  };

  try {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
    console.log('Updated', statePath, '->', now);
  } catch (e) {
    console.error('Failed to write heartbeat-state.json:', e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
