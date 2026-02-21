"use client";
import React, { useEffect, useState } from "react";

type Health = {
  ok: boolean;
  proxyLatencyMs?: number;
  lastRunAt?: string | null;
  heartbeatAgeMs?: number | null;
  lastSnapshot?: string | null;
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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            System Health
          </h1>
          {badge(!!data?.ok)}
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
          <Tile
            label="Heartbeat Age"
            value={
              data?.heartbeatAgeMs != null
                ? Math.round((data.heartbeatAgeMs as number) / 1000) + " s"
                : "—"
            }
          />
          <Tile label="Last Snapshot" value={data?.lastSnapshot ?? "—"} />
        </div>
      </section>
    </div>
  );
}
