import { NextRequest, NextResponse } from "next/server";
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
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(base + path, { headers });
  if (!r.ok) return null;
  return r.json();
}

function getBaseFromHeaders(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : null;
}

export async function GET(req: NextRequest) {
  try {
    const selfBase = getBaseFromHeaders(req);

    const [hb, logs, selfStatus] = await Promise.all([
      timedFetch(`${CLAWBOT_API_BASE}/api/heartbeat`, { cache: "no-store" }),
      timedFetch(`${CLAWBOT_API_BASE}/api/logs?limit=1`, { cache: "no-store" }),
      selfBase
        ? timedFetch(`${selfBase}/api/status`, { cache: "no-store" })
        : Promise.resolve({ ok: false, ms: 0, res: null } as const),
    ]);

    const hbJson = hb.res ? await hb.res.json().catch(() => ({})) : {};
    let lastRunAt: string | null = hbJson?.lastRunAt ?? null;

    // Try derive from our own /api/status if heartbeat missing
    if (
      (!lastRunAt || typeof lastRunAt !== "string") &&
      selfStatus.ok &&
      selfStatus.res
    ) {
      const s = await selfStatus.res.json().catch(() => null);
      const fromChecks =
        s?.lastChecks?.heartbeat || s?.lastChecks?.cron_denke || null;
      if (fromChecks) lastRunAt = fromChecks;
    }

    const ageMs = lastRunAt
      ? Math.max(0, Date.now() - Date.parse(lastRunAt))
      : null;

    // Status fallback via GitHub RAW (still keep as signal-only)
    const rawFallback = await timedFetch(
      "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/heartbeat-state.json",
      { cache: "no-store" }
    );

    // Optional: latest snapshot time from GitHub (if env present)
    let lastSnapshot: string | null = null;
    const repo = process.env.GH_REPO; // e.g. promobot-hub/HQ-Dashboard
    if (repo && process.env.GH_TOKEN) {
      const items = await ghJson(
        `/repos/${repo}/contents/${encodeURIComponent("data/snapshots")}`
      );
      if (Array.isArray(items) && items.length) {
        const names = items
          .map((x: any) => x?.name)
          .filter(Boolean) as string[];
        lastSnapshot = names.sort().at(-1) || null;
      }
    }

    const ok = Boolean((hb.ok && lastRunAt) || (selfStatus.ok && lastRunAt));

    const status = {
      ok,
      proxyLatencyMs: hb.ms,
      lastRunAt,
      heartbeatAgeMs: ageMs,
      lastSnapshot,
      checks: {
        heartbeatDirect: { ok: hb.ok, ms: hb.ms },
        statusFallback: { ok: rawFallback.ok, ms: rawFallback.ms },
        logsProxy: { ok: logs.ok, ms: logs.ms },
      },
    } as const;
    return NextResponse.json(status, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
