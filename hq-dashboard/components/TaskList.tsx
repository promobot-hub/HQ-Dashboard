import React from 'react';
import { useTasksStore } from '../stores/tasksStore';

export default function TaskList() {
  const tasks = useTasksStore(state => state.tasks);
  const toggleTask = useTasksStore(state => state.toggleTask);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Aufgaben</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              {task.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
