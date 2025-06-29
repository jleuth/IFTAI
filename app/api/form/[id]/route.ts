import { NextRequest, NextResponse } from "next/server";

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
  { params }: { params: { id: string } },
) {
  //Auth
  const authToken = request.headers.get("x-auth-token")

  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "unauthorized"},
      { status: 401 }
    )
  }

  try {
    const id = parseInt(params.id);

    // Check if the ID is valid
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id in URL" }, { status: 400 });
    }

    // Grab the form items from the query string
    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    // Parse the body, whether it's JSON or not
    const textBody = await request.text();
    let bodyData: any = {};

    if (textBody) {
      try {
        bodyData = JSON.parse(textBody);
      } catch {
        bodyData = textBody;
      }
    }

    // Smash together the query string data and body data and grab the input from it
    const combined = { query: queryData, body: bodyData };
    const input = JSON.stringify(combined, null, 2);

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
