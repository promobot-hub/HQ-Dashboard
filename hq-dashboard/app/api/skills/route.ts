import { NextResponse } from "next/server";
import { jsonFromRaw } from "../_utils/raw";

export async function GET() {
  try {
    const r = await jsonFromRaw("data/skills.json");
    const json = r.ok ? (r.data || { skills: [] }) : { skills: [] };
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({ skills: [] }, { status: 200 });
  }
}
