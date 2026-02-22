"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface StatusData {
  runsToday?: number;
  totalRuns?: number;
  lastRunAt?: string | null;
  ok?: boolean;
}

export default function QuickStats() {
  const [data, setData] = useState<StatusData | null>(null);
  const prevRef = useRef<string | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch("/api/status", { cache: "no-store" });
        const j = await r.json();
        if (live) {
          if (
            prevRef.current &&
            j?.lastRunAt &&
            j.lastRunAt !== prevRef.current
          ) {
            setFlash(true);
            setTimeout(() => setFlash(false), 600);
          }
          prevRef.current = j?.lastRunAt ?? null;
          setData(j);
        }
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
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div className={`text-xl font-extrabold ${accent ?? "text-white"}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 w-full md:w-auto">
      <Stat label="Runs Today" value={data?.runsToday ?? "—"} />
      <Stat label="Total Runs" value={data?.totalRuns ?? "—"} />
      <Stat label="Last Run" value={last} />
      <Stat label="Age" value={ageSec != null ? `${ageSec}s` : "—"} />
      <Stat
        label="Liveness"
        value={data?.ok || data?.lastRunAt ? "OK" : "DOWN"}
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
