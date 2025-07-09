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
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;

  // Auth
  const authToken = request.headers.get("x-auth-token");
  
  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Get the ID from the slug
    const id = parseInt(resolvedParams.id);
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    // HO YOU IZ MISSIN STUFFS
    if (!url || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "One or more query parameters is missing or invalid" },
        { status: 400 },
      );
    }

    // Get the HTML from whatever the link was, and pipe it into the workflow. This is useful for getting "web search" even tho it's not really.
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  // ...existing code...
}
