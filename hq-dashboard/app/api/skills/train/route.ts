import { NextRequest, NextResponse } from "next/server";
import { ghGetContent, ghPutContent } from "../../ingest/utils";

export async function POST(req: NextRequest) {
  try {
    const token = process.env.GH_TOKEN;
    const repo = process.env.GH_REPO;
    const body = await req.json().catch(()=>({}));
    const sourceRepo = (body?.repo as string) || repo;
    if (!token || !repo || !sourceRepo) {
      return NextResponse.json({ ok: false, error: "GH_TOKEN and GH_REPO (target) required; optionally body.repo as source" }, { status: 400 });
    }
    const commitsUrl = `https://api.github.com/repos/${sourceRepo}/commits?per_page=50`;
    const prsUrl = `https://api.github.com/repos/${sourceRepo}/pulls?state=all&per_page=50`;
    const headers = { Authorization: `token ${token}`, "User-Agent": "hq-dashboard" } as any;
    const [cr, pr] = await Promise.all([
      fetch(commitsUrl, { headers, cache: "no-store" }),
      fetch(prsUrl, { headers, cache: "no-store" })
    ]);
    const commits = cr.ok ? await cr.json() : [];
    const prs = pr.ok ? await pr.json() : [];

    // Load existing skills
    const path = "data/skills.json";
    const existing = await ghGetContent(repo, path).catch(()=>null);
    let skills: any[] = [];
    if (existing?.content && existing.encoding === "base64") {
      try { skills = JSON.parse(Buffer.from(existing.content, "base64").toString("utf8")); } catch {}
    }
    if (!Array.isArray(skills)) skills = [];

    const activity = [] as any[];
    for (const c of commits || []) {
      activity.push({ ts: c.commit?.author?.date, kind: 'commit', message: c.commit?.message?.split('\n')[0], url: c.html_url });
    }
    for (const p of prs || []) {
      activity.push({ ts: p.created_at, kind: 'pr', message: p.title, url: p.html_url });
    }
    activity.sort((a,b)=> new Date(a.ts||0).getTime() - new Date(b.ts||0).getTime());

    // Attach activity snapshot to first skill or create one placeholder
    if (skills.length === 0) skills = [{ name: 'General', level: 1 }];
    skills[0].activity = (skills[0].activity||[]).slice(-50).concat(activity.slice(-50));
    skills[0].lastTrainedAt = new Date().toISOString();

    const put = await ghPutContent(repo, path, JSON.stringify(skills, null, 2), `feat(skills): add activity snapshot from ${sourceRepo}`);
    return NextResponse.json({ ok: !!put.ok, repo, activity: activity.length }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
