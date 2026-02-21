import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = 'https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/heartbeat-state.json';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const json = await res.json();
    const counters = json.counters || {};
    const lastRun = json.lastChecks?.heartbeat || json.lastRun || null;
    return Response.json({
      ok: true,
      runsToday: counters.runsToday ?? null,
      totalRuns: counters.totalRuns ?? null,
      lastRun,
      source: 'github-raw'
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || 'unknown' }, { status: 200 });
  }
}
