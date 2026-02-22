"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DebugBar = dynamic(() => import("./DebugBar"), { ssr: false });

function isDebugEnabled() {
  if (typeof window === "undefined") return false;
  const sp = new URLSearchParams(window.location.search);
  if (sp.has("debug")) {
    const v = sp.get("debug");
    localStorage.setItem("hq.debug", v === "1" ? "1" : "0");
  }
  return localStorage.getItem("hq.debug") === "1";
}

export default function DebugMount() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const enabled = isDebugEnabled();
    setOn(enabled);
    if (!enabled) return;

    const orig = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const t0 = performance.now();
      let status = 0,
        ok = false,
        error: string | undefined;
      try {
        const resp = await orig(input as any, init as any);
        status = (resp as any).status;
        ok = (resp as any).ok;
        return resp as any;
      } catch (e: any) {
        error = String(e?.message || e);
        throw e;
      } finally {
        const ev = {
          ts: new Date().toISOString(),
          kind: "fetch",
          url: String(input),
          status,
          ok,
          durationMs: Math.round(performance.now() - t0),
          error,
        };
        try {
          window.dispatchEvent(new CustomEvent("hq:debug", { detail: ev }));
        } catch {}
        try {
          fetch("/api/debug/collect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ev),
          });
        } catch {}
      }
    };

    return () => {
      window.fetch = orig;
    };
  }, []);

  if (!on) return null;
  return <DebugBar />;
}
