#!/usr/bin/env node
/* Log Scanner: scans OpenClaw logs and writes analysis to data/debug.ndjson + data/debug/analysis-<ts>.json */
const fs = require('fs');
const path = require('path');

const CLAW_LOG_DIR = process.env.CLAW_LOG_DIR || '/data/.openclaw/logs';
const REPO_ROOT = path.join(process.cwd());
const DATA_DIR = path.join(REPO_ROOT, 'data');
const DEBUG_FILE = path.join(DATA_DIR, 'debug.ndjson');
const ANALYSIS_DIR = path.join(DATA_DIR, 'debug');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ANALYSIS_DIR)) fs.mkdirSync(ANALYSIS_DIR, { recursive: true });

function listFiles(dir) {
  try { return fs.readdirSync(dir).map(f => path.join(dir, f)); } catch { return []; }
}

function readTail(p, maxBytes=200*1024) {
  try {
    const st = fs.statSync(p);
    const size = st.size;
    const fd = fs.openSync(p, 'r');
    const start = Math.max(0, size - maxBytes);
    const len = size - start;
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, start);
    fs.closeSync(fd);
    return buf.toString('utf8');
  } catch { return ''; }
}

function analyze(text) {
  const findings = [];
  const add = (type, msg, meta={}) => findings.push({ type, msg, ...meta });
  const lines = text.split(/\n/);
  for (const ln of lines) {
    if (/Telegram/i.test(ln) && /(400|401|403)/.test(ln)) add('telegram_error', 'Telegram HTTP error', { line: ln });
    if (/Gateway Timeout|ETIMEDOUT|ECONNRESET|ECONNREFUSED/i.test(ln)) add('network_timeout', 'Network timeout/refused/reset', { line: ln });
    if (/unknown cron id|cron id not found/i.test(ln)) add('cron_unknown', 'Unknown cron id referenced', { line: ln });
    if (/rate limit|429/i.test(ln)) add('rate_limit', 'Rate limit encountered', { line: ln });
    if (/ReferenceError|TypeError|UnhandledRejection|UnhandledPromiseRejection/i.test(ln)) add('runtime_error', 'Unhandled runtime error', { line: ln });
  }
  return findings;
}

function writeNdjson(items) {
  const lines = items.map(x => JSON.stringify({ ts: new Date().toISOString(), kind: 'logscan', ...x })).join('\n') + '\n';
  fs.appendFileSync(DEBUG_FILE, lines);
}

function main() {
  const files = listFiles(CLAW_LOG_DIR).filter(f => fs.statSync(f).isFile());
  const report = { ts: new Date().toISOString(), scanned: [], findings: [] };
  for (const f of files) {
    const tail = readTail(f);
    const fnd = analyze(tail);
    report.scanned.push({ file: f, bytes: tail.length, findings: fnd.length });
    report.findings.push(...fnd.map(x => ({ file: f, ...x })));
  }
  // write analysis json
  const out = path.join(ANALYSIS_DIR, `analysis-${Date.now()}.json`);
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  // write ndjson summary
  writeNdjson(report.findings.length ? report.findings : [{ type:'logscan_ok', msg:'no critical findings' }]);
  console.log(`logscan complete: scanned=${report.scanned.length} files, findings=${report.findings.length}`);
}

if (require.main === module) main();
