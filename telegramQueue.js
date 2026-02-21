import { sendTelegramMessage as sendRawMessage } from './telegramDelivery.js';
import * as logger from './structuredLogger.js';

let queue = [];
let sending = false;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processQueue() {
  if (sending || queue.length === 0) return;
  sending = true;

  while(queue.length > 0) {
    const message = queue.shift();
    try {
      await sendRawMessage(message);
      logger.info(`Telegram message sent: ${message}`);
    } catch (e) {
      logger.warn(`Telegram send failed, retrying in 10s: ${e.message}`);
      queue.unshift(message);
      await delay(10000);
    }
  }
  sending = false;
}

export function sendTelegramMessage(message) {
  queue.push(message);
  processQueue();
}
