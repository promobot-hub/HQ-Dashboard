import React from "react";

type TaskLike = {
  id: string;
  title?: string;
  text?: string;
  status?: string;
  done?: boolean;
};

interface TaskTimelineProps {
  tasks: TaskLike[];
}

export default function TaskTimeline({ tasks }: TaskTimelineProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Task Timeline</h2>
      <ul className="list-disc list-inside">
        {tasks.map((task) => (
          <li key={task.id}>
            {(task.title || task.text || 'Untitled')} — Status: {task.status ?? (task.done ? 'done' : 'open')}
          </li>
        ))}
      </ul>
    </div>
  );
}
