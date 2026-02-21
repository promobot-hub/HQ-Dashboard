import { getAllTasks, addTask } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';

let lastFailedTasks = new Set();

export function detectAndRecoverFailures() {
  const tasks = getAllTasks();
  const failedTasks = tasks.filter(t => t.status === 'failed');

  if (failedTasks.length > 0) {
    failedTasks.forEach(t => {
      if (!lastFailedTasks.has(t.id)) {
        sendTelegramMessage(`Fehler erkannt bei Task ${t.id}, versuche Neuvergabe.`);
        addTask(`Neuvergabe: ${t.title}`);
        lastFailedTasks.add(t.id);
      }
    });
  } else {
    lastFailedTasks.clear();
  }
}
