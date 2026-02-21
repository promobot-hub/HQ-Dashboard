"use client";
import React from 'react';

type PendingItem = { id: string; title: string; priority?: string; source?: string };

type Ledger = {
  lastRunUTC?: string;
  runsToday?: number;
  totalRuns?: number;
  completed?: { timeUTC: string; type?: string; summary?: string }[];
  pending?: PendingItem[];
};

export default function HeartbeatLedger() {
  const [data, setData] = React.useState<Ledger | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch('/api/ledger')
      .then(r => r.json())
      .then(j => { if (alive) setData(j); })
      .catch(e => { if (alive) setError(String(e)); });
    return () => { alive = false; };
  }, []);

  if (error) return <div className="p-4 border rounded">Ledger error: {error}</div>;
  if (!data) return <div className="p-4 border rounded">Loading ledger…</div>;

  const completed = data.completed?.slice(0, 5) || [];
  const pending = data.pending?.slice(0, 8) || [];

  return (
    <div className="p-4 border rounded space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Heartbeat Ledger</h3>
        <div className="text-sm text-gray-500">Last Run: {data.lastRunUTC || '—'}</div>
      </div>
      <div className="text-sm">Runs Today: {data.runsToday ?? 0} · Total: {data.totalRuns ?? 0}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Next up</h4>
          <ul className="list-disc ml-5 space-y-1">
            {pending.map((p) => (
              <li key={p.id}><span className="text-xs uppercase mr-1 opacity-70">{p.priority || 'N'}</span>{p.title}</li>
            ))}
            {pending.length === 0 && <li>Nothing pending</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Recently completed</h4>
          <ul className="list-disc ml-5 space-y-1">
            {completed.map((c, i) => (
              <li key={i}><span className="text-xs opacity-70 mr-1">{c.timeUTC}</span>{c.summary || c.type || 'heartbeat'}</li>
            ))}
            {completed.length === 0 && <li>No recent items</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
