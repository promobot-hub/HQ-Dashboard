const puppeteer = require('puppeteer');

const TWITTER_LOGIN_URL = 'https://twitter.com/login';

const TWITTER_ACCOUNT = {
  email: 'promobot@zohomail.eu',
  username: 'Alex_pengu_1337',
  password: 'panamacity1'
};

async function loginToTwitter() {
  const browser = await puppeteer.launch({ headless: true /* set false for debugging */, slowMo: 50 });
  const page = await browser.newPage();

  try {
    await page.goto(TWITTER_LOGIN_URL, { waitUntil: 'networkidle2' });
    await page.type('input[name="text"]', TWITTER_ACCOUNT.email, { delay: 50 });
    await page.click('div[role="button"] >> text=Next');
    await page.waitForSelector('input[name="password"]', { timeout: 5000 });
    await page.type('input[name="password"]', TWITTER_ACCOUNT.password, { delay: 50 });
    await page.click('div[role="button"] >> text=Log in');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    if (page.url() !== TWITTER_LOGIN_URL) {
      console.log('Login erfolgreich');
    } else {
      throw new Error('Login gescheitert: URL unverändert');
    }
  } catch (error) {
    console.error('Login fehlgeschlagen:', error);
  } finally {
    await browser.close();
  }
}

loginToTwitter();
