import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../../ingest/utils";

const PATH = "data/debug.ndjson";

export async function POST(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    const bodyText = await req.text().catch(() => "");
    if (!bodyText)
      return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
    // payload cap ~200KB
    if (bodyText.length > 200 * 1024) {
      return NextResponse.json({ ok: false, error: "payload too large" }, { status: 413 });
    }
    if (!repo || !token)
      return NextResponse.json({ ok: true, persisted: false }, { status: 200 });

    const existing = await ghGetContent(repo, PATH).catch(() => null);
    let old = "";
    if (existing?.content && existing.encoding === "base64") {
      old = Buffer.from(existing.content, "base64").toString("utf8");
    }
    // normalize to NDJSON; cap to last 200 lines to avoid runaway growth
    const incomingLines = (() => {
      try {
        const j = JSON.parse(bodyText);
        const arr = Array.isArray(j) ? j : [j];
        return arr.map((x) => JSON.stringify(x));
      } catch {
        return bodyText.split(/\n+/).filter(Boolean);
      }
    })();
    const oldLines = old ? old.split(/\n+/).filter(Boolean) : [];
    const next = [...oldLines, ...incomingLines].slice(-200).join("\n");
    const put = await ghPutContent(repo, PATH, next, `chore(debug): append debug events`);
    return NextResponse.json({ ok: put.ok, persisted: true }, { status: put.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
