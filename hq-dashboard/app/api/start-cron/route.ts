const { startCronRunner } = require('../../api/cronRunner');

export async function GET() {
  startCronRunner();
  return new Response('Cron runner started', { status: 200 });
}
