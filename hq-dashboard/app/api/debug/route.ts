import { NextRequest, NextResponse } from "next/server";

const RAW =
  "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/debug.ndjson";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? "100");
    const r = await fetch(RAW, { cache: "no-store" });
    if (!r.ok) return NextResponse.json({ items: [] }, { status: 200 });
    const text = await r.text();
    const lines = text.trim().split(/\n+/).filter(Boolean);
    const tail = lines.slice(-limit);
    const items = tail.map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { raw: l };
      }
    });
    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
