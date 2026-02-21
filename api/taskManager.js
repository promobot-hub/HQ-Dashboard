let tasks = [
  { id: 'task-001', title: 'Setup basic HQ-Dashboard UI', status: 'done' },
  { id: 'task-002', title: 'Implement task manager API', status: 'todo' },
  { id: 'task-003', title: 'Create self-improvement loop logic', status: 'todo' },
  { id: 'task-004', title: 'Add git commit and push automation', status: 'todo' },
  { id: 'task-005', title: 'Integrate Telegram notifications', status: 'todo' },
];

export function getTasks() {
  return tasks;
}

export function updateTaskStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    return true;
  }
  return false;
}
