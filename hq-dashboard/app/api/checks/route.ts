import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../ingest/utils";

const DEFAULT_REPO = process.env.GH_REPO || "promobot-hub/HQ-Dashboard";
const RAW_BASE = `https://raw.githubusercontent.com/${DEFAULT_REPO}/main/`;

async function rawOk(path: string) {
  const t0 = Date.now();
  try {
    const r = await fetch(RAW_BASE + path, { cache: "no-store" });
    const ok = r.ok;
    // consume body small
    try { await r.text(); } catch {}
    return { ok, status: r.status, durationMs: Date.now() - t0 };
  } catch (e: any) {
    return { ok: false, status: 0, durationMs: Date.now() - t0, error: String(e?.message || e) };
  }
}

export async function GET(req: NextRequest) {
  const results: any[] = [];
  // RAW data sources
  for (const p of [
    { key: "heartbeat", path: "data/heartbeat.json" },
    { key: "tasks", path: "data/tasks.json" },
    { key: "metrics", path: "data/metrics.json" },
    { key: "skills", path: "data/skills.json" },
    { key: "sessions", path: "data/sessions.json" },
    { key: "logs", path: "data/logs.ndjson" },
    { key: "debugRead", path: "data/debug.ndjson" },
  ]) {
    const r = await rawOk(p.path);
    results.push({ key: p.key, url: RAW_BASE + p.path, ...r });
  }

  // Scheduler via GitHub persistence (read)
  for (const p of [
    { key: "schedulerJobs", path: "data/scheduler/jobs.json" },
    { key: "schedulerHistory", path: "data/scheduler/history.ndjson" },
  ]) {
    const r = await rawOk(p.path);
    results.push({ key: p.key, url: RAW_BASE + p.path, ...r });
  }

  // schedulerExecute: append a noop history line via GH if creds available
  {
    const t0 = Date.now();
    let ok = false, status = 200, error: string | undefined;
    try {
      const repo = process.env.GH_REPO;
      const token = process.env.GH_TOKEN;
      if (!repo || !token) {
        status = 0; ok = false; error = "GH_TOKEN/GH_REPO not set";
      } else {
        const path = "data/scheduler/history.ndjson";
        const existing = await ghGetContent(repo, path).catch(()=>null);
        let old = "";
        if (existing?.content && existing.encoding === "base64") {
          old = Buffer.from(existing.content, "base64").toString("utf8");
        }
        const line = JSON.stringify({ ts: new Date().toISOString(), kind: "check", action: "execute", ok: true });
        const next = (old ? old + "\n" : "") + line;
        const put = await ghPutContent(repo, path, next, "chore(checks): scheduler execute noop");
        ok = !!put.ok;
      }
    } catch (e: any) {
      ok = false; status = 0; error = String(e?.message || e);
    }
    results.push({ key: "schedulerExecute", url: "gh:append data/scheduler/history.ndjson", ok, status, durationMs: Date.now() - t0, error });
  }

  // cronTrigger: we mark as N/A if internal HTTP blocked; try import fallback if available
  try {
    const t0 = Date.now();
    const mod = await import("../cron/trigger/route");
    const resp: Response = await (mod.GET as any)(new Request("http://local/"));
    results.push({ key: "cronTrigger", url: "/api/cron/trigger (import)", ok: resp.ok, status: resp.status, durationMs: Date.now() - t0 });
  } catch (e: any) {
    results.push({ key: "cronTrigger", url: "/api/cron/trigger (import)", ok: false, status: 0, durationMs: 0, error: String(e?.message || e) });
  }

  // debugWrite via GitHub contents
  {
    const t0 = Date.now();
    let ok = false, status = 200, error: string | undefined;
    try {
      const repo = process.env.GH_REPO;
      const token = process.env.GH_TOKEN;
      if (!repo || !token) { status = 0; ok = false; error = "GH_TOKEN/GH_REPO not set"; }
      else {
        const path = "data/debug.ndjson";
        const existing = await ghGetContent(repo, path).catch(()=>null);
        let old = "";
        if (existing?.content && existing.encoding === "base64") {
          old = Buffer.from(existing.content, "base64").toString("utf8");
        }
        const line = JSON.stringify({ ts: new Date().toISOString(), kind: "check", url: "/api/checks", ok: true, status: 200, message: "self-check" });
        const next = (old ? old + "\n" : "") + line;
        const put = await ghPutContent(repo, path, next, "chore(checks): debug write");
        ok = !!put.ok;
      }
    } catch (e: any) {
      ok = false; status = 0; error = String(e?.message || e);
    }
    results.push({ key: "debugWrite", url: "gh:append data/debug.ndjson", ok, status, durationMs: Date.now() - t0, error });
  }

  const allOk = results.every(r => r.ok);
  return NextResponse.json({ ok: allOk, results, checkedAt: new Date().toISOString() });
}
