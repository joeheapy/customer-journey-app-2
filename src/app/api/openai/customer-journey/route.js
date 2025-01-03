// app/api/openai/customer-journey/route.js
import { NextResponse } from 'next/server'
import { openai, withTimeout, handleOpenAIError } from '../../lib/openai'

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

    const completion = await withTimeout(
      openai.chat.completions.create({
        messages: [{ role: 'user', content: body.formattedPrompt }],
        model: 'gpt-3.5-turbo-0125',
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
    )

    const functionCall = completion.choices[0]?.message?.function_call
    if (!functionCall?.arguments) {
      throw new Error('Invalid response format from OpenAI')
    }

    const { journeySteps, responseTitle } = JSON.parse(functionCall.arguments)
    console.log('Parsed Journey Steps:', journeySteps)
    if (!journeySteps?.length) {
      throw new Error(
        'Sorry. No journey steps were generated. Please click the button to try again.'
      )
    }

    return NextResponse.json({
      data: journeySteps.map((step) => ({
        ...step,
        responseTitle,
      })),
    })
  } catch (error) {
    const errorResponse = handleOpenAIError(error)
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    )
  }
}
