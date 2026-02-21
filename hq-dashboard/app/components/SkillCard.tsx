"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";

export type Skill = {
  id: string;
  name: string;
  icon?: string; // optional icon key
  level?: number; // 0-100
  mastered?: boolean;
  stats?: Record<string, any>;
  capabilities?: Array<{ key: string; label: string; value?: string | number }>;
};

function Ring({ value, color = "#22d3ee" }: { value: number; color?: string }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
    </svg>
  );
}

export default function SkillCard({ skill, onTrain, onView }: { skill: Skill; onTrain?: (id: string) => void; onView?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const level = Number(skill.level ?? 0);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#22d3ee]/30 to-[#a855f7]/30 blur animate-glow" />
          <div className="relative h-10 w-10 grid place-items-center rounded-xl bg-[#0f0f10] text-white font-extrabold">
            {skill.icon?.slice(0, 2).toUpperCase() || skill.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold truncate">{skill.name}</div>
          <div className="text-[11px] text-white/60">{skill.mastered ? "Mastered" : "Training"}</div>
        </div>
        <Ring value={level} />
      </div>
      {skill.capabilities && skill.capabilities.length > 0 && (
        <button onClick={() => setOpen((v) => !v)} className="mt-3 text-xs text-white/70 underline-offset-4 hover:underline">
          {open ? "Hide" : "Show"} capabilities
        </button>
      )}
      {open && (
        <ul className="mt-2 space-y-1 text-sm">
          {skill.capabilities!.map((c) => (
            <li key={c.key} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-2 py-1">
              <span className="text-white/80">{c.label}</span>
              <span className="text-white/60 text-xs">{c.value ?? "—"}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => onTrain?.(skill.id)} className="rounded-xl bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110">Train Skill</button>
        <button onClick={() => onView?.(skill.id)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">View Activity</button>
      </div>
    </div>
  );
}
