import { getTasks } from './api/taskManager';
import { sendTelegramMessage } from './api/telegramNotify';

export function monitorProgress() {
  const tasks = getTasks();
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPercent = (completedTasks / totalTasks) * 100;

  if (progressPercent < 50) {
    sendTelegramMessage(`🚨 Fortschritt zu niedrig: nur ${progressPercent.toFixed(2)}% der Aufgaben abgeschlossen.`);
  }
  return progressPercent;
}
