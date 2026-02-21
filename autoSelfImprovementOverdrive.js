import { addPriorityTask } from './priorityTaskQueue.js';
import { sendTelegramMessage } from './telegramQueue.js';
import { nextBabyStep, getCurrentBabyStep } from './babySteps.js';
import { autoGenerateNextBabyStep } from './babyStepGenerator.js';
import { analyzeAndCreateTasks } from './autoLearningModule.js';
import { detectAndRecoverFailures } from './errorRecovery.js';

export function overdrivePoller() {
  for(let i=0; i<10; i++) {
    const babyStep = getCurrentBabyStep();
    if (!babyStep) break;
    addPriorityTask(`Baby Step: ${babyStep}`, 1).then(task => {
      sendTelegramMessage(`Overdrive Task added: ${task.title}`);
      setTimeout(() => {
        // Task completion simulated, actual completion managed by queue
        nextBabyStep();
        autoGenerateNextBabyStep();
        analyzeAndCreateTasks();
        detectAndRecoverFailures();
      }, 5000 * i);
    });
  }
  console.log('Overdrive Poller running with massive Baby Step parallelism.');
}
