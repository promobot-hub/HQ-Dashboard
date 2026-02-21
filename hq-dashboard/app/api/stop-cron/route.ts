import { stopCronRunner, getCronStatus } from "../../../api/cronRunner";

export async function GET() {
  const s = stopCronRunner();
  return Response.json({ success: true, message: "Cron stopped", status: getCronStatus() });
}
