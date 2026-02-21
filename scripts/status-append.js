#!/usr/bin/env node
/**
 * status-append.js
 * Quick utility to append a run summary into STATUS.md and refresh the header timestamp.
 * Usage: node scripts/status-append.js "Run-Typ" "Ergebnis kurz" 
 * If no args provided, defaults to: Run-Typ=Cron/DENKE, Ergebnis=Micro-Commit (Utility angelegt)
 */

const fs = require('fs');
const path = require('path');

const STATUS_PATH = path.resolve(process.cwd(), 'STATUS.md');

function nowUtcIso() {
  return new Date().toISOString().replace(/\..+/, 'Z');
}

function nowUtcPretty() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

function run() {
  const runType = process.argv[2] || 'Cron/DENKE';
  const result = process.argv[3] || 'Micro-Commit: Utility angelegt/ausgeführt';

  if (!fs.existsSync(STATUS_PATH)) {
    fs.writeFileSync(STATUS_PATH, '# STATUS\n\n', 'utf8');
  }

  const tsPretty = nowUtcPretty();

  const original = fs.readFileSync(STATUS_PATH, 'utf8');
  const updatedHeader = original.replace(/Zuletzt aktualisiert: .*/,
    `Zuletzt aktualisiert: ${tsPretty}`);

  const block = [
    `\n## ${tsPretty}`,
    `- Run-Typ: ${runType}`,
    `- Ergebnis: ${result}`
  ].join('\n');

  const final = updatedHeader.includes('# STATUS')
    ? updatedHeader + '\n' + block + '\n'
    : '# STATUS\n\n' + `Zuletzt aktualisiert: ${tsPretty}\n` + '\n' + block + '\n';

  fs.writeFileSync(STATUS_PATH, final, 'utf8');
  console.log(`STATUS.md aktualisiert @ ${tsPretty}`);
}

run();
