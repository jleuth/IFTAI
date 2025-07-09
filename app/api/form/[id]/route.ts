import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import runWorkflow from "@/app/lib/runWorkflow";

export async function OPTIONS() { // Cors Options
  return NextResponse.json({
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-type, x-auth-token",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const authToken = request.headers.get("x-auth-token");

  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const workflowsPath = path.join(process.cwd(), "app/workflows.json");
    const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, "utf-8"));
    const id = parseInt(resolvedParams.id, 10);

    // Check if the ID is valid
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id in URL" }, { status: 400 });
    }

    // Smash together the query string data and body data and grab the input from it
    const input = JSON.stringify(body, null, 2);

    const result = await runWorkflow(input, id);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error running workflow from form:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
