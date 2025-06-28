'use client'

import { Button, ButtonGroup } from "@heroui/button"
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import { FiPlus, FiEdit, FiSettings, FiEye, FiFileText, FiX } from "react-icons/fi"
import workflowsData from './workflows.json'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">What're we automating next?</h1>

      <div className="flex flex-row gap-6 mb-8">
        <Button size="lg" color="primary" startContent={<FiPlus />} onPress={() => {
        window.location.href = '/create';
        }}>Create a new workflow</Button>
        <Button size="lg" startContent={<FiFileText/>} onPress={() => {
          window.location.href = "/logs";
        }}>View logs</Button>
        <Button size="lg" startContent={<FiSettings />} onPress={() => {
          window.location.href = '/settings';
        }}>Settings</Button>
        <Button size="lg" color="danger" startContent={<FiX/>} onPress={() => {
          fetch("/api/stop", {
            method: 'POST'
          })
        }}>EMERGENCY STOP</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowsData.workflows.map((workflow, index) => (
          <Card key={workflow.id}>
            <CardHeader>
              <h2 className="text-lg font-bold">{workflow.name}</h2>
            </CardHeader>
            <CardBody>
              <p>Trigger: {workflow.trigger}</p>
              <p>Steps: {workflow.steps.length}</p>
            </CardBody>
            <CardFooter>
              <div className="flex flex-row gap-3">
                <Button size="md" startContent={<FiEdit />} onPress={() => {
                  window.location.href = `/edit/${workflow.id}`;
                }}>Edit workflow</Button>
                <Button size='md' startContent={<FiEye />} onPress={() => {
                  window.location.href = `/view/${workflow.id}`
                }}>View workflow</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
