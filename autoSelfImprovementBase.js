import { addTask } from './persistentTaskEngine.js';

export function setupInitialBabySteps() {
  const steps = [
    'Task-Generator implementieren',
    'Task-Executor implementieren',
    'Telegram Integration implementieren',
    'Automatischen Commit-Push Loop starten',
    'Monitoring Dashboard bauen',
    'Health-Check Modul aktivieren',
  ];
  steps.forEach(step => addTask(`Baby Step Task: ${step}`));
}
