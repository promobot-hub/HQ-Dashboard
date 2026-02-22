"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface StatusData {
  runsToday?: number;
  totalRuns?: number;
  lastRunAt?: string | null;
  ok?: boolean;
}

type Health = { proxyLatencyMs?: number };

export default function QuickStats() {
  const [data, setData] = useState<StatusData | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const prevRef = useRef<string | null>(null);
  const prevRuns = useRef<number | null>(null);
  const prevLatency = useRef<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let live = true;

    const load = async () => {
      try {
        const [sr, hr] = await Promise.all([
          fetch("/api/status", { cache: "no-store" }),
          fetch("/api/health", { cache: "no-store" })
        ]);
        const sj = await sr.json();
        const hj = await hr.json();
        if (live) {
          if (prevRef.current && sj?.lastRunAt && sj.lastRunAt !== prevRef.current) {
            setFlash(true);
            setTimeout(() => setFlash(false), 600);
          }
          prevRef.current = sj?.lastRunAt ?? null;
          setData(sj);
          setHealth({ proxyLatencyMs: hj?.proxyLatencyMs ?? null });
        }
      } catch {
        /* ignore */
      }
    };

    load();
    const iv = setInterval(load, 4000);
    return () => { live = false; clearInterval(iv); };
  }, []);

  const last = data?.lastRunAt
    ? new Date(data.lastRunAt).toLocaleString()
    : "—";
  const ageSec = useMemo(
    () =>
      data?.lastRunAt
        ? Math.max(
            0,
            Math.round((Date.now() - Date.parse(data.lastRunAt)) / 1000)
          )
        : null,
    [data?.lastRunAt]
  );

  const Trend = ({ up, down }: { up?: boolean; down?: boolean }) => (
    <span className={`ml-1 text-[10px] ${up? 'text-emerald-300': down? 'text-red-300':'text-white/40'}`}>{up? '▲': down? '▼': '•'}</span>
  );

  const Stat = ({
    label,
    value,
    accent,
  }: {
    label: string;
    value: React.ReactNode;
    accent?: string;
  }) => (
    <div
      className={`rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3 text-center transition ${
        flash ? "ring-2 ring-accent-cyan/40" : ""
      } hover:bg-white/10 hover:scale-[1.02] duration-150`}
    >
      <div className="text-[10px] uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div className={`text-xl font-extrabold ${accent ?? "text-white"}`}>
        {value}
      </div>
    </div>
  );

  const runsUp = useMemo(()=> { const up = prevRuns.current!=null && (data?.runsToday ?? 0) > (prevRuns.current as number); prevRuns.current = data?.runsToday ?? null; return up; }, [data?.runsToday]);
  const latTrend = useMemo(()=> { const cur = health?.proxyLatencyMs ?? null; const prev = prevLatency.current; const res = prev!=null && cur!=null ? (cur<prev? 'up': cur>prev? 'down': 'flat') : 'flat'; prevLatency.current = cur; return res; }, [health?.proxyLatencyMs]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 w-full md:w-auto">
      <Stat label="Runs Today" value={<span>{data?.runsToday ?? '—'}<Trend up={runsUp} down={false} /></span>} />
      <Stat label="Total Runs" value={data?.totalRuns ?? "—"} />
      <Stat label="Last Run" value={last} />
      <Stat label="Age" value={ageSec != null ? `${ageSec}s` : "—"} />
      <Stat
        label="Liveness"
        value={<span>{data?.ok || data?.lastRunAt ? 'OK':'DOWN'}<Trend up={latTrend==='up'} down={latTrend==='down'} /></span>}
        accent={
          data?.ok || data?.lastRunAt ? "text-emerald-400" : "text-red-400"
        }
      />
      {(() => {
        const S = require("./RunsSparkline").default;
        return <S />;
      })()}
    </div>
  );
}
