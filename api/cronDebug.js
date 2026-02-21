import { logCronEvent, getCronLogs } from '../cronjobDebugLogger';

export default function handler(req, res) {
  if (req.method === 'POST') {
    logCronEvent(req.body.event || 'unknown event');
    res.status(200).json({ message: 'Event logged' });
  } else if (req.method === 'GET') {
    res.status(200).json(getCronLogs());
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
