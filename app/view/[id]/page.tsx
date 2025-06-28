'use client'

import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { useParams, useRouter } from "next/navigation"
import workflowsData from "../../workflows.json"
import React from "react"

export default function ViewWorkflow() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const workflow = workflowsData.workflows.find((w) => w.id === id);

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
                <Button onPress={() => router.push('/')}>Back home</Button>
            </div>
        </div>
    )
}