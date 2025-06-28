"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem, SelectSection } from "@heroui/select"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Form } from "@heroui/form";
import { FiSave, FiClock } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";
import { RiTelegram2Line } from "react-icons/ri";
import { SiCurl } from "react-icons/si";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import workflowsData from "../../workflows.json"

const actionIcons: Record<string, React.ReactNode> = {
    ai: <SiOpenai />,
    telegram: <RiTelegram2Line />,
    request: <SiCurl />,
    wait: <FiClock />,
};

export default function EditWorkflow() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const workflow = workflowsData.workflows.find((w) => w.id === id);

    const [name, setName] = useState(workflow?.name || "");
    const [description, setDescription] = useState(workflow?.description || "");
    const [trigger, setTrigger] = useState(workflow?.trigger || "");
    const [model, setModel] = useState(workflow?.model || "");
    const [actions, setActions] = useState<any[]>(workflow?.steps || []);

    const actionOptions = [
        { key: "ai", label: "Call to AI", icon: <SiOpenai />},
        {
            key: "telegram",
            label: "Send a Telegram message",
            icon: <RiTelegram2Line />
        },
        { key: "request", label: "Send an HTTP request", icon: <SiCurl /> },
    ];

    const handleAddAction = (key: React.Key) => {
        const action = actionOptions.find((a) => a.key === String(key));

        if (action) 
            setActions((prev) => [...prev, { key: action.key, label: action.label }]);
    };

    const handleRemoveAction = (idx: number) => {
        setActions((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const workflowData = {
            name,
            description,
            trigger,
            model,
            actions: actions.map((a, index) => ({
                id: index + 1,
                action: a.key,
                label: a.key,
            })),
        };

        fetch(`/api/editworkflow/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workflowData),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    router.push("/");
                } else {
                    console.error("Failed to update workflow:", result.error)
                }
            })
            .catch((err) => {
                console.error("error updating workflow:", err)
            });
    };

    if (!workflow) {
        return <div className="p-8">Workflow not found!</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Edit Workflow</h1>
                <Form className="mb-6" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="Workflow name"
                        labelPlacement="outside"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Optional description"
                        labelPlacement="outside"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <br/>
                    <br/>

                    <Select
                        isRequired
                        label="Trigger"
                        labelPlacement="outside"
                        placeholder="Select a trigger"
                        selectedKeys={trigger}
                        onChange={(e) => setTrigger(e.target.value)}
                    >
                        <SelectItem key="webhook">Webhook</SelectItem>
                        <SelectItem key="cron">Schedule/cron</SelectItem>
                    </Select>

                    <Select
                        isRequired
                        label="Model"
                        labelPlacement="outside"
                        placeholder="Select a model"
                        selectedKeys={model}
                        onChange={(e) => setTrigger(e.target.value)}
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

                    <br/>
                    <br/>

                    <div className="p-4 border border-dashed border-default-300 rounded-lg text-center mx-auto max-w-750">
                        {actions.length === 0 ? (
                            <p className='text-default-500'>No actions configured yet</p>
                        ) : (
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-2"> 
                                {actions.map((action, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-default-200 rounded-full">
                                            {actionIcons[action.key]}
                                            {action.label}
                                            <button
                                                aria-label="Remove action"
                                                className="ml-1 text-xs text-red-500 hover:underline"
                                                type="button"
                                                onClick={() => handleRemoveAction(idx)}
                                            >
                                                x
                                            </button>
                                        </span>
                                        {idx < actions.length - 1 && (
                                            <span className="text-lg">→</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                     <Dropdown>
                        <DropdownTrigger>
                            <Button className="mt-2" size="sm">
                                Add action
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
            </div>
        </div>
    );
}