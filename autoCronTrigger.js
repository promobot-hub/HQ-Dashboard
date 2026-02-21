import { exec } from 'child_process';

function runCronTrigger() {
  exec('openclaw cron run 065329dc-eeff-4c85-a259-16730f4e8319 --force', (error, stdout, stderr) => {
    if (error) {
      console.error(`Fehler beim Cron-Run: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`STDERR: ${stderr}`);
      return;
    }
    console.log(`Cron-Job 065329dc-eeff-4c85-a259-16730f4e8319 ausgeführt: ${stdout}`);
  });
}

setInterval(runCronTrigger, 60000);
console.log('Auto-Cron-Trigger gestartet, läuft jede Minute');
