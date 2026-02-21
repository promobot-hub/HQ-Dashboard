import { addTask, completeTask } from './persistentTaskEngine.js';
import { getCurrentBabyStep } from './babySteps.js';
import { sendTelegramMessage } from './telegramQueue.js';
import { autoGenerateNextBabyStep } from './babyStepGenerator.js';
import { analyzeAndCreateTasks } from './autoLearningModule.js';
import { enqueueSelfMessage } from './internalChatQueue.js';
import { analyzeAndGenerateStep } from './autoBabyStepLearner.js';

export function startStablePoller() {
  setInterval(() => {
    const babyStep = getCurrentBabyStep();
    const newTask = addTask(`Baby Step: ${babyStep}`);
    sendTelegramMessage(`Neuer Task hinzugefügt: ${newTask.title}`);
    enqueueSelfMessage(`Task hinzugefügt: ${newTask.title}`);

    setTimeout(() => {
      completeTask(newTask.id);
      sendTelegramMessage(`Task abgeschlossen: ${newTask.title}`);
      enqueueSelfMessage(`Task abgeschlossen: ${newTask.title}`);
      const nextStep = autoGenerateNextBabyStep();
      enqueueSelfMessage(nextStep ? `Nächster Baby Step: ${nextStep}` : 'Alle Baby Steps erledigt');
      analyzeAndGenerateStep();
      analyzeAndCreateTasks();
    }, 30000);
  }, 60000);
  console.log('Stabiler Poller mit Self-Reply-Queue und Auto-Baby-Step-Lerner gestartet.');
}
