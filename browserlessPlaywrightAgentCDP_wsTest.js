const WebSocket = require('ws');
const API_KEY = process.env.REMOTE_BROWSER_API_KEY;
const wsUrl = `wss://production-sfo.browserless.io?token=${API_KEY}`;

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('WebSocket Verbindung geöffnet');
  ws.close();
});

ws.on('error', (error) => {
  console.error('WebSocket Fehler:', error.message);
});

ws.on('close', (code, reason) => {
  console.log(`WebSocket geschlossen, Code: ${code}, Grund: ${reason}`);
});
