import React, { useEffect, useState } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const toggleStatus = (id, currentStatus) => {
    let newStatus = 'todo';
    if (currentStatus === 'todo') newStatus = 'in-progress';
    else if (currentStatus === 'in-progress') newStatus = 'done';

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    }).then(() => {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      ));
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - <em>{task.status}</em>{' '}
            <button onClick={() => toggleStatus(task.id, task.status)} className="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded">
              Next Status
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
