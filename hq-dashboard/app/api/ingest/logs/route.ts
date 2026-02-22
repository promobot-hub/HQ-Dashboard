import { NextRequest, NextResponse } from "next/server";
import { getRepo, ghGetContent, ghPutContent, verifySignature } from "../utils";
import { rateLimit } from "../../_utils/rate";

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'ingest_logs', 60, 60*1000);
    if (!rl.allowed) return NextResponse.json({ ok:false, error:'rate_limited' }, { status:429, headers: { 'Retry-After': String(rl.retryAfter) } });
    const raw = await req.text();
    const ts = req.headers.get("x-timestamp");
    const sig = req.headers.get("x-signature");
    if (!verifySignature(raw, ts, sig))
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );

    const { repo, token } = getRepo();
    if (!repo || !token)
      return NextResponse.json(
        { ok: true, warning: "GH env not set; accepted but not persisted" },
        { status: 200 }
      );

    const tsid = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `data/logs.ndjson`;
    const existing = await ghGetContent(repo, path);
    let old = "";
    if (existing?.content && existing.encoding === "base64") {
      old = Buffer.from(existing.content, "base64").toString("utf8");
    }
    const next = (old ? old + "\n" : "") + raw.trim();
    const put = await ghPutContent(
      repo,
      path,
      next,
      `chore(ingest): logs append @ ${tsid}`
    );
    return NextResponse.json({ ok: put.ok }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
