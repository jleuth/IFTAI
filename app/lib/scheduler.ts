import fs from "node:fs";
import path from "node:path";

import cron from "node-cron";
import { getWorkflowsFilePath } from "@/config/demo";

import runWorkflow from "./runWorkflow";

export default function startScheduledWorkflows() {
  const workflowsPath = path.join(process.cwd(), getWorkflowsFilePath());

  if (!fs.existsSync(workflowsPath)) return;
  const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, "utf-8"));

  let workflows: any[] = [];

  if (Array.isArray(workflowsData)) {
    workflows = workflowsData;
  } else if (
    workflowsData.workflows &&
    Array.isArray(workflowsData.workflows)
  ) {
    workflows = workflowsData.workflows;
  } else if (
    workflowsData.workflows &&
    typeof workflowsData.workflows === "object"
  ) {
    workflows = Object.values(workflowsData.workflows);
  }

  for (const workflow of workflows) {
    if (workflow.trigger === "cron" && workflow.schedule) {
      cron.schedule(workflow.schedule, () => {
        runWorkflow("", workflow.id).catch((err) => {
          console.error(
            `Scheduled workflow ${workflow.id} failed to run. Error:`,
            err,
          );
        });
      });
    }
  }
}
