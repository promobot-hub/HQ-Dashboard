import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, status, ...rest } = body || {};
    // Prefer Core PATCH /api/tasks/{id}
    if (id) {
      const r = await fetch(`${CLAWBOT_API_BASE}/api/tasks/${encodeURIComponent(String(id))}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...rest }),
      }).catch(() => null);
      if (r && r.ok) {
        const j = await r.json().catch(() => ({}));
        return NextResponse.json(j, { status: r.status || 200 });
      }
    }
    // Fallback: POST /api/tasks (upsert semantics) wenn Core PATCH nicht verfügbar
    const r2 = await fetch(`${CLAWBOT_API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    if (r2 && r2.ok) {
      const j2 = await r2.json().catch(() => ({}));
      return NextResponse.json(j2, { status: r2.status || 200 });
    }
    return NextResponse.json({ ok: false }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
