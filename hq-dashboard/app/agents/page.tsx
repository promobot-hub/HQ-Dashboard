"use client";
import React, { useEffect, useState } from "react";

type Sessions = {
  sessions?: number;
  agents?: number;
  concurrent?: number;
  longestSec?: number;
  lastUpdated?: string;
};

type Agent = {
  id: string;
  name?: string;
  status?: string;
  paused?: boolean;
  lastActiveAt?: string;
  activity?: Array<string>;
};

export default function AgentsPage() {
  const [data, setData] = useState<Sessions | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const [sr, ar] = await Promise.all([
          fetch(`/api/sessions`, { cache: "no-store" }),
          fetch(`/api/agents`, { cache: "no-store" }),
        ]);
        const sj = await sr.json();
        const aj = await ar.json();
        if (live) {
          setData(sj || {});
          setAgents(aj?.agents || []);
        }
      } catch {}
    };
    load();
    const iv = setInterval(load, 5000);
    return () => {
      live = false;
      clearInterval(iv);
    };
  }, []);

  const Card = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-white/5 p-4 backdrop-blur-md">
      <div className="text-xs uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div className="mt-1 text-white text-lg font-extrabold">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            Agents Monitor
          </h1>
          <span className="rounded-md bg-white/10 text-white/60 px-2 py-0.5 text-[10px]">
            {data?.lastUpdated
              ? new Date(data.lastUpdated).toLocaleTimeString()
              : "—"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <Card label="Sessions" value={data?.sessions ?? "—"} />
          <Card label="Agents" value={data?.agents ?? "—"} />
          <Card label="Concurrent" value={data?.concurrent ?? "—"} />
          <Card label="Longest" value={(data?.longestSec ?? 0) + "s"} />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.length === 0 && (
            <div className="text-white/60 text-sm">No agents.</div>
          )}
          {agents.map((a) => (
            <div key={a.id}>
              {(() => {
                const AC = require("../components/AgentCard").default;
                return (
                  <AC
                    agent={a}
                    onToggle={async (id: string, paused: boolean) => {
                      await fetch("/api/agents", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, paused }),
                      });
                      const r = await fetch("/api/agents", {
                        cache: "no-store",
                      });
                      const j = await r.json();
                      setAgents(j?.agents || []);
                    }}
                  />
                );
              })()}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
