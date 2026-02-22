import { NextRequest, NextResponse } from "next/server";
import { jsonFromRaw } from "../_utils/raw";

export async function GET(_req: NextRequest) {
  try {
    const r = await jsonFromRaw("data/metrics.json");
    const json = r.ok ? r.data || {} : {};
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 200 });
  }
}
