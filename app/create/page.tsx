'use client'

import { Button } from "@heroui/button"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"
import { Input, Textarea } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { FiSave, FiX } from "react-icons/fi"
import { SiOpenai } from "react-icons/si";
import { RiTelegram2Line } from "react-icons/ri";
import { SiCurl } from "react-icons/si";
import { Form } from "@heroui/form"
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@heroui/dropdown";
import React, { useState } from "react";
import type { Key } from "react";

function constructWorkflow(name: string, trigger: string, actions: any, description?: string) {

}

export default function CreateWorkflow() {
  const [actions, setActions] = useState<any[]>([]);

  // Action options
  const actionOptions = [
    { key: "ai", label: "Call to AI", icon: <SiOpenai /> },
    { key: "telegram", label: "Send a Telegram message", icon: <RiTelegram2Line /> },
    { key: "request", label: "Send an HTTP request", icon: <SiCurl /> },
  ];

  // Add action handler
  const handleAddAction = (key: Key) => {
    const action = actionOptions.find((a) => a.key === String(key));
    if (action) setActions((prev) => [...prev, action]);
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
          constructWorkflow('1', '1', '1');
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
              label="Trigger"
              labelPlacement="outside"
              placeholder="Select a trigger"
            >
              <SelectItem key="webhook">Webhook</SelectItem>
              <SelectItem key="cron">Schedule/cron</SelectItem>
            </Select>

            <br/><br/>

            <div className="p-4 border border-dashed border-default-300 rounded-lg text-center mx-auto max-w-2xl">
              {actions.length === 0 ? (
                <p className="text-default-500">No actions configured yet</p>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  {actions.map((action, idx) => (
                    <React.Fragment key={idx}>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-default-200 rounded-full">
                        {action.icon}
                        {action.label}
                        <button
                          type="button"
                          className="ml-2 text-xs text-red-500 hover:underline"
                          onClick={() => handleRemoveAction(idx)}
                          aria-label="Remove action"
                        >
                          ✕
                        </button>
                      </span>
                      {idx < actions.length - 1 && <span className="text-lg">→</span>}
                    </React.Fragment>
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
        </Form>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Basic Information</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Workflow Name"
              placeholder="Enter workflow name"
              variant="bordered"
            />
            <Input
              label="Description"
              placeholder="Describe what this workflow does"
              variant="bordered"
            />
            <Select
              label="Category"
              placeholder="Select a category"
              variant="bordered"
            >
              <SelectItem key="automation">Automation</SelectItem>
              <SelectItem key="integration">Integration</SelectItem>
              <SelectItem key="notification">Notification</SelectItem>
              <SelectItem key="data-processing">Data Processing</SelectItem>
            </Select>
          </CardBody>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Trigger Configuration</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Trigger Type"
              placeholder="Select trigger type"
              variant="bordered"
            >
              <SelectItem key="webhook">Webhook</SelectItem>
              <SelectItem key="schedule">Schedule</SelectItem>
              <SelectItem key="manual">Manual</SelectItem>
            </Select>
            <Input
              label="Trigger URL (if webhook)"
              placeholder="https://your-domain.com/webhook"
              variant="bordered"
            />
          </CardBody>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            variant="bordered"
            startContent={<FiX />}
            onPress={() => window.location.href = '/'}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            startContent={<FiSave />}
            onPress={() => {
              // Handle save logic here
              console.log('Saving workflow...')
            }}
          >
            Save Workflow
          </Button>
        </div>
      </div>
    </div>
  )
}
