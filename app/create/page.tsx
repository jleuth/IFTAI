'use client'

import { Button } from "@heroui/button"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"
import { Input, Textarea } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { FiSave, FiX } from "react-icons/fi"

export default function CreateWorkflow() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Workflow</h1>
        
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

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="p-4 border border-dashed border-default-300 rounded-lg text-center">
                <p className="text-default-500">No actions configured yet</p>
                <Button size="sm" className="mt-2">
                  Add Action
                </Button>
              </div>
            </div>
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
