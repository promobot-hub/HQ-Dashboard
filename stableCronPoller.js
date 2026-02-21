import { addTask, getAllTasks } from './minimalTaskEngine';

export function startStablePoller() {
  setInterval(() => {
    addTask('Baby Step: Polling und Task Ausführung');
    const tasks = getAllTasks();
    console.log('Aktuelle Tasks:', tasks);
    // Hier könnte Logik zur Abarbeitung folgen
  }, 60000);
  console.log('Stabiler Poller läuft - Baby Step gestartet.');
}
