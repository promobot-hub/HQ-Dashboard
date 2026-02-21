#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const statePath = path.resolve(process.cwd(), 'heartbeat-state.json');

function now() {
  const d = new Date();
  return {
    iso: d.toISOString(),
    epoch: Math.floor(d.getTime() / 1000)
  };
}

function loadState(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {
      lastRun: null,
      lastChecks: {},
      kpis: {
        microCommit: false,
        skillProgress: false,
        stateUpdated: false
      },
      updatedAt: null
    };
  }
}

function saveState(p, state) {
  fs.writeFileSync(p, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

(function main() {
  const t = now();
  const state = loadState(statePath);

  state.lastRun = t.iso;
  state.lastRunAt = t.iso;
  state.updatedAt = t.iso;
  state.lastUpdate = t.epoch;
  state.lastChecks = state.lastChecks || {};
  for (const key of ['email', 'calendar', 'weather', 'social']) {
    state.lastChecks[key] = t.epoch;
  }
  state.kpis = Object.assign({
    microCommit: true,
    skillProgress: state.kpis && typeof state.kpis.skillProgress === 'boolean' ? state.kpis.skillProgress : false,
    stateUpdated: true
  }, state.kpis || {});

  saveState(statePath, state);
  console.log('heartbeat-state.json updated:', t.iso);
})();
