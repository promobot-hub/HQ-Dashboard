import { NextResponse } from "next/server";
const RAW = "https://raw.githubusercontent.com/promobot-hub/HQ-Dashboard/main/data/tasks.json";
export async function GET(){
  try {
    const r = await fetch(RAW, { cache: 'no-store' });
    if (!r.ok) throw new Error('not ok');
    const json = await r.json();
    return NextResponse.json(json, { status: 200 });
  } catch(e){
    return NextResponse.json({ updatedAt: null, tasks: [] }, { status: 200 });
  }
}
