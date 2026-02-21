// Clawbot Live Systems: Heartbeat, Improve, Logs, Sidebar routing (Vanilla JS)
(function(){
  const HEARTBEAT_API = '/api/status'; // fallback if /api/heartbeat not present
  const ALT_HEARTBEAT = '/api/heartbeat';
  const LOGS_API = (limit=20)=> `/api/logs?limit=${limit}`;
  const IMPROVE_API = '/api/improve';

  const state = { online: true, lastOkAt: null };
  const DEBUG = false;

  // Concurrency limiter (max 3 parallel fetches)
  const MAX_CONCURRENT = 3; let active = 0; const queue = [];
  function limitedFetch(url, init){
    return new Promise((resolve, reject)=>{
      const run = ()=>{ active++; fetch(url, init).then(resolve, reject).finally(()=>{ active--; const n=queue.shift(); n && n(); }); };
      if (active < MAX_CONCURRENT) run(); else queue.push(run);
    });
  }

  function qs(s, r=document){ return r.querySelector(s); }
  function qsa(s, r=document){ return Array.from(r.querySelectorAll(s)); }

  function setOffline(on){
    const bar = qs('#offline-indicator');
    if (!bar) return;
    bar.classList.toggle('hidden', !on);
  }

  async function safeJson(url, init){
    try{
      const r = await limitedFetch(url, init);
      if (!r.ok) throw new Error('bad '+r.status);
      const j = await r.json();
      state.online = true; state.lastOkAt = Date.now(); setOffline(false);
      return j;
    }catch(e){ state.online = false; setOffline(true); throw e; }
  }

  // Heartbeat widget
  async function updateHeartbeat(){
    const host = qs('#heartbeat-widget'); if (!host) return;
    let data=null;
    try{ data = await safeJson(ALT_HEARTBEAT); }
    catch{ try{ data = await safeJson(HEARTBEAT_API); } catch{ /* fallthrough */ } }
    if (!data){ host.innerHTML = hbMarkup(null, true); return; }
    host.innerHTML = hbMarkup(data, false);
  }
  function hbMarkup(d, err){
    const ok = !err && (!!d?.lastRunAt || !!d?.ok);
    const last = d?.lastRunAt || d?.last || null;
    const runsToday = d?.runsToday ?? '—';
    const totalRuns = d?.totalRuns ?? '—';
    const ago = last ? timeAgo(new Date(last)) : 'n/a';
    const pulse = ok ? 'animate-pulse' : '';
    const dot = ok ? 'bg-emerald-400' : 'bg-red-500';
    return `<div class="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md">
      <span class="inline-block h-2.5 w-2.5 rounded-full ${dot} ${pulse} shadow-[0_0_0_2px_rgba(34,211,238,0.2),0_0_40px_rgba(168,85,247,0.25)]"></span>
      <div class="text-xs text-white/70">Heartbeat: <span class="text-white/90">${ok?'OK':'DOWN'}</span> • Last: ${ago} • Today: ${runsToday} • Total: ${totalRuns}</div>
    </div>`;
  }

  // Self-Improve card
  async function updateImprove(){
    const host = qs('#improve-card'); if (!host) return;
    let data=null;
    try{ data = await safeJson('/api/autoimprove'); } catch{ /* optional */ }
    const last = data?.lastRunAt || null; const score = data?.score ?? '—';
    host.innerHTML = `
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div class="flex items-center justify-between">
          <div class="text-xs uppercase tracking-wide text-white/60">Self-Improve</div>
          <button id="improveNow" class="rounded-xl bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110">Trigger Now</button>
        </div>
        <div class="mt-2 text-sm text-white/80">Letzter Cycle: <span class="text-white/90">${ last? timeAgo(new Date(last)) : 'unbekannt' }</span></div>
        <div class="mt-1 text-sm text-white/80">Score: <span class="text-white/90">${score}</span></div>
      </div>`;
    qs('#improveNow')?.addEventListener('click', triggerImprove);
  }
  async function triggerImprove(){
    const { show } = window.ClawToasts || {}; const toast = show ? show('Triggering Improve cycle…', { type:'info', duration:2000 }) : null;
    try{
      const r = await fetch(IMPROVE_API, { method:'POST' });
      if (!r.ok) throw new Error('bad status');
      show && show('Improve cycle triggered.', { type:'success', duration:2200 });
    }catch(e){ show && show('Improve failed (simulated if API missing).', { type:'error' }); }
  }

  // Logs
  async function updateLogs(){
    const host = qs('#recent-activity-list'); if (!host) return;
    try{
      const j = await safeJson(LOGS_API(20));
      const rows = (j?.items || j?.logs || [])
        .map((x)=> logRow(x))
        .join('');
      host.innerHTML = rows || emptyRow();
    }catch(e){ host.innerHTML = emptyRow(); }
  }
  function emptyRow(){ return `<li class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/60 text-sm">No recent activity.</li>`; }
  function logRow(x){
    const msg = x.message || x.msg || x.text || JSON.stringify(x);
    const when = x.ts ? timeAgo(new Date(x.ts)) : 'just now';
    return `<li class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-3">
      <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent-cyan/20 text-accent-cyan">✓</span>
      <div class="flex-1">
        <div class="text-white/90 truncate">${escapeHtml(msg)}</div>
        <div class="text-white/50 text-xs">${when}</div>
      </div>
    </li>`;
  }

  // Routing hooks (placeholder anchors)
  function wireSidebar(){
    qsa('a[href="#kanban"]').forEach(a=> a.addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('kanban-container')?.scrollIntoView({ behavior:'smooth' }); }));
    qsa('a[href="#logs"]').forEach(a=> a.addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('recent-activity')?.scrollIntoView({ behavior:'smooth' }); }));
  }

  function timeAgo(d){
    const s = Math.floor((Date.now()-d.getTime())/1000);
    if (s<60) return `${s}s ago`;
    const m = Math.floor(s/60); if (m<60) return `${m}m ago`;
    const h = Math.floor(m/60); return `${h}h ago`;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>]/g, (c)=> ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]) ); }

  // Mount points injection if missing
  function ensureHeartbeatSlot(){
    if (!qs('#heartbeat-slot')){
      const nav = qs('header .flex.h-16.items-center.justify-between');
      if (nav){ const slot = document.createElement('div'); slot.id='heartbeat-slot'; slot.className='hidden md:block'; nav.appendChild(slot); }
    }
    if (!qs('#heartbeat-widget')){
      const slot = qs('#heartbeat-slot'); if (slot){ const box=document.createElement('div'); box.id='heartbeat-widget'; slot.appendChild(box); }
    }
  }
  function ensureImproveCard(){
    if (!qs('#improve-card')){
      const main = qs('#content'); if (main){ const sec=document.createElement('section'); sec.className='mt-6'; sec.innerHTML='<div id="improve-card"></div>'; main.appendChild(sec); }
    }
  }
  function ensureLogsList(){
    const sec = qs('#recent-activity-section');
    if (sec && !qs('#recent-activity-list', sec)){
      const ol = document.createElement('ol'); ol.id='recent-activity-list'; ol.className='mt-4 space-y-2 text-sm'; sec.appendChild(ol);
    }
  }
  function ensureOfflineBar(){
    if (!qs('#offline-indicator')){
      const b = document.createElement('div');
      b.id='offline-indicator'; b.className='hidden fixed top-0 inset-x-0 z-50 bg-red-600 text-white text-center text-xs py-1';
      b.textContent = 'Offline: Live-Updates temporär unterbrochen';
      document.body.appendChild(b);
    }
  }

  function start(){
    ensureOfflineBar(); ensureHeartbeatSlot(); ensureImproveCard(); ensureLogsList(); wireSidebar();
    // initial
    updateHeartbeat(); updateImprove(); updateLogs();
    // intervals
    setInterval(updateHeartbeat, 10000);
    setInterval(updateLogs, 5000);
  }

  document.addEventListener('DOMContentLoaded', start);
})();
