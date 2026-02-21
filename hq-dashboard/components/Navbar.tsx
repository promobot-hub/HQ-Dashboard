"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const p = usePathname();
  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8">
        <div className="mt-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#22d3ee]/30 via-transparent to-[#a855f7]/30 blur-lg" />
          </div>
          <div className="flex h-16 items-center justify-between px-3 sm:px-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#a855f7] blur animate-glow" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f0f10] text-white shadow-[0_0_0_2px_rgba(34,211,238,0.2),0_0_40px_rgba(168,85,247,0.25)] text-xs font-extrabold">
                  CB
                </div>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-white font-extrabold tracking-tight">
                  Clawbot
                </span>
                <span className="text-[10px] text-white/60 -mt-0.5">
                  HQ Dashboard
                </span>
              </div>
            </div>
            <nav
              className="hidden md:flex items-center gap-2"
              aria-label="Primary"
            >
              {[
                { href: "/", label: "Overview" },
                { href: "/tasks", label: "Tasks" },
                { href: "/skills", label: "Skills" },
                { href: "/analytics", label: "Runs" },
                { href: "/health", label: "Health" },
              ].map((t) => {
                const active = p === t.href;
                return (
                  <Link
                    key={t.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-xs hover:bg-white/10 ${
                      active
                        ? "bg-white/10 text-white ring-1 ring-accent-cyan/40"
                        : "bg-white/5 text-white/80"
                    }`}
                    href={t.href}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
            <div id="heartbeat-slot" className="hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
