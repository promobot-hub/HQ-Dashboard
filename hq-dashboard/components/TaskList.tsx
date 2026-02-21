import React, { useEffect, useState } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - <em>{task.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
