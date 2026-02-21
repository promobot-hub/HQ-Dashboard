"use client";
import React, { useEffect, useState } from "react";
import { CLAWBOT_API_BASE } from "./config";

export default function HeartbeatWidget() {
  const [data, setData] = useState<{
    runsToday?: number;
    totalRuns?: number;
    lastRunAt?: string;
    ok?: boolean;
  } | null>(null);
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`${CLAWBOT_API_BASE}/api/heartbeat`, {
          cache: "no-store",
        });
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
    const iv = setInterval(load, 10000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);
  const ok = !!(data?.lastRunAt || data?.ok);
  const last = data?.lastRunAt
    ? new Date(data.lastRunAt).toLocaleString()
    : "n/a";
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          ok ? "bg-emerald-400" : "bg-red-500"
        } animate-pulse shadow-[0_0_0_2px_rgba(34,211,238,0.2),0_0_40px_rgba(168,85,247,0.25)]`}
      />
      <div className="text-xs text-white/70">
        Heartbeat: <span className="text-white/90">{ok ? "OK" : "DOWN"}</span> •
        Last: {last} • Today: {data?.runsToday ?? "—"} • Total:{" "}
        {data?.totalRuns ?? "—"}
      </div>
    </div>
  );
}
