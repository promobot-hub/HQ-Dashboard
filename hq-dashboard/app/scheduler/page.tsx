"use client";
import React, { useEffect, useState } from "react";

export default function SchedulerPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [every, setEvery] = useState(5);
  const [action, setAction] = useState("trigger");
  const [tick, setTick] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [jr, hr] = await Promise.all([
        fetch(`/api/scheduler/jobs`, { cache: "no-store" }),
        fetch(`/api/scheduler/history?limit=50`, { cache: "no-store" })
      ]);
      const jj = await jr.json();
      const hj = await hr.json();
      setJobs(jj?.jobs || []);
      const err = (hj?.items||[]).reverse().find((x:any)=> x?.ok===false);
      setLastError(err? (err.message || err.error || JSON.stringify(err)) : null);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    const iv = setInterval(()=> setTick(t=>t+1), 1000);
    return () => clearInterval(iv);
  }, []);

  const create = async () => {
    try {
      await fetch(`/api/scheduler/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          everyMinutes: every,
          enabled: true,
          payload: { action },
        }),
      });
      setName("");
      await load();
    } catch {}
  };

  const runNow = async () => {
    await fetch(`/api/scheduler/execute`, { method: "POST" });
    await load();
  };

  // Presets
  const presetImportIssues = async () => {
    setName("Import GitHub Issues");
    setEvery(15);
    setAction("trigger");
    // Fire an initial import using data repo
    await fetch(`/api/tasks/import/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  };
  const presetTrainSkills = async () => {
    setName("Train Skills Activity");
    setEvery(30);
    setAction("trigger");
    await fetch(`/api/skills/train`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            Scheduler
          </h1>
          <div className="flex items-center gap-2">
            {lastError && <span className="rounded-md bg-red-500/20 text-red-200 px-2 py-0.5 text-[10px] truncate max-w-[220px]" title={lastError}>Last error: {lastError}</span>}
            <button
              onClick={runNow}
              className="rounded-xl bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110"
            >
              Run due now
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={presetImportIssues}
            className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/20"
          >
            Preset: Import Issues */15m
          </button>
          <button
            onClick={presetTrainSkills}
            className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/20"
          >
            Preset: Train Skills */30m
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button onClick={async()=>{ await fetch('/api/scheduler/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Import GitHub Issues', everyMinutes: 15, enabled: true, payload: { action: 'trigger', note: 'import_issues' } }) }); await load(); }} className="rounded-md bg-accent-cyan/20 text-cyan-200 border border-cyan-400/20 px-2 py-1 text-xs hover:bg-accent-cyan/30">Create preset job: Import */15m</button>
          <button onClick={async()=>{ await fetch('/api/scheduler/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Train Skills Activity', everyMinutes: 30, enabled: true, payload: { action: 'trigger', note: 'train_skills' } }) }); await load(); }} className="rounded-md bg-accent-cyan/20 text-cyan-200 border border-cyan-400/20 px-2 py-1 text-xs hover:bg-accent-cyan/30">Create preset job: Train */30m</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Job name"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/40"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={every}
              onChange={(e) => setEvery(parseInt(e.target.value || "5", 10))}
              className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
            />
            <span className="text-white/70 text-sm">minutes</span>
          </div>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
          >
            <option value="trigger">Cron Trigger</option>
            <option value="snapshot">Snapshot</option>
            <option value="improve">Improve (Git)</option>
          </select>
          <div>
            <button
              onClick={create}
              className="rounded-xl bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110"
            >
              Create Job
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <h2 className="text-white text-lg font-bold mb-3">Jobs</h2>
        {loading ? (
          <div className="text-white/60 text-sm">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="text-white/60 text-sm">No jobs yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.map((j: any) => (
              <div
                key={j.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-semibold truncate">
                    {j.name}
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] ${
                      j.enabled
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {j.enabled ? "ENABLED" : "DISABLED"}
                  </span>
                </div>
                <div className="mt-2 text-white/70 text-sm">
                  Every {j.everyMinutes} min • Action:{" "}
                  {j.payload?.action || "trigger"}
                </div>
                <div className="mt-1 text-white/50 text-xs flex items-center gap-2">
                  <span>
                    Last:{" "}
                    {j.lastRunAt ? new Date(j.lastRunAt).toLocaleString() : "—"}
                  </span>
                  <span>•</span>
                  <span>
                    Next:{" "}
                    {j.nextRunAt ? new Date(j.nextRunAt).toLocaleString() : "—"}
                    {j.nextRunAt && (()=>{ const ms = Date.parse(j.nextRunAt) - Date.now(); if (ms>0) { const s=Math.floor(ms/1000); const m=Math.floor(s/60); const ss=s%60; return <span className="ml-1 text-white/50">(in {m}m {ss}s)</span>; } return null; })()}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await fetch("/api/scheduler/jobs", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: j.id, enabled: !j.enabled }),
                      });
                      await load();
                    }}
                    className={`${
                      j.enabled
                        ? "bg-red-500/20 text-red-300 border border-red-400/20"
                        : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/20"
                    } rounded-md px-2 py-1 text-xs`}
                  >
                    {j.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={async () => {
                      await fetch("/api/scheduler/execute", { method: "POST" });
                      await load();
                    }}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    Run now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
