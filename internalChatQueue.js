let messageQueue = [];
let processing = false;

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function processQueue() {
  if (processing || messageQueue.length === 0) return;
  processing = true;

  while(messageQueue.length > 0) {
    const message = messageQueue.shift();
    try {
      console.log('Selbst-Reply:', message);
      // Hier kann komplexe Selbstkommunikationslogik folgen
      await delay(1000);
    } catch (e) {
      console.error('Fehler beim Selbst-Reply:', e);
      messageQueue.unshift(message);
      await delay(3000);
    }
  }

  processing = false;
}

export function enqueueSelfMessage(message) {
  messageQueue.push(message);
  processQueue();
}
