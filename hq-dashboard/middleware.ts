import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateMap: Map<string, { count: number; ts: number }> = (global as any).__rateMap || new Map();
(global as any).__rateMap = rateMap;

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Basic security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'no-referrer');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com https://raw.githubusercontent.com");
  // CORS for API (same-origin default; allow OPTIONS) + simple in-memory rate limit
  if (req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('Access-Control-Allow-Origin', req.headers.get('origin') || '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: res.headers });
    }
    // rudimentary rate limit per ip + stricter for ingest endpoints
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const key = `${ip}:${req.nextUrl.pathname.startsWith('/api/ingest/')?'ingest':'api'}`;
    const rec = rateMap.get(key) || { count: 0, ts: now };
    const windowMs = 60*1000;
    if (now - rec.ts > windowMs) { rec.count = 0; rec.ts = now; }
    rec.count += 1; rateMap.set(key, rec);
    const limit = req.nextUrl.pathname.startsWith('/api/ingest/') ? 60 : 180; // 60/min ingest, 180/min api
    if (rec.count > limit) {
      const headers = new Headers({ 'Content-Type': 'application/json', 'Retry-After': '60' });
      return new NextResponse(JSON.stringify({ ok:false, error:'rate_limited' }), { status: 429, headers });
    }
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
