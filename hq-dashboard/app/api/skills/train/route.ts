import { NextRequest, NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../../components/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const r = await fetch(`${CLAWBOT_API_BASE}/api/skills/train`, {
      method: "POST",
      headers: { "Content-Type": req.headers.get("content-type") || "application/json" },
      body,
    });
    const text = await r.text();
    return new NextResponse(text, { status: r.status || 200, headers: { "Content-Type": r.headers.get("content-type") || "application/json" } });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
