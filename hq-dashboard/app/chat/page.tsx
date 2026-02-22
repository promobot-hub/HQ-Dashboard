"use client";
import React, { useEffect, useRef, useState } from "react";

type Msg = { ts?: string; role?: string; message?: string };

export default function ChatPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      const r = await fetch(`/api/chat/history?limit=200`, { cache: "no-store" });
      const j = await r.json();
      setItems(j?.items || []);
    } catch {}
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const el = listRef.current; if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [items]);

  const send = async () => {
    const m = text.trim(); if (!m) return;
    setSending(true);
    try {
      const r = await fetch(`/api/chat/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: m }) });
      const j = await r.json();
      if (j?.ok) { setText(""); setTimeout(load, 700); }
    } catch {}
    finally { setSending(false); }
  };

  const Bubble = ({ it }: { it: Msg }) => (
    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${it.role==='user'? 'ml-auto bg-cyan-500/20 text-cyan-100 border border-cyan-400/20':'mr-auto bg-white/5 text-white/90 border border-white/10'}`}>
      <div className="text-sm whitespace-pre-wrap break-words">{it.message || JSON.stringify(it)}</div>
      <div className="mt-1 text-[10px] text-white/50">{it.role || 'system'} • {it.ts ? new Date(it.ts).toLocaleTimeString() : ''}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Chat</h1>
        </div>
        <div ref={listRef} className="mt-4 max-h-[60vh] overflow-auto space-y-2 pr-1">
          {items.length===0 && <div className="text-white/60 text-sm">Noch keine Nachrichten.</div>}
          {items.map((it, idx) => <Bubble key={idx} it={it} />)}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={2} placeholder="Nachricht an PromoteBot schreiben…" className="flex-1 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 px-3 py-2 text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-cyan/40" />
          <button onClick={send} disabled={sending || !text.trim()} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-accent-cyan/20 text-cyan-100 hover:bg-accent-cyan/30 px-4 py-2 text-sm disabled:opacity-50">{sending? 'Senden…':'Senden'}</button>
        </div>
        <div className="mt-2 text-[11px] text-white/50">Hinweis: Chat ist GitHub‑gesichert (data/chat/history.ndjson). Antworten erscheinen, sobald der Bot den Eingang verarbeitet.</div>
      </section>
    </div>
  );
}
