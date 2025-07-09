import * as fs from "node:fs";
import * as path from "node:path";

import writeLog from "./logger";
import sendTelegramMessage from "./telegram";
import sendRequest from "./sendHttp";
import { isDemoMode, demoConfig, getWorkflowsFilePath } from "@/config/demo";

import { getResponse } from "@/app/lib/openai";

export default async function runWorkflow(input: string, id: number) {
  if (fs.existsSync(path.join(process.cwd(), "app", ".stop"))) {
    writeLog("info", "Emergency stop active - workflow execution aborted");
    return {
      success: false,
      message: "Emergency stop active - workflow execution aborted",
    };
  }

  // Parse the JSON store - use demo workflows if demo mode is enabled
  const workflowsPath = path.join(process.cwd(), getWorkflowsFilePath());
  const workflowsData = JSON.parse(fs.readFileSync(workflowsPath, "utf8"));

  console.log(workflowsData);

  let workflows: any[] = [];
  let inputChain = `Input from user: "${input}"`;

  if (Array.isArray(workflowsData)) {
    // Support multiple JSON schema formats for workflows
    // If there is a direct array of workflows
    workflows = workflowsData;
  } else if (
    workflowsData.workflows &&
    Array.isArray(workflowsData.workflows)
  ) {
    // if the json is like { workflows: [] }
    workflows = workflowsData.workflows;
  } else if (
    workflowsData.workflows &&
    typeof workflowsData.workflows === "object"
  ) {
    // if ts is like { workflows: { "1": {}, "2": {} } }
    workflows = Object.values(workflowsData.workflows);
  } else {
    writeLog("error", "Invalid JSON structure for workflows.");
    throw new Error("Invalid JSON structure for workflows.");
  }

  // Get workflow by ID
  const chosenWorkflow = workflows.find((workflow: any) => {
    console.log(
      `Comparing workflow.id: ${workflow.id} (${typeof workflow.id}) with search id: ${id} (${typeof id})`,
    );

    return workflow.id === id;
  });

  console.log("GOT DA WORKFLOW:", chosenWorkflow);
  writeLog("info", `Workflow with id ${id} found`);

  if (!chosenWorkflow) {
    writeLog("error", `Workflow with id ${id} not found`);
    throw new Error(
      "Workflow with the specified ID was not found",
    );
  }

  const steps = chosenWorkflow.steps;
  let lastResponse;
  const variables: Record<string, any> = {
    input: input // Set the input variable for use in templates
  };

  // Apply variables to the input
  const applyVars = (str: any) =>
    typeof str === "string"
      ? str.replace(/\{\{(.*?)\}\}/g, (_, v) => variables[v.trim()] ?? "")
      : str;

  // Run each step in order
  for (const step of steps) {
    // Add a small delay in demo mode for better visual feedback
    if (isDemoMode && steps.indexOf(step) > 0) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay between steps
    }
    
    const response = await runStep(step.id, inputChain);

    // Log the response from each step
    writeLog("info", `Response from step #${step.id} was "${response}"`);
    inputChain = inputChain.concat(
      `\n\nResponse from step #${step.id} was "${response}"`,
    );
    lastResponse = response;
    if (step.action === "return_string" || step.action === "return") {
      break;
    }
  }

  async function runStep(stepId: number, input?: any) {
    // Check if a ".stop" file exists, if it does, that means the emergency stop is on and we should stop the workflow
    if (fs.existsSync(path.join(process.cwd(), "app", ".stop"))) {
      writeLog("info", "Emergency stop active - step execution aborted");
      return {
        success: false,
        message: "Emergency stop active - step execution aborted",
      };
    }

    // Grab a step from the steps array
    const step = steps.find((step: any) => step.id === stepId);

    console.log("input", input);

    // If we call the model, use openai to get the response
    if (step.action === "call_model" || step.action === "ai") {
      // Always use real OpenAI for better demo experience
      const response = await getResponse(
        applyVars(input),
        applyVars(step.instructions),
        step.model,
      );

      variables["ai_response"] = response;

      console.log("response:", response);

      return response;
    } else if (step.action === "telegram_send" || step.action === "telegram") {
      if (isDemoMode) {
        // Mock telegram response in demo mode
        console.log("Demo Telegram message:", applyVars(step.message));
        return demoConfig.mockResponses.telegram;
      }

      const response = await sendTelegramMessage(applyVars(step.message), id);

      console.log(response);

      return response;
    } else if (step.action === "send_http" || step.action === "request") {
      if (isDemoMode) {
        // Mock HTTP request response in demo mode
        const mockResponse = {
          ...demoConfig.mockResponses.request,
          url: applyVars(step.url),
          method: step.method
        };
        console.log("Demo HTTP request:", mockResponse);
        
        // Return a formatted description for logs instead of the raw object
        return `Fetched data from ${applyVars(step.url)} (demo mode)`;
      }

      const response = await sendRequest(
        step.method,
        applyVars(step.url),
        applyVars(step.body),
        step.headers,
      );

      console.log(response);

      return response;
    } else if (step.action === "wait") {
      const time = Number(step.time || step.duration || 0);

      if (isDemoMode && time > 5000) {
        // In demo mode, limit wait times to 5 seconds max
        await new Promise((r) => setTimeout(r, 5000));
        return `waited 5000ms (limited in demo mode, requested ${time}ms)`;
      }

      await new Promise((r) => setTimeout(r, time));

      return `waited ${time}ms`;
    } else if (step.action === "set_variable" || step.action === "variable") {
      if (step.name) {
        variables[step.name] = applyVars(step.value || "");

        return `set ${step.name}`;
      }

      return "no variable set";
    } else if (step.action === "return_string" || step.action === "return") {
      return applyVars(step.value || step.message || "");
    }
  }

  // Once runStep returns after all steps are run, return.
  writeLog("info", `Workflow with id ${id} completed`);

  return { success: true, lastResponse: lastResponse };
}
