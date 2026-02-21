import { NextRequest, NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keys = searchParams.get("keys") || "cpu,memory,disk,active_tasks";
    const r = await fetch(
      `${CLAWBOT_API_BASE}/api/metrics?keys=${encodeURIComponent(keys)}`,
      { cache: "no-store" }
    );
    const json = await r.json().catch(() => ({}));
    return NextResponse.json(json, { status: r.status || 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 200 });
  }
}
