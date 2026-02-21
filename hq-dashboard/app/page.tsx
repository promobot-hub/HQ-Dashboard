import React from "react";
import ChartsClient from "../components/ChartsClient";
import Script from "next/script";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#a855f7] blur animate-glow" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f0f10] text-white shadow-[0_0_0_2px_rgba(34,211,238,0.2),0_0_40px_rgba(168,85,247,0.25)]">
                <span className="text-lg font-extrabold">CB</span>
              </div>
            </div>
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">
                Clawbot – Live Status
              </h1>
              <p className="text-white/70 mt-1">
                Autonomous Growth Agent • HQ Dashboard
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-[#22d3ee] animate-pulse shadow-[0_0_0_2px_rgba(34,211,238,0.2),0_0_40px_rgba(168,85,247,0.25)]"></span>
                <span className="text-white/70">Heartbeat healthy</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3 text-center">
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Runs Today
              </div>
              <div className="text-white text-xl font-extrabold">0</div>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3 text-center">
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Total Runs
              </div>
              <div className="text-white text-xl font-extrabold">0</div>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3 text-center">
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Last Run
              </div>
              <div className="text-white text-xl font-extrabold">—</div>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-3 text-center">
              <div className="text-[10px] uppercase tracking-wide text-white/60">
                Liveness
              </div>
              <div className="text-emerald-400 text-xl font-extrabold">OK</div>
            </div>
          </div>
        </div>
      </section>
      <ChartsClient />

      {/* Kanban Controls */}
      <section className="mt-6" aria-labelledby="kanbanTitle">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 id="kanbanTitle" className="text-white text-lg font-bold">Kanban</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-1" role="group" aria-label="Filter tasks">
              <button className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10" data-filter="all" aria-pressed="true">All</button>
              <button className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10" data-filter="pending">Pending</button>
              <button className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10" data-filter="progress">Progress</button>
              <button className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10" data-filter="done">Done</button>
            </div>
            <div className="relative">
              <input id="kanbanSearch" type="search" placeholder="Search tasks... (F to focus)" className="w-full sm:w-64 rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 pl-3 pr-3 py-1.5 text-xs text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" aria-label="Search tasks" />
            </div>
            <div className="flex items-center gap-1" aria-label="Sound">
              <button id="soundToggle" className="rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10" aria-pressed="false">Sound: Off</button>
            </div>
          </div>
        </div>
        <div id="kanban-container" className="grid grid-cols-12 gap-4" aria-live="polite"></div>
      </section>

      {/* Recent Activity (ensure section ids for live.js) */}
      <section id="recent-activity-section" className="mt-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6">
        <div className="flex items-center justify-between"><h2 className="text-white text-lg font-bold">Recent Activity</h2></div>
        <ol id="recent-activity-list" className="mt-4 space-y-2 text-sm"></ol>
      </section>

      {/* Client scripts from public/js */}
      <Script src="/js/kanban.js" strategy="afterInteractive" />
      <Script src="/js/live.js" strategy="afterInteractive" />
      <Script src="/js/particles.js" strategy="afterInteractive" />
    </div>
  );
}
