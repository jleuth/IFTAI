"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { FiSave, FiClock } from "react-icons/fi";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from "@heroui/react";
import { SiOpenai, SiCurl } from "react-icons/si";
import { RiTelegram2Line } from "react-icons/ri";
import { FaQuestion, FaArrowRightToBracket } from "react-icons/fa6";

import StepConfig from "./StepConfig";

interface Action {
  key: string;
  label: string;
  [key: string]: any;
}

interface Workflow {
  // model is now lumped in with actions
  name?: string;
  description?: string;
  trigger?: string;
  schedule?: string;
  steps?: Action[];
}

interface WorkflowFormProps {
  workflow?: Workflow;
  onSubmit: (data: {
    name: string;
    description?: string;
    trigger: string;
    schedule?: string;
    actions: Action[];
  }) => void;
}

const actionOptions = [
  { key: "ai", label: "Call to AI", icon: <SiOpenai /> },
  {
    key: "telegram",
    label: "Send a mesage on Telegram",
    icon: <RiTelegram2Line />,
  },
  { key: "request", label: "Make an HTTP request", icon: <SiCurl /> },
  { key: "wait", label: "Wait a specific amount of time", icon: <FiClock /> },
  { key: "variable", label: "Set a variable", icon: <FaQuestion /> },
  {
    key: "return",
    label: "Return a plain string",
    icon: <FaArrowRightToBracket />,
  },
];

export default function WorkflowForm({
  workflow,
  onSubmit,
}: WorkflowFormProps) {
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [trigger, setTrigger] = useState(workflow?.trigger || "");
  const [schedule, setSchedule] = useState(workflow?.schedule || "");
  const [actions, setActions] = useState<Action[]>(
    workflow?.steps?.map((s: any) => ({
      key: s.action,
      label: s.action,
      ...s,
    })) || [],
  );

  const handleAddAction = (key: React.Key) => {
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
          defaults = { method: "GET", url: "", body: "" };
          break;
        case "wait":
          defaults = { time: "" };
          break;
        case "variable":
          defaults = { name: "", value: "" };
          break;
        case "return":
          defaults = { value: "" };
          break;
      }
      setActions((prev) => [
        ...prev,
        { key: action.key, label: action.label, ...defaults },
      ]);
    }
  };

  const handleRemoveAction = (idx: number) => {
    setActions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, description, trigger, schedule, actions });
  };

  return (
    <Form className="mb-6" onSubmit={handleSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a workflow name"
        label="Workflow name"
        labelPlacement="outside"
        placeholder="My awesome cookie baking workflow"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="Optional description"
        labelPlacement="outside"
        placeholder="MAKE COOKIE FAST"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <Select
        isRequired
        label="Trigger"
        labelPlacement="outside"
        placeholder="When new Crumbl flavors drop"
        selectedKeys={trigger ? new Set([trigger]) : new Set()}
        onSelectionChange={(keys) => setTrigger(Array.from(keys)[0] as string)}
      >
        <SelectItem key="webhook">Webhook</SelectItem>
        <SelectItem key="cron">Schedule/Cron</SelectItem>
        <SelectItem key="form">Form input</SelectItem>
        <SelectItem key="link">Web page</SelectItem>
        <SelectItem key="manual">Manual</SelectItem>
      </Select>

      {trigger === "cron" && (
        <Input
          isRequired
          label="Cron Schedule"
          labelPlacement="outside"
          placeholder="* * * * *"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
        />
      )}

      <br />
      <br />

      <div className="p-4 border border-dashed border-default-300 rounded-lg text-center mx-auto max-w-750">
        {actions.length === 0 ? (
          <p className="text-default-500">No actions configures</p>
        ) : (
          <div className="flex flex-col gap-4">
            {actions.map((action, idx) => (
              <StepConfig
                key={idx}
                index={idx}
                step={action}
                onChange={(i, field, value) =>
                  setActions((prev) =>
                    prev.map((a, j) =>
                      j === i ? { ...a, [field]: value } : a,
                    ),
                  )
                }
                onRemove={handleRemoveAction}
              />
            ))}
          </div>
        )}
        <Dropdown>
          <DropdownTrigger>
            <Button className="mt-2" size="sm">
              Add Action!
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

      <Button color="primary" startContent={<FiSave />} type="submit">
        Save
      </Button>
    </Form>
  );
}
