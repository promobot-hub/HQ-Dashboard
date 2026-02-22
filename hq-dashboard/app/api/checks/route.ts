import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../ingest/utils";

const PRIMARY_REPO = process.env.GH_REPO || "";
const FALLBACK_REPO = "promobot-hub/HQ-Dashboard";
const BASES = [PRIMARY_REPO, FALLBACK_REPO].filter(Boolean).map(r => `https://raw.githubusercontent.com/${r}/main/`);

async function rawOk(path: string) {
  const t0 = Date.now();
  for (const base of BASES) {
    try {
      const bust = Date.now();
      const url = `${base}${path}?t=${bust}`;
      const r = await fetch(url, { cache: "no-store" });
      const ok = r.ok;
      try { await r.text(); } catch {}
      if (ok) return { ok: true, status: r.status, durationMs: Date.now() - t0, url };
    } catch {}
  }
  return { ok: false, status: 404, durationMs: Date.now() - t0, error: "not found in any repo", tried: BASES };
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
    results.push({ key: p.key, url: r.url || (BASES[0] + p.path), ...r });
  }
  // Scheduler via GitHub persistence (read)
  for (const p of [
    { key: "schedulerJobs", path: "data/scheduler/jobs.json" },
    { key: "schedulerHistory", path: "data/scheduler/history.ndjson" },
  ]) {
    const r = await rawOk(p.path);
    results.push({ key: p.key, url: r.url || (BASES[0] + p.path), ...r });
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
  // cronTrigger via direct import
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
      const repo = process.env.GH_REPO; const token = process.env.GH_TOKEN;
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
    } catch (e: any) { ok = false; status = 0; error = String(e?.message || e); }
    results.push({ key: "debugWrite", url: "gh:append data/debug.ndjson", ok, status, durationMs: Date.now() - t0, error });
  }
  // Github creds summary
  {
    const ghOk = !!process.env.GH_REPO && !!process.env.GH_TOKEN;
    results.push({ key: "githubCreds", url: "env", ok: ghOk, status: ghOk ? 200 : 0, durationMs: 0, error: ghOk ? undefined : "GH_TOKEN/GH_REPO not set" });
  }

  const allOk = results.every(r => r.ok);
  return NextResponse.json({ ok: allOk, results, checkedAt: new Date().toISOString() });
}
