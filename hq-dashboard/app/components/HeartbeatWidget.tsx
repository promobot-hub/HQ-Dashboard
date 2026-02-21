"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function HeartbeatWidget() {
  const [data, setData] = useState<{
    runsToday?: number;
    totalRuns?: number;
    lastRunAt?: string | null;
    ok?: boolean;
  } | null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      // Prefer direct heartbeat proxy; fallback to status json
      try {
        const r = await fetch(`/api/heartbeat`, { cache: "no-store" });
        if (!r.ok) throw new Error("hb");
        const j = await r.json();
        if (live) setData(j);
      } catch {
        try {
          const r = await fetch(`/api/status`, { cache: "no-store" });
          if (!r.ok) throw new Error("fallback");
          const j = await r.json();
          if (live) setData(j);
        } catch {
          if (live) setData(null);
        }
      }
    };
    load();
    const iv = setInterval(load, 4000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const ageMs = useMemo(
    () =>
      data?.lastRunAt
        ? Math.max(0, Date.now() - Date.parse(data.lastRunAt))
        : null,
    [data?.lastRunAt]
  );

  const healthy = !!(data?.lastRunAt || data?.ok);
  const deadMan = ageMs != null && ageMs > 5 * 60 * 1000; // 5 minutes
  const stateOk = healthy && !deadMan;
  const last = data?.lastRunAt
    ? new Date(data.lastRunAt).toLocaleString()
    : "n/a";
  const title = deadMan
    ? `last ${Math.round((ageMs as number) / 1000)}s ago`
    : `last ${last}`;

  return (
    <div
      className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md"
      title={title}
    >
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          stateOk ? "bg-emerald-400" : "bg-red-500"
        } animate-pulse shadow-[0_0_0_2px_rgba(34,211,238,0.2),0_0_40px_rgba(168,85,247,0.25)]`}
      />
      <div className="text-xs text-white/70">
        Heartbeat:{" "}
        <span className="text-white/90">{stateOk ? "OK" : "STALE"}</span> •
        Last: {last} • Today: {data?.runsToday ?? "—"} • Total:{" "}
        {data?.totalRuns ?? "—"}
      </div>
    </div>
  );
}
