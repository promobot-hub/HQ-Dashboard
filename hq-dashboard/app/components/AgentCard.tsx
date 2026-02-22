"use client";
import React from "react";

type Agent = { id: string; name?: string; status?: string; paused?: boolean; lastActiveAt?: string; activity?: Array<string> };

function Heatmap({ activity }: { activity?: Array<string> }) {
  const now = Date.now();
  const buckets = Array.from({ length: 24 }, (_, i) => 0);
  (activity||[]).forEach(ts => { const ageH = Math.floor((now - Date.parse(ts))/ (60*60*1000)); const idx = 23 - Math.max(0, Math.min(23, ageH)); if (idx>=0 && idx<24) buckets[idx] += 1; });
  return (
    <div className="grid grid-cols-12 gap-1">
      {buckets.map((v,i)=> (
        <div key={i} title={`${23-i}h ago: ${v}`} className={`h-3 rounded ${v>3?'bg-emerald-400/70':v>1?'bg-emerald-400/40':v>0?'bg-emerald-400/20':'bg-white/10'}`} />
      ))}
    </div>
  );
}

export default function AgentCard({ agent, onToggle }: { agent: Agent; onToggle: (id: string, paused: boolean)=>void }) {
  const ok = agent.status?.toLowerCase()==='ok' || (!agent.paused && agent.status!=='degraded');
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${ok? 'bg-emerald-400 animate-pulse':'bg-amber-400'}`} />
          <div className="text-white font-semibold truncate flex items-center gap-2">
            {agent.name || agent.id}
            {agent.paused && <span className="rounded-md bg-amber-400/20 text-amber-200 px-1.5 py-0.5 text-[10px]">PAUSED</span>}
          </div>
        </div>
        <button aria-label={agent.paused? 'Resume agent':'Pause agent'} onClick={()=>onToggle(agent.id, !agent.paused)} className={`rounded-md px-2 py-1 text-xs ${agent.paused? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/20':'bg-red-500/20 text-red-200 border border-red-500/20'}`}>{agent.paused? 'Resume':'Pause'}</button>
      </div>
      <div className="mt-1 text-white/60 text-xs">Last Active: {agent.lastActiveAt? new Date(agent.lastActiveAt).toLocaleString() : '—'}</div>
      <div className="mt-2"><Heatmap activity={agent.activity} /></div>
    </div>
  );
}
