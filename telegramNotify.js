const { Telegraf } = require('telegraf');

// Bot-Token und Chat-ID (Chat-ID ist hardcodiert für deinen Telegram-Account)
const BOT_TOKEN = '8400899584:AAEBA2s8GCZMWpgKUNkM2DQMTgibpi0F2i8';
const CHAT_ID = '941837164';

let bot = null;

if (BOT_TOKEN && CHAT_ID) {
  bot = new Telegraf(BOT_TOKEN);
} else {
  console.warn('Telegram BOT_TOKEN oder CHAT_ID ist nicht gesetzt.');
}

async function sendTelegramMessage(message) {
  if (!bot) {
    console.warn('Telegram Bot nicht initialisiert, Nachricht nicht gesendet:', message);
    return;
  }
  try {
    await bot.telegram.sendMessage(CHAT_ID, message);
  } catch (error) {
    console.error('Fehler beim Senden der Telegram-Nachricht:', error);
  }
}

module.exports = { sendTelegramMessage };
