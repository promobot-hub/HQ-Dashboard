"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Item = { ts?: string; ok?: boolean; message?: string; msg?: string; type?: string };

function levelOf(x: Item) {
  const t = (x.type||'').toLowerCase();
  const m = (x.msg||x.message||'').toLowerCase();
  if (x.ok===false || /error|fail|timeout|refused|429/.test(m)) return 'error';
  if (/warn|retry|backoff/.test(m)) return 'warn';
  return 'info';
}

export default function LogViewer() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState<'all'|'info'|'warn'|'error'>('all');
  const listRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try { const r = await fetch(`/api/logs?limit=500`, { cache: 'no-store' }); const j = await r.json(); if (live) setItems(j?.items||[]); } catch {}
    };
    load();
    const iv = setInterval(load, 6000);
    return () => { live = false; clearInterval(iv); };
  }, []);

  const filtered = useMemo(()=>{
    const qq = q.trim().toLowerCase();
    return (items||[]).filter(x => (lvl==='all' || levelOf(x)===lvl) && (!qq || JSON.stringify(x).toLowerCase().includes(qq)));
  }, [items, q, lvl]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(filtered, null, 2)); } catch {}
  };
  const exportFile = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='logs-export.json'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-white font-semibold">Log Viewer</div>
        <div className="flex items-center gap-2 text-xs">
          <select value={lvl} onChange={e=>setLvl(e.target.value as any)} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/80">
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/80" />
          <button onClick={copy} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/80 hover:bg-white/10">Copy</button>
          <button onClick={exportFile} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-white/80 hover:bg-white/10">Export</button>
        </div>
      </div>
      <div ref={listRef} className="mt-3 max-h-[60vh] overflow-auto space-y-2 pr-1">
        {filtered.map((x,i)=> (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 flex items-center gap-3">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${levelOf(x)==='error'?'bg-red-500/20 text-red-300':levelOf(x)==='warn'?'bg-amber-400/20 text-amber-200':'bg-emerald-400/20 text-emerald-200'}`}>{levelOf(x).toUpperCase().slice(0,1)}</span>
            <div className="flex-1 min-w-0">
              <div className="truncate">{x.msg || x.message || JSON.stringify(x)}</div>
              <div className="text-[11px] text-white/50">{x.type || 'log'} • {x.ts ? new Date(x.ts).toLocaleString() : ''}</div>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="text-white/60 text-sm">No logs.</div>}
      </div>
    </div>
  );
}
