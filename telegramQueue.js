import { sendTelegramMessage as sendRawMessage } from './telegramDelivery.js';

let queue = [];
let sending = false;
let lastSent = 0;
const minInterval = 1000; // minimal 1 sek Abstände

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processQueue() {
  if (sending || queue.length === 0) return;
  sending = true;

  while(queue.length > 0) {
    const message = queue.shift();
    const now = Date.now();
    const elapsed = now - lastSent;
    if (elapsed < minInterval) {
      await delay(minInterval - elapsed);
    }
    try {
      await sendRawMessage(message);
      lastSent = Date.now();
    } catch (e) {
      // Fehler ignorieren, erneut anfügen
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
