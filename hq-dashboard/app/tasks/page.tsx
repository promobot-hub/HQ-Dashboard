"use client";
import React from "react";
import KanbanBoard from "../components/KanbanBoard";

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-white text-2xl font-extrabold tracking-tight">Tasks</h1>
      <KanbanBoard />
    </div>
  );
}
