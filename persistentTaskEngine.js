import fs from 'fs';

const TASK_FILE = 'tasks.json';

let tasks = [];

function loadTasks() {
  try {
    const data = fs.readFileSync(TASK_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}

export function addTask(title) {
  const task = { id: `task-${Date.now()}`, title, status: 'todo' };
  tasks.push(task);
  saveTasks();
  return task;
}

export function completeTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index >= 0) {
    tasks[index].status = 'done';
    saveTasks();
    return true;
  }
  return false;
}

export function getAllTasks() {
  return tasks;
}

loadTasks();
