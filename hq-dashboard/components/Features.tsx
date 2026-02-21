"use client";
import React from 'react';
import { FiZap, FiTrendingUp, FiShield } from 'react-icons/fi';

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2"><Icon className="text-indigo-600" /> <h3 className="font-semibold">{title}</h3></div>
      <p className="text-sm opacity-80">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Feature icon={FiZap} title="Auto-Heartbeat" desc="Stabile 10‑Minuten Cadence: State, Logs, Badges, Ledger – automatisch synchron." />
      <Feature icon={FiTrendingUp} title="AutoImproveBot" desc="Alle 5 Minuten Analyse + Report. Kontinuierliche, kleine Verbesserungen 24/7." />
      <Feature icon={FiShield} title="Sichere Deploys" desc="Deterministische Builds (yarn.lock), Actions/Worker/Daemon für Liveness." />
    </section>
  );
}
