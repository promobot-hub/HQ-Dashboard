"use client";
import React, { useEffect, useState } from "react";

export default function SchedulerPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [every, setEvery] = useState(5);
  const [action, setAction] = useState("trigger");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/scheduler/jobs`, { cache: "no-store" });
      const j = await r.json();
      setJobs(j?.jobs || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            Scheduler
          </h1>
          <button
            onClick={runNow}
            className="rounded-xl bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110"
          >
            Run due now
          </button>
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
                <div className="mt-1 text-white/50 text-xs">
                  Last:{" "}
                  {j.lastRunAt ? new Date(j.lastRunAt).toLocaleString() : "—"} •
                  Next:{" "}
                  {j.nextRunAt ? new Date(j.nextRunAt).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
