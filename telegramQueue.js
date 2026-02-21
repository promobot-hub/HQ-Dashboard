import { sendTelegramMessage as sendRawMessage } from './telegramDelivery.js';

let queue = [];
let sending = false;
let lastSent = 0;
let minInterval = 1000; // Start 1 sec
let failureCount = 0;
const maxFailures = 3;

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
      failureCount = 0;
      // Nach Erfolg minimales Intervall reduzieren
      if (minInterval > 1000) minInterval -= 200;
    } catch (e) {
      failureCount++;
      if (failureCount >= maxFailures) {
        minInterval = Math.min(minInterval * 2, 10000); // Exponentiell bis 10s
      }
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
