import { NextRequest, NextResponse } from "next/server";
import { ghGetContent } from "../../ingest/utils";

export async function GET(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO || "";
    if (!repo) return NextResponse.json({ items: [] }, { status: 200 });
    const j = await ghGetContent(repo, "data/scheduler/history.ndjson");
    if (!j || !j.content || j.encoding !== "base64") return NextResponse.json({ items: [] }, { status: 200 });
    const txt = Buffer.from(j.content, "base64").toString("utf8");
    const lines = txt.trim().split(/\n+/).filter(Boolean).slice(-100);
    const items = lines.map((l) => { try { return JSON.parse(l); } catch { return { raw: l }; } });
    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
