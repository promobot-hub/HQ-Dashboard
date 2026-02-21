import { getAllTasks } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';

let lastCheckTime = Date.now();

export function runHealthCheck() {
  const now = Date.now();
  const tasks = getAllTasks();
  const unfinished = tasks.filter(t => t.status !== 'done').length;

  if (now - lastCheckTime > 5 * 60000) { // 5 Minuten Interval
    sendTelegramMessage(`Healthcheck: ${unfinished} Tasks offen.`);
    lastCheckTime = now;
  }

  if (unfinished > 10) {
    sendTelegramMessage(`Achtung: Zu viele offene Tasks (${unfinished}). Prüfe System.`);
  }

  // Hier Auto-Heilung einfügen
}

setInterval(runHealthCheck, 60000);

console.log('HealthCheck Modul gestartet.');
