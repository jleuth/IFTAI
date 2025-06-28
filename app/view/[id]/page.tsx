'use client'

import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { useParams, useRouter } from "next/navigation"
import workflowsData from "../../workflows.json"
import React, { useEffect, useRef, useState } from "react"
import { Input } from "@heroui/input"
import { Spacer } from "@heroui/react"

interface LogEntry {
    type: string;
    message: string;
    timestamp: string;
  }

export default function ViewWorkflow() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const workflow = workflowsData.workflows.find((w) => w.id === id);
    const [manualInput, setManualInput] = useState("")
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [showLogs, setShowLogs] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

   async function manualTrigger(id: number) {
        setShowLogs(true)

        const fetchLogs = async () => {
            const res = await fetch("/api/logs")
            const data = await res.json();

            setShowLogs(data.logs || [])
        }

        await fetchLogs();

        await fetch(`/api/webhook/${id}?input=${manualInput}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    

    if (!workflow) {
        return <div className="p-8">Workflow not found oopsies</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{workflow.name}</h1>
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
                    <Button onPress={() => router.push('/')}>Back home</Button>
                    <div className="flex flex-row items-center gap-2">
                    <Input onValueChange={setManualInput} label="Input" className="max-w-50 h-10"/>
                    <Button onPress={() => manualTrigger(workflow.id)}>Trigger</Button>
                    </div>
                </div>
                {showLogs && (
                    <div className="mt-6 space-y-4">
                        {logs.length === 0 ? (
                            <p>No logs yet...</p>
                        ) : (
                            logs.map((log: any, idx: number) => (
                                <Card key={idx}>
                                    <CardHeader className="flex justify-between font-semibold">
                                        <span>{log.type}</span>
                                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                                    </CardHeader>
                                    <CardBody>
                                        <p>{log.message}</p>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}