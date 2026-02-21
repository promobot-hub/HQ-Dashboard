import { NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

export async function GET() {
  try {
    const r = await fetch(`${CLAWBOT_API_BASE}/api/autoimprove`, {
      cache: "no-store",
    });
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status || 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "autoimprove_fetch_failed" },
      { status: 502 }
    );
  }
}
