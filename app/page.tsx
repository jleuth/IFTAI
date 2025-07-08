"use client";

import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  FiPlus,
  FiEdit,
  FiSettings,
  FiEye,
  FiFileText,
  FiX,
} from "react-icons/fi";
import { isDemoMode, demoConfig } from "@/config/demo";

import workflowsData from "./workflows.json";

export default function Dashboard() {
  const workflowCount = workflowsData.workflows.length;
  const canCreateMore = !isDemoMode || workflowCount < demoConfig.maxWorkflows;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">What're we automating next?</h1>

      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">
                Demo Mode Features
              </h3>
              <p className="text-blue-700 text-sm">
                • External services are safely mocked • Workflow limit:{" "}
                {workflowCount}/{demoConfig.maxWorkflows} • Settings changes
                disabled
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-6 mb-8">
        <Button
          color="primary"
          size="lg"
          startContent={<FiPlus />}
          isDisabled={!canCreateMore}
          onPress={() => {
            window.location.href = "/create";
          }}
        >
          {canCreateMore
            ? "Create a new workflow"
            : `Max workflows reached (${demoConfig.maxWorkflows})`}
        </Button>
        <Button
          size="lg"
          startContent={<FiFileText />}
          onPress={() => {
            window.location.href = "/logs";
          }}
        >
          View logs
        </Button>
        <Button
          size="lg"
          startContent={<FiSettings />}
          onPress={() => {
            window.location.href = "/settings";
          }}
        >
          Settings
        </Button>
        <Button
          color="danger"
          size="lg"
          startContent={<FiX />}
          onPress={() => {
            fetch("/api/stop", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string,
              },
            });
          }}
        >
          EMERGENCY STOP
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowsData.workflows.map((workflow, index) => (
          <Card key={workflow.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-bold">{workflow.name}</h2>
              {isDemoMode && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  DEMO
                </span>
              )}
            </CardHeader>
            <CardBody>
              <p>Trigger: {workflow.trigger}</p>
              <p>Steps: {workflow.steps.length}</p>
              {workflow.description && (
                <p className="text-sm text-default-500 mt-2">
                  {workflow.description}
                </p>
              )}
            </CardBody>
            <CardFooter>
              <div className="flex flex-row gap-3">
                <Button
                  size="md"
                  startContent={<FiEdit />}
                  isDisabled={
                    isDemoMode && !demoConfig.allowWorkflowEdit
                  }
                  onPress={() => {
                    window.location.href = `/edit/${workflow.id}`;
                  }}
                >
                  {isDemoMode && !demoConfig.allowWorkflowEdit
                    ? "View Only"
                    : "Edit workflow"}
                </Button>
                <Button
                  size="md"
                  startContent={<FiEye />}
                  onPress={() => {
                    window.location.href = `/view/${workflow.id}`;
                  }}
                >
                  View workflow
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
