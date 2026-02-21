"use client";

import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskEditForm from './TaskEditForm';
import Button from './Button';
import { useTasksStore } from '../stores/tasksStore';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<'all' | 'done' | 'open'>('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'done') return task.done;
    if (filter === 'open') return !task.done;
    return true;
  });

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setFilter('all')}
        >
          Alle
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setFilter('open')}
        >
          Offen
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setFilter('done')}
        >
          Erledigt
        </button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className="mb-4">
    const tasksStore = useTasksStore();

  const tasksStore = useTasksStore();

  const tasksStore = useTasksStore();

          <TaskEditForm
              taskText={task.text}
              onSave={(newText) => {
                // TODO: Echten State-Update implementieren
                // tasksStore.toggleTask(task.id); // Beispiel für State-Update über Store
                console.log("Saved:", newText); // Optional: Feedback
              }}
            >
              <TaskItem text={task.text} done={task.done} onToggle={() => {}} />
            </TaskEditForm>
            <Button
              variant="secondary"
              className="mt-1"
              onClick={() => {
                // Delete Funktion hier einbauen
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
