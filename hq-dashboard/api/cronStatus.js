let cronRunning = false;

export function startCron() {
  cronRunning = true;
}

export function stopCron() {
  cronRunning = false;
}

export function isCronRunning() {
  return cronRunning;
}

export default function handler(req, res) {
  res.status(200).json({ running: cronRunning });
}
