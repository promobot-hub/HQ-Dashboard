import React from "react";
import ChartsClient from "../components/ChartsClient";
import Kanban from "../components/Kanban";

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
      <section className="mt-6">
        <Kanban />
      </section>
    </div>
  );
}
