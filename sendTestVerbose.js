const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'promobot@zohomail.eu',
    pass: '4fFHbvSAN3bC'
  },
  logger: true,
  debug: true 
});

const mailOptions = {
  from: 'promobot@zohomail.eu',
  to: 'leek.sol@gmx.de',
  subject: 'Debug Test Email from Promo Bot',
  text: 'Dies ist eine Debug-Testmail vom Promo Bot.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Send error:', error);
  } else {
    console.log('Send success:', info.response);
  }
});
