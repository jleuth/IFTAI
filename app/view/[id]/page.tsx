"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@heroui/input";
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

import PageTitle from "@/components/PageTitle";

interface LogEntry {
  type: string;
  message: string;
  timestamp: string;
}

export default function ViewWorkflow() {
  const [workflowsData, setWorkflowsData] = useState<WorkflowData>(
    isDemoMode ? (demoWorkflows as WorkflowData) : (normalWorkflows as WorkflowData),
  );
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [manualInput, setManualInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [stepResults, setStepResults] = useState<{[key: number]: string}>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Use demo workflows if demo mode is enabled
    if (isDemoMode) {
      setWorkflowsData(demoWorkflows as WorkflowData);
    } else {
      setWorkflowsData(normalWorkflows as WorkflowData);
    }
  }, []);

  const workflow = workflowsData.workflows.find((w) => w.id === id);

  // Process logs to extract step information
  const processLogs = (logs: LogEntry[]) => {
    const newStepResults: {[key: number]: string} = {};
    let currentExecutingStep: number | null = null;
    let workflowStarted = false;
    let workflowCompleted = false;
    
    logs.forEach((log) => {
      // Check if workflow started
      if (log.message.includes("Workflow with id") && log.message.includes("found")) {
        workflowStarted = true;
      }
      
      // Check if workflow completed
      if (log.message.includes("completed")) {
        workflowCompleted = true;
      }
      
      // Extract step results - handle multiline responses
      const stepMatch = log.message.match(/Response from step #(\d+) was "(.+)"$/s);
      if (stepMatch) {
        const stepNum = parseInt(stepMatch[1]);
        const response = stepMatch[2];
        newStepResults[stepNum] = response;
      }
    });
    
    // Determine current step
    if (workflowCompleted) {
      currentExecutingStep = null;
    } else if (workflowStarted) {
      // Find the next step to execute
      const completedSteps = Object.keys(newStepResults).map(Number);
      const maxCompletedStep = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
      currentExecutingStep = maxCompletedStep + 1;
      
      // Make sure we don't go beyond available steps
      if (workflow && currentExecutingStep > workflow.steps.length) {
        currentExecutingStep = null;
      }
    }
    
    setStepResults(newStepResults);
    setCurrentStep(currentExecutingStep);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  async function manualTrigger(id: number) {
    setIsExecuting(true);
    setShowLogs(true);
    
    // Clear logs and reset state
    setLogs([]);
    setStepResults({});
    setCurrentStep(1); // Start with step 1 executing
    const startTime = new Date().toISOString();

    const fetchLogsFromTime = async (fromTime: string) => {
      const res = await fetch("/api/logs", {
        headers: { "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string },
      });
      const data = await res.json();
      
      // Filter logs to only show those from this session
      const filteredLogs = (data.logs || []).filter((log: LogEntry) => 
        log.timestamp >= fromTime
      );
      setLogs(filteredLogs);
      processLogs(filteredLogs);
    };

    try {
      // Start polling immediately for real-time updates
      let pollCount = 0;
      const maxPolls = 30; // Poll for 30 seconds
      
      intervalRef.current = setInterval(async () => {
        pollCount++;
        
        try {
          // Get fresh logs
          const res = await fetch("/api/logs", {
            headers: { "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string },
          });
          
          if (!res.ok) {
            console.error("Failed to fetch logs:", res.statusText);
            return;
          }
          
          const data = await res.json();
          
          const filteredLogs = (data.logs || []).filter((log: LogEntry) => 
            log.timestamp >= startTime
          );
          
          setLogs(filteredLogs);
          processLogs(filteredLogs);
          
          // Check if workflow is completed by looking for completion message
          const hasCompleted = filteredLogs.some(log => log.message.includes("completed"));
          
          if (hasCompleted) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsExecuting(false);
          } else if (pollCount >= maxPolls) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsExecuting(false);
          }
        } catch (error) {
          console.error("Error during polling:", error);
        }
      }, 500); // Poll every 500ms for better responsiveness

      // Trigger the workflow (this will start the execution)
      await fetch(`/api/webhook/${id}?input=${encodeURIComponent(manualInput)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string,
        },
      });

    } catch (error) {
      console.error("Error triggering workflow:", error);
      setIsExecuting(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }

  if (!workflow) {
    return <div className="p-8">Workflow not found oopsies</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageTitle>{workflow.name}</PageTitle>
        {workflow.description && (
          <p className="mb-6 text-default-500">{workflow.description}</p>
        )}
        <Card className="mb-6">
          <CardHeader className="font-semibold">Workflow details</CardHeader>
          <CardBody className="space-y-2">
            <p>
              <strong>Trigger:</strong> {workflow.trigger}
            </p>
            {workflow.schedule && (
              <p>
                <strong>Schedule:</strong> {workflow.schedule}
              </p>
            )}
            {workflow.model && (
              <p>
                <strong>Model:</strong> {workflow.model}
              </p>
            )}
            <div>
              <p className="font-semibold mb-1">Steps:</p>
              <ol className="list-decimal ml-4 space-y-2">
                {workflow.steps.map((step: any) => (
                  <li key={step.id}>
                    <p>
                      <strong>Action:</strong> {step.action}
                    </p>
                    {step.instructions && (
                      <p>
                        <strong>Instructions:</strong> {step.instructions}
                      </p>
                    )}
                    {step.message && (
                      <p>
                        <strong>Message:</strong> {step.message}
                      </p>
                    )}
                    {step.url && (
                      <p>
                        <strong>URL:</strong> {step.url}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </CardBody>
        </Card>
        <div className="flex flex-row justify-between items-center gap-8">
          <Button onPress={() => router.push("/")}>Back home</Button>
          <div className="flex flex-row items-center gap-2">
            <Input
              className="max-w-50 h-10"
              label="Input"
              placeholder={workflow.name === "Content Summarizer" ? "Enter URL to summarize" : "Enter workflow input"}
              onValueChange={setManualInput}
              description={workflow.name === "Content Summarizer" ? "Paste a URL to get a summary" : workflow.name === "Simple Greeting Bot" ? "Enter your message" : "Enter any required input for the workflow"}
            />
            <Button 
              onPress={() => manualTrigger(workflow.id)}
              isLoading={isExecuting}
              disabled={isExecuting}
            >
              {isExecuting ? "Executing..." : "Trigger"}
            </Button>
          </div>
        </div>
        {showLogs && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Workflow Execution</h3>
            <div className="space-y-3">
              {workflow?.steps.map((step, idx) => {
                const stepNum = step.id;
                const stepResult = stepResults[stepNum];
                const isCompleted = stepResult !== undefined;
                const isActive = currentStep === stepNum;
                const isPending = !isCompleted && !isActive;
                
                return (
                  <Card key={stepNum} className={`${
                    isActive ? 'ring-2 ring-blue-500' : 
                    isCompleted ? 'ring-1 ring-green-500' : 
                    'opacity-60'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted ? 'bg-green-500 text-white' :
                          isActive ? 'bg-blue-500 text-white animate-pulse' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? '✓' : stepNum}
                        </div>
                        <div>
                          <h4 className="font-semibold">Step {stepNum}: {step.action}</h4>
                          {step.instructions && (
                            <p className="text-sm text-gray-600">{step.instructions}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {(isCompleted || isActive) && (
                      <CardBody className="pt-0">
                        {isActive && !isCompleted && (
                          <p className="text-blue-600 italic">Executing...</p>
                        )}
                        {isCompleted && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Result:</p>
                            <p className="text-sm text-black mt-1">{stepResult}</p>
                          </div>
                        )}
                      </CardBody>
                    )}
                  </Card>
                );
              })}
                
                {isExecuting && (
                  <Card className="border-dashed border-2 border-blue-300">
                    <CardBody>
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className="text-blue-600">Workflow is running...</p>
                      </div>
                    </CardBody>
                  </Card>
                )}
                
                {!isExecuting && Object.keys(stepResults).length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardBody>
                      <p className="text-green-700 font-medium">✓ Workflow completed successfully!</p>
                    </CardBody>
                  </Card>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
