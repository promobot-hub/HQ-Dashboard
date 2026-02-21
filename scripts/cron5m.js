#!/usr/bin/env node
/* OpenClaw local cron (5m): Triggers site evolution cycle via deployed API
   - Calls /api/cron/trigger (uses request-origin snapshot + Core improve via site cron)
   - Logs to logs/cron5m.log
*/
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = process.cwd();
const LOG_DIR = path.join(ROOT, 'logs');
const PID_FILE = path.join(LOG_DIR, 'cron5m.pid');
const LOG_FILE = path.join(LOG_DIR, 'cron5m.log');
const BASE = process.env.DASHBOARD_URL || 'https://hq-dashboard-z74i.onrender.com';
const INTERVAL_MS = 5 * 60 * 1000;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function log(line) {
  const out = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG_FILE, out);
  process.stdout.write(out);
}

function post(pathname) {
  const u = new URL(pathname, BASE);
  const opts = { method: 'POST', headers: { 'Content-Length': '0' } };
  return new Promise((resolve) => {
    const req = https.request(u, opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', (e) => resolve({ status: 0, error: String(e.message||e) }));
    req.end();
  });
}

async function cycle() {
  log('cycle: triggering /api/cron/trigger');
  const r = await post('/api/cron/trigger');
  log(`trigger result status=${r.status} body=${(r.body||'').slice(0,200)}`);
}

async function main() {
  fs.writeFileSync(PID_FILE, String(process.pid));
  log(`cron5m daemon start URL=${URL}`);
  await cycle();
  setInterval(cycle, INTERVAL_MS);
}

main().catch((e) => { log('fatal: '+e.message); process.exit(1); });
