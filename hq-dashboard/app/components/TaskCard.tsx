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
}

export default function TaskCard({
  task,
  onViewLog,
}: {
  task: TaskItem;
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
      onDragStart={(ev) => {
        ev.dataTransfer.setData("text/plain", task.id);
        const g = document.createElement("div");
        g.className = "rounded-lg px-2 py-1 bg-white/10 text-white/80 text-xs";
        g.textContent = task.title;
        document.body.appendChild(g);
        ev.dataTransfer.setDragImage(g, 0, 0);
        setTimeout(() => g.remove(), 0);
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
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
          {task.status === "pending"
            ? "Pending"
            : task.status === "progress"
            ? "In Progress"
            : "Done"}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
        <span>
          {new Date(
            task.updated_at || task.created_at || Date.now()
          ).toLocaleString()}
        </span>
        <button
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] hover:bg-white/10"
          onClick={() => onViewLog?.(task.id)}
        >
          View Log
        </button>
      </div>
    </div>
  );
}
