"use client";
import React, { useEffect, useMemo, useState } from "react";

type LogItem = { ts?: string; ok?: boolean; type?: string };

export default function RunsSparkline() {
  const [items, setItems] = useState<LogItem[]>([]);
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/logs?limit=200`, { cache: "no-store" });
        const j = await r.json();
        if (live) setItems(j?.items || []);
      } catch {}
    };
    load();
    const iv = setInterval(load, 10000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const points = useMemo(() => {
    const now = Date.now();
    const win = 24 * 60 * 60 * 1000; // 24h
    const arr = (items || []).filter(
      (x) => x.ts && now - Date.parse(String(x.ts)) < win
    );
    // group per hour
    const buckets: number[] = Array.from({ length: 24 }, () => 0);
    arr.forEach((x) => {
      const ageH = Math.floor(
        (now - Date.parse(String(x.ts))) / (60 * 60 * 1000)
      );
      const idx = Math.max(0, Math.min(23, 23 - ageH));
      buckets[idx] += x.ok === false ? -1 : 1;
    });
    return buckets;
  }, [items]);

  const w = 120,
    h = 36;
  const max = Math.max(1, ...points.map((v) => Math.abs(v)));
  const step = w / (points.length - 1 || 1);
  const path = points
    .map((v, i) => {
      const x = i * step;
      const y = h / 2 - (v / max) * (h / 2 - 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto">
      <defs>
        <linearGradient id="sp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        rx="6"
        fill="rgba(255,255,255,0.06)"
      />
      <path
        d={path}
        fill="none"
        stroke="url(#sp-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
