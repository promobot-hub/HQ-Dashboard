#!/usr/bin/env node
/*
Poll inbox for Render deploy emails and write a status snapshot to data/render-deploy-status.json
- Looks for recent messages (last 50) with subject containing 'Render' or 'Deploy'
- Classifies as success/failure based on subject/body keywords
Note: Uses same IMAP config as emailSkill (Zoho). Keep credentials in env if possible.
*/
const fs = require('fs');
const path = require('path');
const imaps = require('imap-simple');

const ROOT = process.cwd();
const outDir = path.join(ROOT, 'data');
const outPath = path.join(outDir, 'render-deploy-status.json');

const IMAP_USER = process.env.IMAP_USER || 'promobot@zohomail.eu';
const IMAP_PASS = process.env.IMAP_PASS || '4fFHbvSAN3bC';

const imapConfig = {
  imap: {
    user: IMAP_USER,
    password: IMAP_PASS,
    host: process.env.IMAP_HOST || 'imap.zoho.eu',
    port: 993,
    tls: true,
    authTimeout: 5000
  }
};

function classify(subject, body) {
  const text = `${subject} ${body}`.toLowerCase();
  if (text.includes('build successful') || text.includes('deploy successful') || text.includes('deployed successfully')) return 'success';
  if (text.includes('build failed') || text.includes('deploy failed') || text.includes('failed')) return 'failure';
  return 'unknown';
}

(async () => {
  try {
    const connection = await imaps.connect(imapConfig);
    await connection.openBox('INBOX');
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3); // last 3 days
    const searchCriteria = ['ALL', ['SINCE', since.toUTCString()]];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: false };
    const messages = await connection.search(searchCriteria, fetchOptions);

    const items = [];
    for (const m of messages.slice(-50)) {
      const parts = m.parts.reduce((a,p)=>{a[p.which]=p.body; return a;},{});
      const headers = parts['HEADER'] || {};
      const from = headers.from ? headers.from[0] : '';
      const subject = headers.subject ? headers.subject[0] : '';
      const date = headers.date ? headers.date[0] : '';
      const body = (parts['TEXT'] || '').toString();
      const isRender = /render\.com|render/i.test(from) || /render|deploy|build/i.test(subject);
      if (!isRender) continue;
      const status = classify(subject, body);
      items.push({ from, subject, date, status });
    }

    await connection.end();

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const latest = items[items.length - 1] || null;
    const payload = { checkedAtUTC: new Date().toISOString(), latest, recent: items.slice(-10) };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
    console.log('Render inbox status written to', outPath);
  } catch (e) {
    console.error('checkRenderInbox error:', e.message);
    try {
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify({ checkedAtUTC: new Date().toISOString(), error: e.message }, null, 2));
    } catch {}
  }
})();
