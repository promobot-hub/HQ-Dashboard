import React from "react";

export default function TaskTimeline({ tasks }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Task Timeline</h2>
      <ul className="list-disc list-inside">
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - Status: {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
