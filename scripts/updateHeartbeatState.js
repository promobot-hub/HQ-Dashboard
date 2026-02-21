#!/usr/bin/env node
/**
 * Update heartbeat-state.json timestamps for one or more keys.
 * Usage: node scripts/updateHeartbeatState.js dashboard skills email
 */
const fs = require('fs');
const path = require('path');

const statePath = path.resolve(__dirname, '..', 'heartbeat-state.json');
const keys = process.argv.slice(2);
if (keys.length === 0) {
  console.error('Provide at least one key to update (e.g., dashboard skills)');
  process.exit(1);
}

function loadState(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { lastChecks: {}, meta: {} };
  }
}

function saveState(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const now = new Date().toISOString();
const state = loadState(statePath);
state.lastChecks = state.lastChecks || {};

for (const k of keys) {
  state.lastChecks[k] = now;
}

state.meta = state.meta || {};
state.meta.updatedAt = now;

saveState(statePath, state);

console.log(`Updated ${keys.join(', ')} at ${now}`);
