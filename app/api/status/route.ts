import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// GET /api/status -> surfaces minimal heartbeat state for dashboard consumption
export async function GET() {
  const filePath = path.join(process.cwd(), 'heartbeat-state.json')

  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(raw)

    const payload = {
      runsToday: data?.runsToday ?? 0,
      totalRuns: data?.totalRuns ?? 0,
      lastRunAt: data?.lastRunAt ?? null,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(payload, { status: 200 })
  } catch (err: any) {
    // If file missing or invalid, return a safe default
    const payload = {
      runsToday: 0,
      totalRuns: 0,
      lastRunAt: null,
      updatedAt: new Date().toISOString(),
      error: 'status_unavailable',
      message: process.env.NODE_ENV === 'development' ? String(err?.message || err) : undefined,
    }
    return NextResponse.json(payload, { status: 200 })
  }
}
