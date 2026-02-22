import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../../ingest/utils";

const PATH = "data/chat/history.ndjson";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json().catch(() => ({}));
    if (!message || typeof message !== "string") {
      return NextResponse.json({ ok: false, error: "message required" }, { status: 400 });
    }
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    if (!repo || !token) {
      return NextResponse.json({ ok: false, error: "GH_TOKEN/GH_REPO not set" }, { status: 500 });
    }
    const existing = await ghGetContent(repo, PATH).catch(() => null);
    let old = "";
    if (existing?.content && existing.encoding === "base64") {
      old = Buffer.from(existing.content, "base64").toString("utf8");
    }
    const entry = {
      ts: new Date().toISOString(),
      role: "user",
      message: message.slice(0, 4000),
      source: "web",
    };
    const line = JSON.stringify(entry);
    const next = (old ? old + "\n" : "") + line;
    const put = await ghPutContent(repo, PATH, next, "feat(chat): append user message");
    return NextResponse.json({ ok: !!put.ok, appended: true }, { status: put.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
