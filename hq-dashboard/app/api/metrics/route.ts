import { NextRequest, NextResponse } from "next/server";

const RAW =
  "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/metrics.json";

export async function GET(_req: NextRequest) {
  try {
    const r = await fetch(`${RAW}?t=${Date.now()}`, { cache: "no-store" });
    const json = r.ok ? await r.json().catch(() => ({})) : {};
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 200 });
  }
}
