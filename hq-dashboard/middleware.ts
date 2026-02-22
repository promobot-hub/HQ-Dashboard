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
    // rudimentary rate limit: 60 req/min per ip (best-effort; in-memory)
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const rec = rateMap.get(ip as string) || { count: 0, ts: now };
    if (now - rec.ts > 60*1000) { rec.count = 0; rec.ts = now; }
    rec.count += 1; rateMap.set(ip as string, rec);
    if (rec.count > 120) {
      return new NextResponse(JSON.stringify({ ok:false, error:'rate_limited' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
