import { NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

export async function GET() {
  try {
    const r = await fetch(`${CLAWBOT_API_BASE}/api/heartbeat`, { cache: "no-store" });
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: r.status || 200 });
  } catch (e) {
    // Fall back to a neutral status; client can also read /api/status
    return NextResponse.json({ ok: false, runsToday: 0, totalRuns: 0, lastRunAt: null }, { status: 200 });
  }
}
