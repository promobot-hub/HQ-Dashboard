"use client";
import React, { useEffect, useState } from "react";

type Check = { key: string; ok: boolean; status: number; durationMs: number };

export default function StatusBar() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [ts, setTs] = useState<string>("");

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/checks`, { cache: "no-store" });
        const j = await r.json();
        if (!live) return;
        setChecks(j?.results || []);
        setTs(j?.checkedAt || new Date().toISOString());
      } catch {}
    };
    load();
    const iv = setInterval(load, 15000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const ok = (k: string) => checks.find((c) => c.key === k)?.ok;
  const Dot = ({ k, label }: { k: string; label: string }) => (
    <div className="flex items-center gap-1 text-[11px]">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          ok(k) ? "bg-emerald-400" : "bg-red-500"
        }`}
      />
      <span className="text-white/60">{label}</span>
    </div>
  );

  return (
    <div className="sticky bottom-0 z-30 border-t border-[rgba(255,255,255,0.08)] bg-[#0a0a0a]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60">
      <div className="mx-auto max-w-screen-2xl px-4 py-2 flex items-center gap-4 overflow-x-auto">
        <Dot k="heartbeat" label="Heartbeat" />
        <Dot k="logs" label="Logs" />
        <Dot k="schedulerJobs" label="Jobs" />
        <Dot k="schedulerExecute" label="Exec" />
        <Dot k="debugWrite" label="Debug" />
        <div className="ml-auto text-[10px] text-white/40">
          {ts ? new Date(ts).toLocaleTimeString() : ""}
        </div>
      </div>
    </div>
  );
}
