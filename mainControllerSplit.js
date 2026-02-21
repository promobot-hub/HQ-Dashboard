const selfOptimization = require('./selfOptimization');
const { startSimpleProgressMonitor, reportProgress } = require('./progressSimpleMonitor');

async function mainControllerSplit() {
  console.log('Starte Selbstoptimierung und Monitoring unabhängig.');

  // Start Fortschrittsüberwachung
  startSimpleProgressMonitor();

  // Selbstoptimierung starten
  selfOptimization();

  // Manuelle Funktion zum Starten des Twitter-Skills bei Bedarf
  function startTwitterSkillManuell() {
    const twitterSkill = require('./twitterSkill');
    if (twitterSkill && twitterSkill.start) {
      twitterSkill.start();
    } else {
      console.log('TwitterSkill läuft manuell nicht, bitte prüfen.');
    }
  }

  // Export der manuellen Startfunktion
  module.exports = { startTwitterSkillManuell };
  console.log('Bereit. TwitterSkill kann manuell gestartet werden.');
}

mainControllerSplit();
