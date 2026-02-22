"use client";
import React, { useRef } from "react";

export interface TaskItem {
  id: string;
  title: string;
  status: "pending" | "progress" | "done";
  progress?: number;
  created_at?: string;
  updated_at?: string;
  log_link?: string;
  url?: string;
  labels?: string[];
  priority?: 'low'|'medium'|'high';
}

export default function TaskCard({
  task,
  onViewLog,
}: {
  task: TaskItem & { url?: string; labels?: string[] };
  onViewLog?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pct = Math.max(
    0,
    Math.min(
      100,
      Number(
        task.progress ??
          (task.status === "done" ? 100 : task.status === "progress" ? 50 : 10)
      )
    )
  );
  const pulse = task.status === "progress" ? " ring-1 ring-accent-cyan/30" : "";
  const doneGlow = task.status === "done" ? " ring-1 ring-emerald-400/30" : "";
  return (
    <div
      ref={ref}
      draggable
      data-task-id={task.id}
      onDragStart={(ev) => {
        ev.dataTransfer.setData("text/plain", task.id);
        const g = document.createElement("div");
        g.className = "rounded-lg px-2 py-1 bg-white/10 text-white/80 text-xs";
        g.textContent = task.title;
        document.body.appendChild(g);
        ev.dataTransfer.setDragImage(g, 0, 0);
        setTimeout(() => g.remove(), 0);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewLog?.(task.id);
        }
      }}
      className={`rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/90 hover:bg-white/10 transition-all duration-200 translate-y-0 opacity-100${pulse}${doneGlow}`}
      role="button"
      tabIndex={0}
      aria-label={`Task ${task.id}: ${task.title} (${task.status})`}
      onDoubleClick={() => onViewLog?.(task.id)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold truncate">
          {task.id} — {task.title}
        </div>
        <div className="flex items-center gap-1">
          {task.priority && (
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${
              task.priority==='high' ? 'bg-red-500/20 text-red-300' : task.priority==='medium' ? 'bg-amber-400/20 text-amber-200' : 'bg-emerald-400/20 text-emerald-200'
            }`}>{task.priority.toUpperCase()}</span>
          )}
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
            {task.status === "pending"
              ? "Pending"
              : task.status === "progress"
              ? "In Progress"
              : "Done"}
          </span>
        </div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet"
          style={{ width: `${pct}%` }}
        />
      </div>
      {task.labels && task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 5).map((l) => (
            <span
              key={l}
              className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70"
            >
              {l}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
        <span>
          {new Date(
            task.updated_at || task.created_at || Date.now()
          ).toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          {task.url && (
            <a
              href={task.url}
              target="_blank"
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] hover:bg-white/10"
            >
              Open
            </a>
          )}
          <button
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] hover:bg-white/10"
            onClick={() => onViewLog?.(task.id)}
          >
            View Log
          </button>
        </div>
      </div>
    </div>
  );
}
