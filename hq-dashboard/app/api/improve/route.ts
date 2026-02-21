import { NextRequest, NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text().catch(() => "");
    const init: RequestInit = { method: "POST" };
    if (bodyText && bodyText.trim().length > 0) {
      init.headers = {
        "Content-Type": req.headers.get("content-type") || "application/json",
      } as any;
      init.body = bodyText;
    }
    const r = await fetch(`${CLAWBOT_API_BASE}/api/improve`, init);
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status || 200,
      headers: {
        "Content-Type": r.headers.get("content-type") || "application/json",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "improve_failed" },
      { status: 502 }
    );
  }
}
