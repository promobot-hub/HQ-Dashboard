import { NextResponse } from "next/server";
import { loadJobs, saveJobs, appendHistory } from "../../scheduler/utils";

async function runJob(job: any) {
  const base =
    process.env.SELF_BASE ||
    process.env.CRON_SELF_URL ||
    "https://hq-dashboard-z74i.onrender.com";
  const ts = new Date().toISOString();
  let action = job?.payload?.action || "trigger";
  let endpoint = "";
  if (action === "trigger") endpoint = "/api/cron/trigger";
  else if (action === "improve") endpoint = "/api/improve/github";
  else if (action === "snapshot") endpoint = "/api/snapshot";
  else endpoint = "/api/cron/trigger";
  try {
    const r = await fetch(base + endpoint, {
      method: "POST",
      headers: { "Content-Length": "0" },
    });
    const text = await r.text();
    return { ok: r.ok, status: r.status, endpoint, text: text.slice(0, 400) };
  } catch (e: any) {
    return { ok: false, status: 0, endpoint, text: String(e?.message || e) };
  }
}

export async function POST() {
  try {
    const repo = process.env.GH_REPO;
    const token = process.env.GH_TOKEN;
    if (!repo || !token)
      return NextResponse.json(
        { ok: false, error: "missing_github_env" },
        { status: 400 }
      );
    const jobsData = await loadJobs(repo);
    const jobs = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
    const now = Date.now();
    const due: any[] = [];
    for (const j of jobs) {
      if (!j.enabled) continue;
      const last = j.lastRunAt ? Date.parse(j.lastRunAt) : 0;
      const everyMs = Math.max(60000, Number(j.everyMinutes || 5) * 60000);
      if (!j.lastRunAt || now - last >= everyMs) due.push(j);
    }
    const results: any[] = [];
    for (const j of due) {
      const res = await runJob(j);
      results.push({ id: j.id, name: j.name, ...res });
      j.lastRunAt = new Date().toISOString();
      j.nextRunAt = new Date(
        Date.now() + Math.max(60000, Number(j.everyMinutes || 5) * 60000)
      ).toISOString();
      const hist = {
        ts: j.lastRunAt,
        jobId: j.id,
        name: j.name,
        endpoint: res.endpoint,
        status: res.status,
        ok: res.ok,
      };
      await appendHistory(repo, token, JSON.stringify(hist));
    }
    if (due.length) await saveJobs(repo, token, { jobs });
    return NextResponse.json(
      {
        ok: true,
        ran: results,
        totalJobs: jobs.length,
        due: due.map((d) => d.id),
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
