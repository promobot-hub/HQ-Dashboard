"use client";
import React, { useEffect, useState } from "react";

export default function Checks() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/checks`, { cache: "no-store" });
      const j = await r.json();
      setData(j);
    } catch (e) {
      setData({ ok: false, results: [], error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold">System Checks</h2>
        <button
          onClick={load}
          className="text-xs rounded-md border border-white/10 bg-white/10 px-2 py-1 text-white/80 hover:bg-white/20"
        >
          {loading ? "Checking…" : "Re-Run Checks"}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {data?.results?.map((r: any) => (
          <div
            key={r.key}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div className="text-white/80 text-sm truncate">{r.key}</div>
            <div
              className={`text-xs rounded-md px-2 py-0.5 ${
                r.ok
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {r.ok ? "✓" : "✗"}
            </div>
          </div>
        ))}
      </div>
      {data?.results?.some((r: any) => !r.ok) && (
        <div className="mt-3 space-y-2">
          {data.results
            .filter((r: any) => !r.ok)
            .map((r: any) => (
              <div
                key={r.key}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200"
              >
                <div className="font-semibold">{r.key}</div>
                <div>
                  Status {r.status} • {r.durationMs}ms
                </div>
                {r.error && <div className="truncate">{r.error}</div>}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
