import { getAllTasks } from './persistentTaskEngine.js';
import { addTask } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';

export function analyzeAndGenerateStep() {
  const tasks = getAllTasks();
  const doneCount = tasks.filter(t => t.status === 'done').length;

  // Sehr einfache Heuristik: alle 3 erledigten Tasks, neuen Baustein anlegen
  if (doneCount > 0 && doneCount % 3 === 0) {
    const newStep = `Auto Learned BabyStep nach ${doneCount} Tasks`;
    addTask(newStep);
    sendTelegramMessage(`Auto generierter Baby Step: ${newStep}`);
    return newStep;
  }
  return null;
}
