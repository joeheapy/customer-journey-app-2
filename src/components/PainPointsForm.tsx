import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PainPointsForm() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:p-0">
      <Card className="w-full md:flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Customer Pain Points</h2>
            <p className="text-sm text-muted-foreground">
              Generate pain points from a customer perspective.
            </p>
          </div>
          <Button className="w-full">Generate Customer Pain Points</Button>
        </div>
      </Card>

      <Card className="w-full md:flex-1 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Business Pain Points</h2>
            <p className="text-sm text-muted-foreground">
              Generate pain points from a business perspective.
            </p>
          </div>
          <Button className="w-full">Generate Business Pain Points</Button>
        </div>
      </Card>
    </div>
  )
}
