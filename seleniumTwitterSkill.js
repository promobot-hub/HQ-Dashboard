const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { sendTelegramMessage } = require('./telegramNotify');

async function loginTwitter(email, password) {
  let driver;
  try {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().addArguments('--headless'))
      .build();

    await driver.get('https://twitter.com/login');

    // Warte auf Email-Feld
    await driver.wait(until.elementLocated(By.name('text')), 10000);
    await driver.findElement(By.name('text')).sendKeys(email);
    await driver.findElement(By.css('div[role="button"]')).click();
    
    // Warte auf Passwort-Feld
    await driver.wait(until.elementLocated(By.name('password')), 10000);
    await driver.findElement(By.name('password')).sendKeys(password);
    
    // Login Button
    await driver.findElement(By.css('div[role="button"]')).click();

    // Warte auf Startseite
    await driver.wait(until.urlContains('home'), 10000);
    await sendTelegramMessage('Selenium Twitter: Login erfolgreich');

    // Andere Aktionen hier

    await driver.quit();
    return true;
  } catch (error) {
    if(driver) await driver.quit();
    await sendTelegramMessage('Selenium Twitter Login Fehler: ' + error.message);
    return false;
  }
}

async function start() {
  const email = 'promobot@zohomail.eu';
  const password = 'panamacity1';

  await loginTwitter(email, password);
}

module.exports = { start };
