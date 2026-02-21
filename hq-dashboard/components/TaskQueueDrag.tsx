"use client";

import React, { useState, useRef } from "react";
import TaskItem from "./TaskItem";

export default function TaskQueueDrag() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Task that can be dragged", done: false },
    { id: 2, text: "Another draggable task", done: true },
    { id: 3, text: "Yet another task", done: false },
  ]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const items = [...tasks];
    const draggedItemContent = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;

    setTasks(items);
  };

  return (
    <div className="max-w-md bg-gray-700 p-4 rounded text-white">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          className="mb-2"
        >
          <TaskItem text={task.text} done={task.done} onToggle={() => {}} />
        </div>
      ))}
    </div>
  );
}
