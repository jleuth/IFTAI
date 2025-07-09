"use client";

import { redirect } from "next/navigation";
import React, { useState, useEffect } from "react";
import { isDemoMode } from "@/config/demo";

// Import both workflow files
import normalWorkflows from "../../workflows.json";
import demoWorkflows from "../../workflows.demo.json";

// Define a common type for workflows
type WorkflowData = {
  workflows: Array<{
    id: number;
    name: string;
    description?: string;
    trigger: string;
    schedule?: string;
    model?: string; // Add this missing property
    steps: Array<{
      id: number;
      action: string;
      [key: string]: any; // Allow any additional properties
    }>;
  }>;
};

import WorkflowForm from "@/components/WorkflowForm";
import PageTitle from "@/components/PageTitle";

export default function EditWorkflow({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [workflowsData, setWorkflowsData] = useState<WorkflowData>(
    isDemoMode ? (demoWorkflows as WorkflowData) : (normalWorkflows as WorkflowData),
  );
  const [isLoading, setIsLoading] = useState(true);
  const id = React.use(params);

  useEffect(() => {
    // Use demo workflows if demo mode is enabled
    if (isDemoMode) {
      setWorkflowsData(demoWorkflows as WorkflowData);
    } else {
      setWorkflowsData(normalWorkflows as WorkflowData);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const workflow = workflowsData.workflows.find(
    (w) => w.id === parseInt(id.id),
  );

  if (!workflow) {
    return <div className="p-8">Workflow not found!</div>;
  }

  const { steps, ...workflowRest } = workflow;
  const workflowWithActions = {
    ...workflowRest,
    steps: (steps || []).map((step: any) => ({
      ...step,
      key: step.action,
      label: step.action,
      // Include all step properties that might be needed by the form
      instructions: step.instructions,
      model: step.model,
      message: step.message,
      method: step.method,
      url: step.url,
      body: step.body,
      time: step.time,
      name: step.name,
      value: step.value,
    })),
  };

  const handleSubmit = (data: any) => {
    const workflowData = {
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      schedule: data.schedule,
      actions: data.actions.map((a: any, index: number) => ({
        id: index + 1,
        action: a.key,
        label: a.key,
        instructions: a.instructions,
        model: a.model,
        message: a.message,
        url: a.url,
        body: a.body,
        time: a.time,
        name: a.name,
        value: a.value,
      })),
    };

    fetch(`/api/editworkflow/${id.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string,
      },
      body: JSON.stringify(workflowData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          redirect("/");
        } else {
          console.error("Failed to update your workflow. Error:", result.error);
        }
      })
      .catch((err) => {
        console.error("Error updating workflow:", err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageTitle>Edit a workflow</PageTitle>
        <WorkflowForm workflow={workflowWithActions} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
