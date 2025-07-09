import { NextRequest, NextResponse } from "next/server";

import runWorkflow from "@/app/lib/runWorkflow";

export async function OPTIONS() {
  // Needed for CORS and webhooks
  return NextResponse.json({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;

  // Auth
  const authToken = request.headers.get("x-auth-token");

  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Get the ID from the slug
    const id = parseInt(resolvedParams.id);
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input") || "";

    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: "Invalid id in URL",
        },
        { status: 400 },
      );
    }

    const result = await runWorkflow(input, id);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error running workflow:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
