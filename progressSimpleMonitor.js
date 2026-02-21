const { sendSimpleTelegramMessage } = require('./simpleTelegramNotify');

let lastProgressTimestamp = Date.now();

function reportProgress() {
  lastProgressTimestamp = Date.now();
}

function startSimpleProgressMonitor() {
  setInterval(() => {
    const now = Date.now();
    if (now - lastProgressTimestamp >= 5 * 60 * 1000) {
      sendSimpleTelegramMessage('Statusupdate: Twitter-Skill läuft, keine Fortschritte seit 5 Minuten. Neustart ggf. erforderlich.').catch(console.error);
      reportProgress();
    }
  }, 60 * 1000);
}

module.exports = {
  reportProgress,
  startSimpleProgressMonitor
};
