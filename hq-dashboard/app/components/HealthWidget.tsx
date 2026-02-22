"use client";
import React, { useEffect, useMemo, useState } from "react";

type Health = {
  ok: boolean;
  proxyLatencyMs?: number;
  lastRunAt?: string | null;
  heartbeatAgeMs?: number | null;
  checks?: {
    heartbeatDirect?: { ok?: boolean; ms?: number };
    statusFallback?: { ok?: boolean; ms?: number };
    logsProxy?: { ok?: boolean; ms?: number };
  };
};

export default function HealthWidget() {
  const [items, setItems] = useState<number[]>([]);
  const [h, setH] = useState<Health | null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/health`, { cache: "no-store" });
        const j = await r.json();
        if (!live) return;
        setH(j || null);
        const v = Number(j?.proxyLatencyMs || 0);
        setItems((prev) => {
          const next = prev.concat([v]).slice(-60);
          return next;
        });
      } catch {}
    };
    load();
    const iv = setInterval(load, 5000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const alertBadge = useMemo(() => {
    if (!h) return { text: "—", cls: "bg-white/10 text-white/60" };
    const ok = !!h.ok;
    const age = Number(h.heartbeatAgeMs || 0);
    if (!ok) return { text: "DEGRADED", cls: "bg-red-500/20 text-red-200" };
    if (age > 10 * 60 * 1000)
      return { text: "STALE", cls: "bg-amber-400/20 text-amber-200" };
    return { text: "OK", cls: "bg-emerald-400/20 text-emerald-200" };
  }, [h]);

  const Spark = () => {
    const w = 240,
      hh = 40;
    const max = Math.max(1, ...items);
    const step = items.length > 1 ? w / (items.length - 1) : w;
    const path = items
      .map((v, i) => {
        const x = i * step;
        const y = hh - 2 - (v / max) * (hh - 4);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
    return (
      <svg width={w} height={hh} viewBox={`0 0 ${w} ${hh}`}>
        <defs>
          <linearGradient id="hl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width={w}
          height={hh}
          rx="8"
          fill="rgba(255,255,255,0.06)"
        />
        <path
          d={path}
          fill="none"
          stroke="url(#hl-grad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-white font-semibold">Latency Trend</div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] ${alertBadge.cls}`}
        >
          {alertBadge.text}
        </span>
      </div>
      <div className="mt-2">
        <Spark />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-white/70">
        <div className="rounded-md border border-white/10 bg-white/5 p-2">
          Current:{" "}
          <span className="text-white/90">{h?.proxyLatencyMs ?? 0}ms</span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-2">
          Heartbeat:{" "}
          <span className="text-white/90">
            {h?.heartbeatAgeMs != null
              ? Math.round((h!.heartbeatAgeMs as number) / 1000) + "s"
              : "—"}
          </span>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-2">
          Logs Proxy:{" "}
          <span
            className={`text-white/90 ${
              h?.checks?.logsProxy?.ok ? "" : "text-red-300"
            }`}
          >
            {h?.checks?.logsProxy?.ok ? "OK" : "DOWN"}
          </span>
        </div>
      </div>
    </div>
  );
}
