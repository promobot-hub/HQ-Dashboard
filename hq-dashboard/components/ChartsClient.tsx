"use client";
import React, { useEffect, useRef, useState } from "react";
export default function ChartsClient() {
  const cpuRef = useRef<HTMLCanvasElement | null>(null);
  const memRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<{ disk?: number; active_tasks?: number }>(
    {}
  );
  useEffect(() => {
    let cpuChart: any, memChart: any;
    let i1: any, i2: any, poll: any;
    let cancelled = false;

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        // @ts-ignore
        if ((window as any).Chart) return resolve();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/chart.js";
        s.onload = () => resolve();
        s.onerror = reject as any;
        document.head.appendChild(s);
      });

    const push = (c: any, y: number) => {
      const ds = c.data.datasets[0];
      const last = ds.data.length ? ds.data[ds.data.length - 1].x : 0;
      ds.data.push({ x: last + 1, y });
      if (ds.data.length > 40) ds.data.shift();
      c.update("none");
    };

    loadScript()
      .then(() => {
        if (cancelled) return;
        const Chart = (window as any).Chart;
        const create = (ctx: CanvasRenderingContext2D, color: string) =>
          new Chart(ctx, {
            type: "line",
            data: {
              datasets: [
                {
                  data: [],
                  parsing: false,
                  borderColor: color,
                  backgroundColor: color + "33",
                  fill: true,
                  tension: 0.35,
                  pointRadius: 0,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              plugins: {
                legend: { display: false },
                tooltip: { mode: "nearest", intersect: false },
              },
              scales: {
                x: { display: false },
                y: { display: false, min: 0, max: 100 },
              },
            },
          });
        if (cpuRef.current)
          cpuChart = create(cpuRef.current.getContext("2d")!, "#22d3ee");
        if (memRef.current)
          memChart = create(memRef.current.getContext("2d")!, "#a855f7");

        const pollOnce = async () => {
          try {
            const r = await fetch(
              `/api/metrics?keys=cpu,memory,disk,active_tasks`,
              { cache: "no-store" }
            );
            if (!r.ok) throw new Error("metrics");
            const j = await r.json();
            const cpu = Number(j?.cpu ?? NaN);
            const mem = Number(j?.memory ?? NaN);
            if (!Number.isNaN(cpu) && cpuChart)
              push(cpuChart, Math.max(0, Math.min(100, cpu)));
            if (!Number.isNaN(mem) && memChart)
              push(memChart, Math.max(0, Math.min(100, mem)));
            setMeta({
              disk: Number(j?.disk),
              active_tasks: Number(j?.active_tasks),
            });
            setLoading(false);
          } catch {
            // no random fallback; keep last state and loading if never succeeded
          }
        };
        pollOnce();
        poll = setInterval(pollOnce, 3000);

        // keep charts fresh without animation
        i1 = setInterval(() => cpuChart && cpuChart.update("none"), 3000);
        i2 = setInterval(() => memChart && memChart.update("none"), 3000);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      if (i1) clearInterval(i1);
      if (i2) clearInterval(i2);
      cpuChart?.destroy?.();
      memChart?.destroy?.();
    };
  }, []);
  return (
    <div className="grid grid-cols-12 gap-4 mt-6">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-xs uppercase tracking-wide">
              CPU
            </div>
            <span className="text-[#22d3ee]">%</span>
          </div>
          <div className="mt-2 h-16 relative">
            {loading && (
              <div className="absolute inset-0 grid place-items-center text-white/50 text-xs">
                Loading…
              </div>
            )}
            <canvas ref={cpuRef} />
          </div>
        </div>
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-xs uppercase tracking-wide">
              Memory
            </div>
            <span className="text-[#a855f7]">%</span>
          </div>
          <div className="mt-2 h-16 relative">
            {loading && (
              <div className="absolute inset-0 grid place-items-center text-white/50 text-xs">
                Loading…
              </div>
            )}
            <canvas ref={memRef} />
          </div>
        </div>
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-xs uppercase tracking-wide">
              Active Tasks
            </div>
            <span className="text-[#22d3ee]">#</span>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">
            {Number.isFinite(meta.active_tasks as any)
              ? meta.active_tasks
              : "—"}
          </div>
          <div className="mt-1 text-[11px] text-white/60">live from core</div>
        </div>
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-xs uppercase tracking-wide">
              Disk
            </div>
            <span className="text-[#a855f7]">%</span>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">
            {Number.isFinite(meta.disk as any) ? `${meta.disk}%` : "—"}
          </div>
          <div className="mt-1 text-[11px] text-white/60">usage</div>
        </div>
      </div>
    </div>
  );
}
