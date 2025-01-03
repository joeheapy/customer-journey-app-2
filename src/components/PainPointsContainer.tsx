'use client'

import { useState } from 'react'
import { CustomerPainPointData } from '@/lib/types'
import CustomerPainsForm from './CustomerPainsForm'
import CustomerPainsDisplay from './CustomerPainsDisplay'
import { JourneyStep } from '@/lib/types'

interface PainPointsContainerProps {
  journeySteps?: JourneyStep[]
}

export default function PainPointsContainer({
  journeySteps = [],
}: PainPointsContainerProps) {
  const [painPoints, setPainPoints] = useState<CustomerPainPointData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  console.log('PainPointsContainer rendering', { painPoints, loading, error }) // Debug log

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
    console.log('Journey Steps:', journeySteps) // Debug journeySteps

    if (!journeySteps?.length) {
      return `You are a customer experience expert. Please analyze general customer pain points.`
    }

    const stepsText = journeySteps
      .map(
        (step) =>
          `Step ${step.step}: ${step.title}\nDescription: ${step.description}`
      )
      .join('\n\n')

    console.log('Steps Text:', stepsText) // Debug formatted steps

    const prompt = `You are a customer experience expert. Here is the customer journey:

${stepsText}

Based on this journey, identify two key customer pain point for each step in the journey, ensuring coverage of all journey steps.`
    // For each pain point:Format the response as a numbered list of pain points, ensuring coverage of all journey steps.'`

    console.log('Final Prompt:', prompt) // Debug final prompt
    return prompt
  }

  return (
    <div className="w-full space-y-8">
      <CustomerPainsForm onGenerate={handleGeneratePains} loading={loading} />
      <CustomerPainsDisplay painPoints={painPoints} error={error} />
    </div>
  )
}
