import { NextRequest, NextResponse } from "next/server";

const endpoints = [
  { key: "heartbeat", url: "/api/heartbeat" },
  { key: "tasks", url: "/api/tasks" },
  { key: "metrics", url: "/api/metrics" },
  { key: "skills", url: "/api/skills" },
  { key: "sessions", url: "/api/sessions" },
  { key: "logs", url: "/api/logs?limit=5" },
  { key: "schedulerJobs", url: "/api/scheduler/jobs" },
  { key: "schedulerHistory", url: "/api/scheduler/history" },
  { key: "schedulerExecute", url: "/api/scheduler/execute", method: "POST" },
  { key: "cronTrigger", url: "/api/cron/trigger" },
  { key: "debugRead", url: "/api/debug?limit=5" },
  { key: "debugWrite", url: "/api/debug/collect", method: "POST", body: { ts: new Date().toISOString(), kind: "check", url: "/api/checks", ok: true, status: 200, durationMs: 0, message: "self-check" } },
];

export async function GET(req: NextRequest) {
  const base = new URL(req.url).origin;
  const results: any[] = [];
  for (const ep of endpoints) {
    const t0 = Date.now();
    let ok = false, status = 0, error: string | undefined;
    try {
      const r = await fetch(base + ep.url, {
        method: (ep as any).method || "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: (ep as any).body ? JSON.stringify((ep as any).body) : undefined,
      } as any);
      status = r.status; ok = r.ok;
      // try to consume body to avoid hanging connections
      try { await r.clone().text(); } catch {}
    } catch (e: any) {
      error = String(e?.message || e);
    }
    results.push({ key: ep.key, url: ep.url, ok, status, durationMs: Date.now() - t0, error });
  }
  const allOk = results.every(r => r.ok);
  return NextResponse.json({ ok: allOk, results, checkedAt: new Date().toISOString() });
}
