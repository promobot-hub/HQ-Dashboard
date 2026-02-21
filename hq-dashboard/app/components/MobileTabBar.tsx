"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/skills", label: "Skills" },
  { href: "/analytics", label: "Analytics" },
  { href: "/health", label: "Health" },
];

export default function MobileTabBar() {
  const p = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div className="mx-auto max-w-[2000px] px-3 pb-3">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <ul className="grid grid-cols-5 text-xs text-white/70">
            {tabs.map((t) => {
              const active = p === t.href;
              return (
                <li key={t.href} className="relative">
                  {active && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a855f7]" />
                  )}
                  <Link href={t.href} className={`flex items-center justify-center py-3 ${active ? "text-white" : "text-white/70"}`}>
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
