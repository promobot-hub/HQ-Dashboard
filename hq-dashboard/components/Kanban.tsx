"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TItem {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  owner?: string;
}

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4 min-h-[240px]">
      <div className="mb-2 text-xs uppercase tracking-wide text-white/60">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Card({ item }: { item: TItem }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition-soft">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium">{item.title}</div>
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
          {item.owner ?? "bot"}
        </span>
      </div>
    </div>
  );
}

export default function Kanban() {
  const [items, setItems] = useState<TItem[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/tasks", { cache: "no-store" });
        const j = await r.json();
        setItems(j.tasks ?? []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  const cols = useMemo(
    () => ({
      todo: items.filter((i) => i.status === "todo"),
      in_progress: items.filter((i) => i.status === "in_progress"),
      done: items.filter((i) => i.status === "done"),
    }),
    [items]
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const aid = String(active.id);
    const overCol = (over.data?.current as any)?.col as string | undefined;
    if (overCol) {
      setItems((prev) =>
        prev.map((x) => (x.id === aid ? { ...x, status: overCol as any } : x))
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-12 gap-4">
        {(["todo", "in_progress", "done"] as const).map((key) => (
          <div key={key} className="col-span-12 md:col-span-4">
            <div className="" data-col={key}>
              <Column
                title={
                  key === "todo"
                    ? "To Do"
                    : key === "in_progress"
                    ? "In Progress"
                    : "Done"
                }
              >
                <SortableContext
                  items={cols[key]}
                  strategy={verticalListSortingStrategy}
                >
                  {cols[key].map((it) => (
                    <div
                      key={it.id}
                      id={it.id}
                      className="cursor-grab active:cursor-grabbing"
                      data-col={key}
                    >
                      <Card item={it} />
                    </div>
                  ))}
                </SortableContext>
              </Column>
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
