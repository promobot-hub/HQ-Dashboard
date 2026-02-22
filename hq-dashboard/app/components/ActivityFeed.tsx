"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type LogItem = {
  ts?: string;
  message?: string;
  msg?: string;
  type?: string;
  ok?: boolean;
};

export default function ActivityFeed() {
  const [items, setItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const listRef = useRef<HTMLOListElement | null>(null);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/logs?limit=50`, { cache: "no-store" });
        if (!r.ok) throw new Error("logs");
        const j = await r.json();
        if (live) setItems(j?.items || j?.logs || []);
      } catch {
        /* keep old */
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    const iv = setInterval(load, 4000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  // Auto-scroll only when at bottom
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom =
      Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 24;
    if (auto && nearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [items, auto]);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    const f = filter.toLowerCase();
    return items.filter((i) => (i.type || "").toLowerCase() === f);
  }, [items, filter]);

  const Skeleton = () => (
    <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 animate-pulse">
      <div className="h-3 w-2/3 bg-white/10 rounded" />
      <div className="mt-2 h-2 w-1/3 bg-white/10 rounded" />
    </li>
  );

  const TypePill = ({ t, ok }: { t?: string; ok?: boolean }) => (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
        ok === false
          ? "bg-red-500/20 text-red-300"
          : "bg-white/10 text-white/60"
      }`}
    >
      {(t || "event").toUpperCase()}
    </span>
  );

  return (
    <section className="mt-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-white text-lg font-bold">Recent Activity</h2>
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1">
            {["all", "snapshot", "improve", "kanban", "status"].map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 hover:bg-white/10 ${
                  filter === k
                    ? "ring-1 ring-accent-cyan/40 text-white"
                    : "text-white/70"
                }`}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
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
      <ol
        ref={listRef}
        className="mt-4 space-y-2 text-sm max-h-[320px] overflow-auto pr-1"
      >
        {loading && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
        {!loading && visible.length === 0 && (
          <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/60 text-sm">
            No recent activity.
          </li>
        )}
        {visible.map((x, i) => (
          <li
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center gap-3 animate-[fadeIn_300ms_ease-out]"
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${
                x.ok === false
                  ? "bg-red-500/20 text-red-300"
                  : "bg-emerald-400/20 text-emerald-300"
              }`}
            >
              {x.ok === false ? "✗" : "✓"}
            </span>
            <div className="flex-1">
              <div className="text-white/90 truncate">
                {x.message || x.msg || JSON.stringify(x)}
              </div>
              <div className="text-white/50 text-xs">
                {x.ts ? new Date(x.ts).toLocaleString() : "just now"}
              </div>
            </div>
            <TypePill t={x.type} ok={x.ok} />
          </li>
        ))}
      </ol>
    </section>
  );
}
