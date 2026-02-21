"use client";

import React from 'react';
import { Task } from '../stores/tasksStore';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center justify-between p-2 rounded shadow-sm transition-colors duration-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${task.done ? 'line-through text-gray-500' : ''}`}
        >
          <span onClick={() => onToggle(task.id)} className="flex-1">
            {task.text}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Löschen
          </button>
        </li>
      ))}
    </ul>
  );
}
