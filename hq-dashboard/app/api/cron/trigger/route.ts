import { NextRequest, NextResponse } from "next/server";
import { triggerCronOnce } from "../../../../api/cronRunner";

export async function POST(req: NextRequest) {
  try {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const base = host ? `${proto}://${host}` : undefined;
    const result = await triggerCronOnce(base);
    return NextResponse.json({ ok: true, base, result }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
