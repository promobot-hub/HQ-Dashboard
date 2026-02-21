import { getCurrentBabyStep, completeCurrentBabyStep } from './autoSelfImprovement';

let tasks = [];

export function generateNewTask() {
  const babyStep = getCurrentBabyStep();
  const newTask = {
    id: `auto-task-${tasks.length + 1}`,
    title: `Baby Step Task: ${babyStep}`,
    status: 'todo'
  };
  tasks.push(newTask);
  return newTask;
}

export function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = 'done';
    if (completeCurrentBabyStep()) {
      return 'Baby Step abgeschlossen, nächster Schritt aktiviert.';
    }
    return 'Alle Baby Steps abgeschlossen.';
  }
  return 'Task nicht gefunden.';
}

export function getTasks() {
  return tasks;
}
