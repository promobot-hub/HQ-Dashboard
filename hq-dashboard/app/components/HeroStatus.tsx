"use client";
import React, { useEffect, useMemo, useState } from "react";

type Health = {
  ok: boolean;
  proxyLatencyMs?: number;
  lastRunAt?: string | null;
  heartbeatAgeMs?: number | null;
  checks?: {
    heartbeatDirect?: { ok?: boolean; ms?: number };
    statusFallback?: { ok?: boolean; ms?: number };
    logsProxy?: { ok?: boolean; ms?: number };
  };
};

type Status = {
  runsToday?: number;
  totalRuns?: number;
  lastRunAt?: string | null;
  ok?: boolean;
};

function Ring({
  value,
  label,
  size = 144,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]"
      >
        <defs>
          <linearGradient id="hs-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#hs-grad)"
          strokeWidth={10}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="animate-[pulse_4s_ease-in-out_infinite]"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-white">
            {Math.round(pct)}%
          </div>
          <div className="text-[11px] text-white/60">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function HeroStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const [hr, sr] = await Promise.all([
          fetch("/api/health", { cache: "no-store" }),
          fetch("/api/status", { cache: "no-store" }),
        ]);
        const hj = await hr.json();
        const sj = await sr.json();
        if (!live) return;
        setHealth(hj || null);
        setStatus(sj || null);
      } catch {}
    };
    load();
    const iv = setInterval(load, 8000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const healthScore = useMemo(() => {
    if (!health) return 0;
    let score = 0;
    const parts = [
      health.ok,
      health.checks?.statusFallback?.ok,
      health.checks?.logsProxy?.ok,
      health.checks?.heartbeatDirect?.ok,
    ];
    const total = parts.length;
    const okc = parts.filter(Boolean).length;
    score = (okc / total) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [health]);

  const uptimePct = useMemo(() => {
    // naive uptime proxy: if we had a lastRunAt recently, assume high uptime; else degrade
    const last = status?.lastRunAt ? Date.parse(status.lastRunAt) : 0;
    const ageSec = last
      ? Math.max(0, Math.round((Date.now() - last) / 1000))
      : 999999;
    if (!last) return 60;
    if (ageSec < 60) return 99;
    if (ageSec < 5 * 60) return 97;
    if (ageSec < 15 * 60) return 90;
    return 80;
  }, [status?.lastRunAt]);

  return (
    <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8 animate-[fadeIn_500ms_ease-out]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#22d3ee]/20 to-[#a855f7]/20 blur-xl animate-glow" />
            <Ring value={healthScore} label="Health Score" />
          </div>
          <div className="hidden md:block">
            <Ring value={uptimePct} label="Uptime" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              Clawbot HQ
            </h1>
            <p className="text-white/70 mt-1">
              Autonomous Growth Agent • Live Overview
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span
                className={`rounded-md px-2 py-0.5 ${
                  health?.ok
                    ? "bg-emerald-400/20 text-emerald-200"
                    : "bg-red-500/20 text-red-200"
                }`}
              >
                {health?.ok ? "OK" : "DEGRADED"}
              </span>
              <span className="rounded-md bg-white/10 text-white/70 px-2 py-0.5">
                Runs Today: {status?.runsToday ?? "—"}
              </span>
              <span className="rounded-md bg-white/10 text-white/70 px-2 py-0.5">
                Latency: {health?.proxyLatencyMs ?? 0}ms
              </span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { href: "/tasks", label: "Tasks" },
              { href: "/skills", label: "Skills" },
              { href: "/health", label: "Health" },
              { href: "/scheduler", label: "Scheduler" },
              { href: "/debug", label: "Debug" },
              { href: "/chat", label: "Chat" },
              { href: "/agents", label: "Agents" },
              { href: "/analytics", label: "Runs" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 text-center transition-transform duration-150 hover:scale-[1.03]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
