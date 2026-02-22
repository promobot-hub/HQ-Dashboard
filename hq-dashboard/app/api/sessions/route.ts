import { NextResponse } from "next/server";
import { jsonFromRaw } from "../_utils/raw";

export async function GET() {
  try {
    const r = await jsonFromRaw("data/sessions.json");
    const json = r.ok ? (r.data || { sessions: [] }) : { sessions: [] };
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({ sessions: [] }, { status: 200 });
  }
}
