import { addTask, getAllTasks, completeTask } from './persistentTaskEngine.js';
import { getCurrentBabyStep } from './babySteps.js';
import { sendTelegramMessage } from './telegramQueue.js';
import { autoGenerateNextBabyStep } from './babyStepGenerator.js';

export function startStablePoller() {
  setInterval(() => {
    const babyStep = getCurrentBabyStep();
    const newTask = addTask(`Baby Step: ${babyStep}`);
    sendTelegramMessage(`Neuer Task hinzugefügt: ${newTask.title}`);
    setTimeout(() => {
      completeTask(newTask.id);
      sendTelegramMessage(`Task abgeschlossen: ${newTask.title}`);
      autoGenerateNextBabyStep();
    }, 30000);
  }, 60000);
  console.log('Stabiler Poller mit automatischer Baby-Step-Generierung gestartet.');
}
