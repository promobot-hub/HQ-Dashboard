import { NextResponse } from "next/server";
import { CLAWBOT_API_BASE } from "../../components/config";
const RAW =
  "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/tasks.json";

export async function GET() {
  try {
    // Prefer Core API
    let r = await fetch(`${CLAWBOT_API_BASE}/api/tasks`, {
      cache: "no-store",
    }).catch(() => null);
    if (!r || !r.ok) {
      // Fallback to GitHub raw snapshot
      r = await fetch(RAW, { cache: "no-store" });
    }
    const json = r && r.ok ? await r.json() : { tasks: [] };
    return NextResponse.json(json, { status: 200 });
  } catch (e) {
    return NextResponse.json({ updatedAt: null, tasks: [] }, { status: 200 });
  }
}
