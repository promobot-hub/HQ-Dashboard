const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const sqlite3 = require('sqlite3').verbose();

// Setup DB
const db = new sqlite3.Database('./emailInfo.db');
const createTable = `
CREATE TABLE IF NOT EXISTS ImportantEmails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fromAddress TEXT,
  subject TEXT,
  content TEXT,
  category TEXT,
  dateReceived TEXT
);
`;

// Initialize DB
db.serialize(() => {
  db.run(createTable);
});

const imapConfig = {
  imap: {
    user: 'promobot@zohomail.eu',
    password: '4fFHbvSAN3bC',
    host: 'imap.zoho.eu',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'promobot@zohomail.eu',
    pass: '4fFHbvSAN3bC'
  }
});

function classifyEmail(subject, content) {
  // Simplified example classification, extend with real criteria
  const promoKeywords = ['promo', 'sale', 'discount', 'offer'];
  const accessKeywords = ['password', 'login', 'account', 'credentials'];
  const spamKeywords = ['lottery', 'win', 'free', 'click here'];

  const text = (subject + ' ' + content).toLowerCase();

  if (promoKeywords.some(word => text.includes(word)) || accessKeywords.some(word => text.includes(word))) {
    return 'important';
  }
  if (spamKeywords.some(word => text.includes(word))) {
    return 'spam';
  }
  return 'not important';
}

async function replyToEmail(item, fromAddress, subject, content) {
  // Basic psychological trick: be polite, appreciative, and create reciprocation
  const replyText = `Hallo,\n\nvielen Dank f\u00fcr Ihre Nachricht zum Thema \"${subject}\". Ich sch\u00e4tze Ihre Zeit und Ihre Informationen sehr.\n\nK\u00f6nnten Sie mir bitte weitere Details zusenden? Das w\u00e4re sehr hilfreich f\u00fcr unsere Zusammenarbeit.\n\nVielen Dank im Voraus!\n\nBeste Gr\u00fc\u00dfe,\nIhr Promo Bot`;

  const mailOptions = {
    from: 'promobot@zohomail.eu',
    to: fromAddress,
    subject: `Re: ${subject}`,
    text: replyText
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Replied to email from:', fromAddress);
  } catch (error) {
    console.error('Error sending reply:', error);
  }
}

async function checkAndProcessEmails() {
  try {
    const connection = await imaps.connect(imapConfig);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const item of messages) {
      const allParts = item.parts.reduce((acc, part) => {
        acc[part.which] = part.body;
        return acc;
      }, {});
      const headers = allParts['HEADER'];
      const content = allParts['TEXT'] ? allParts['TEXT'].trim() : '';

      const fromAddress = headers.from ? headers.from[0] : '';
      const subject = headers.subject ? headers.subject[0] : '';
      const dateReceived = headers.date ? headers.date[0] : '';

      const category = classifyEmail(subject, content);

      if (category === 'important') {
        // Save important emails
        db.run('INSERT INTO ImportantEmails (fromAddress, subject, content, category, dateReceived) VALUES (?, ?, ?, ?, ?)',
          [fromAddress, subject, content, category, dateReceived]);

        // Implement reply logic with psychological tricks
        await replyToEmail(item, fromAddress, subject, content);
        console.log('Important email processed and replied:', subject);
      } else {
        console.log('Email classified as:', category, '| Subject:', subject);
      }
    }

    await connection.end();
  } catch (err) {
    console.error('Error checking emails:', err);
  }
}

// Schedule check every hour
setInterval(checkAndProcessEmails, 3600 * 1000);

module.exports = {
  checkAndProcessEmails
};

// Immediately run once on load
checkAndProcessEmails();
