"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TaskCard, { TaskItem } from "./TaskCard";
import { CLAWBOT_API_BASE } from "./config";

function Column({
  title,
  kind,
  children,
}: {
  title: string;
  kind: TaskItem["status"];
  children: React.ReactNode;
}) {
  return (
    <section className="col-span-12 md:col-span-4">
      <div
        data-col={kind}
        className={`rounded-2xl border ${
          kind === "pending"
            ? "border-white/10"
            : kind === "progress"
            ? "border-accent-cyan/30"
            : "border-emerald-400/30"
        } ${
          kind === "pending"
            ? "bg-white/5"
            : kind === "progress"
            ? "bg-accent-cyan/10"
            : "bg-emerald-400/10"
        } backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4`}
        onDragOver={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).classList.add(
            "outline",
            "outline-1",
            "outline-accent-cyan/30"
          );
        }}
        onDragLeave={(e) => {
          (e.currentTarget as HTMLElement).classList.remove(
            "outline",
            "outline-1",
            "outline-accent-cyan/30"
          );
        }}
        onDrop={(e) => {
          (e.currentTarget as HTMLElement).classList.remove(
            "outline",
            "outline-1",
            "outline-accent-cyan/30"
          );
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <div
            className={`text-xs uppercase tracking-wide ${
              kind === "pending"
                ? "text-white/60"
                : kind === "progress"
                ? "text-accent-cyan"
                : "text-emerald-400"
            }`}
          >
            {title}
          </div>
        </div>
        <div data-list={kind} className="space-y-2">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "progress" | "done">(
    "all"
  );
  const [query, setQuery] = useState("");
  const mountedRef = useRef(false);

  const fetchTasks = useCallback(async () => {
    const r = await fetch(`/api/tasks`, {
      cache: "no-store",
    });
    if (!r.ok) throw new Error("tasks fetch failed");
    const j = await r.json();
    const items: TaskItem[] = (j?.tasks ?? []).map((t: any) => ({
      id: String(t.id ?? t.title ?? Math.random().toString(36).slice(2, 8)),
      title: t.title ?? t.text ?? "Task",
      status:
        t.status === "todo"
          ? "pending"
          : t.status === "in_progress"
          ? "progress"
          : t.status ?? "done",
      progress: Number(
        t.progress ??
          (t.status === "done" ? 100 : t.status === "in_progress" ? 50 : 10)
      ),
      created_at: t.created_at,
      updated_at: t.updated_at,
      log_link: t.log_link,
    }));
    setTasks(items);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchTasks().catch(() => {});
    const iv = setInterval(() => fetchTasks().catch(() => {}), 5000);
    return () => {
      mountedRef.current = false;
      clearInterval(iv);
    };
  }, [fetchTasks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (filter === "all" || t.status === filter) &&
        (!q ||
          t.title?.toLowerCase().includes(q) ||
          String(t.id).toLowerCase().includes(q))
    );
  }, [tasks, filter, query]);

  const byCol = useMemo(
    () => ({
      pending: visible.filter((t) => t.status === "pending"),
      progress: visible.filter((t) => t.status === "progress"),
      done: visible.filter((t) => t.status === "done"),
    }),
    [visible]
  );

  const onDropTo = async (target: TaskItem["status"], id: string) => {
    const prev = tasks;
    const next = prev.map((x) =>
      x.id === id
        ? {
            ...x,
            status: target,
            progress: target === "done" ? 100 : x.progress,
          }
        : x
    );
    setTasks(next);
    try {
      await fetch(`/api/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: target }),
      });
    } catch {
      setTasks(prev);
    }
  };

  // wire DnD on lists
  useEffect(() => {
    const lists = document.querySelectorAll(
      "[data-col]"
    ) as NodeListOf<HTMLElement>;
    lists.forEach((col) => {
      const kind = col.getAttribute("data-col") as TaskItem["status"];
      col.ondrop = (e) => {
        e.preventDefault();
        const id = e.dataTransfer?.getData("text/plain");
        if (id) onDropTo(kind, id);
      };
    });
  }, [byCol]);

  const viewLog = (id: string) => {
    const url = `/api/task/${encodeURIComponent(id)}/logs`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Filter tasks"
        >
          {(["all", "pending", "progress", "done"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-md border border-[rgba(255,255,255,0.08)] bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10 ${
                filter === k ? "ring-1 ring-accent-cyan/40" : ""
              }`}
            >
              {k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className="w-full sm:w-64 rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 pl-3 pr-3 py-1.5 text-xs text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-cyan/40"
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <Column title="Pending" kind="pending">
          {byCol.pending.map((t) => (
            <TaskCard key={t.id} task={t} onViewLog={viewLog} />
          ))}
        </Column>
        <Column title="In Progress" kind="progress">
          {byCol.progress.map((t) => (
            <TaskCard key={t.id} task={t} onViewLog={viewLog} />
          ))}
        </Column>
        <Column title="Done" kind="done">
          {byCol.done.map((t) => (
            <TaskCard key={t.id} task={t} onViewLog={viewLog} />
          ))}
        </Column>
      </div>
    </div>
  );
}
