#!/usr/bin/env node
const { execSync } = require('child_process');
const https = require('https');

function sh(cmd){ try { return execSync(cmd, { encoding:'utf8' }); } catch(e){ return String(e.message||e); } }
function http(url, method='GET'){ return new Promise(res=>{ const u=new URL(url); const req=https.request(u,{method},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res({status:r.statusCode,headers:r.headers,body:d}));}); req.on('error',e=>res({status:0,error:String(e.message||e)})); req.end();}); }

(async()=>{
  const BASE = process.env.DASHBOARD_URL || 'https://hq-dashboard-z74i.onrender.com';
  const REPO = process.env.GH_REPO || 'promobot-hub/HQ-Dashboard';
  const paths = ['heartbeat.json','logs.ndjson','tasks.json','metrics.json','skills.json','sessions.json'];

  console.log('=== Local Cron (OpenClaw) ===');
  console.log(sh('bash scripts/cron5m-status.sh || true'));
  console.log('tail cron5m.log:');
  console.log(sh('tail -n 20 logs/cron5m.log || true'));

  console.log('=== Site Cron ===');
  console.log('status:', await http(`${BASE}/api/cron/status`));

  console.log('=== Site APIs ===');
  for (const p of ['health','status','tasks','logs?limit=3','metrics','skills','sessions']){
    const r = await http(`${BASE}/api/${p}`);
    console.log(`/api/${p} ->`, r.status, (r.body||'').slice(0,200));
  }

  console.log('=== GitHub raw files ===');
  for (const p of paths){
    const url = `https://raw.githubusercontent.com/${REPO}/main/data/${p}`;
    const r = await http(url);
    console.log(p, '->', r.status, (r.body||'').slice(0,120));
  }

  console.log('=== GH commits (last 5 touching data/) ===');
  console.log(sh(`gh api -X GET repos/${REPO}/commits --jq 'map(select(.files) )' || true`));
})();
