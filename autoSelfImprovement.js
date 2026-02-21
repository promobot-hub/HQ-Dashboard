let babySteps = [
  'Implementiere Task-Generator zur Erstellung eigener Verbesserungsaufgaben',
  'Baue Task-Executor, der Aufgaben durchgeführt',
  'Integriere Feedback-Loops für Priorisierung',
  'Optimiere Task-Erstellung anhand Ergebnis',
  'Erstelle Monitoring-Dashboard',
  'Automatisiere Commit, Push, Deployment'
];

let currentStep = 0;

export function getCurrentBabyStep() {
  return babySteps[currentStep];
}

export function completeCurrentBabyStep() {
  if (currentStep < babySteps.length - 1) {
    currentStep++;
    return true;
  }
  return false;
}
