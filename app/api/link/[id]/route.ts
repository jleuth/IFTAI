import { NextRequest, NextResponse } from "next/server";

import runWorkflow from "@/app/lib/runWorkflow";

export async function OPTIONS() {
  return NextResponse.json({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-auth-token",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "One or more query parameters is missing or invalid" },
        { status: 400 },
      );
    }

    const resp = await fetch(url);
    const html = await resp.text();
    const text = html.replace(/<[^>]*>/g, " ");

    const result = await runWorkflow(text, id);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error running workflow:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
