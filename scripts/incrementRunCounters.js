#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const statePath = path.resolve(process.cwd(), 'heartbeat-state.json');

function loadState() {
  try {
    const raw = fs.readFileSync(statePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { lastChecks: {}, counters: {} };
  }
}

function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
}

function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

(function main() {
  const now = new Date();
  const state = loadState();
  state.lastChecks = state.lastChecks || {};
  state.counters = state.counters || {};

  const lastDay = state.counters.lastDay || null;
  const currentDay = todayStr(now);

  if (lastDay !== currentDay) {
    state.counters.runsToday = 0;
    state.counters.lastDay = currentDay;
  }

  state.counters.runsToday = (state.counters.runsToday || 0) + 1;
  state.counters.totalRuns = (state.counters.totalRuns || 0) + 1;
  state.lastChecks.heartbeat = now.toISOString();

  saveState(state);

  // also emit a short line to logs/HEARTBEAT-LOG.md
  try {
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const logPath = path.join(logsDir, 'HEARTBEAT-LOG.md');
    const line = `- ${now.toISOString()} — Counters updated (runsToday=${state.counters.runsToday}, totalRuns=${state.counters.totalRuns})`;
    const prefix = fs.existsSync(logPath) ? '\n' : '# HEARTBEAT LOG\n\n';
    fs.appendFileSync(logPath, prefix + line + '\n');
  } catch (e) {
    // ignore logging errors
  }
})();
