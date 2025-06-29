"use client";

import React from "react";

import PageTitle from "@/components/PageTitle";
import WorkflowForm from "@/components/WorkflowForm";

function constructWorkflow(data: any) {
  console.log(data);
  const workflowData = {
    name: data.name,
    description: data.description || "",
    trigger: data.trigger,
    schedule: data.schedule,
    actions: (data.actions || []).map((action: any, index: number) => ({
      id: index + 1,
      action: action.key,
      label: action.label,
      instructions: action.instructions,
      model: action.model,
      message: action.message,
      method: action.method,
      url: action.url,
      body: action.body,
      time: action.time,
      name: action.name,
      value: action.value,
    })),
  };

  fetch("/api/createworkflow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": process.env.AUTH_TOKEN as string,
    },
    body: JSON.stringify(workflowData),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log("Workflow created successfully:", result.workflow);

        // Redirect to dashboard or show success message
        window.location.href = "/";
      } else {
        console.error("Failed to create workflow:", result.error);
      }
    })
    .catch((error) => {
      console.error("Error creating workflow:", error);
    });
}

export default function CreateWorkflow() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageTitle>Create New Workflow</PageTitle>
        <WorkflowForm onSubmit={constructWorkflow} />
      </div>
    </div>
  );
}
