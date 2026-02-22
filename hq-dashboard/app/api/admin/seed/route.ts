import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../../ingest/utils";

const defaults = {
  heartbeat: { ok: true, lastRunAt: new Date().toISOString(), proxyLatencyMs: 0, heartbeatDirect: false, statusFallback: true, logsProxy: false },
  tasks: [
    { id: "seed-1", title: "Welcome to HQ-Dashboard", status: "pending", updatedAt: new Date().toISOString() },
    { id: "seed-2", title: "Connect GitHub Issues Importer", status: "progress", updatedAt: new Date().toISOString() },
    { id: "seed-3", title: "Polish Health & Activity", status: "done", updatedAt: new Date().toISOString() }
  ],
  skills: [ { name: "GitHub Management", level: 3, lastTrainedAt: new Date().toISOString() } ],
  sessions: { sessions: 1, agents: 1, concurrent: 1, longestSec: 120, lastUpdated: new Date().toISOString() }
};

export async function POST(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO; const token = process.env.GH_TOKEN;
    if (!repo || !token) return NextResponse.json({ ok: false, error: 'GH_TOKEN/GH_REPO required' }, { status: 400 });

    const plan = [
      { path: 'data/heartbeat.json', content: JSON.stringify(defaults.heartbeat, null, 2) },
      { path: 'data/tasks.json', content: JSON.stringify(defaults.tasks, null, 2) },
      { path: 'data/skills.json', content: JSON.stringify(defaults.skills, null, 2) },
      { path: 'data/sessions.json', content: JSON.stringify(defaults.sessions, null, 2) },
      { path: 'data/logs.ndjson', content: JSON.stringify({ ts: new Date().toISOString(), type:'seed', msg:'Admin seed created' })+"\n" }
    ];

    const results: any[] = [];
    for (const item of plan) {
      const exists = await ghGetContent(repo, item.path).catch(()=>null);
      if (!exists?.content) {
        const put = await ghPutContent(repo, item.path, item.content, `chore(seed): create ${item.path}`);
        results.push({ path: item.path, created: !!put.ok });
      } else {
        results.push({ path: item.path, created: false });
      }
    }
    return NextResponse.json({ ok: true, repo, results }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
