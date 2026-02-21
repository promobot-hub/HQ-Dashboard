import fs from 'fs';

export function runCronTest() {
  const timestamp = new Date().toISOString();
  fs.writeFileSync('cron_test_triggered.txt', `Cron test triggered at ${timestamp}`);
  return `File updated at ${timestamp}`;
}
