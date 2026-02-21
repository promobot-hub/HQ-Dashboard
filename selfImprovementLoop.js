import { getTasks, updateTaskStatus } from './api/taskManager';

export function selfImprovementLoop() {
  const tasks = getTasks();
  // Simple logic: move first todo task to in-progress
  const nextTask = tasks.find(t => t.status === 'todo');
  if (nextTask) {
    updateTaskStatus(nextTask.id, 'in-progress');
    return `Task ${nextTask.id} (${nextTask.title}) set to in-progress.`;
  }
  return 'No todo tasks to start.';
}
