import { NextRequest, NextResponse } from "next/server";
import {
  getRepo,
  ghPutContent,
  ghGetContent,
  readJson,
  verifySignature,
} from "../utils";
import { rateLimit } from "../../_utils/rate";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'ingest_tasks', 60, 60*1000);
    if (!rl.allowed) return NextResponse.json({ ok:false, error:'rate_limited' }, { status:429, headers: { 'Retry-After': String(rl.retryAfter) } });
    const raw = await req.text();
    const ts = req.headers.get("x-timestamp");
    const sig = req.headers.get("x-signature");
    if (!verifySignature(raw, ts, sig)) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }
    const body = JSON.parse(raw || "{}");
    const { tasks } = body as { tasks?: any };
    if (!tasks)
      return NextResponse.json(
        { ok: false, error: "missing tasks" },
        { status: 400 }
      );

    const { repo, token } = getRepo();
    if (!repo || !token)
      return NextResponse.json(
        { ok: true, warning: "GH env not set; accepted but not persisted" },
        { status: 200 }
      );

    const tsid = new Date().toISOString().replace(/[:.]/g, "-");
    const snapshotPath = `data/snapshots/tasks-${tsid}.json`;
    const tasksPath = `data/tasks.json`;

    const snap = await ghPutContent(
      repo,
      snapshotPath,
      JSON.stringify({ ts: tsid, tasks }, null, 2),
      `chore(ingest): tasks snapshot @ ${tsid}`
    );
    // Merge or replace tasks.json (simple replace)
    const put = await ghPutContent(
      repo,
      tasksPath,
      JSON.stringify({ tasks }, null, 2),
      `chore(ingest): tasks update @ ${tsid}`
    );

    return NextResponse.json({ ok: snap.ok && put.ok }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
