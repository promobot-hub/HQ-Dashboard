import { getAllTasks, addTask } from './persistentTaskEngine.js';
import { sendTelegramMessage } from './telegramQueue.js';

export function analyzeAndCreateTasks() {
  const tasks = getAllTasks();
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  // Neue Aufgabe für je 5 erledigte Tasks
  if (doneTasks > 0 && doneTasks % 5 === 0) {
    const newTaskTitle = `Auto-Task generiert nach ${doneTasks} erledigten Tasks`;
    addTask(newTaskTitle);
    sendTelegramMessage(`Neue Aufgabe hinzugefügt: ${newTaskTitle}`);
    return true;
  }
  return false;
}
