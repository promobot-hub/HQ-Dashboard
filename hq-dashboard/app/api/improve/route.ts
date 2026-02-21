import { NextRequest, NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

export async function POST(_req: NextRequest) {
  try {
    const r = await fetch(`${CLAWBOT_API_BASE}/api/improve`, {
      method: "POST",
    });
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status || 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "improve_failed" },
      { status: 502 }
    );
  }
}
