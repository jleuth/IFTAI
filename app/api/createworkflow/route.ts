import * as fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { isDemoMode, demoConfig } from "@/config/demo";

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get("x-auth-token");
    
    // Auth
    if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Demo mode restrictions
    if (isDemoMode && !demoConfig.allowWorkflowCreation) {
      return NextResponse.json(
        { error: "Workflow creation disabled in demo mode" },
        { status: 403 }
      );
    }
    
    const body = await request.json();

    // Read existing workflows
    const workflowsPath = path.join(process.cwd(), "app/workflows.json");
    const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, "utf-8"));

    // Demo mode workflow limit
    if (isDemoMode && workflowsData.workflows.length >= demoConfig.maxWorkflows) {
      return NextResponse.json(
        { error: `Maximum workflows reached in demo mode (${demoConfig.maxWorkflows})` },
        { status: 403 }
      );
    }

    // Generate new workflow ID
    const newId =
      Math.max(...workflowsData.workflows.map((w: any) => w.id)) + 1;

    // Create new workflow object
    const newWorkflow = {
      id: newId,
      name: body.name,
      description: body.description,
      trigger: body.trigger,
      schedule: body.schedule,
      model: body.model,
      steps: body.actions,
    };

    // Add to workflows array
    workflowsData.workflows.push(newWorkflow);

    // Write back to file
    fs.writeFileSync(workflowsPath, JSON.stringify(workflowsData, null, 2));

    return NextResponse.json({
      success: true,
      workflow: newWorkflow,
    });
  } catch (error) {
    console.error("Error creating workflow:", error);

    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 },
    );
  }
}
