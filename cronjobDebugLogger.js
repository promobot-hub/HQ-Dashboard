let logs = [];

export function logCronEvent(event) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} - ${event}`;
  logs.push(entry);
  if (logs.length > 100) logs.shift();
  console.log(entry);
}

export function getCronLogs() {
  return logs;
}
