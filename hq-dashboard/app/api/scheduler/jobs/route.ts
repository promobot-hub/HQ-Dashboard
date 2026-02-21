import { NextRequest, NextResponse } from "next/server";
import { loadJobs, saveJobs } from "../../scheduler/utils";

export async function GET() {
  const repo = process.env.GH_REPO;
  const data = await loadJobs(repo || "");
  return NextResponse.json(data || { jobs: [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    if (!repo || !token)
      return NextResponse.json(
        { ok: false, error: "missing_github_env" },
        { status: 400 }
      );
    const body = await req.json().catch(() => ({}));
    let { name, everyMinutes, enabled, payload } = body || {};
    if (!name || !everyMinutes)
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    const now = new Date().toISOString();
    const jobsData = await loadJobs(repo);
    const jobs = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
    const id = `job_${Math.random().toString(36).slice(2, 8)}`;
    const job = {
      id,
      name,
      everyMinutes: Number(everyMinutes),
      enabled: enabled !== false,
      payload: payload || {},
      createdAt: now,
      lastRunAt: null,
      nextRunAt: null,
    };
    jobs.push(job);
    const save = await saveJobs(repo, token!, { jobs });
    return NextResponse.json(
      { ok: save.ok, job },
      { status: save.ok ? 200 : 502 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
