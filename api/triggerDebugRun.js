import { runCronJobWithDebug } from './cronRunnerWithDebug';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const result = await runCronJobWithDebug();
    res.status(200).json({ message: 'Debug run executed', result });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
