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

    // Add timeout handling
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 45000)
    )

    const completionPromise = openai.chat.completions.create({
      messages: [{ role: 'user', content: formattedPrompt }],
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

    const completion = await Promise.race([completionPromise, timeout])
    console.log('OpenAI Response:', completion)

    const functionCall = completion.choices[0]?.message?.function_call
    if (!functionCall?.arguments) {
      console.error('Invalid response:', completion)
      throw new Error('Invalid response format from OpenAI')
    }

    try {
      const { journeySteps, responseTitle } = JSON.parse(functionCall.arguments)
      console.log('Parsed Journey Steps:', journeySteps)

      if (!journeySteps?.length) {
        throw new Error('No journey steps in response')
      }

      return NextResponse.json({
        data: journeySteps.map((step) => ({
          ...step,
          responseTitle,
        })),
      })
    } catch (parseError) {
      console.error('Parsing error:', parseError)
      console.error('Function arguments:', functionCall.arguments)
      throw new Error('Failed to parse OpenAI response')
    }
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI API error', details: error.message },
        { status: 502 }
      )
    }

    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate journey' },
      { status: 500 }
    )
  }
}
