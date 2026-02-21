"use client";
import React, { useEffect, useMemo, useState } from "react";
import SkillCard, { Skill } from "../components/SkillCard";

function LevelRing({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center h-28 w-28">
      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#22d3ee]/30 to-[#a855f7]/30 blur animate-glow" />
      <svg width="112" height="112" viewBox="0 0 112 112" className="relative">
        <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
        {(() => {
          const r = 46;
          const c = 2 * Math.PI * r;
          const dash = (pct / 100) * c;
          return (
            <circle cx="56" cy="56" r={r} stroke="#22d3ee" strokeWidth="8" fill="none" strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round" transform="rotate(-90 56 56)" />
          );
        })()}
      </svg>
      <div className="absolute text-white text-xl font-extrabold">{pct}%</div>
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/skills`, { cache: "no-store" });
        const j = await r.json();
        if (!live) return;
        const list: Skill[] = Array.isArray(j?.skills) ? j.skills : (j?.items || []);
        setSkills(list);
        const agg = Number(j?.level ?? (Array.isArray(list) && list.length ? Math.round(list.reduce((s, x) => s + (Number(x.level || 0)), 0) / list.length) : 0));
        setLevel(agg);
        setLoading(false);
      } catch {
        if (live) setLoading(false);
      }
    };
    load();
    const iv = setInterval(load, 8000);
    return () => { live = false; clearInterval(iv); };
  }, []);

  const onTrain = async (id: string) => {
    try {
      await fetch(`/api/skills/train`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    } catch {}
  };

  const onView = (id: string) => {
    window.open(`/api/logs?limit=50&skillId=${encodeURIComponent(id)}`, "_blank");
  };

  const grid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((s) => (
        <SkillCard key={s.id} skill={s} onTrain={onTrain} onView={onView} />
      ))}
    </div>
  ), [skills]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">Skills Hub</h1>
            <p className="text-white/70 mt-1">Clawbot Intelligence Level & training capabilities</p>
          </div>
          <LevelRing value={level} />
        </div>
      </section>

      {loading ? (
        <div className="text-white/60 text-sm">Loading skills…</div>
      ) : (
        grid
      )}
    </div>
  );
}
