#!/usr/bin/env node
/**
 * updateHeartbeatState.js
 * Quick utility to update / create heartbeat-state.json timestamps.
 * Usage:
 *   node scripts/updateHeartbeatState.js [field]
 * Examples:
 *   node scripts/updateHeartbeatState.js            # updates lastRun only
 *   node scripts/updateHeartbeatState.js email      # sets lastChecks.email to now and updates lastRun
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATE_PATH = path.join(ROOT, 'heartbeat-state.json');

function loadState() {
  try {
    const raw = fs.readFileSync(STATE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { lastChecks: { email: null, calendar: null, weather: null, mentions: null, dashboardRepo: null, skills: null }, lastRun: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function isoNow() {
  return new Date().toISOString();
}

(function main() {
  const arg = process.argv[2];
  const state = loadState();
  const now = isoNow();

  if (arg) {
    if (!state.lastChecks) state.lastChecks = {};
    state.lastChecks[arg] = now;
  }
  state.lastRun = now;

  saveState(state);
  const updated = arg ? `lastChecks.${arg}` : 'lastRun';
  console.log(`[heartbeat] Updated ${updated} => ${now}`);
})();
