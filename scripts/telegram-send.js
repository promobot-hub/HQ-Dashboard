#!/usr/bin/env node
/* Telegram sender with chat id validation + clear error mapping */
const https = require('https');

function postJSON(url, body) {
  const u = new URL(url);
  const payload = Buffer.from(JSON.stringify(body));
  const opts = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': String(payload.length) } };
  return new Promise((resolve) => {
    const req = https.request(u, opts, (res) => { let data=''; res.on('data', c=>data+=c); res.on('end', ()=> resolve({ status: res.statusCode, body: data })); });
    req.on('error', (e) => resolve({ status: 0, error: String(e.message||e) }));
    req.write(payload); req.end();
  });
}

async function send(token, chatId, text) {
  if (!token) return { ok:false, error:'missing token' };
  if (!chatId) return { ok:false, error:'missing chat id' };
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await postJSON(url, { chat_id: chatId, text });
  if (res.status === 200) return { ok:true };
  let reason = `HTTP ${res.status}`;
  try {
    const j = JSON.parse(res.body||'{}');
    if (j?.description) reason = j.description;
  } catch {}
  // Map common errors to actionable hints
  if (/chat not found/i.test(reason)) reason += ' — check CHAT_ID or invite bot to chat first';
  if (/bot was blocked/i.test(reason)) reason += ' — user blocked the bot';
  if (/forbidden/i.test(reason)) reason += ' — bot lacks permission in this chat';
  return { ok:false, error: reason };
}

if (require.main === module) {
  const token = process.env.TELEGRAM_BOT_TOKEN || process.argv[2];
  const chat = process.env.TELEGRAM_CHAT_ID || process.argv[3];
  const text = process.argv.slice(4).join(' ') || 'test';
  send(token, chat, text).then(r => { console.log(r); process.exit(r.ok?0:1); });
}

module.exports = { send };
