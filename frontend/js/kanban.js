// Clawbot HQ – Kanban Live Logic (Vanilla JS)
// Polls /api/tasks every 5s; smooth moves across 3 columns; modal logs via /api/task/{id}/logs; fallback + spinner + confetti
(function(){
  const POLL_MS = 5000;
  const API_TASKS = '/api/tasks';
  const API_TASK_LOG = (id)=> `/api/task/${encodeURIComponent(id)}/logs`;

  const state = { tasks: [], mounted: false };

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function ensureContainer(){
    let cont = qs('#kanban-container');
    if (!cont){
      const host = qs('#content') || document.body;
      const sec = document.createElement('section');
      sec.className = 'mt-6';
      sec.innerHTML = '<div id="kanban-container" class="grid grid-cols-12 gap-4" aria-live="polite"></div>';
      host.appendChild(sec);
      cont = qs('#kanban-container');
    }
    return cont;
  }

  function spinner(){
    const d = document.createElement('div');
    d.className = 'flex items-center justify-center py-6';
    d.innerHTML = '<div class="claw-spinner" style="width:42px;height:42px;border-radius:9999px;border:3px solid rgba(255,255,255,0.08);border-top-color:#22d3ee;border-right-color:#a855f7;animation: claw-spin 1s linear infinite;box-shadow: inset 0 0 12px rgba(168,85,247,0.2)"></div>';
    const style = document.createElement('style');
    style.textContent='@keyframes claw-spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
    return d;
  }

  function badge(kind){
    if (kind==='pending') return '<span class="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">Pending</span>';
    if (kind==='progress') return '<span class="rounded-md bg-accent-cyan/20 px-1.5 py-0.5 text-[10px] text-accent-cyan">In Progress</span>';
    return '<span class="rounded-md bg-emerald-400/20 px-1.5 py-0.5 text-[10px] text-emerald-400">Done</span>';
  }

  function colHeader(kind){
    const color = kind==='pending'?'text-white/60':(kind==='progress'?'text-accent-cyan':'text-emerald-400');
    const title = kind==='pending'?'Pending Tasks':(kind==='progress'?'In Progress':'Done');
    return `<div class="mb-2 flex items-center justify-between">
      <div class="text-xs uppercase tracking-wide ${color}">${title}</div>
      <div class="text-[11px] text-white/50" data-count="${kind}"></div>
    </div>`;
  }

  function ensureColumns(){
    const cont = ensureContainer();
    if (!state.mounted){
      cont.innerHTML = ['pending','progress','done'].map((kind)=>{
        const border = kind==='pending'?'border-white/10':(kind==='progress'?'border-accent-cyan/30':'border-emerald-400/30');
        const bg = kind==='pending'?'bg-white/5':(kind==='progress'?'bg-accent-cyan/10':'bg-emerald-400/10');
        return `<section class="col-span-12 md:col-span-4"><div class="rounded-2xl border ${border} ${bg} backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4" data-col="${kind}">${colHeader(kind)}<div class="space-y-2" data-list="${kind}"></div></div></section>`;
      }).join('');
      state.mounted = true;
    }
    return cont;
  }

  function cardEl(t){
    const pct = Math.max(0, Math.min(100, Number(t.progress||0)));
    const pulse = t.status==='progress' ? ' ring-1 ring-accent-cyan/30' : '';
    const doneGlow = t.status==='done' ? ' ring-1 ring-emerald-400/30' : '';
    const el = document.createElement('div');
    el.className = `rounded-xl border ${t.status==='pending'?'border-white/10':'border-white/10'} bg-white/5 p-3 text-sm text-white/90 hover:bg-white/10 transition-all duration-200 translate-y-0 opacity-100${pulse}${doneGlow}`;
    el.style.willChange = 'transform, opacity';
    el.dataset.taskId = t.id;
    el.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="font-semibold truncate">${t.id} — ${t.title}</div>
        ${badge(t.status)}
      </div>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10"><div class="h-full bg-gradient-to-r from-accent-cyan to-accent-violet" style="width:${pct}%"></div></div>
      <div class="mt-2 flex items-center justify-between text-[11px] text-white/60">
        <span>${new Date(t.updated_at||t.created_at||Date.now()).toLocaleString()}</span>
        <button class="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] hover:bg-white/10" data-view-log>View Log</button>
      </div>`;
    el.querySelector('[data-view-log]')?.addEventListener('click', ()=> openLogModal(t.id));
    return el;
  }

  function updateCounts(){
    const tasks = state.tasks;
    const counts = { pending:0, progress:0, done:0 };
    tasks.forEach(t=> counts[t.status] = (counts[t.status]||0)+1);
    qsa('[data-count]')?.forEach(n=>{ const k=n.getAttribute('data-count'); if(k && counts[k]!=null) n.textContent = `${counts[k]} items`; });
  }

  function mountTasks(tasks){
    ensureColumns();
    const lists = {
      pending: qs('[data-list="pending"]'),
      progress: qs('[data-list="progress"]'),
      done: qs('[data-list="done"]')
    };
    // Build index of current elements
    const existing = new Map();
    qsa('[data-list] > div').forEach(el=> existing.set(el.dataset.taskId, el));

    // Add/update
    const seen = new Set();
    tasks.forEach(t=>{
      seen.add(t.id);
      const want = lists[t.status];
      const cur = existing.get(t.id);
      if (!cur){
        const el = cardEl(t);
        el.style.opacity = '0'; el.style.transform = 'translateY(6px)';
        want.appendChild(el);
        requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; });
      } else {
        // Update progress/status
        const bar = cur.querySelector('div > div > div');
        if (bar) bar.style.width = `${Math.max(0, Math.min(100, Number(t.progress||0)))}%`;
        if (cur.parentElement !== want){
          // Smooth move: fade out then insert then fade in
          cur.style.opacity='0.0'; cur.style.transform='translateY(6px)';
          setTimeout(()=>{ want.appendChild(cur); requestAnimationFrame(()=>{ cur.style.opacity='1'; cur.style.transform='translateY(0)'; }); if (t.status==='done') confetti(cur); }, 120);
        }
      }
    });

    // Remove stale
    existing.forEach((el, id)=>{ if (!seen.has(id)){ el.style.opacity='0'; el.style.transform='translateY(6px)'; setTimeout(()=> el.remove(), 150); } });

    state.tasks = tasks;
    updateCounts();
  }

  function confetti(target){
    const host = document.createElement('div');
    const rect = target.getBoundingClientRect();
    host.style.position='fixed'; host.style.left=rect.left+'px'; host.style.top=(rect.top-8)+'px'; host.style.width=rect.width+'px'; host.style.height='0px'; host.style.pointerEvents='none'; host.style.zIndex='70';
    for (let i=0;i<20;i++){
      const p = document.createElement('span');
      const size = 4 + Math.random()*4;
      p.style.position='absolute'; p.style.left=(rect.width/2)+'px'; p.style.top='0px'; p.style.width=size+'px'; p.style.height=size+'px'; p.style.borderRadius='1px';
      p.style.background= i%2? '#22d3ee' : '#a855f7';
      const dx = (Math.random()-0.5)*120; const dy = 40 + Math.random()*60; const rot = (Math.random()-0.5)*180;
      p.animate([
        { transform:`translate(0,0) rotate(0deg)`, opacity:1 },
        { transform:`translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity:0 }
      ], { duration: 700+Math.random()*400, easing:'cubic-bezier(.2,.8,.2,1)', fill:'forwards' });
      host.appendChild(p);
    }
    document.body.appendChild(host);
    setTimeout(()=> host.remove(), 1200);
  }

  async function fetchTasks(){
    try {
      const r = await fetch(API_TASKS, { cache: 'no-store' });
      if (!r.ok) throw new Error('bad status');
      const data = await r.json();
      const tasks = (data.tasks||[]).map((t)=>({
        id: String(t.id||t.title||Math.random().toString(36).slice(2,8)),
        title: t.title || t.text || 'Task',
        status: (t.status==='todo'?'pending':(t.status==='in_progress'?'progress':(t.status||'done'))),
        progress: Number(t.progress|| (t.status==='done'?100: (t.status==='in_progress'?50:10))),
        created_at: t.created_at || new Date().toISOString(),
        updated_at: t.updated_at || new Date().toISOString(),
        log_link: t.log_link || '#'
      }));
      return tasks;
    } catch (e) {
      // Fallback demo data
      const now = new Date().toISOString();
      return [
        { id:'F-201', title:'Fallback pending', status:'pending', progress:10, created_at:now, updated_at:now, log_link:'#' },
        { id:'F-202', title:'Fallback in progress', status:'progress', progress:55, created_at:now, updated_at:now, log_link:'#' },
        { id:'F-203', title:'Fallback done', status:'done', progress:100, created_at:now, updated_at:now, log_link:'#' },
      ];
    }
  }

  async function openLogModal(taskId){
    const { createModal } = window.ClawModals || {};
    const m = createModal ? createModal({ title:`Task ${taskId} – Log`, content: '<div class="text-white/70 text-sm">Loading log...</div>', actions:[{label:'Close'}] }) : null;
    try{
      const r = await fetch(API_TASK_LOG(taskId), { cache:'no-store' });
      if (!r.ok) throw new Error('not ok');
      const text = await r.text();
      if (m) m.body.innerHTML = `<pre class="text-xs whitespace-pre-wrap text-white/80">${text.replace(/[&<>]/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[s]))}</pre>`;
      else alert(text);
    }catch(e){
      const fallback = `No server log endpoint; showing placeholder for ${taskId}.\n\n- Heartbeat: ok\n- AutoImprove: last run success\n- Actions: commit, push, deploy`;
      if (m) m.body.innerHTML = `<pre class="text-xs whitespace-pre-wrap text-white/70">${fallback}</pre>`;
      else alert(fallback);
    }
  }

  async function tick(first=false){
    const cont = ensureColumns();
    if (first){ cont.innerHTML = cont.innerHTML + spinner().outerHTML; }
    const tasks = await fetchTasks();
    mountTasks(tasks);
  }

  // Boot
  document.addEventListener('DOMContentLoaded', ()=>{
    tick(true);
    setInterval(()=>{ tick(false); }, POLL_MS);
    const btn = document.getElementById('refreshBtn');
    btn?.addEventListener('click', ()=> tick(false));
  });
})();
