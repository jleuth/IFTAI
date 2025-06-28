import { NextRequest, NextResponse } from "next/server";
import runWorkflow from "@/app/lib/runWorkflow";

export async function OPTIONS() {
    return NextResponse.json({
        headers: {
            'Access-Control-Allow-Origin': "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-type, x-auth-token"
        }
    })
}

export async function POST(request: NextRequest, { params }: { params: {id: string} }) {
    try {
        const id = parseInt(params.id)
        if (Number.isNaN(id)) {
            return NextResponse.json({ error: 'Invalid id in URL'}, { status: 400 })
        }

        const { searchParams } = new URL(request.url)
        const queryData = Object.fromEntries(searchParams.entries())

        const textBody = await request.text()
        let bodyData: any = {}
        if (textBody) {
            try {
                bodyData = JSON.parse(textBody)
            } catch {
                bodyData = textBody
            }
        }

        const combined = { query: queryData, body: bodyData }
        const input = JSON.stringify(combined, null, 2)

        const result = await runWorkflow(input, id)
        return NextResponse.json({ result })
    } catch (error) {
        console.error('Error running workflow from form:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}