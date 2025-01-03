import OpenAI from 'openai'
import { ChatCompletion } from 'openai/resources/chat/completions'
import { NextResponse } from 'next/server'

interface RequestBody {
  formattedPrompt: string
}

interface PainPoint {
  step: number
  title: string
  description: string
}

interface PainPointsData {
  painPoints: PainPoint[]
}

type ObjectWithPainPoints = {
  painPoints: unknown[]
}

interface ValidationError {
  error: string
  details?: string
}

const TIMEOUT_MS = 60000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPainPoint(point: unknown): point is PainPoint {
  if (!isObject(point)) return false
  return (
    'step' in point &&
    typeof point.step === 'number' &&
    'title' in point &&
    typeof point.title === 'string' &&
    'description' in point &&
    typeof point.description === 'string'
  )
}

function validatePainPoints(data: unknown): data is PainPointsData {
  if (!isObject(data)) return false
  if (!('painPoints' in data)) return false
  const painPointsData = data as ObjectWithPainPoints
  if (!Array.isArray(painPointsData.painPoints)) return false
  return painPointsData.painPoints.every(isPainPoint)
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<ValidationError>(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    if (!req.body) {
      return NextResponse.json<ValidationError>(
        { error: 'Missing request body' },
        { status: 400 }
      )
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
    })

    const body = (await Promise.race([
      req.json(),
      timeoutPromise,
    ])) as RequestBody
    if (!body.formattedPrompt?.trim()) {
      return NextResponse.json<ValidationError>(
        {
          error: 'Invalid request format',
          details: 'formattedPrompt is required and cannot be empty',
        },
        { status: 400 }
      )
    }

    console.log('🤖 OpenAI Prompt:', body.formattedPrompt)

    const openAiPromise = openai.chat.completions.create({
      messages: [{ role: 'user', content: body.formattedPrompt }],
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
      tools: [
        {
          type: 'function',
          function: {
            name: 'createPainPoints',
            description: 'Create customer pain points',
            parameters: {
              type: 'object',
              properties: {
                painPoints: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      step: { type: 'number' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                    },
                    required: ['step', 'title', 'description'],
                  },
                },
              },
              required: ['painPoints'],
            },
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'createPainPoints' } },
    })

    const completion = (await Promise.race([
      openAiPromise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('OpenAI request timeout')),
          TIMEOUT_MS
        )
      ),
    ])) as ChatCompletion

    console.log('📦 Raw OpenAI Response:', completion)

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0]
    if (!toolCall?.function?.arguments) {
      throw new Error('Invalid response format from OpenAI')
    }

    const parsedData = JSON.parse(toolCall.function.arguments)
    console.log('✨ Parsed Data:', JSON.stringify(parsedData, null, 2))

    if (!validatePainPoints(parsedData)) {
      throw new Error('Invalid pain points format')
    }

    const { painPoints } = parsedData
    console.log(
      '🎯 Validated Pain Points:',
      JSON.stringify(painPoints, null, 2)
    )

    return NextResponse.json({ data: painPoints })
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json<ValidationError>(
        { error: 'Request timed out' },
        { status: 504 }
      )
    }

    return NextResponse.json<ValidationError>(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Sorry. No customer pain points were generated. Please click the button to try again.',
      },
      { status: 500 }
    )
  }
}
