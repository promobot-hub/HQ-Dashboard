"use client";
import React, { useEffect, useState } from "react";

export default function DataSourceBadge() {
  const [fallback, setFallback] = useState<boolean>(false);
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`/api/checks`, { cache: 'no-store' });
        const j = await r.json();
        const hb = (j?.results||[]).find((x:any)=>x.key==='heartbeat');
        const url = hb?.url || '';
        setSrc(url);
        const envRepo = (typeof window!=='undefined' && (window as any).ENV_GH_REPO) || '';
        // Heuristic: if url contains promobot-hub/HQ-Dashboard and env repo is set but different → fallback true
        setFallback(url.includes('promobot-hub/HQ-Dashboard') && !!envRepo && !url.includes(envRepo));
      } catch {}
    };
    load();
  }, []);
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] ${fallback? 'bg-amber-400/20 text-amber-200':'bg-emerald-400/20 text-emerald-200'}`} title={src}>
      {fallback? 'Fallback Repo' : 'ENV Repo'}
    </span>
  );
}
