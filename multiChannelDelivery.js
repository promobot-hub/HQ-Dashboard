import { sendTelegramMessage } from './telegramQueue.js';
// Beispiel Email- und Slack-Fake Sender
async function sendEmail(message) {
  console.log(`Email gesendet: ${message}`);
}
async function sendSlack(message) {
  console.log(`Slack gesendet: ${message}`);
}

export async function multiChannelSend(message) {
  await sendTelegramMessage(message);
  await sendEmail(message);
  await sendSlack(message);
}
