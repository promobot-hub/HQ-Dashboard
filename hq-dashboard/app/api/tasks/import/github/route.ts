import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../../../ingest/utils";

function mapStatus(labels: any[], state: string) {
  const names = (labels || []).map((l: any) => (l?.name || "").toLowerCase());
  if (state === "closed") return "done";
  if (
    names.includes("in-progress") ||
    names.includes("doing") ||
    names.includes("wip")
  )
    return "progress";
  return "pending";
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.GH_TOKEN;
    const repoEnv = process.env.GH_REPO;
    const body = await req.json().catch(() => ({}));
    const repo = (body?.repo as string) || repoEnv;
    if (!token || !repo) {
      return NextResponse.json(
        { ok: false, error: "GH_TOKEN/GH_REPO or body.repo required" },
        { status: 400 }
      );
    }
    const apiUrl = `https://api.github.com/repos/${repo}/issues?state=all&per_page=100`;
    const r = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "hq-dashboard",
      },
      cache: "no-store",
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `GitHub API ${r.status}: ${err.slice(0, 200)}` },
        { status: 502 }
      );
    }
    const issues = await r.json();
    const tasks = (issues || [])
      .filter((x: any) => !x.pull_request)
      .map((it: any) => {
        const labels = (it.labels || [])
          .map((l: any) => l?.name)
          .filter(Boolean);
        const st = mapStatus(it.labels, it.state);
        const priority = (() => {
          const l: string[] = labels.map((x: string) => x.toLowerCase());
          if (l.some((x: string) => ["p0", "p1", "urgent", "high"].includes(x)))
            return "high";
          if (l.some((x: string) => ["p2", "medium"].includes(x))) return "medium";
          if (l.some((x: string) => ["p3", "low"].includes(x))) return "low";
          return "medium";
        })();
        return {
          id: String(it.number),
          title: it.title,
          status: st,
          progress: it.state === "closed" ? 100 : st === "progress" ? 50 : 10,
          created_at: it.created_at,
          updated_at: it.updated_at,
          url: it.html_url,
          labels,
          priority,
        };
      });

    // persist to repo data/tasks.json using GH_REPO env as target for the dashboard data
    const targetRepo = repoEnv || repo; // prefer configured data repo; fallback to source
    const path = "data/tasks.json";
    const existing = await ghGetContent(targetRepo, path).catch(() => null);
    const nextJson = JSON.stringify(tasks, null, 2);
    const put = await ghPutContent(
      targetRepo,
      path,
      nextJson,
      `feat(tasks): import ${tasks.length} issues from ${repo}`
    );
    return NextResponse.json(
      { ok: !!put.ok, repo: targetRepo, imported: tasks.length },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
