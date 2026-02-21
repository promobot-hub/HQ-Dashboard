const { sendEmail } = require('../sendEmailCommand');

// Handler für den Telegram-Befehl /emailsenden
async function handleEmailSendenCommand(ctx) {
  const messageText = ctx.message.text;

  // Textformat: /emailsenden empfaenger@example.com Betreff Nachrichtstext
  const parts = messageText.split(' ');
  if (parts.length < 4) {
    await ctx.reply('Bitte benutze das Format:\n/emailsenden empfaenger@example.com Betreff Nachrichtstext');
    return;
  }

  const to = parts[1];
  const subject = parts[2];
  const text = parts.slice(3).join(' ');

  const result = await sendEmail(to, subject, text);
  await ctx.reply(result);
}

module.exports = { handleEmailSendenCommand };
