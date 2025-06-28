import { Input, Textarea } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { FiX } from "react-icons/fi"
import React from "react"

interface Step {
    key: string;
    label: string
    [key: string]: any
}

interface Props {
    step: Step
    index: number
    onChange: (index: number, field: string, value: any) => void
    onRemove: (index: number) => void
}

export default function StepConfig({ step, index, onChange, onRemove}: Props) {
    const handleField = (field: string) => (e: any) => {
        onChange(index, field, e.target ? e.target.value : e)
    }

    return (
        <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold flex items-center gap-2">
                    {step.label}
                </span>
                <button
                    className="text-red-500"
                    type="button"
                    onClick={() => onRemove(index)}
                >
                    <FiX />
                </button>
            </div>
            {step.key === 'ai' && (
                <div className='flex flex-col gap-2'>
                    <Select
                        label="Model"
                        labelPlacement="outside"
                        placeholder="Select a model"
                        selectedKeys={step.model ? new Set([step.model]) : new Set()}
                        onSelectionChange={(keys) =>
                            handleField("model")({ target: { value: Array.from(keys)[0] }})
                        }
                    >
                        <SelectItem key="gpt-4.1">GPT-4.1</SelectItem>
                        <SelectItem key="gpt-4.1-mini">GPT-4.1 Mini</SelectItem>
                        <SelectItem key="gpt-4.1-nano">GPT-4.1 Nano</SelectItem>
                        <SelectItem key="o4-mini">o4-mini</SelectItem>
                        <SelectItem key="o3">o3</SelectItem>
                        <SelectItem key="o3-pro">o3-pro</SelectItem>
                    </Select>
                    <Textarea
                        label="Instructions"
                        labelPlacement="outside"
                        placeholder="You are an expert on cookies..."
                        value={step.instructions || ""}
                        onChange={handleField("instrutions")}
                    />
                </div>
            )}
            {step.key === 'telegram' && (
                <Textarea
                    label="Message"
                    labelPlacement="outside"
                    placeholder="I love cookies!"
                    value={step.message || ""}
                    onChange={handleField("message")}
                />
            )}
            {step.key === "request" && (
                <div className="flex flex-col gap-2">
                    <Select
                        label="Method"
                        labelPlacement="outside"
                        placeholder="COOKIE"
                        selectedKeys={
                            step.method ? new Set([step.method]) : new Set(["GET"])
                        }
                        onSelectionChange={(keys) =>
                            handleField("method")({ target: { value: Array.from(keys)[0] }})
                        }
                    >
                        <SelectItem key="GET">GET</SelectItem>
                        <SelectItem key="POST">POST</SelectItem>
                        <SelectItem key="PUT">PUT</SelectItem>
                        <SelectItem key="DELETE">DELETE</SelectItem>
                        <SelectItem key="OPTIONS">OPTIONS</SelectItem>
                    </Select>
                    <Input
                        label="URL"
                        labelPlacement="outside"
                        placeholder="https://crumblcookies.com"
                        value={step.url || ""}
                        onChange={handleField("url")}
                    />
                    <Textarea
                        label="Body"
                        labelPlacement="outside"
                        placeholder="{ cookies: 'yes'}"
                        value={step.body || ""}
                        onChange={handleField("body")}
                    />
                </div>
            )}
            {step.key === "wait" && (
                <Input
                    label="Time to wait (ms)"
                    labelPlacement="outside"
                    placeholder="0ms when waiting for cookies"
                    type="number"
                    value={step.time || ""}
                    onChange={handleField("time")}
                />
            )}
            {step.key === "variable" && (
                <div className="flex flex-col gap-2">
                    <Input
                        label="Variable name"
                        labelPlacement="outside"
                        placeholder="Cookie type"
                        value={step.name || ""}
                        onChange={handleField("name")}
                    />
                    <Input
                        label="Value"
                        labelPlacement="outside"
                        placeholder="Choco chip :3"
                        value={step.value || ""}
                        onChange={handleField("value")}
                    />
                </div>
            )}
            {step.key === "return" && (
                <Textarea
                    label="String to return"
                    labelPlacement="outside"
                    placeholder="Cookies make me happy"
                    value={step.value || ""}
                    onChange={handleField("value")}
                />
            )}
        </div>
    )
}