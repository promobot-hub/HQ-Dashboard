import { NextResponse } from "next/server";
import { jsonFromRaw } from "../_utils/raw";

export async function GET() {
  try {
    const r = await jsonFromRaw("data/heartbeat.json");
    const json = r.ok ? r.data || { ok: false } : { ok: false, meta: r.meta };
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
