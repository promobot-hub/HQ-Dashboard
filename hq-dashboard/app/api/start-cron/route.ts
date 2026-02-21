import { startCronRunner } from "../../../api/cronRunner";

export async function GET() {
  startCronRunner();
  return Response.json({ success: true, message: "Cron started" });
}
