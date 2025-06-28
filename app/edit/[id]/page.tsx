
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
import StepConfig from "@/components/StepConfig";
import workflowsData from "../../workflows.json"
import { FaQuestion } from "react-icons/fa";
import writeLog from "@/app/lib/logger"
import PageTitle from "@/components/PageTitle";

const actionIcons: Record<string, React.ReactNode> = {
    ai: <SiOpenai />,
    telegram: <RiTelegram2Line />,
    request: <SiCurl />,
    wait: <FiClock />,
    variable: <FaQuestion />,
    return: <FiClock />
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
    const [schedule, setSchedule] = useState(workflow?.schedule || "")
    const [actions, setActions] = useState<any[]>(
        workflow?.steps.map((s: any) => ({
            key: s.action,
            label: s.action,
            ...s,
        })) || [],
    );

    const actionOptions = [
        { key: "ai", label: "Call to AI", icon: <SiOpenai />},
        {
            key: "telegram",
            label: "Send a Telegram message",
            icon: <RiTelegram2Line />
        },
        { key: "request", label: "Send an HTTP request", icon: <SiCurl /> },
        { key: "wait", label: "Wait for a specific amount of time", icon: <FiClock />},
        { key: "variable", label: "Set a variable", icon: <FaQuestion />},
        { key: 'return', label: "Return a plain string", icon: <FiClock />}
    ];

    const handleAddAction = (key: React.Key) => {
        const action = actionOptions.find((a) => a.key === String(key));

        if (action) {
            let defaults: any = {}

            switch (action.key) {
                
                case "ai":
                    defaults = { instructions: "", model: ""}
                    break;
                case "telegram":
                    defaults = { message: "" }
                    break
                case "request":
                    defaults = { method: "GET", url: "", body: ""}
                    break
                case "wait":
                    defaults = { time: "" }
                    break
                case "variable":
                    defaults = { name: "", value: "" }
                    break
                case "return":
                    defaults = { value: "" }
                    break
                }
                setActions((prev) => [
                    ...prev,
                    { key: action.key, label: action.label, ...defaults}
                ])
        }
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
                instructions: a.instructions,
                model: a.model,
                message: a.message,
                url: a.url,
                body: a.body,
                time: a.time,
                name: a.name,
                value: a.value
            })),
        };

        fetch(`/api/editworkflow/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-auth-token": process.env.AUTH_TOKEN as string },
            body: JSON.stringify(workflowData),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    router.push("/");
                } else {
                    console.error("Failed to update workflow:", result.error)
                    writeLog('info', `User attempted to edit workflow ${workflow!.id} with the API but it errored with the following error: ${result.error}`)
                }
            })
            .catch((err) => {
                console.error("error updating workflow:", err)
                writeLog('info', `User attempted to edit workflow ${workflow!.id} but it errored with the following error: ${err}`)
            });

        writeLog('info', `User edited a workflow with the id of ${workflow!.id} with the changes ${workflowData}`)
    };

    if (!workflow) {
        return <div className="p-8">Workflow not found!</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <PageTitle>Edit Workflows</PageTitle>
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
                        selectedKeys={trigger ? new Set([trigger]) : new Set()}
                        onSelectionChange={(keys) =>
                            setTrigger(Array.from(keys)[0] as string)
                        }
                    >
                        <SelectItem key="webhook">Webhook</SelectItem>
                        <SelectItem key="cron">Schedule/cron</SelectItem>
                        <SelectItem key="form">Form</SelectItem>
                        <SelectItem key="link">Website</SelectItem>
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

                    <Select
                        isRequired
                        label="Model"
                        labelPlacement="outside"
                        placeholder="Select a model"
                        selectedKeys={model ? new Set([model]) : new Set()}
                        onSelectionChange={(keys) =>
                            setModel(Array.from(keys)[0] as string)
                        }
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
                    <div className="text-center mt-2">
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
                </div>

                    <Button color="primary" startContent={<FiSave />} type="submit">
                        Save
                    </Button> 
                </Form>
            </div>
        </div>
    );
}