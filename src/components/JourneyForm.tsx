import { useState, FormEvent } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { JourneyFormData } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface JourneyFormProps {
  onSubmit: (formData: JourneyFormData) => Promise<void>
  isLoading?: boolean
}

export function JourneyForm({ onSubmit, isLoading = false }: JourneyFormProps) {
  const [formData, setFormData] = useState<JourneyFormData>({
    target_customers: '',
    persona_name: '',
    business_proposition: '',
    customer_scenario: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleInputChange =
    (field: keyof JourneyFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  return (
    <Card className="w-full p-4">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Customer Journey Generator</h2>
          <p className="text-sm text-muted-foreground">
            Fill out the form below to generate a customer journey.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_proposition">Business Proposition</Label>
              <Input
                id="business_proposition"
                placeholder="Roadside recovery for electric vehicles"
                value={formData.business_proposition}
                onChange={handleInputChange('business_proposition')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_customers">Target Customers</Label>
              <Input
                id="target_customers"
                placeholder="Motorists with electric vehicles"
                value={formData.target_customers}
                onChange={handleInputChange('target_customers')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_scenario">Customer Scenario</Label>
              <Input
                id="customer_scenario"
                placeholder="Broken down on a motorway in an electric vehicle"
                value={formData.customer_scenario}
                onChange={handleInputChange('customer_scenario')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona_name">Persona Name</Label>
              <Input
                id="persona_name"
                placeholder="Larry"
                className="bg-blue-50"
                value={formData.persona_name}
                onChange={handleInputChange('persona_name')}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white hover:bg-black/80"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving you time...' : 'Generate Journey Steps'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
