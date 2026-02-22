import { NextRequest, NextResponse } from 'next/server'

// Prep-only endpoint: gated by DATA_SOURCE=supabase and required SUPABASE envs.
export async function POST(req: NextRequest) {
  const useSupabase = (process.env.DATA_SOURCE || 'github') === 'supabase'
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE
  if (!useSupabase || !url || !key) {
    return NextResponse.json({ ok: false, error: 'supabase not configured' }, { status: 400 })
  }
  try {
    // TODO: implement RAW readers and batch upserts via supabase client
    return NextResponse.json({ ok: true, prepared: true, inserted: 0, updated: 0 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
