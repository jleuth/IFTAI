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
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");
    const id = await parseInt(params.id);

    if (!input || !id) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: input query parameter and valid id in URL",
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
