const { sendSimpleTelegramMessage } = require('./simpleTelegramNotify');
const selfOptimization = require('./selfOptimization');
const { reportProgress } = require('./progressSimpleMonitor');

async function cronJob() {
  console.log('Cron Job gestartet - überprüfe Fortschritt und führe Tasks aus.');

  // Fortschrittsmeldung
  reportProgress();

  // Selbstoptimierung durchführen
  selfOptimization();

  // Statusupdate senden
  await sendSimpleTelegramMessage('Cron Job Update: Tasks laufen, Fortschritt gesichert.');

  // TODO: Aktive Tasks hier aufrufen oder priorisieren
}

// Cron-Job-Simulation: alle 5 Minuten
setInterval(cronJob, 5 * 60 * 1000);

module.exports = { cronJob };
