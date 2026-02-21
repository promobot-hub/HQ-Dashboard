#!/usr/bin/env node
/*
Local daemon (best-effort) to run inside this workspace host.
- Periodically checks GitHub heartbeat freshness and dispatches if stale (via gh CLI)
- Optionally reads inbox (skipped here to avoid storing creds locally)
- Writes status to logs/local-daemon.log
Limitations: persists only while current host/session is alive; no systemd/cron integration.
*/
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const PID_FILE = path.join(LOG_DIR, 'local-daemon.pid');
const LOG_FILE = path.join(LOG_DIR, 'local-daemon.log');
const MAX_STALE_MIN = parseInt(process.env.MAX_STALE_MIN || '20', 10);
const INTERVAL_MS = parseInt(process.env.DAEMON_INTERVAL_MS || '120000', 10);

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function log(line) {
  const out = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG_FILE, out);
  process.stdout.write(out);
}

function gh(cmd) {
  return execSync(`gh ${cmd}`, { encoding: 'utf8' });
}

function latestHeartbeatAgeMin() {
  try {
    const out = gh('run list -R promobot-hub/HQ-Dashboard --limit 1 --workflow "Heartbeat Micro-Commit" --json updatedAt');
    const arr = JSON.parse(out);
    if (!arr.length) return null;
    const t = new Date(arr[0].updatedAt).getTime();
    return Math.round((Date.now() - t)/60000);
  } catch (e) {
    log(`gh error: ${e.message}`);
    return null;
  }
}

function dispatchHeartbeat() {
  try {
    gh('workflow run -R promobot-hub/HQ-Dashboard "Heartbeat Micro-Commit"');
    log('dispatched heartbeat via gh');
  } catch (e) {
    log(`dispatch error: ${e.message}`);
  }
}

async function loop() {
  log('local-daemon start');
  fs.writeFileSync(PID_FILE, String(process.pid));
  while (true) {
    try {
      const age = latestHeartbeatAgeMin();
      log(`heartbeat ageMin=${age}`);
      if (age === null || age > MAX_STALE_MIN) dispatchHeartbeat();
    } catch (e) {
      log(`loop error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, INTERVAL_MS));
  }
}

loop().catch(e => { log('fatal: '+e.message); process.exit(1); });
