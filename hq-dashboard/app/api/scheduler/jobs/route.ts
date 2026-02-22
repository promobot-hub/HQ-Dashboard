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

export async function PATCH(req: NextRequest) {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    if (!repo || !token)
      return NextResponse.json({ ok: false, error: 'missing_github_env' }, { status: 400 });
    const body = await req.json().catch(()=>({}));
    const { id, enabled, name, everyMinutes, payload } = body || {};
    if (!id) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
    const jobsData = await loadJobs(repo);
    const jobs = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
    const idx = jobs.findIndex((j:any)=>j.id===id);
    if (idx<0) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
    const j = jobs[idx];
    if (typeof enabled === 'boolean') j.enabled = enabled;
    if (typeof name === 'string') j.name = name;
    if (everyMinutes!=null) j.everyMinutes = Number(everyMinutes);
    if (payload && typeof payload==='object') j.payload = payload;
    const save = await saveJobs(repo, token!, { jobs });
    return NextResponse.json({ ok: save.ok, job: j }, { status: save.ok?200:502 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
