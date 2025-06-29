"use client";

import { redirect } from "next/navigation";
import React from "react";

import workflowsData from "../../workflows.json";

import WorkflowForm from "@/components/WorkflowForm";
import PageTitle from "@/components/PageTitle";

export default function EditWorkflow({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = React.use(params);
  const workflow = workflowsData.workflows.find(
    (w) => w.id === parseInt(id.id),
  );

  if (!workflow) {
    return <div className="p-8">Workflow not found!</div>;
  }

  const { steps, ...workflowRest } = workflow;
  const workflowWithActions = {
    ...workflowRest,
    actions: (steps || []).map((step: any) => ({
      ...step,
      key: step.action,
      label: step.action,
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
        "x-auth-token": process.env.AUTH_TOKEN as string,
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
