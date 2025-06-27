import { NextRequest, NextResponse } from 'next/server'
import runWorkflow from '@/app/lib/runWorkflow'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, id } = body

    if (!input || !id) {
      return NextResponse.json(
        { error: 'Missing required fields: input and id' },
        { status: 400 }
      )
    }

    const result = await runWorkflow(input, id)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Error running workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
