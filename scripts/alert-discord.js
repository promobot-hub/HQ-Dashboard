#!/usr/bin/env node
/* Send a compact alert to Discord via webhook */
const https = require('https');

function postJSON(url, body) {
  const u = new URL(url);
  const payload = Buffer.from(JSON.stringify(body));
  const opts = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': String(payload.length) } };
  return new Promise((resolve) => {
    const req = https.request(u, opts, (res) => { let data = ''; res.on('data', c => data += c); res.on('end', ()=> resolve({ status: res.statusCode, body: data })); });
    req.on('error', (e) => resolve({ status: 0, error: String(e.message||e) }));
    req.write(payload); req.end();
  });
}

async function sendAlert(webhook, title, items) {
  const lines = items.slice(0, 10).map(i => `• [${i.type}] ${i.msg}`).join('\n');
  const content = `🚨 OpenClaw Log Alert\n${title}\n${lines}${items.length>10?`\n… +${items.length-10} more`:''}`;
  return postJSON(webhook, { content });
}

if (require.main === module) {
  const webhook = process.env.DISCORD_WEBHOOK_URL || process.argv[2];
  const title = process.argv[3] || 'Findings';
  const items = JSON.parse(process.argv[4] || '[]');
  if (!webhook) { console.error('No webhook provided'); process.exit(2); }
  sendAlert(webhook, title, items).then(r => { console.log('alert sent', r.status); process.exit(0); });
}

module.exports = { sendAlert };
