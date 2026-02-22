"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Ev = {
  ts: string;
  kind?: string;
  url?: string;
  status?: number;
  ok?: boolean;
  durationMs?: number;
  error?: string;
};

export default function DebugBar() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [paused, setPaused] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onEv = (e: any) => {
      if (paused) return;
      const d = e?.detail as Ev;
      if (!d) return;
      setEvents((prev) => {
        const next = [...prev, d].slice(-80);
        return next;
      });
    };
    window.addEventListener("hq:debug", onEv as any);
    return () => window.removeEventListener("hq:debug", onEv as any);
  }, [paused]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [events]);

  const okCount = useMemo(() => events.filter((e) => e.ok).length, [events]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(events, null, 2));
    } catch {}
  };

  const persist = async () => {
    try {
      await fetch("/api/debug/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(events),
      });
    } catch {}
  };

  return (
    <div className="fixed left-4 bottom-20 z-40 w-[360px] max-w-[92vw] rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="text-[12px] text-white/70">
          Debug ({okCount}/{events.length})
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPaused((p) => !p)}
            className="text-[10px] rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-white/70 hover:bg-white/20"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => setEvents([])}
            className="text-[10px] rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-white/70 hover:bg-white/20"
          >
            Clear
          </button>
          <button
            onClick={copy}
            className="text-[10px] rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-white/70 hover:bg-white/20"
          >
            Copy
          </button>
          <button
            onClick={persist}
            className="text-[10px] rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-cyan-200 hover:bg-cyan-400/20"
          >
            Persist
          </button>
        </div>
      </div>
      <div
        ref={listRef}
        className="max-h-[240px] overflow-auto px-3 pb-2 space-y-1"
      >
        {events.map((e, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/80"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">{e.url || e.kind || "event"}</div>
              <div
                className={`rounded px-1 ${
                  e.ok
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {e.status ?? (e.ok ? "OK" : "ERR")}
              </div>
            </div>
            <div className="text-white/50 flex items-center gap-3">
              <span>{e.ts ? new Date(e.ts).toLocaleTimeString() : ""}</span>
              {typeof e.durationMs === "number" && (
                <span>{e.durationMs}ms</span>
              )}
              {e.error && (
                <span className="text-red-300 truncate">{e.error}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
