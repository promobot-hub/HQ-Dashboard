import { stopCronRunner } from "../../../api/cronRunner";

export async function GET() {
  stopCronRunner();
  return Response.json({ success: true, message: "Cron stopped" });
}
