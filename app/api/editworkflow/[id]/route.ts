import * as fs from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const workflowsPath = path.join(process.cwd(), "app/workflows.json");
    const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, "utf-8"));
    const id = parseInt(params.id, 10);
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
