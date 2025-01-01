import { Card } from '@/components/ui/card'
import { JourneyStep } from '@/lib/types'
import CustomerJourneyGenerator from '@/components/JourneyForm'

import { JourneyFormData } from '@/lib/types'

interface JourneyDisplayProps {
  journeySteps: JourneyStep[]
  error: string
  loading: boolean
  onSubmit: (formData: JourneyFormData) => Promise<void>
}

export default function JourneyDisplay({
  journeySteps,
  error,
  loading,
  onSubmit,
}: JourneyDisplayProps) {
  return (
    <main className="container mx-auto py-6 px-4">
      <CustomerJourneyGenerator onSubmit={onSubmit} isLoading={loading} />

      {error && (
        <div className="mt-6">
          <Card className="bg-red-50 p-4">
            <p className="text-red-600">{error}</p>
          </Card>
        </div>
      )}

      {journeySteps.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Customer Journey Steps</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {journeySteps.map((step) => (
              <Card key={step.step} className="p-4 flex-none w-[250px]">
                <h3 className="font-medium mb-2">
                  {step.step}: {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
