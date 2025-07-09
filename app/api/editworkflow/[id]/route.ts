import * as fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { isDemoMode, demoConfig, getWorkflowsFilePath } from "@/config/demo";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {

  const authToken = request.headers.get("x-auth-token")

  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "unauthorized"},
      { status: 401 }
    )
  }

  try {
    const body = await request.json();
    const resolvedParams = await params;
    const workflowsPath = path.join(process.cwd(), getWorkflowsFilePath());
    const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, "utf-8"));
    const id = parseInt(resolvedParams.id, 10);
    const index = workflowsData.workflows.findIndex((w: any) => w.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    const updatedWorkflow = {
      id,
      name: body.name,
      description: body.description,
      trigger: body.trigger,
      schedule: body.schedule,
      model: body.model,
      steps: body.actions,
    };

    workflowsData.workflows[index] = updatedWorkflow;
    fs.writeFileSync(workflowsPath, JSON.stringify(workflowsData, null, 2));

    return NextResponse.json({ success: true, workflow: updatedWorkflow });
  } catch (error) {
    console.error("Error updating:", error);

    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
