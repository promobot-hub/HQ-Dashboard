import { NextResponse } from "next/server";

const RAW =
  "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/sessions.json";

export async function GET() {
  try {
    const r = await fetch(`${RAW}?t=${Date.now()}`, { cache: "no-store" });
    const json = r.ok
      ? await r.json().catch(() => ({ sessions: [] }))
      : { sessions: [] };
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({ sessions: [] }, { status: 200 });
  }
}
