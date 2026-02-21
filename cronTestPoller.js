import { runCronTest } from './cronTestRunner';
import { sendTelegramMessage } from './api/telegramNotify';

import { selfImprovementLoop } from './selfImprovementLoop';

async function pollCronTest() {
  const result = runCronTest();
  console.log(result);
  sendTelegramMessage(`Cron test result: ${result}`);
  const improvement = selfImprovementLoop();
  sendTelegramMessage(`Self-improvement result: ${improvement}`);
}

setInterval(pollCronTest, 60000);
console.log('Cron test poller mit Telegram gestartet.');

