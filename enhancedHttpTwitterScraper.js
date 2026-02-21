const axios = require('axios').default;
const { JSDOM } = require('jsdom');
const { sendTelegramMessage } = require('./telegramNotify');

let cookies = '';

async function getCsrfTokenAndCookies() {
  try {
    const response = await axios.get('https://twitter.com/login');
    cookies = response.headers['set-cookie'].join('; ');

    const dom = new JSDOM(response.data);
    const csrfTokenMeta = dom.window.document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenMeta ? csrfTokenMeta.content : null;
    if (!csrfToken) {
      await sendTelegramMessage('Erweiterter HTTP-Twitter-Scraper: CSRF Token nicht gefunden');
    }
    return csrfToken;
  } catch (err) {
    await sendTelegramMessage('Erweiterter HTTP-Twitter-Scraper: Fehler beim Abrufen der Loginseite: ' + err.message);
    return null;
  }
}

async function login(email, password) {
  const csrfToken = await getCsrfTokenAndCookies();
  if (!csrfToken) return false;

  try {
    const response = await axios.post('https://twitter.com/sessions',
      `authenticity_token=${encodeURIComponent(csrfToken)}&session%5Busername_or_email%5D=${encodeURIComponent(email)}&session%5Bpassword%5D=${encodeURIComponent(password)}&return_to_ssl=true&scribe_log=&redirect_after_login=%2Fhome`,
      {
        headers: {
          'cookie': cookies,
          'content-type': 'application/x-www-form-urlencoded',
          'x-csrf-token': csrfToken,
          'x-twitter-active-user': 'yes',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
        },
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 400
      }
    );

    if (response.status === 302) {
      cookies = response.headers['set-cookie'].join('; ');
      await sendTelegramMessage('Erweiterter HTTP-Twitter-Scraper: Login erfolgreich');
      return true;
    } else {
      await sendTelegramMessage(`Erweiterter HTTP-Twitter-Scraper: Login gescheitert mit Status ${response.status}`);
      return false;
    }
  } catch (err) {
    await sendTelegramMessage('Erweiterter HTTP-Twitter-Scraper: Login Fehler: ' + err.message);
    return false;
  }
}

async function start() {
  const email = 'promobot@zohomail.eu';
  const password = 'panamacity1';
  await login(email, password);
}

module.exports = { start };
