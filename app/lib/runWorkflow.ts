import { getResponse } from '@/app/lib/openai'
import * as fs from 'node:fs'
import * as path from 'node:path'
import writeLog from './logger'
import sendTelegramMessage from './telegram'
import sendRequest from './sendHttp'

export default async function runWorkflow(input: string, id: number) {

    if (fs.existsSync(path.join(process.cwd(), 'app', '.stop'))) {
        return { success: false, message: "The emergency stop flag is currently blocking step execution."}
    }

    // Parse the JSON store
    const workflowsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'app/workflows.json'), 'utf8'))

    console.log(workflowsData)

    let workflows: any[] = []
    let inputChain = `Input from user: "${input}"`

    if (Array.isArray(workflowsData)) { // Couldn't decide on a JSON schema, so we just do all of them yippee!
        // If there is a direct array of workflows
        workflows = workflowsData
    } else if (workflowsData.workflows && Array.isArray(workflowsData.workflows)) {
        // if the json is like { workflows: [] }
        workflows = workflowsData.workflows
    } else if (workflowsData.workflows && typeof workflowsData.workflows === 'object') {
        // if ts is like { workflows: { "1": {}, "2": {} } }
        workflows = Object.values(workflowsData.workflows)
    } else {
        writeLog("error", "What the fuck is ts json.")
        throw new Error("What the fuck is ts json.")
    }


    // Get workflow by ID
    const chosenWorkflow = workflows.find((workflow: any) => {
        console.log(`Comparing workflow.id: ${workflow.id} (${typeof workflow.id}) with search id: ${id} (${typeof id})`)
        return workflow.id === id
    })

    console.log("GOT DA WORKFLOW:", chosenWorkflow)
    writeLog("info", `Workflow with id ${id} found`)

    if (!chosenWorkflow) {
        writeLog("error", `Workflow with id ${id} not found`)
        throw new Error("You suck at supplying the correct ID, this one wasn't found")
    }

    const steps = chosenWorkflow.steps
    let lastResponse

    // Run each step in order
    for (const step of steps) {
        const response = await runStep(step.id, inputChain)
        writeLog("info", `Response from step #${step.id} was "${response}"`)
        inputChain = inputChain.concat(`\n\nResponse from step #${step.id} was "${response}"`)
        lastResponse = response
    }

    async function runStep(stepId: number, input?: any) {

        if (fs.existsSync(path.join(process.cwd(), 'app', '.stop'))) {
            return { success: false, message: "The emergency stop flag is currently blocking step execution."}
        }

        const step = steps.find((step: any) => step.id === stepId)

        console.log("input", input)
        
        if (step.action === "call_model") {
            const response = await getResponse(input, step.instructions, step.model)
            console.log("response", response)
            return response;
        } else if (step.action === "telegram_send") {
            const response = await sendTelegramMessage(step.message, id)
            console.log("response", response)
            return response;
        } else if (step.action === "send_http") {
            const response = await sendRequest(step.method, step.url, step.body, step.headers)
            console.log("response", response)
            return response;
        }



    }

    // Once runStep returns after all steps are run, return.
    writeLog("info", `Workflow with id ${id} completed`)
    return {"success": true, "lastResponse": lastResponse}
}

