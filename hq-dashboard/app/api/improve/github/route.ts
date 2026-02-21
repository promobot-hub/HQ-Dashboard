import { NextRequest, NextResponse } from "next/server";
import { ghPutContent } from "../../../api/ingest/utils";

export async function POST(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    if (!repo || !token) {
      return NextResponse.json(
        { ok: false, error: "missing_github_env" },
        { status: 400 }
      );
    }
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const body = await req.text().catch(() => "");
    const payload =
      body && body.trim().length
        ? body
        : JSON.stringify({ trigger: true, ts }, null, 2);
    const path = `data/improve_trigger-${ts}.json`;
    const r = await ghPutContent(
      repo,
      path,
      typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
      `chore(improve): trigger @ ${ts}`
    );
    return NextResponse.json(
      { ok: r.ok, status: r.status },
      { status: r.ok ? 200 : 502 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
