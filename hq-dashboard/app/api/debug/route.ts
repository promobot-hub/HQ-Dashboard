import { NextRequest, NextResponse } from "next/server";
import { fetchRaw } from "../_utils/raw";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? "100");
    const r = await fetchRaw("data/debug.ndjson");
    if (!r.ok || !r.text)
      return NextResponse.json({ items: [], meta: r }, { status: 200 });
    const lines = r.text.trim().split(/\n+/).filter(Boolean);
    const tail = lines.slice(-limit);
    const items = tail.map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { raw: l };
      }
    });
    return NextResponse.json(
      { items, meta: { url: (r as any).url } },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
