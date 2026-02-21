import { getCurrentBabyStep, nextBabyStep } from './babySteps.js';
import { addTask } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';

export function autoGenerateNextBabyStep() {
  const finishedStep = getCurrentBabyStep();
  if (nextBabyStep()) {
    const newStep = getCurrentBabyStep();
    sendTelegramMessage(`Automatisch generiere nächsten Baby Step: ${newStep}`);
    addTask(`Automatisch generierter Task: ${newStep}`);
    return newStep;
  } else {
    sendTelegramMessage('Alle Baby Steps erledigt, keine neuen generiert.');
    return null;
  }
}
