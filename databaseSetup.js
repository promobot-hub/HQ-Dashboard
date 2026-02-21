const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./emailInfo.db');

// Create table for storing important email info
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

db.serialize(() => {
  db.run(createTable, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created or already exists.');
    }
  });
});

module.exports = db;
