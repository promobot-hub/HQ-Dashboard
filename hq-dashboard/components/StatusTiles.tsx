"use client";
import React from 'react';

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function StatusTiles() {
  // Platzhalterwerte – werden später per API ersetzt
  const runsToday = '—';
  const totalRuns = '—';
  const lastRun = 'just now';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Tile label="Runs Today" value={runsToday} />
      <Tile label="Total Runs" value={totalRuns} />
      <Tile label="Last Run" value={lastRun} />
    </section>
  );
}
