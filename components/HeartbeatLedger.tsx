"use client";
import React from 'react';
import Card from './Card';

type PendingItem = { id: string; title: string; priority?: string; source?: string };

type Ledger = {
  lastRunUTC?: string;
  runsToday?: number;
  totalRuns?: number;
  completed?: { timeUTC: string; type?: string; summary?: string }[];
  pending?: PendingItem[];
};

const Pill = ({ children, color='gray' }: { children: React.ReactNode, color?: 'green'|'blue'|'yellow'|'red'|'gray' }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs bg-${color}-600/20 text-${color}-400 border border-${color}-600/30`}>{children}</span>
);

function prioColor(p?: string): any {
  switch(p){
    case 'P0': return 'red';
    case 'P1': return 'yellow';
    case 'P2': return 'blue';
    default: return 'gray';
  }
}

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

  if (error) return <Card title="Heartbeat Ledger"><div>Ledger error: {error}</div></Card>;
  if (!data) return <Card title="Heartbeat Ledger"><div>Loading ledger…</div></Card>;

  const completed = data.completed?.slice(0, 5) || [];
  const pending = data.pending?.slice(0, 8) || [];

  return (
    <Card title="Heartbeat Ledger">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Pill color="green">Last Run: {data.lastRunUTC || '—'}</Pill>
          <Pill color="blue">Runs Today: {data.runsToday ?? 0}</Pill>
          <Pill color="yellow">Total: {data.totalRuns ?? 0}</Pill>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Next up</h4>
            <ul className="space-y-1">
              {pending.map((p) => (
                <li key={p.id} className="flex items-start gap-2">
                  <Pill color={prioColor(p.priority)}>{p.priority || 'N'}</Pill>
                  <span>{p.title}</span>
                </li>
              ))}
              {pending.length === 0 && <li className="opacity-70">Nothing pending</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Recently completed</h4>
            <ul className="space-y-1">
              {completed.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Pill color="green">{c.timeUTC}</Pill>
                  <span>{c.summary || c.type || 'heartbeat'}</span>
                </li>
              ))}
              {completed.length === 0 && <li className="opacity-70">No recent items</li>}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
