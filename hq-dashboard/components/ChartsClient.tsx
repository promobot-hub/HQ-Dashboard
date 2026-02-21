"use client";
import React, { useEffect, useRef } from "react";
export default function ChartsClient() {
  const cpuRef = useRef<HTMLCanvasElement | null>(null);
  const memRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let cpuChart: any, memChart: any;
    async function ensure() {
      // @ts-ignore
      if (!(window as any).Chart) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/chart.js";
          s.onload = resolve as any; s.onerror = reject as any; document.head.appendChild(s);
        });
      }
      const Chart = (window as any).Chart;
      const create = (ctx: CanvasRenderingContext2D, color: string) => new Chart(ctx, {
        type: "line",
        data: { datasets: [{ data: Array.from({length:20}, (_,i)=>({x:i,y:Math.round(Math.random()*40)+5})), parsing:false, borderColor: color, backgroundColor: color+"33", fill:true, tension:.35, pointRadius:0 }]},
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{mode:"nearest",intersect:false}}, scales:{ x:{display:false}, y:{display:false, min:0, max:100} } }
      });
      if (cpuRef.current) cpuChart = create(cpuRef.current.getContext("2d")!, "#22d3ee");
      if (memRef.current) memChart = create(memRef.current.getContext("2d")!, "#a855f7");
      const push = (c:any, y:number)=>{ const ds=c.data.datasets[0]; const last=ds.data.length? ds.data[ds.data.length-1].x:0; ds.data.push({x:last+1,y}); if(ds.data.length>40) ds.data.shift(); c.update("none"); };
      const i1 = setInterval(()=> cpuChart && push(cpuChart, Math.max(5, Math.min(95, Math.random()*18+8))), 1500);
      const i2 = setInterval(()=> memChart && push(memChart, Math.max(5, Math.min(95, Math.random()*22+12))), 1700);
      return () => { clearInterval(i1); clearInterval(i2); cpuChart?.destroy?.(); memChart?.destroy?.(); };
    }
    const cleanup = ensure();
    return () => { void cleanup; };
  }, []);
  return (
    <div className="grid grid-cols-12 gap-4 mt-6">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3"><div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4"><div className="flex items-center justify-between"><div className="text-white/70 text-xs uppercase tracking-wide">CPU</div><span className="text-[#22d3ee]">%</span></div><div className="mt-2 h-16"><canvas ref={cpuRef} /></div></div></div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3"><div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4"><div className="flex items-center justify-between"><div className="text-white/70 text-xs uppercase tracking-wide">Memory</div><span className="text-[#a855f7]">GB</span></div><div className="mt-2 h-16"><canvas ref={memRef} /></div></div></div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3"><div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4"><div className="flex items-center justify-between"><div className="text-white/70 text-xs uppercase tracking-wide">Tasks</div><span className="text-[#22d3ee]">#</span></div><div className="mt-3 text-2xl font-extrabold text-white">34</div><div className="mt-1 text-[11px] text-white/60">completed today: 6</div></div></div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3"><div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4"><div className="flex items-center justify-between"><div className="text-white/70 text-xs uppercase tracking-wide">Uptime</div><span className="text-[#a855f7]">%</span></div><div className="mt-3 text-2xl font-extrabold text-white">99.98%</div><div className="mt-1 text-[11px] text-white/60">last 30 days</div></div></div>
    </div>
  );
}
