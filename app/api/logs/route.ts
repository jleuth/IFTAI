import { NextResponse } from "next/server";

import { getLogs } from "@/app/lib/logger";

export async function GET() {
  try {
    const logs = await getLogs();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Failed to get logs:", error);

    return NextResponse.json(
      { error: `Failed to fetch logs with error: ${error}` },
      { status: 500 },
    );
  }
}
