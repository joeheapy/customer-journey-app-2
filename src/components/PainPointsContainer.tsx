'use client'

import { useState } from 'react'
import { JourneyStep } from '@/lib/types'
import { CustomerPainsForm } from './CustomerPainsForm'
import { CustomerPainsDisplay } from './CustomerPainsDisplay'

interface PainPointsContainerProps {
  journeySteps?: JourneyStep[]
}

interface PainPoint {
  'customer-pain-1': string
  'customer-pain-2': string
  'customer-pain-3': string
}

export default function PainPointsContainer({
  journeySteps = [],
}: PainPointsContainerProps) {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGeneratePains = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/openai/customer-pains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formattedPrompt: createPrompt(),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { data } = await response.json()
      setPainPoints(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const createPrompt = () => {
    console.log('Journey Steps:', journeySteps)

    if (!journeySteps?.length) {
      return `You are a customer experience expert. Please analyze general customer pain points.`
    }

    const stepsText = journeySteps
      .map(
        (step) =>
          `Step ${step.step}: ${step.title}\nDescription: ${step.description}`
      )
      .join('\n\n')

    console.log('Steps Text:', stepsText)

    const prompt = `You are a customer experience expert. Here is the customer journey:

${stepsText}

For each step in this journey, describe three potential problems customers might encounter.
Do not return a title.`

    console.log('Final Prompt:', prompt)
    return prompt
  }

  return (
    <div className="w-[96%] md:w-[96%] mx-auto">
      <div className="space-y-8">
        <CustomerPainsForm onGenerate={handleGeneratePains} loading={loading} />
        <CustomerPainsDisplay
          painPoints={painPoints}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
