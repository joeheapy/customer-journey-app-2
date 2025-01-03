import { Card } from '@/components/ui/card'

interface PainPoint {
  'customer-pain-1': string
  'customer-pain-2': string
  'customer-pain-3': string
}

interface CustomerPainsDisplayProps {
  painPoints?: PainPoint[]
  error?: string
  loading?: boolean
}

export function CustomerPainsDisplay(props: CustomerPainsDisplayProps) {
  const { painPoints = [], error = '', loading = false } = props

  if (loading) {
    return (
      <Card className="p-4">
        <p></p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-50 p-4">
        <p className="text-red-600">{error}</p>
      </Card>
    )
  }

  if (!painPoints?.length) return null

  return (
    <div className="mt-8">
      <div className="flex overflow-x-auto gap-4 pb-4">
        {painPoints.map((point, index) => (
          <Card key={index} className="p-4 flex-none w-[250px]">
            <h3 className="font-medium mb-4 ">Step {index + 1}</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-sm font-medium text-gray-500"></p>
                <p className="mt-1">{point['customer-pain-1']}</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-sm font-medium text-gray-500"></p>
                <p className="mt-1">{point['customer-pain-2']}</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-sm font-medium text-gray-500"></p>
                <p className="mt-1">{point['customer-pain-3']}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
