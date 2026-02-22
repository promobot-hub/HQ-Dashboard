"use client";
import React, { useEffect, useState } from "react";

type Health = {
  ok: boolean;
  proxyLatencyMs?: number;
  lastRunAt?: string | null;
  heartbeatAgeMs?: number | null;
  lastSnapshot?: string | null;
  checks?: {
    heartbeatDirect?: { ok?: boolean; ms?: number };
    statusFallback?: { ok?: boolean; ms?: number };
    logsProxy?: { ok?: boolean; ms?: number };
  };
};

export default function HealthPage() {
  const [data, setData] = useState<Health | null>(null);
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch("/api/health", { cache: "no-store" });
        const j = await r.json();
        if (live) setData(j);
      } catch {}
    };
    load();
    const iv = setInterval(load, 8000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const badge = (ok: boolean) => (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] ${
        ok ? "bg-emerald-400/20 text-emerald-300" : "bg-red-500/20 text-red-300"
      }`}
    >
      {ok ? "OK" : "DOWN"}
    </span>
  );

  const Tile = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div className="mt-1 text-white text-lg font-extrabold">{value}</div>
    </div>
  );

  const githubMode =
    !!data?.checks?.statusFallback?.ok && !data?.checks?.heartbeatDirect?.ok;
  const freshness = (ms?: number | null) => {
    if (ms == null) return { label: "—", cls: "bg-white/10 text-white/60" };
    if (ms < 2 * 60 * 1000)
      return {
        label: `${Math.round(ms / 1000)}s`,
        cls: "bg-emerald-400/20 text-emerald-300",
      };
    if (ms < 10 * 60 * 1000)
      return {
        label: `${Math.round(ms / 60000)}m`,
        cls: "bg-amber-400/20 text-amber-300",
      };
    return {
      label: `${Math.round(ms / 60000)}m`,
      cls: "bg-red-500/20 text-red-300",
    };
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            System Health
          </h1>
          <div className="flex items-center gap-2">
            {githubMode && (
              <span className="rounded-md bg-cyan-400/20 text-cyan-200 px-2 py-0.5 text-[10px]">
                GitHub Mode
              </span>
            )}
            <div className="flex items-center gap-2">
              {(() => {
                const B = require("../components/DataSourceBadge").default;
                return <B />;
              })()}
              {badge(!!data?.ok)}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Tile
            label="Proxy Latency"
            value={(data?.proxyLatencyMs ?? 0) + " ms"}
          />
          <Tile
            label="Last Run"
            value={
              data?.lastRunAt ? new Date(data.lastRunAt).toLocaleString() : "—"
            }
          />
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-4 backdrop-blur-md">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Heartbeat Freshness
            </div>
            <div
              className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[12px] ${
                freshness(data?.heartbeatAgeMs).cls
              }`}
            >
              {freshness(data?.heartbeatAgeMs).label}
            </div>
          </div>
          <Tile label="Last Snapshot" value={data?.lastSnapshot ?? "—"} />
        </div>
        <div className="mt-6">
          {(() => { const HW = require('../components/HealthWidget').default; return <HW/>; })()}
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Heartbeat (Direct)
            </div>
            <div className="mt-2 flex items-center gap-2">
              {badge(!!data?.checks?.heartbeatDirect?.ok)}
              <span className="text-white/60 text-xs">
                {data?.checks?.heartbeatDirect?.ms ?? 0} ms
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Status (GitHub Fallback)
            </div>
            <div className="mt-2 flex items-center gap-2">
              {badge(!!data?.checks?.statusFallback?.ok)}
              <span className="text-white/60 text-xs">
                {data?.checks?.statusFallback?.ms ?? 0} ms
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Logs Proxy
            </div>
            <div className="mt-2 flex items-center gap-2">
              {badge(!!data?.checks?.logsProxy?.ok)}
              <span className="text-white/60 text-xs">
                {data?.checks?.logsProxy?.ms ?? 0} ms
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
