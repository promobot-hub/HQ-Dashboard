import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (best-effort per instance)
const globalAny = global as any;
if (!globalAny.__rate)
  globalAny.__rate = new Map<string, { count: number; ts: number }>();
const store: Map<string, { count: number; ts: number }> = globalAny.__rate;

export function rateLimit(
  req: NextRequest,
  key: string,
  limit: number,
  windowMs: number
) {
  // Next.js 16: NextRequest has no req.ip; derive from headers and remote addr if exposed
  const xf = req.headers.get("x-forwarded-for") || "";
  const ip = (xf.split(",")[0].trim() || "unknown") as string;
  const k = `${ip}:${key}`;
  const now = Date.now();
  const rec = store.get(k) || { count: 0, ts: now };
  if (now - rec.ts > windowMs) {
    rec.count = 0;
    rec.ts = now;
  }
  rec.count += 1;
  store.set(k, rec);
  const allowed = rec.count <= limit;
  const retryAfter = allowed ? 0 : Math.ceil((rec.ts + windowMs - now) / 1000);
  return { allowed, retryAfter };
}
