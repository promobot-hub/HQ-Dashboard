let tasks = [];

export function addTask(title) {
  const task = { id: `task-${tasks.length + 1}`, title, status: 'todo' };
  tasks.push(task);
  return task;
}

export function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = 'done';
    return true;
  }
  return false;
}

export function getAllTasks() {
  return tasks;
}
