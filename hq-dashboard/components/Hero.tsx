"use client";
import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="rounded-lg p-6 mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-2">PromoteBot HQ-Dashboard</h1>
      <p className="opacity-90 mb-4">Live-Status, Tasks und kontinuierliche Auto-Verbesserung – in einem Blick.</p>
      <div className="flex gap-3 flex-wrap">
        <Link href="/" className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition">Dashboard</Link>
        <a href="https://github.com/promobot-hub/HQ-Dashboard" target="_blank" rel="noreferrer" className="border border-white/60 px-4 py-2 rounded hover:bg-white/10 transition">GitHub Repo</a>
        <a href="https://hq-dashboard-z74i.onrender.com" target="_blank" rel="noreferrer" className="border border-white/60 px-4 py-2 rounded hover:bg-white/10 transition">Live</a>
      </div>
    </section>
  );
}
