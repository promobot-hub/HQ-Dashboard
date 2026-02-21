// Toast System (Clawbot HQ) – responsive, micro-animations, queue
(function(){
  const STYLE_ID = 'claw-toasts-styles';
  if (!document.getElementById(STYLE_ID)) {
    const css = `
      .claw-toasts { position: fixed; top: 14px; right: 14px; z-index: 70; display: grid; gap: 10px; width: min(92vw, 360px); }
      .claw-toast { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.06); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); color: rgba(255,255,255,0.95); padding: 10px 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.45); opacity: 0; transform: translateY(-6px) scale(.98); transition: opacity .16s ease, transform .16s ease; }
      .claw-toast.enter { opacity: 1; transform: translateY(0) scale(1); }
      .claw-toast.exit { opacity: 0; transform: translateY(-6px) scale(.98); }
      .claw-toast .icon { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; }
      .claw-toast .msg { font-size: .92rem; line-height: 1.3; }
      .claw-toast .act { display: inline-flex; gap: 6px; }
      .claw-toast .btn { border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); padding: 4px 8px; font-size: .78rem; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.95); }
      .claw-toast .btn:hover { background: rgba(255,255,255,0.1); }
      @media (max-width: 640px) { .claw-toasts { left: 14px; right: 14px; width: auto; } }
    `;
    const style = document.createElement('style'); style.id=STYLE_ID; style.textContent=css; document.head.appendChild(style);
  }

  const colors = {
    info: { bg: 'rgba(34,211,238,0.18)', color: '#22d3ee' },
    success: { bg: 'rgba(16,185,129,0.18)', color: '#10b981' },
    warn: { bg: 'rgba(245,158,11,0.18)', color: '#f59e0b' },
    error: { bg: 'rgba(239,68,68,0.18)', color: '#ef4444' },
  };

  function ensureHost(){
    let host = document.querySelector('.claw-toasts');
    if (!host){ host = document.createElement('div'); host.className='claw-toasts'; document.body.appendChild(host); }
    return host;
  }

  function iconPath(type){
    switch(type){
      case 'success': return 'M20 6L9 17l-5-5';
      case 'warn': return 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z';
      case 'error': return 'M6 18L18 6M6 6l12 12';
      default: return 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z';
    }
  }

  function showToast(msg, { type='info', duration=3200, action=null }={}){
    const host = ensureHost();
    const t = document.createElement('div'); t.className='claw-toast';
    const ic = document.createElement('div'); ic.className='icon';
    const cfg = colors[type] || colors.info; ic.style.background = cfg.bg; ic.style.color = cfg.color;
    ic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="${iconPath(type)}"/></svg>`;
    const msgEl = document.createElement('div'); msgEl.className='msg'; msgEl.textContent = msg;
    const act = document.createElement('div'); act.className='act';
    if (action) {
      const btn = document.createElement('button'); btn.className='btn'; btn.textContent = action.label || 'Open';
      btn.addEventListener('click', ()=>{ try { action.onClick && action.onClick(); } finally { dismiss(); } });
      act.appendChild(btn);
    }
    const closeBtn = document.createElement('button'); closeBtn.className='btn'; closeBtn.textContent='Dismiss'; closeBtn.addEventListener('click', ()=> dismiss());
    act.appendChild(closeBtn);
    t.appendChild(ic); t.appendChild(msgEl); t.appendChild(act);
    host.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('enter'));

    let to = setTimeout(()=> dismiss(), duration);

    function dismiss(){
      clearTimeout(to);
      t.classList.add('exit');
      setTimeout(()=>{ t.remove(); }, 150);
    }

    return { dismiss, el: t };
  }

  // Public API
  window.ClawToasts = { show: showToast };
})();
