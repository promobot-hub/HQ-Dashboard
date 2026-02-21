import { addTask, getAllTasks, completeTask } from './persistentTaskEngine.js';
import { getCurrentBabyStep, nextBabyStep } from './babySteps.js';
import { sendTelegramMessage } from './telegramQueue.js';

export function startStablePoller() {
  setInterval(() => {
    const babyStep = getCurrentBabyStep();
    const newTask = addTask(`Baby Step: ${babyStep}`);
    sendTelegramMessage(`Neuer Task hinzugefügt: ${newTask.title}`);
    setTimeout(() => {
      completeTask(newTask.id);
      sendTelegramMessage(`Task abgeschlossen: ${newTask.title}`);
      if (nextBabyStep()) {
        sendTelegramMessage(`Wechsle zu nächstem Baby Step: ${getCurrentBabyStep()}`);
      } else {
        sendTelegramMessage('Alle Baby Steps abgeschlossen.');
      }
    }, 30000);
  }, 60000);
  console.log('Stabiler Poller mit Telegram Queue ist gestartet.');
}
