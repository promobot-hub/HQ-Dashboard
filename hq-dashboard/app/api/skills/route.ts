import { NextResponse } from "next/server";

const RAW = "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/skills.json";

export async function GET() {
  try {
    const r = await fetch(RAW, { cache: "no-store" });
    const json = r.ok ? await r.json().catch(() => ({ skills: [] })) : { skills: [] };
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({ skills: [] }, { status: 200 });
  }
}
