import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CustomerPainsFormProps {
  onGenerate: () => Promise<void>
  loading: boolean
}

export function CustomerPainsForm({
  onGenerate,
  loading,
}: CustomerPainsFormProps) {
  return (
    <Card className="w-full p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Customer Pain Points</h2>
          <p className="text-sm text-muted-foreground">
            Identify likely customer pain points at each journey step.
          </p>
        </div>
        <Button
          type="submit"
          onClick={onGenerate}
          disabled={loading}
          className=" bg-black text-white hover:bg-black/80"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Saving you time...' : 'Identify Customer Pain Points'}
        </Button>
      </div>
    </Card>
  )
}
