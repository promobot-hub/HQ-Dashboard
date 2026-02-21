const { Telegraf } = require('telegraf');

const BOT_TOKEN = '8400899584:AAEBA2s8GCZMWpgKUNkM2DQMTgibpi0F2i8';
const CHAT_ID = '941837164';
const bot = new Telegraf(BOT_TOKEN);

async function sendSimpleTelegramMessage(message) {
  try {
    await bot.telegram.sendMessage(CHAT_ID, message);
  } catch (error) {
    console.error('Fehler beim Senden der einfachen Telegram-Nachricht:', error);
  }
}

module.exports = { sendSimpleTelegramMessage };
