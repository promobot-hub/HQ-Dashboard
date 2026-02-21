const axios = require('axios').default;
const cheerio = require('cheerio');
const { sendTelegramMessage } = require('./telegramNotify');

let sessionCookies = '';

async function loginTwitter(email, password) {
  try {
    // 1. Hole Login-Seite für Cookies und Tokens
    const loginPageResponse = await axios.get('https://twitter.com/login');
    sessionCookies = loginPageResponse.headers['set-cookie'].join('; ');

    // 2. Parse CSRF Token (als Beispiel nur, erfolgreiche Parsing ist komplex)
    const $ = cheerio.load(loginPageResponse.data);
    const csrfToken = $('input[name=authenticity_token]').val() || '';

    if (!csrfToken) {
      await sendTelegramMessage('Twitter Login: CSRF Token nicht gefunden - Login schwierig');
    }

    // 3. Sende Login POST Anfrage (dieser Request ist Maximal simuliert, real oft komplex mit JavaScript)
    const loginResponse = await axios.post('https://twitter.com/sessions',
      new URLSearchParams({
        session: { username_or_email: email, password: password },
        authenticity_token: csrfToken
      }),
      {
        headers: {
          'Cookie': sessionCookies,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0'
        },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      }
    );

    if (loginResponse.status === 302) {
      await sendTelegramMessage('HTTP Twitter Login: Login erfolgreich (Redirect)');
      return true;
    } else {
      await sendTelegramMessage(`HTTP Twitter Login fehlgeschlagen mit Status ${loginResponse.status}`);
      return false;
    }

  } catch (error) {
    await sendTelegramMessage('HTTP Twitter Login Fehler: ' + error.message);
    return false;
  }
}

async function start() {
  const email = 'promobot@zohomail.eu';
  const password = 'panamacity1';

  await loginTwitter(email, password);
}

module.exports = { start };
