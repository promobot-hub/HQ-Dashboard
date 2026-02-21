let logs = [];

export function logEvent(event) {
  const timestamp = new Date().toISOString();
  const logEntry = { ...event, timestamp };
  logs.push(logEntry);
  // Keep logs max 100 entries
  if (logs.length > 100) logs.shift();
  console.log("[Log]", logEntry);
}

export function getLogs() {
  return logs;
}

export default function handler(req, res) {
  res.status(200).json(getLogs());
}
