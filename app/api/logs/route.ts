import { NextResponse, NextRequest } from "next/server";
import { getLogs } from "@/app/lib/logger";

// ts file so ahh i don't even think we use it but i'm too scared to delete it and break shit

export async function GET(request: NextRequest) {

  const authToken = request.headers.get("x-auth-token")

  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 401 }
    )
  }

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
