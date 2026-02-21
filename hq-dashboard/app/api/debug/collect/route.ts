import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../../ingest/utils";

const PATH = "data/debug.ndjson";

export async function POST(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    const body = await req.text().catch(() => "");
    if (!body) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
    if (!repo || !token) return NextResponse.json({ ok: true, persisted: false }, { status: 200 });

    const existing = await ghGetContent(repo, PATH);
    let old = "";
    if (existing?.content && existing.encoding === "base64") {
      old = Buffer.from(existing.content, "base64").toString("utf8");
    }
    const line = (() => {
      try {
        const j = JSON.parse(body);
        if (Array.isArray(j)) return j.map((x) => JSON.stringify(x)).join("\n");
        return JSON.stringify(j);
      } catch {
        return body.trim();
      }
    })();
    const next = (old ? old + "\n" : "") + line;
    const put = await ghPutContent(repo, PATH, next, `chore(debug): append debug events`);
    return NextResponse.json({ ok: put.ok, persisted: true }, { status: put.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
