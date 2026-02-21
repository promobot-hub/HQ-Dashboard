// Modals, Glass Backdrop, Neon Spinner, Settings Form (Clawbot HQ)
// Premium Dark micro-animations (scale, fade, blur)

(function(){
  const STYLE_ID = 'claw-modals-styles';
  if (!document.getElementById(STYLE_ID)) {
    const css = `
      .claw-modal-backdrop { position: fixed; inset: 0; background: rgba(10,10,10,0.55); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 60; opacity: 0; transform: scale(0.98); transition: opacity .16s ease, transform .16s ease; }
      .claw-modal-backdrop.enter { opacity: 1; transform: scale(1); }
      .claw-modal-backdrop.exit { opacity: 0; transform: scale(0.98); }
      .claw-modal { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.25rem; box-shadow: 0 24px 80px rgba(0,0,0,0.55); color: rgba(255,255,255,0.9); width: min(92vw, 860px); max-height: 86vh; display: flex; flex-direction: column; overflow: hidden; opacity: 0; transform: translateY(8px) scale(0.98); transition: opacity .18s ease, transform .18s ease, filter .18s ease; }
      .claw-modal.enter { opacity: 1; transform: translateY(0) scale(1); }
      .claw-modal.exit { opacity: 0; transform: translateY(6px) scale(0.98); filter: blur(2px); }
      .claw-modal-header { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: 1rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
      .claw-modal-title { font-weight: 800; color: #fff; letter-spacing: -0.01em; }
      .claw-modal-body { padding: 1rem; overflow: auto; }
      .claw-modal-footer { padding: .75rem 1rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: .5rem; justify-content: flex-end; }
      .claw-btn { border-radius: .75rem; padding: .5rem .9rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.95); transition: transform .08s ease, filter .12s ease, background .12s ease; }
      .claw-btn:hover { background: rgba(255,255,255,0.1); }
      .claw-btn:active { transform: scale(0.99); }
      .claw-btn-primary { background: #22d3ee; color: #0a0a0a; border-color: transparent; box-shadow: 0 0 0 2px rgba(34,211,238,0.25), 0 0 32px rgba(168,85,247,0.2); }
      .claw-btn-primary:hover { filter: brightness(1.07); }
      .claw-close { display: inline-flex; align-items: center; justify-content: center; height: 2rem; width: 2rem; border-radius: .75rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
      .claw-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
      .claw-glow { box-shadow: 0 0 0 2px rgba(34,211,238,0.2), 0 0 40px rgba(168,85,247,0.25); }
      /* Neon spinner */
      .claw-spinner { width: 42px; height: 42px; border-radius: 9999px; border: 3px solid rgba(255,255,255,0.08); border-top-color: #22d3ee; border-right-color: #a855f7; animation: claw-spin 1s linear infinite; box-shadow: inset 0 0 12px rgba(168,85,247,0.2); }
      @keyframes claw-spin { to { transform: rotate(360deg); } }
      /* Forms */
      .claw-field { display: grid; gap: .35rem; }
      .claw-label { font-size: .8rem; color: rgba(255,255,255,0.75); }
      .claw-input, .claw-select, .claw-textarea { width: 100%; border-radius: .75rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.95); padding: .55rem .75rem; outline: none; transition: box-shadow .12s ease, background .12s ease; }
      .claw-input::placeholder { color: rgba(255,255,255,0.4); }
      .claw-input:focus, .claw-select:focus, .claw-textarea:focus { box-shadow: 0 0 0 2px rgba(34,211,238,0.35); background: rgba(255,255,255,0.08); }
      .claw-form-grid { display: grid; grid-template-columns: 1fr; gap: .75rem; }
      @media (min-width: 768px) { .claw-form-grid { grid-template-columns: 1fr 1fr; } }
    `;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function svgIcon(path) {
    const el = document.createElement('span');
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="h-4 w-4"><path d="${path}"/></svg>`;
    return el.firstChild;
  }

  function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'claw-modal-backdrop';
    requestAnimationFrame(()=> backdrop.classList.add('enter'));
    return backdrop;
  }

  function createModal({ title = 'Modal', content, actions = [], size = 'md', dismissible = true } = {}) {
    const backdrop = createBackdrop();
    const modal = document.createElement('div');
    modal.className = 'claw-modal';
    const header = document.createElement('div');
    header.className = 'claw-modal-header';
    const h = document.createElement('div'); h.className = 'claw-modal-title'; h.textContent = title;
    const x = document.createElement('button'); x.className = 'claw-close'; x.innerHTML = '&#10005;';
    header.appendChild(h); header.appendChild(x);

    const body = document.createElement('div'); body.className = 'claw-modal-body';
    if (typeof content === 'string') { body.innerHTML = content; } else if (content instanceof Node) { body.appendChild(content); }

    const footer = document.createElement('div'); footer.className = 'claw-modal-footer';
    actions.forEach(a => {
      const b = document.createElement('button');
      b.className = 'claw-btn ' + (a.primary ? 'claw-btn-primary' : '');
      b.textContent = a.label || 'OK';
      b.addEventListener('click', async ()=>{ if (a.onClick) { const r = await a.onClick(); if (r === false) return; } close(); });
      footer.appendChild(b);
    });

    modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);
    backdrop.appendChild(modal);

    function close(){
      backdrop.classList.add('exit'); modal.classList.add('exit');
      setTimeout(()=>{ backdrop.remove(); }, 160);
      window.removeEventListener('keydown', onKey);
    }
    function onKey(e){ if (e.key === 'Escape' && dismissible) close(); }
    window.addEventListener('keydown', onKey);
    if (dismissible) backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) close(); });
    x.addEventListener('click', close);

    document.body.appendChild(backdrop);
    requestAnimationFrame(()=> modal.classList.add('enter'));

    return { close, el: modal, backdrop, body, header, footer };
  }

  function confirmModal({ title='Confirm', message='Are you sure?', confirmText='Confirm', cancelText='Cancel' }={}){
    return new Promise((resolve)=>{
      const m = createModal({ title, content: `<p>${message}</p>`, actions: [
        { label: cancelText, onClick: ()=> resolve(false) },
        { label: confirmText, primary: true, onClick: ()=> resolve(true) },
      ]});
    });
  }

  function createSpinner(size=42){
    const d = document.createElement('div');
    d.className = 'claw-spinner';
    d.style.width = `${size}px`; d.style.height = `${size}px`;
    return d;
  }

  function buildSettingsForm(fields=[], onSubmit){
    const form = document.createElement('form');
    form.className = 'claw-form-grid';
    fields.forEach(f => {
      const wrap = document.createElement('div'); wrap.className = 'claw-field';
      const label = document.createElement('label'); label.className = 'claw-label'; label.textContent = f.label || f.name;
      let input;
      if (f.type === 'select') {
        input = document.createElement('select'); input.className = 'claw-select';
        (f.options || []).forEach(o=>{ const opt=document.createElement('option'); opt.value=o.value; opt.textContent=o.label||o.value; if (o.value===f.value) opt.selected=true; input.appendChild(opt); });
      } else if (f.type === 'textarea') {
        input = document.createElement('textarea'); input.className = 'claw-textarea'; input.rows = f.rows || 4; input.placeholder = f.placeholder || '';
        input.value = f.value || '';
      } else {
        input = document.createElement('input'); input.type = f.type || 'text'; input.className = 'claw-input'; input.placeholder = f.placeholder || '';
        if (f.value != null) input.value = f.value;
      }
      input.name = f.name;
      if (f.required) input.required = true;
      wrap.appendChild(label); wrap.appendChild(input); form.appendChild(wrap);
    });
    const actions = document.createElement('div'); actions.style.gridColumn = '1 / -1'; actions.style.display='flex'; actions.style.justifyContent='flex-end'; actions.style.gap='.5rem';
    const cancel = document.createElement('button'); cancel.type='button'; cancel.className='claw-btn'; cancel.textContent='Cancel';
    const save = document.createElement('button'); save.type='submit'; save.className='claw-btn claw-btn-primary'; save.textContent='Save';
    actions.appendChild(cancel); actions.appendChild(save); form.appendChild(actions);

    const api = {
      getValues(){ const data={}; fields.forEach(f=>{ const el=form.querySelector(`[name="${f.name}"]`); data[f.name]= el?.value ?? null; }); return data; }
    };
    cancel.addEventListener('click', ()=>{ const host = form.closest('.claw-modal-backdrop'); host?.remove(); });
    form.addEventListener('submit', (e)=>{ e.preventDefault(); const vals=api.getValues(); if (onSubmit) onSubmit(vals); const host=form.closest('.claw-modal-backdrop'); host?.remove(); });
    return form;
  }

  // Public API
  window.ClawModals = { createModal, confirmModal, createSpinner, buildSettingsForm };
})();
