"use client";

import React, {useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import PageTitle from "@/components/PageTitle";

interface LogEntry {
    type: string;
    message: string;
    timestamp: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/logs", {
            headers: { "x-auth-token": process.env.AUTH_TOKEN as string }
        })
            .then((res) => res.json())
            .then((data) => {
                setLogs(data.logs || [])
            })
            .catch((err) => console.error("Failed to fatch logs:", err))
            .finally(() => setLoading(false))
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <PageTitle>Logs</PageTitle>
                {loading? (
                    <p>loading...</p>
                ) : logs.length === 0 ? (
                    <p>No logs found!</p>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log, idx) => (
                            <Card key={idx}>
                                <CardHeader className="flex justify-between font-semibold">
                                    <span>{log.type}</span>
                                    <span className="flex justify-between font-semibold">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                </CardHeader>
                                <CardBody>
                                    <p>{log.message}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
                <div className="mt-6">
                    <Button onPress={() => (window.location.href = "/")}>
                        Back home
                    </Button>
                </div>
            </div>
        </div>
    )
}