#!/usr/bin/env node
/**
 * update-heartbeat-state.js
 * Small utility to bump heartbeat-state.json timestamps to "now".
 * Internal use only.
 */
const fs = require('fs');
const path = require('path');

const STATE_PATH = path.resolve(__dirname, '..', 'heartbeat-state.json');

function now() {
  return Math.floor(Date.now() / 1000);
}

function main() {
  const ts = now();
  let state = { lastRun: ts, lastChecks: {} };
  try {
    if (fs.existsSync(STATE_PATH)) {
      const raw = fs.readFileSync(STATE_PATH, 'utf8');
      state = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read existing state, will recreate:', e.message);
    state = { lastRun: ts, lastChecks: {} };
  }

  state.lastRun = ts;
  state.lastChecks = state.lastChecks || {};

  // Bump known categories if present; otherwise, keep minimal
  const keys = Object.keys(state.lastChecks);
  if (keys.length === 0) {
    state.lastChecks.growthTask = ts;
  } else {
    for (const k of keys) state.lastChecks[k] = ts;
  }

  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  console.log('Updated', path.relative(process.cwd(), STATE_PATH), 'to', ts);
}

main();
