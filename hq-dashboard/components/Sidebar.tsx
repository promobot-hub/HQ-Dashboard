"use client";
import React from "react";
import Link from "next/link";
export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 min-h-screen p-4">
      <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4">
        <div className="mb-3 text-xs uppercase tracking-wide text-white/60">
          Navigation
        </div>
        <nav className="flex flex-col gap-2" aria-label="Sidebar">
          <Link
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:border-[rgba(255,255,255,0.08)]"
            href="/"
          >
            Overview
          </Link>
          <Link
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:border-[rgba(255,255,255,0.08)]"
            href="/tasks"
          >
            Tasks
          </Link>
          <Link
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:border-[rgba(255,255,255,0.08)]"
            href="/skills"
          >
            Skills
          </Link>
          <Link
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:border-[rgba(255,255,255,0.08)]"
            href="/analytics"
          >
            Runs
          </Link>
          <Link
            className="rounded-xl border border-transparent px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:border-[rgba(255,255,255,0.08)]"
            href="/logs"
          >
            Logs
          </Link>
        </nav>
      </div>
    </aside>
  );
}
