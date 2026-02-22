import { NextResponse } from "next/server";

const PRIMARY_REPO = process.env.GH_REPO || "";
const FALLBACK_REPO = "promobot-hub/HQ-Dashboard";
const BASES = [PRIMARY_REPO, FALLBACK_REPO]
  .filter(Boolean)
  .map((r) => `https://raw.githubusercontent.com/${r}/main/`);

export async function fetchRaw(path: string) {
  const bust = Date.now();
  const tried: string[] = [];
  for (const base of BASES) {
    const url = `${base}${path}?t=${bust}`;
    tried.push(url);
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) return { ok: true, url, text: await r.text() };
    } catch {}
  }
  return { ok: false, tried };
}

export async function jsonFromRaw(path: string) {
  const r = await fetchRaw(path);
  if (!r.ok) return { ok: false, data: null, meta: r };
  try {
    return { ok: true, data: JSON.parse(r.text || "{}"), meta: r };
  } catch {
    return { ok: true, data: r.text, meta: r };
  }
}
