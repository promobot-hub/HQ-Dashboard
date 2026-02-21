#!/usr/bin/env node
/*
Persistent background runner (for Render Background Worker)
- Polls GitHub Actions workflow status for "Heartbeat Micro-Commit"
- Triggers the heartbeat workflow if stale (> maxStaleMin) via GitHub REST API
- Checks inbox for Render deploy emails (reuses logic inline, not writing to git)
- Logs heartbeat to stdout for observability

Environment variables (configure on Render Worker):
- GH_OWNER (e.g. promobot-hub)
- GH_REPO (e.g. HQ-Dashboard)
- GH_TOKEN (required for dispatch + API calls)
- MAX_STALE_MIN (optional, default 20)
- POLL_INTERVAL_S (optional, default 120)
- IMAP_USER/IMAP_PASS/IMAP_HOST (optional for inbox check)
*/
const https = require('https');
const imaps = require('imap-simple');

const OWNER = process.env.GH_OWNER || 'promobot-hub';
const REPO = process.env.GH_REPO || 'HQ-Dashboard';
const GH_TOKEN = process.env.GH_TOKEN || '';
const MAX_STALE_MIN = parseInt(process.env.MAX_STALE_MIN || '20', 10);
const POLL_INTERVAL_S = parseInt(process.env.POLL_INTERVAL_S || '120', 10);

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'User-Agent': 'PromoteBot-Worker',
        'Accept': 'application/vnd.github+json',
        ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}),
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, (res) => {
      let out = '';
      res.on('data', (d) => out += d);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(out ? JSON.parse(out) : {}); } catch { resolve({ raw: out }); }
        } else {
          reject(new Error(`GitHub ${method} ${path} ${res.statusCode}: ${out}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getLatestHeartbeatRun() {
  const wfList = await ghRequest('GET', `/repos/${OWNER}/${REPO}/actions/workflows`, null);
  const wf = (wfList.workflows || []).find(w => w.name === 'Heartbeat Micro-Commit');
  if (!wf) return null;
  const runs = await ghRequest('GET', `/repos/${OWNER}/${REPO}/actions/workflows/${wf.id}/runs?per_page=1`, null);
  const run = runs.workflow_runs && runs.workflow_runs[0] || null;
  return run;
}

async function dispatchHeartbeat() {
  const body = { ref: 'main' };
  const r = await ghRequest('POST', `/repos/${OWNER}/${REPO}/actions/workflows/heartbeat.yml/dispatches`, body);
  return r;
}

async function checkInboxOnce() {
  const user = process.env.IMAP_USER;
  const pass = process.env.IMAP_PASS;
  if (!user || !pass) return { ok: false, reason: 'no-imap-creds' };
  const cfg = { imap: { user, password: pass, host: process.env.IMAP_HOST || 'imap.zoho.eu', port: 993, tls: true, authTimeout: 5000 } };
  try {
    const conn = await imaps.connect(cfg);
    await conn.openBox('INBOX');
    const since = new Date(Date.now() - 1000*60*60*24);
    const messages = await conn.search(['ALL', ['SINCE', since.toUTCString()]], { bodies: ['HEADER'], markSeen: false });
    const latest = messages.slice(-1)[0];
    await conn.end();
    return { ok: true, latestHeader: latest && latest.parts && latest.parts[0] && latest.parts[0].body || null };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function loop() {
  while (true) {
    const t0 = Date.now();
    try {
      const run = await getLatestHeartbeatRun();
      const updated = run ? new Date(run.updated_at).getTime() : 0;
      const ageMin = run ? Math.round((Date.now() - updated)/60000) : null;
      const needsDispatch = ageMin === null || ageMin > MAX_STALE_MIN;
      console.log(`[worker] latest heartbeat: ${run ? run.status+'/'+(run.conclusion||'')+ ' @ '+ run.updated_at : 'none'}; ageMin=${ageMin}; needsDispatch=${needsDispatch}`);
      if (needsDispatch && GH_TOKEN) {
        try { await dispatchHeartbeat(); console.log('[worker] dispatched heartbeat'); } catch(e) { console.error('[worker] dispatch error:', e.message); }
      }
      const inbox = await checkInboxOnce();
      console.log('[worker] inbox check:', inbox.ok ? 'ok' : `fail:${inbox.reason||inbox.error}`);
    } catch (e) {
      console.error('[worker] loop error:', e.message);
    }
    const dt = Date.now() - t0;
    const sleepMs = Math.max(1000, POLL_INTERVAL_S*1000 - dt);
    await new Promise(r => setTimeout(r, sleepMs));
  }
}

loop().catch(e => { console.error('[worker] fatal', e); process.exit(1); });
