import { addTask, completeTask } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';

let queue = [];
let runningCount = 0;
const maxWorkers = 3;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function addPriorityTask(title, priority=1) {
  const task = { id: `task-${Date.now()}`, title, priority, status: 'todo' };
  queue.push(task);
  queue.sort((a,b) => a.priority - b.priority);
  processQueue();
  return task;
}

async function processQueue() {
  while(queue.length > 0 && runningCount < maxWorkers) {
    const task = queue.shift();
    runningCount++;
    addTask(task.title);
    sendTelegramMessage(`Task gestartet: ${task.title}`);
    await delay(15000);
    completeTask(task.id);
    sendTelegramMessage(`Task abgeschlossen: ${task.title}`);
    runningCount--;
  }
}