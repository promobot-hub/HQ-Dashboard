import { stopCronRunner } from '../../api/cronRunner';

export async function GET() {
  stopCronRunner();
  return new Response('Cron runner stopped', { status: 200 });
}
