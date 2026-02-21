import { startCronRunner, getCronStatus } from "../../../api/cronRunner";

export async function GET() {
  const s = startCronRunner();
  return Response.json({
    success: true,
    message: "Cron started",
    status: getCronStatus(),
  });
}
