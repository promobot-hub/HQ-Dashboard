"use client";
import React, { useEffect, useState } from "react";

interface StatusData {
  runsToday?: number;
  totalRuns?: number;
  lastRunAt?: string | null;
  ok?: boolean;
}

export default function QuickStats() {
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch("/api/status", { cache: "no-store" });
        const j = await r.json();
        if (live) setData(j);
      } catch {
        /* ignore */
      }
    };
    load();
    const iv = setInterval(load, 4000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const last = data?.lastRunAt
    ? new Date(data.lastRunAt).toLocaleString()
    : "—";

  const Stat = ({
    label,
    value,
    accent,
  }: {
    label: string;
    value: React.ReactNode;
    accent?: string;
  }) => (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div className={`text-xl font-extrabold ${accent ?? "text-white"}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
      <Stat label="Runs Today" value={data?.runsToday ?? "—"} />
      <Stat label="Total Runs" value={data?.totalRuns ?? "—"} />
      <Stat label="Last Run" value={last} />
      <Stat
        label="Liveness"
        value={data?.ok || data?.lastRunAt ? "OK" : "DOWN"}
        accent={
          data?.ok || data?.lastRunAt ? "text-emerald-400" : "text-red-400"
        }
      />
    </div>
  );
}
