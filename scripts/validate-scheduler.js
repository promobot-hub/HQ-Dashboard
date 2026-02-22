#!/usr/bin/env node
/* Validate GitHub-backed scheduler jobs (data/scheduler/jobs.json) */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const JOBS_FILE = path.join(REPO_ROOT, 'data', 'scheduler', 'jobs.json');

function loadJobs() {
  try { return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8')); } catch { return []; }
}

function isValidCron(cron) {
  // Basic: 5 space-separated fields, allow */n and numbers
  return typeof cron === 'string' && cron.trim().split(/\s+/).length === 5;
}

function validate(jobs) {
  const actions = new Set(['trigger','snapshot','improve']);
  const findings = [];
  for (const j of jobs || []) {
    if (!j.id || typeof j.id !== 'string') findings.push({ type:'sched_invalid', msg:'missing id', job: j });
    if (!j.name) findings.push({ type:'sched_invalid', msg:'missing name', job: j });
    if (!isValidCron(j.cron)) findings.push({ type:'sched_cron', msg:`invalid cron: ${j.cron}`, job: j });
    if (!actions.has(j.action)) findings.push({ type:'sched_action', msg:`unknown action: ${j.action}`, job: j });
  }
  return findings;
}

function appendDebug(lines) {
  const f = path.join(REPO_ROOT, 'data', 'debug.ndjson');
  const ts = new Date().toISOString();
  const out = (lines.length? lines: [{ type:'sched_ok', msg:'scheduler jobs valid' }])
    .map(x => JSON.stringify({ ts, kind:'sched-validate', ...x }))
    .join('\n') + '\n';
  fs.appendFileSync(f, out);
}

function main() {
  const jobs = loadJobs();
  const findings = validate(jobs);
  appendDebug(findings);
  console.log(`validate-scheduler: jobs=${(jobs||[]).length}, findings=${findings.length}`);
}

if (require.main === module) main();
