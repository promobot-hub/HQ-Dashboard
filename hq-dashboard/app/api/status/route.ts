import { NextResponse } from "next/server";
export async function GET() {
  try {
    const url =
      "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/heartbeat-state.json";
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("not ok");
    const json = await r.json();
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { runsToday: 0, totalRuns: 0, lastRunAt: null },
      { status: 200 }
    );
  }
}
