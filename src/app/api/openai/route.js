import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }

    const body = await req.json()
    if (!body.formattedPrompt) {
      return NextResponse.json(
        { error: 'Missing formattedPrompt in request body' },
        { status: 400 }
      )
    }

    const { formattedPrompt } = body
    console.log('Formatted prompt:', formattedPrompt)

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: formattedPrompt },
      ],
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
      functions: [
        {
          name: 'createJourneySteps',
          description: 'Create customer journey steps',
          parameters: {
            type: 'object',
            properties: {
              journeySteps: {
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
              responseTitle: { type: 'string' },
            },
            required: ['journeySteps', 'responseTitle'],
          },
        },
      ],
      function_call: { name: 'createJourneySteps' },
    })

    const functionCall = completion.choices[0]?.message?.function_call
    if (!functionCall?.arguments) {
      throw new Error('Invalid response format from OpenAI')
    }

    const { journeySteps, responseTitle } = JSON.parse(functionCall.arguments)

    if (!journeySteps?.length) {
      throw new Error('No journey steps in response')
    }

    return NextResponse.json({
      data: journeySteps.map((step) => ({
        ...step,
        responseTitle,
      })),
    })
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI API error', details: error.message },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate journey' },
      { status: 500 }
    )
  }
}
