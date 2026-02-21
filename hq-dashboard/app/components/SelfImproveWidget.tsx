"use client";
import React, { useEffect, useState } from "react";
import { CLAWBOT_API_BASE } from "./config";

export default function SelfImproveWidget(){
  const [last, setLast] = useState<string|undefined>();
  const [score, setScore] = useState<number|undefined>();
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    let live=true;
    const load=async()=>{
      try{ const r=await fetch(`${CLAWBOT_API_BASE}/api/autoimprove`, { cache:'no-store' }); if(!r.ok) throw new Error('ai'); const j=await r.json(); if(live){ setLast(j?.lastRunAt); setScore(j?.score); } }catch{}
    };
    load(); const iv=setInterval(load, 10000); return ()=>{ live=false; clearInterval(iv); };
  },[]);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-white/60">Self-Improve</div>
        <button disabled={loading} onClick={async()=>{ setLoading(true); try{ const r=await fetch(`${CLAWBOT_API_BASE}/api/improve`,{ method:'POST' }); }catch{} finally{ setTimeout(()=> setLoading(false), 800);} }}
          className="rounded-xl bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110 disabled:opacity-60">
          {loading? 'Running…' : 'Trigger Now'}
        </button>
      </div>
      <div className="mt-2 text-sm text-white/80">Letzter Cycle: <span className="text-white/90">{ last? new Date(last).toLocaleString() : 'unbekannt' }</span></div>
      <div className="mt-1 text-sm text-white/80">Score: <span className="text-white/90">{score ?? '—'}</span></div>
    </div>
  );
}
