import { addTask, completeTask } from './persistentTaskEngine.js';
// logger entfernen, da Modul gelöscht wurde
import { getCurrentBabyStep } from './babySteps.js';
import { sendTelegramMessage } from './telegramQueue.js';
import { autoGenerateNextBabyStep } from './babyStepGenerator.js';
import { analyzeAndCreateTasks } from './autoLearningModule.js';
import { detectAndRecoverFailures } from './errorRecovery.js';
import { enqueueSelfMessage } from './internalChatQueue.js';
import { analyzeAndGenerateStep } from './autoBabyStepLearner.js';

export function startStablePoller() {
  setInterval(() => {
    const babyStep = getCurrentBabyStep();
    logger.info(`Current Baby Step: ${babyStep}`);
    const newTask = addTask(`Baby Step: ${babyStep}`);
    logger.info(`Task hinzugefügt: ${newTask.title}`);
    sendTelegramMessage(`Neuer Task hinzugefügt: ${newTask.title}`);
    enqueueSelfMessage(`Task hinzugefügt: ${newTask.title}`);

    setTimeout(() => {
      logger.info(`Markiere Task als erledigt: ${newTask.id}`);
      completeTask(newTask.id);
      logger.info(`Task abgeschlossen: ${newTask.title}`);
      sendTelegramMessage(`Task abgeschlossen: ${newTask.title}`);
      enqueueSelfMessage(`Task abgeschlossen: ${newTask.title}`);
      const nextStep = autoGenerateNextBabyStep();
      enqueueSelfMessage(nextStep ? `Nächster Baby Step: ${nextStep}` : 'Alle Baby Steps erledigt');
      analyzeAndGenerateStep();
      analyzeAndCreateTasks();
      detectAndRecoverFailures();
    }, 30000);
  }, 60000);
  console.log('Stabiler Poller mit Self-Reply-Queue und Auto-Baby-Step-Lerner gestartet.');
}
