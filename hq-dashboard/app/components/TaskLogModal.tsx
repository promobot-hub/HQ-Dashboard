"use client";
import React, { useEffect, useState } from "react";

export default function TaskLogModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [items, setItems] = useState<Array<{ ts?: string; message?: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let live = true;
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/task/${encodeURIComponent(id)}/logs`, { cache: "no-store" });
        const j = await r.json();
        if (live) setItems(j?.items || j?.logs || []);
      } catch {
        if (live) setItems([]);
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    const iv = setInterval(load, 4000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, [id]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-w-2xl w-[92vw] md:w-[720px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.55)] p-4">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">Logs for Task {id}</div>
          <button onClick={onClose} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10">Close</button>
        </div>
        <div className="mt-3 max-h-[60vh] overflow-auto space-y-2 pr-1">
          {loading && (
            <div className="text-white/60 text-sm">Loading…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="text-white/60 text-sm">No logs for this task.</div>
          )}
          {items.map((x, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90">
              <div className="truncate">{x.message ?? JSON.stringify(x)}</div>
              <div className="text-[11px] text-white/50">{x.ts ? new Date(x.ts).toLocaleString() : ""}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
