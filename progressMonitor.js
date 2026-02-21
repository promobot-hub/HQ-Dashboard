const { sendTelegramMessage } = require('./telegramNotify');

let lastProgressTimestamp = Date.now();
let progressCheckInterval;

// Funktion, die vom Twitter-Skill aufgerufen wird, wenn Fortschritt gemacht wird
function reportProgress() {
  lastProgressTimestamp = Date.now();
}

// Routine zur Überwachung des Fortschritts
function startProgressMonitor() {
  progressCheckInterval = setInterval(() => {
    const now = Date.now();
    const timeSinceLastProgress = now - lastProgressTimestamp;

    // Sende Statusupdate alle 5 Minuten
    if (timeSinceLastProgress >= 5 * 60 * 1000) {
      sendTelegramMessage('Statusupdate: Twitter-Skill läuft, keine Fortschritte seit 5 Minuten. Prüfe und starte ggf. Neu.');
      // Hier Logik zum Neustart oder Fehlerbehandlung einfügen
      // Zum Beispiel: restartTwitterSkill();
      reportProgress(); // Fortschritt zurücksetzen nach Benachrichtigung
    }
  }, 60 * 1000); // Prüfe jede Minute
}

function stopProgressMonitor() {
  clearInterval(progressCheckInterval);
}

module.exports = {
  reportProgress,
  startProgressMonitor,
  stopProgressMonitor
};
