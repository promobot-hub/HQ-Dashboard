import { runCronTest } from '../cronTestRunner';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const result = runCronTest();
    res.status(200).json({ message: 'Cron test executed', result });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
