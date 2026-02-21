import { NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

export async function GET() {
  try {
    const r = await fetch(`${CLAWBOT_API_BASE}/api/skills`, { cache: "no-store" });
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: r.status || 200 });
  } catch (e) {
    return NextResponse.json({ skills: [] }, { status: 200 });
  }
}
