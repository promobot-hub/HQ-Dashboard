"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function DebugPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/debug?limit=200`, { cache: "no-store" });
        const j = await r.json();
        if (live) setItems(j?.items || []);
      } catch {}
    };
    load();
    const iv = setInterval(load, 8000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    if (!auto) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items, auto]);

  const visible = useMemo(() => {
    const f = filter;
    const qq = q.trim().toLowerCase();
    return (items || []).filter((x: any) => {
      if (f !== "all") {
        const kind = (x.kind || "").toLowerCase();
        const url = (x.url || "").toLowerCase();
        if (f === "api" && kind !== "fetch") return false;
        if (f === "error" && !x.error) return false;
        if (f === "snapshot" && !url.includes("/api/snapshot")) return false;
        if (f === "improve" && !url.includes("/api/improve")) return false;
      }
      if (!qq) return true;
      const raw = JSON.stringify(x).toLowerCase();
      return raw.includes(qq);
    });
  }, [items, filter, q]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            Website Debug
          </h1>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1 text-white/70">
              <input
                type="checkbox"
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
              />{" "}
              Auto-Scroll
            </label>
          </div>
        </div>
        <div className="mt-4">
          {/* Inline System Checks */}
          {(() => {
            const C = require("./Checks").default;
            return <C />;
          })()}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <a
            href={`https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/debug.ndjson?t=${Date.now()}`}
            target="_blank"
            className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-white/70 hover:bg-white/20"
          >
            Download debug.ndjson
          </a>
          <a
            href={`https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/logs.ndjson?t=${Date.now()}`}
            target="_blank"
            className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-white/70 hover:bg-white/20"
          >
            Download logs.ndjson
          </a>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label="Filter debug"
          >
            {["all", "api", "snapshot", "improve", "error"].map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10 ${
                  filter === k ? "ring-1 ring-accent-cyan/40" : ""
                }`}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search debug…"
            className="w-full sm:w-64 rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 pl-3 pr-3 py-1.5 text-xs text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-cyan/40"
          />
        </div>
        <div
          ref={listRef}
          className="mt-4 max-h-[60vh] overflow-auto pr-1 space-y-2"
        >
          {visible.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/60 text-sm">
              No debug events.
            </div>
          )}
          {visible.map((x: any, i: number) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-white/90">
                  {x.url || x.message || x.raw || "event"}
                </div>
                <div
                  className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    x.ok
                      ? "bg-emerald-400/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {x.status ?? (x.ok ? "OK" : "ERR")}
                </div>
              </div>
              <div className="mt-1 text-white/60 text-xs flex items-center gap-3">
                <span>{x.ts ? new Date(x.ts).toLocaleString() : ""}</span>
                {typeof x.durationMs === "number" && (
                  <span>{x.durationMs}ms</span>
                )}
                {x.kind && <span>{x.kind}</span>}
                {x.error && <span className="text-red-300">{x.error}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
