import { NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

async function timedFetch(url: string, init?: RequestInit) {
  const start = Date.now();
  try {
    const r = await fetch(url, init);
    const ms = Date.now() - start;
    return { ok: r.ok, ms, res: r };
  } catch (e) {
    const ms = Date.now() - start;
    return { ok: false, ms, res: null } as const;
  }
}

async function ghJson(path: string) {
  const token = process.env.GH_TOKEN;
  const base = "https://api.github.com";
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(base + path, { headers });
  if (!r.ok) return null;
  return r.json();
}

export async function GET() {
  try {
    // Heartbeat direct from Core
    const hb = await timedFetch(`${CLAWBOT_API_BASE}/api/heartbeat`, { cache: "no-store" });
    const hbJson = hb.res ? await hb.res.json().catch(() => ({})) : {};
    const lastRunAt: string | null = hbJson?.lastRunAt ?? null;
    const ageMs = lastRunAt ? Math.max(0, Date.now() - Date.parse(lastRunAt)) : null;

    // Optional: latest snapshot time from GitHub (if env present)
    let lastSnapshot: string | null = null;
    const repo = process.env.GH_REPO; // e.g. promobot-hub/HQ-Dashboard
    if (repo && process.env.GH_TOKEN) {
      const items = await ghJson(`/repos/${repo}/contents/${encodeURIComponent("data/snapshots")}`);
      if (Array.isArray(items) && items.length) {
        // Filenames are ISO-ish; pick max by name
        const names = items.map((x: any) => x?.name).filter(Boolean) as string[];
        lastSnapshot = names.sort().at(-1) || null;
      }
    }

    const status = {
      ok: !!(hb.ok && lastRunAt),
      proxyLatencyMs: hb.ms,
      lastRunAt,
      heartbeatAgeMs: ageMs,
      lastSnapshot,
    };
    return NextResponse.json(status, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
