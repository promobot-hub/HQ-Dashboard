const { sendSimpleTelegramMessage } = require('./simpleTelegramNotify');

async function test() {
  await sendSimpleTelegramMessage('Testnachricht aus dem Hauptprozess');
  console.log('Nachricht sollte verschickt worden sein.');
}

test();
