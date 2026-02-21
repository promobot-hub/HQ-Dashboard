const { startSimpleProgressMonitor, reportProgress } = require('./progressSimpleMonitor');
const { sendSimpleTelegramMessage } = require('./simpleTelegramNotify');
const selfOptimization = require('./selfOptimization');
const twitterSkill = require('./twitterSkill'); // angenommen exportiert start()

async function mainController() {
  console.log('Starte Hauptsteuerung...');

  // Start Fortschrittsüberwachung
  startSimpleProgressMonitor();

  // Starte Selbstoptimierung
  selfOptimization();

  // Starte Twitter-Skill
  // Twitter-Skill vorübergehend deaktiviert wegen Puppeteer-Fehler
  // if (twitterSkill && twitterSkill.start) {
  //   twitterSkill.start();
  // }

  // Endlosschleife für ständige Selbstberichterstattung
  setInterval(() => {
    reportProgress();
  }, 60 * 1000);

  // Zusätzliche Logik kann hier rein, um weitere Skills zu starten und priorisieren
}

mainController();
