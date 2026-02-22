"use client";
import React, { useEffect, useMemo, useState } from "react";

type LogItem = { ts?: string; type?: string; ok?: boolean; msg?: string; message?: string };

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total>0 ? Math.round((value/total)*100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{label}</span>
        <span>{value} ({pct}%)</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function RunsPage() {
  const [items, setItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/logs?limit=200`, { cache: 'no-store' });
        const j = await r.json();
        if (!live) return;
        setItems(j?.items || []);
        setLoading(false);
      } catch { if (live) setLoading(false); }
    };
    load();
    const iv = setInterval(load, 6000);
    return () => { live = false; clearInterval(iv); };
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const arr = (items||[]).filter(x => ['snapshot','improve','kanban','status'].includes(String(x.type||'').toLowerCase()));
    return qq ? arr.filter(x => JSON.stringify(x).toLowerCase().includes(qq)) : arr;
  }, [items, q]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const success = filtered.filter(x=> x.ok !== false).length;
    const fail = total - success;
    const byType: Record<string, number> = {};
    filtered.forEach(x => { const t = (x.type||'other').toLowerCase(); byType[t] = (byType[t]||0)+1; });
    return { total, success, fail, byType };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Runs</h1>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search runs…" className="w-full sm:w-64 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/40" />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wide text-white/60">Total</div>
            <div className="text-white text-xl font-extrabold">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wide text-white/60">Success</div>
            <div className="text-emerald-300 text-xl font-extrabold">{stats.success}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wide text-white/60">Failed</div>
            <div className="text-red-300 text-xl font-extrabold">{stats.fail}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Bar label="Success" value={stats.success} total={stats.total} color="#10b981" />
          <Bar label="Failed" value={stats.fail} total={stats.total} color="#ef4444" />
        </div>
      </section>

      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <h2 className="text-white text-lg font-bold">Timeline</h2>
        <ol className="mt-3 space-y-2 max-h-[60vh] overflow-auto pr-1">
          {loading && <li className="text-white/60 text-sm">Loading…</li>}
          {!loading && filtered.length===0 && <li className="text-white/60 text-sm">No runs found.</li>}
          {filtered.map((x, i) => (
            <li key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 flex items-center gap-3">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${x.ok===false? 'bg-red-500/20 text-red-300':'bg-emerald-400/20 text-emerald-300'}`}>{x.ok===false?'✗':'✓'}</span>
              <div className="flex-1 min-w-0">
                <div className="truncate">{x.msg || x.message || JSON.stringify(x)}</div>
                <div className="text-[11px] text-white/50">{x.type || 'run'} • {x.ts ? new Date(x.ts).toLocaleString() : ''}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
