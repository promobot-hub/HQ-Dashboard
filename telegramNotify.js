// IMPROVED BY CLAWBOT v2 – Reason: Guard against invalid chat and noisy 400 errors; prefer env for secrets
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8400899584:AAEBA2s8GCZMWpgKUNkM2DQMTgibpi0F2i8';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '941837164';

let bot = null;
if (BOT_TOKEN) {
  try { bot = new Telegraf(BOT_TOKEN); } catch (e) { console.warn('Telegram init failed:', e.message); }
} else {
  console.warn('Telegram BOT_TOKEN fehlt; Telegram-Benachrichtigungen deaktiviert.');
}

async function sendTelegramMessage(message) {
  if (!bot || !CHAT_ID) {
    console.warn('Telegram Bot/Chat-ID nicht initialisiert, Nachricht nicht gesendet.');
    return;
  }
  try {
    await bot.telegram.sendMessage(CHAT_ID, message);
  } catch (error) {
    const code = (error && error.response && error.response.error_code) || null;
    const desc = (error && error.response && error.response.description) || String(error.message || error);
    // Swallow "Bad Request: chat not found" to avoid noisy logs
    if (code === 400 && /chat not found/i.test(desc)) {
      console.warn('Telegram: Chat nicht gefunden – Nachricht verworfen.');
      return;
    }
    console.error('Fehler beim Senden der Telegram-Nachricht:', desc);
  }
}

module.exports = { sendTelegramMessage };
