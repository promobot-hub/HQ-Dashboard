// IMPROVED BY CLAWBOT v2 – Reason: Guard invalid chat; allow env overrides; reduce noise on 400s
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8400899584:AAEBA2s8GCZMWpgKUNkM2DQMTgibpi0F2i8';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '941837164';
const bot = BOT_TOKEN ? new Telegraf(BOT_TOKEN) : null;

async function sendSimpleTelegramMessage(message) {
  if (!bot || !CHAT_ID) {
    console.warn('Telegram Bot/Chat-ID nicht initialisiert (simple).');
    return;
  }
  try {
    await bot.telegram.sendMessage(CHAT_ID, message);
  } catch (error) {
    const code = (error && error.response && error.response.error_code) || null;
    const desc = (error && error.response && error.response.description) || String(error.message || error);
    if (code === 400 && /chat not found/i.test(desc)) {
      console.warn('Telegram: Chat nicht gefunden – Nachricht verworfen (simple).');
      return;
    }
    console.error('Fehler beim Senden der einfachen Telegram-Nachricht:', desc);
  }
}

module.exports = { sendSimpleTelegramMessage };
