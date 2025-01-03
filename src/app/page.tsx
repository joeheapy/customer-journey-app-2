'use client'

import { useState } from 'react'
import JourneyContainer from '@/components/JourneyContainer'
import PainPointsContainer from '@/components/PainPointsContainer'
import { JourneyStep } from '@/lib/types'

export default function Home() {
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([])

  const handleJourneyGenerated = (steps: JourneyStep[]) => {
    setJourneySteps(steps)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto space-y-8 py-8">
        <section>
          <JourneyContainer
            journeySteps={journeySteps}
            onJourneyGenerated={handleJourneyGenerated}
          />
        </section>
        <section className="mt-2">
          <PainPointsContainer journeySteps={journeySteps} />
        </section>
      </div>
    </main>
  )
}
