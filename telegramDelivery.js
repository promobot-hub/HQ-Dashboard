import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_USER_ID;
let bot;

if (token) {
  bot = new TelegramBot(token, { polling: false });
}

export function sendTelegramMessage(message) {
  if (!bot || !chatId) return false;
  bot.sendMessage(chatId, message);
  return true;
}
