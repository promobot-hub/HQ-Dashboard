import { NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

// Optional GitHub commit snapshotter
// Requires process.env.GH_TOKEN and process.env.GH_REPO (e.g., "promobot-hub/HQ-Dashboard")
// Commits JSON snapshots to data/snapshots/ and optionally updates data/tasks.json on main.

async function ghRequest(path: string, init: RequestInit = {}) {
  const token = process.env.GH_TOKEN;
  const base = "https://api.github.com";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    ...(init.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(base + path, { ...init, headers });
}

async function ghGetContent(repo: string, filepath: string) {
  const r = await ghRequest(`/repos/${repo}/contents/${encodeURIComponent(filepath)}`);
  if (!r.ok) return null;
  const j = await r.json();
  return j;
}

async function ghPutContent(repo: string, filepath: string, content: string, message: string) {
  const existing = await ghGetContent(repo, filepath);
  const body = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: "main",
    ...(existing?.sha ? { sha: existing.sha } : {}),
  } as any;
  const r = await ghRequest(`/repos/${repo}/contents/${encodeURIComponent(filepath)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  return { ok: r.ok, status: r.status, text };
}

export async function POST() {
  try {
    // 1) Pull live data from Core
    const [tasksR, hbR, logsR] = await Promise.all([
      fetch(`${CLAWBOT_API_BASE}/api/tasks`, { cache: "no-store" }).catch(() => null),
      fetch(`${CLAWBOT_API_BASE}/api/heartbeat`, { cache: "no-store" }).catch(() => null),
      fetch(`${CLAWBOT_API_BASE}/api/logs?limit=50`, { cache: "no-store" }).catch(() => null),
    ]);
    const tasks = tasksR && tasksR.ok ? await tasksR.json() : { tasks: [] };
    const heartbeat = hbR && hbR.ok ? await hbR.json() : { ok: false };
    const logs = logsR && logsR.ok ? await logsR.json() : { items: [] };

    // 2) If GH env present → commit snapshot
    const repo = process.env.GH_REPO; // e.g., "promobot-hub/HQ-Dashboard"
    const token = process.env.GH_TOKEN;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const results: any = { snapshot: false };

    if (repo && token) {
      const snapshotPath = `data/snapshots/${ts}.json`;
      const snapshotContent = JSON.stringify({ ts, tasks, heartbeat, logs }, null, 2);
      const snap = await ghPutContent(repo, snapshotPath, snapshotContent, `chore(snapshot): core state @ ${ts}`);
      results.snapshot = snap.ok;

      // Optional: keep data/tasks.json in sync (read-only consumers can use this)
      const tasksPath = `data/tasks.json`;
      const tasksContent = JSON.stringify(tasks, null, 2);
      const tcommit = await ghPutContent(repo, tasksPath, tasksContent, `chore(tasks): sync from core @ ${ts}`);
      results.tasksUpdated = tcommit.ok;
    }

    return NextResponse.json({ ok: true, tasks, heartbeat, logs }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET to run a lightweight read-only pass for monitoring
  try {
    const r = await fetch(`${CLAWBOT_API_BASE}/api/heartbeat`, { cache: "no-store" });
    const json = r.ok ? await r.json() : { ok: false };
    return NextResponse.json(json, { status: r.status || 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
