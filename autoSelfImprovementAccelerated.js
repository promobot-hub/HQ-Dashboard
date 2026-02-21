import { addTask, completeTask } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';
import { nextBabyStep, getCurrentBabyStep } from './babySteps.js';
import { autoGenerateNextBabyStep } from './babyStepGenerator.js';
import { analyzeAndCreateTasks } from './autoLearningModule.js';
import { detectAndRecoverFailures } from './errorRecovery.js';

export function acceleratedPoller() {
  for (let i = 0; i < 5; i++) {
    const babyStep = getCurrentBabyStep();
    if (!babyStep) break;
    const newTask = addTask(`Baby Step: ${babyStep}`);
    sendTelegramMessage(`Auto Task hinzugefügt: ${newTask.title}`);

    setTimeout(() => {
      completeTask(newTask.id);
      sendTelegramMessage(`Auto Task abgeschlossen: ${newTask.title}`);
      nextBabyStep();
      autoGenerateNextBabyStep();
      analyzeAndCreateTasks();
      detectAndRecoverFailures();
    }, 10000 * i);
  }
  console.log('Beschleunigter Poller läuft mit parallelen Baby Steps');
}
