import { ghGetContent, ghPutContent } from "../ingest/utils";

const JOBS_PATH = "data/scheduler/jobs.json";
const HIST_PATH = "data/scheduler/history.ndjson";

export async function loadJobs(repo?: string) {
  if (!repo) return { jobs: [] as any[] };
  const j = await ghGetContent(repo, JOBS_PATH);
  if (j && j.content && j.encoding === "base64") {
    try {
      const txt = Buffer.from(j.content, "base64").toString("utf8");
      const parsed = JSON.parse(txt);
      return parsed && typeof parsed === "object" ? parsed : { jobs: [] };
    } catch {}
  }
  return { jobs: [] };
}

export async function saveJobs(repo: string, token: string, data: any) {
  return ghPutContent(
    repo,
    JOBS_PATH,
    JSON.stringify(data, null, 2),
    `chore(scheduler): update jobs`
  );
}

export async function appendHistory(repo: string, token: string, line: string) {
  const j = await ghGetContent(repo, HIST_PATH);
  let old = "";
  if (j && j.content && j.encoding === "base64") {
    old = Buffer.from(j.content, "base64").toString("utf8");
  }
  const next = (old ? old + "\n" : "") + line.trim();
  return ghPutContent(
    repo,
    HIST_PATH,
    next,
    `chore(scheduler): append history`
  );
}

export const paths = { JOBS_PATH, HIST_PATH };
