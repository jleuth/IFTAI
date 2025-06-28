'use client'

import { Button } from "@heroui/button"
import { Input, Textarea } from "@heroui/input"
import { Select, SelectItem, SelectSection } from "@heroui/select"
import { FiSave, FiX, FiClock, FiMessageSquare } from "react-icons/fi"
import { SiOpenai } from "react-icons/si";
import { RiTelegram2Line } from "react-icons/ri";
import { SiCurl } from "react-icons/si";
import { FaQuestion } from "react-icons/fa";
import { Form } from "@heroui/form"
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@heroui/dropdown";
import React, { useState } from "react";
import type { Key } from "react";

import StepConfig from "@/components/StepConfig"

// Icon mapping for rendering only
const actionIcons: Record<string, React.ReactNode> = {
  ai: <SiOpenai />,
  telegram: <RiTelegram2Line />,
  request: <SiCurl />,
  wait: <FiClock />,
  variable: <FaQuestion />,
  return: <FiClock />
};

function constructWorkflow(data: any) {
  console.log(data)
  const workflowData = {
    name: data.name,
    description: data.description || '',
    trigger: data.trigger,
    schedule: data.schedule,
    model: data.model,
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
      value: action.value
    }))
  };

  fetch('/api/createworkflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', "x-auth-token": process.env.AUTH_TOKEN as string
    },
    body: JSON.stringify(workflowData)
  })
  .then((response) => response.json())
  .then((result) => {
    if (result.success) {
      console.log('Workflow created successfully:', result.workflow);
      // Redirect to dashboard or show success message
      window.location.href = '/';
    } else {
      console.error('Failed to create workflow:', result.error);
    }
  })
  .catch((error) => {
    console.error('Error creating workflow:', error);
  });
}

export default function CreateWorkflow() {
  const [actions, setActions] = useState<any[]>([]);
  const [trigger, setTrigger] = useState<any>(null);
  const [model, setModel] = useState<any>(null);
  const [schedule, setSchedule] = useState("");
  // Action options (icon is only used for rendering, not for state)
  const actionOptions = [
    { key: "ai", label: "Call to AI", icon: <SiOpenai /> },
    { key: "telegram", label: "Send a Telegram message", icon: <RiTelegram2Line /> },
    { key: "request", label: "Send an HTTP request", icon: <SiCurl /> },
    { key: "wait", label: "Wait for a specific amount of time", icon: <FiClock /> },
    { key: "variable", label: "Set a variable", icon: <FaQuestion /> },
    { key: "return", label: "Return a plain string", icon: <FiClock /> }
  ];

  // Add action handler 
  const handleAddAction = (key: Key) => {
    const action = actionOptions.find((a) => a.key === String(key));
    if (action) {
      let defaults: any = {};

      switch (action.key) {
        case "ai":
          defaults = { instructions: "", model: "" };
          break;
        case "telegram":
          defaults = { message: "" };
          break;
        case "request":
          defaults = { method: "GET", url: "", body: ""}
          break;
        case "wait":
          defaults = { time: ""}
          break;
        case "variable":
          defaults={ name: "", value: "" };
          break
        case "return":
          defaults = { value: "" }
          break;
      }
      setActions((prev) => [
        ...prev,
        { key: action.key, label: action.label, ...defaults}
      ])
    }
  };

  // Remove action handler
  const handleRemoveAction = (idx: number) => {
    setActions((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Workflow</h1>
        
        <Form className="mb-6" onSubmit={(e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(e.currentTarget));
          data.actions = actions as any;
          data.trigger = trigger as any;
          data.model = model as any;
          constructWorkflow(data);
        }}>
            <Input
              isRequired
              errorMessage="Please enter a workflow name"
              label="Workflow name"
              labelPlacement="outside"
              name="name"
              placeholder="Cookie baking workflow"
              type="text"
            />

            <Input
              label="Optional description"
              labelPlacement="outside"
              name="description"
              placeholder="This workflow will auto-make cookies!"
              type="text"
            />

            <br/><br/>

            <Select
              isRequired
              label="Trigger"
              labelPlacement="outside"
              placeholder="Select a trigger"
              onChange={(e) => setTrigger(e.target.value)}
            >
              <SelectItem key="webhook">Webhook</SelectItem>
              <SelectItem key="cron">Schedule/cron</SelectItem>
            </Select>

            {trigger === "cron" && (
              <Input
                isRequired
                label="Cron schedule"
                labelPlacement="outside"
                name="schedule"
                placeholder="* * * * *"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            )}

            <Select
              isRequired
              label="Model"
              labelPlacement="outside"
              placeholder="Select a model"
              onChange={(e) => setModel(e.target.value)}
            >
              <SelectSection showDivider title="GPT series">
                <SelectItem key="gpt-4.1">GPT-4.1</SelectItem>
                <SelectItem key="gpt-4.1-mini">GPT-4.1 Mini</SelectItem>
                <SelectItem key="gpt-4.1-nano">GPT-4.1 Nano</SelectItem>
              </SelectSection>
              <SelectSection showDivider title="o series">
                <SelectItem key="o4-mini">o4-mini</SelectItem>
                <SelectItem key="o3">o3</SelectItem>
                <SelectItem key="o3-pro">o3-pro</SelectItem>
              </SelectSection>
            </Select>

            <br/><br/>

            <div className="p-4 border border-dashed border-default-300 rounded-lg text-center mx-auto max-w-750">
              {actions.length === 0 ? (
                <p className="text-default-500">No actions configured yet</p>
              ) : (
                <div className="flex flex-col gap-4">
                    {actions.map((action, idx) => (
                      <StepConfig
                        key={idx}
                        index={idx}
                        step={action}
                        onChange={(idx: number, field: any, value: any) =>
                          setActions((prev) =>
                            prev.map((a, j) =>
                              j === idx ? { ...a, [field]: value} : a
                            )
                          )
                        }
                        onRemove={handleRemoveAction}
                      />
                    ))}
                </div>
              )}
              <Dropdown>
                <DropdownTrigger>
                  <Button size="sm" className="mt-2">
                    Add Action
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={handleAddAction}>
                  {actionOptions.map((action) => (
                    <DropdownItem key={action.key} startContent={action.icon}>
                      {action.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <Button type="submit" color="primary" startContent={<FiSave/>}>Save</Button>
        </Form>

        </div>
      </div>
  )
}
