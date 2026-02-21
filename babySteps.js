const babySteps = [
  'Initialisiere neues sauberes Repository',
  'Entwickle minimale Task Engine',
  'Baue Baby Step Verwaltung',
  'Implementiere stable Cron-Bypass Poller',
  'Integriere Telegram Delivery',
  'Setze Commit & Push Loop auf',
  'Führe Healthchecks und Recovery ein',
  'Automatisiere neue Baby Step Generierung'
];

let currentIndex = 0;

export function getCurrentBabyStep() {
  return babySteps[currentIndex];
}

export function nextBabyStep() {
  if (currentIndex < babySteps.length - 1) {
    currentIndex += 1;
    return true;
  }
  return false;
}
