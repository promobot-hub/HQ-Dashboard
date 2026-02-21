"use client";
import React from "react";
import { useTasksStore, Task } from "../stores/tasksStore";

interface TaskListProps {
  tasks?: Task[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskList({
  tasks: tasksProp,
  onToggle,
  onDelete,
}: TaskListProps) {
  const storeTasks = useTasksStore((s) => s.tasks);
  const storeToggle = useTasksStore((s) => s.toggleTask);
  const storeDelete = useTasksStore((s) => s.deleteTask);

  const tasks = tasksProp ?? storeTasks;
  const toggleTask = onToggle ?? storeToggle;
  const deleteTask = onDelete ?? storeDelete;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Aufgaben</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              {task.text}
            </label>
            {deleteTask && (
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => deleteTask(task.id)}
              >
                Entfernen
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
