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
const NDJSON_FILE = path.join(LOG_DIR, 'cron5m.ndjson');
const BASE = process.env.DASHBOARD_URL || 'https://hq-dashboard-z74i.onrender.com';
const INTERVAL_MS = 5 * 60 * 1000;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function log(line) {
  const out = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG_FILE, out);
  process.stdout.write(out);
}

function jlog(obj) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...obj }) + "\n";
  fs.appendFileSync(NDJSON_FILE, line);
}

async function post(pathname, attempt = 1) {
  const u = new URL(pathname, BASE);
  const opts = { method: 'POST', headers: { 'Content-Length': '0' } };
  return new Promise((resolve) => {
    const t0 = Date.now();
    const req = https.request(u, opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        const result = { status: res.statusCode, body: data };
        jlog({ kind: 'http', url: String(u), status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, durationMs: Date.now()-t0 });
        resolve(result);
      });
    });
    req.on('error', async (e) => {
      const err = String(e.message||e);
      jlog({ kind: 'http', url: String(u), status: 0, ok: false, durationMs: Date.now()-t0, error: err, attempt });
      if (attempt < 3) {
        const delay = Math.pow(2, attempt) * 500; // 1s, 2s, 4s
        setTimeout(async () => resolve(await post(pathname, attempt + 1)), delay);
      } else {
        resolve({ status: 0, error: err });
      }
    });
    req.end();
  });
}

async function cycle() {
  log('cycle: executing scheduler');
  const r1 = await post('/api/scheduler/execute');
  log(`execute result status=${r1.status} body=${(r1.body||'').slice(0,200)}`);
  log('cycle: triggering /api/cron/trigger');
  const r2 = await post('/api/cron/trigger');
  log(`trigger result status=${r2.status} body=${(r2.body||'').slice(0,200)}`);
}

async function main() {
  fs.writeFileSync(PID_FILE, String(process.pid));
  log(`cron5m daemon start URL=${BASE}`);
  await cycle();
  setInterval(cycle, INTERVAL_MS);
}

main().catch((e) => { log('fatal: '+e.message); process.exit(1); });
