import { addTask, completeTask } from './persistentTaskEngine.js';
import { getCurrentBabyStep } from './babySteps.js';
import { sendTelegramMessage } from './telegramQueue.js';
import { autoGenerateNextBabyStep } from './babyStepGenerator.js';
import { enqueueSelfMessage } from './internalChatQueue.js';
import { analyzeAndCreateTasks } from './autoLearningModule.js';
import { detectAndRecoverFailures } from './errorRecovery.js';
import { addPriorityTask } from './priorityTaskQueue.js';

export function startStablePoller() {
  setInterval(() => {
    const babyStep = getCurrentBabyStep();
    addPriorityTask(`Baby Step: ${babyStep}`, 1).then(newTask => {
      enqueueSelfMessage(`Task hinzugefügt: ${newTask.title}`);
    });

    setTimeout(() => {
      // keine direkte Task-Abschlüsse hier, Queue verarbeitet
      const nextStep = autoGenerateNextBabyStep();
      enqueueSelfMessage(nextStep ? `Nächster Baby Step: ${nextStep}` : 'Alle Baby Steps erledigt');
      analyzeAndCreateTasks();
      detectAndRecoverFailures();
    }, 33000);
  }, 60000);
  console.log('Stabiler Poller mit Telegram Queue und automatischem Lernen gestartet.');
}
