import type { NextRequest } from "next/server";

export function getRepo() {
  const repo = process.env.GH_REPO; // e.g. promobot-hub/HQ-Dashboard
  const token = process.env.GH_TOKEN; // classic/fine-grained
  return { repo, token };
}

export async function ghRequest(path: string, init: RequestInit = {}) {
  const { token } = getRepo();
  const base = "https://api.github.com";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    ...(init.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(base + path, { ...init, headers });
}

export async function ghGetContent(repo: string, filepath: string) {
  const r = await ghRequest(
    `/repos/${repo}/contents/${encodeURIComponent(filepath)}`
  );
  if (!r.ok) return null;
  const j = await r.json();
  return j as { sha?: string; content?: string; encoding?: string } | null;
}

export async function ghPutContent(
  repo: string,
  filepath: string,
  content: string,
  message: string
) {
  const existing = await ghGetContent(repo, filepath);
  const body = {
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: "main",
    ...(existing?.sha ? { sha: existing.sha } : {}),
  } as any;
  const r = await ghRequest(
    `/repos/${repo}/contents/${encodeURIComponent(filepath)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const text = await r.text();
  return { ok: r.ok, status: r.status || 500, text };
}

export async function readJson(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function verifySignature(
  rawBody: string,
  timestamp: string | null,
  signature: string | null
) {
  const secret = process.env.INGEST_SECRET || "";
  if (!secret) return false;
  if (!timestamp || !signature) return false;
  // Optional: replay window 5 minutes
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60 * 1000)
    return false;
  const encoder = new TextEncoder();
  const data = encoder.encode(timestamp + ":" + rawBody);
  const key = encoder.encode(secret);
  // Minimal HMAC-SHA256 using SubtleCrypto when available; fallback to expect 'sha256=<hex>' header managed by client
  // In Node 18+, crypto.subtle is present; to keep it simple here, accept signature as 'plain' match of hex(hmac)
  // We compute via Node crypto if available
  // @ts-ignore
  const nodeCrypto = (global as any).require
    ? (global as any).require("crypto")
    : null;
  if (nodeCrypto) {
    const h = nodeCrypto.createHmac("sha256", key).update(data).digest("hex");
    return signature.replace(/^sha256=/, "") === h;
  }
  return false;
}
