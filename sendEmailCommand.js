const nodemailer = require('nodemailer');

// SMTP transporter (Zoho) - gleiche Konfiguration wie im emailSkill.js
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'promobot@zohomail.eu',
    pass: '4fFHbvSAN3bC'
  }
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'promobot@zohomail.eu',
    to,
    subject,
    text
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return `E-Mail erfolgreich gesendet an ${to}`;
  } catch (error) {
    console.error('Error sending email:', error);
    return `Fehler beim Senden der E-Mail: ${error.message}`;
  }
}

// Beispielaufruf für Debug/Test
// sendEmail('beispiel@domain.de', 'Testbetreff', 'Testnachricht');

module.exports = { sendEmail };
