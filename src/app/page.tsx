'use client'

import { useState } from 'react'
import { JourneyFormData, JourneyStep } from '@/lib/types'
import JourneyDisplay from '@/components/JourneyDisplay'

export default function Home() {
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJourneySubmit = async (formData: JourneyFormData) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formattedPrompt: createPrompt(formData),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { data } = await response.json()
      setJourneySteps(data)
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

  const createPrompt = (inputs: JourneyFormData) => {
    return `You are a world-class customer experience designer with expertise in journey mapping and service design. Create a comprehensive customer journey for a ${inputs.target_customers} named ${inputs.persona_name} who is exploring ${inputs.business_proposition} products and services. Context: ${inputs.persona_name} has ${inputs.customer_scenario}. Map out a detailed end-to-end journey in 10 key stages, from initial awareness through service usage to post-service relationship management. Define a clear title that captures the key interaction or emotional state. Describe the customer's actions, thoughts, and feelings. Identify key touchpoints and channels. Focus on creating memorable moments that build long-term loyalty while addressing friction points in the customer experience. Consider both digital and physical touchpoints where relevant.`
  }

  return (
    <JourneyDisplay
      journeySteps={journeySteps}
      error={error}
      loading={loading}
      onSubmit={handleJourneySubmit}
    />
  )
}
