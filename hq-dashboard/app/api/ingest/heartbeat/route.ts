import { NextRequest, NextResponse } from "next/server";
import { getRepo, ghPutContent, readJson, verifySignature } from "../utils";
import { rateLimit } from "../../_utils/rate";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'ingest_heartbeat', 60, 60*1000);
    if (!rl.allowed) return NextResponse.json({ ok:false, error:'rate_limited' }, { status:429, headers: { 'Retry-After': String(rl.retryAfter) } });
    const raw = await req.text();
    const ts = req.headers.get("x-timestamp");
    const sig = req.headers.get("x-signature");
    if (!verifySignature(raw, ts, sig))
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    const data = JSON.parse(raw || "{}");
    const { repo, token } = getRepo();
    if (!repo || !token)
      return NextResponse.json(
        { ok: true, warning: "GH env not set; accepted but not persisted" },
        { status: 200 }
      );
    const tsid = new Date().toISOString().replace(/[:.]/g, "-");
    const hbPath = `data/heartbeat.json`;
    const snapPath = `data/snapshots/heartbeat-${tsid}.json`;
    const put1 = await ghPutContent(
      repo,
      hbPath,
      JSON.stringify(data, null, 2),
      `chore(ingest): heartbeat @ ${tsid}`
    );
    const put2 = await ghPutContent(
      repo,
      snapPath,
      JSON.stringify(data, null, 2),
      `chore(ingest): heartbeat snapshot @ ${tsid}`
    );
    return NextResponse.json({ ok: put1.ok && put2.ok }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
