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

            <div className="p-4 border border-dashed border-default-300 rounded-lg text-center mx-auto max-w-750">
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

            <Button type="submit" color="primary" startContent={<FiSave/>}>Save</Button>
        </Form>

        </div>
      </div>
  )
}
