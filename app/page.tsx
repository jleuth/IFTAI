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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            What're we automating next?
          </h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Build powerful automation workflows that connect your favorite services and streamline your daily tasks.
          </p>
        </div>

        {isDemoMode && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Demo Mode Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    External services safely mocked
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    Workflow limit: {workflowCount}/{demoConfig.maxWorkflows}
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    Settings changes disabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            color="primary"
            size="lg"
            startContent={<FiPlus />}
            isDisabled={!canCreateMore}
            className="shadow-lg hover:shadow-xl transition-shadow font-semibold"
            onPress={() => {
              window.location.href = "/create";
            }}
          >
            {canCreateMore
              ? "Create New Workflow"
              : `Max workflows reached (${demoConfig.maxWorkflows})`}
          </Button>
          <Button
            size="lg"
            variant="bordered"
            startContent={<FiFileText />}
            className="shadow-sm hover:shadow-md transition-shadow font-semibold"
            onPress={() => {
              window.location.href = "/logs";
            }}
          >
            View Logs
          </Button>
          <Button
            size="lg"
            variant="bordered"
            startContent={<FiSettings />}
            className="shadow-sm hover:shadow-md transition-shadow font-semibold"
            onPress={() => {
              window.location.href = "/settings";
            }}
          >
            Settings
          </Button>
          <Button
            color="danger"
            size="lg"
            variant="bordered"
            startContent={<FiX />}
            className="shadow-sm hover:shadow-md transition-shadow font-semibold"
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
            Emergency Stop
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowsData.workflows.map((workflow, index) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  {workflow.name}
                </h2>
                {isDemoMode && (
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
                    DEMO
                  </span>
                )}
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-default-700">Trigger:</span>
                    <span className="text-sm font-bold px-2 py-1 rounded capitalize">
                      {workflow.trigger}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm font-medium text-default-700">Steps:</span>
                    <span className="text-sm font-bold px-2 py-1 rounded">
                      {workflow.steps.length}
                    </span>
                  </div>
                  {workflow.description && (
                    <p className="text-sm text-default-600 mt-3 leading-relaxed">
                      {workflow.description}
                    </p>
                  )}
                </div>
              </CardBody>
              <CardFooter className="pt-4">
                <div className="flex flex-row gap-2 w-full">
                  <Button
                    size="sm"
                    variant="bordered"
                    startContent={<FiEdit />}
                    isDisabled={
                      isDemoMode && !demoConfig.allowWorkflowEdit
                    }
                    className="flex-1 font-medium"
                    onPress={() => {
                      window.location.href = `/edit/${workflow.id}`;
                    }}
                  >
                    {isDemoMode && !demoConfig.allowWorkflowEdit
                      ? "View Only"
                      : "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    startContent={<FiEye />}
                    className="flex-1 font-medium"
                    onPress={() => {
                      window.location.href = `/view/${workflow.id}`;
                    }}
                  >
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
