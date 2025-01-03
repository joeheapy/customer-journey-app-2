import { Card } from '@/components/ui/card'

// Define the PainPoint interface or import it from types
interface PainPoint {
  step: number
  title: string
  description: string
}

interface CustomerPainsDisplayProps {
  painPoints?: PainPoint[] // Changed from CustomerPainPointData
  error?: string
}

export default function CustomerPainsDisplay({
  painPoints = [],
  error = '',
}: CustomerPainsDisplayProps) {
  if (!painPoints) return null

  return (
    <div className="mt-8">
      {error && (
        <Card className="bg-red-50 p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {painPoints.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {painPoints.map((point) => (
            <Card key={point.step} className="p-4">
              <h3 className="font-medium mb-2">
                {point.step}. {point.title}
              </h3>
              <p className="text-gray-600">{point.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
