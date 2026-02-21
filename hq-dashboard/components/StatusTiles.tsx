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
  const [data, setData] = React.useState<{ runsToday?: number; totalRuns?: number; lastRun?: string } | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch('/api/status', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => { if (alive) setData(j); })
      .catch(e => { if (alive) setErr(String(e)); });
    return () => { alive = false; };
  }, []);

  const runsToday = data?.runsToday ?? '—';
  const totalRuns = data?.totalRuns ?? '—';
  const lastRun = data?.lastRun ?? '—';

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Tile label="Runs Today" value={runsToday} />
      <Tile label="Total Runs" value={totalRuns} />
      <Tile label="Last Run" value={lastRun} />
      {err && <div className="text-sm text-red-600 col-span-full">Status error: {err}</div>}
    </section>
  );
}
