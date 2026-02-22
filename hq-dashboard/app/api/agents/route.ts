import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../ingest/utils";

const PATH = "data/agents.json";

async function loadAgents(repo?: string) {
  const r = await ghGetContent(repo || "", PATH).catch(() => null);
  if (r?.content && r.encoding === "base64") {
    try {
      const json = JSON.parse(
        Buffer.from(r.content, "base64").toString("utf8")
      );
      return Array.isArray(json) ? json : json?.agents || [];
    } catch {
      return [];
    }
  }
  return [] as any[];
}

export async function GET() {
  const repo = process.env.GH_REPO;
  const agents = await loadAgents(repo || "");
  return NextResponse.json({ agents }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    if (!repo || !token)
      return NextResponse.json(
        { ok: false, error: "missing_github_env" },
        { status: 400 }
      );
    const body = await req.json().catch(() => ({}));
    const { id, paused, status } = body || {};
    if (!id)
      return NextResponse.json(
        { ok: false, error: "missing_id" },
        { status: 400 }
      );
    const agents = await loadAgents(repo);
    const idx = agents.findIndex((a: any) => String(a.id) === String(id));
    if (idx < 0)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    const a = agents[idx];
    if (typeof paused === "boolean") a.paused = paused;
    if (typeof status === "string") a.status = status;
    a.lastActiveAt = a.lastActiveAt || new Date().toISOString();
    const ok = await ghPutContent(
      repo,
      PATH,
      JSON.stringify(agents, null, 2),
      `chore(agents): update ${id}`
    );
    return NextResponse.json({ ok: !!ok.ok, agent: a }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
