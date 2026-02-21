"use client";
import React, { useEffect, useState } from "react";
import { CLAWBOT_API_BASE } from "./config";

export default function ActivityFeed(){
  const [items, setItems] = useState<Array<{ ts?:string; message?:string }>>([]);
  useEffect(()=>{
    let live=true;
    const load=async()=>{ try{ const r=await fetch(`${CLAWBOT_API_BASE}/api/logs?limit=20`,{cache:'no-store'}); if(!r.ok) throw new Error('logs'); const j=await r.json(); if(live) setItems(j?.items||j?.logs||[]);}catch{ /* keep old */ } };
    load(); const iv=setInterval(load, 4000); return ()=>{ live=false; clearInterval(iv); };
  },[]);
  return (
    <section className="mt-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6">
      <div className="flex items-center justify-between"><h2 className="text-white text-lg font-bold">Recent Activity</h2></div>
      <ol className="mt-4 space-y-2 text-sm max-h-[320px] overflow-auto pr-1">
        {items.length===0 && (
          <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/60 text-sm">No recent activity.</li>
        )}
        {items.map((x,i)=> (
          <li key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent-cyan/20 text-accent-cyan">✓</span>
            <div className="flex-1">
              <div className="text-white/90 truncate">{x.message ?? JSON.stringify(x)}</div>
              <div className="text-white/50 text-xs">{x.ts? new Date(x.ts).toLocaleString() : 'just now'}</div>
            </div>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">New</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
