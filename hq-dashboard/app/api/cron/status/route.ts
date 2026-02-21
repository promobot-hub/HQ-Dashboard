import { NextResponse } from "next/server";
import { getCronStatus } from "../../../../api/cronRunner";

export async function GET() {
  return NextResponse.json(getCronStatus(), { status: 200 });
}
