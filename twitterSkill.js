const { sendTelegramMessage } = require('./telegramNotify');
const { startSimpleProgressMonitor, reportProgress } = require('./progressSimpleMonitor');

async function dummyTwitterSkill() {
  startSimpleProgressMonitor();
  await sendTelegramMessage('Dummy TwitterSkill gestartet - Puppeteer deaktiviert aus Systemgründen.');

  // Periodische Meldungen simulieren
  setInterval(async () => {
    reportProgress();
    await sendTelegramMessage('Dummy TwitterSkill läuft gesund.');
  }, 10 * 60 * 1000);
}

async function start() {
  try {
    await dummyTwitterSkill();
  } catch (err) {
    await sendTelegramMessage('Dummy TwitterSkill Fehler: ' + err.message);
  }
}

module.exports = { start };
