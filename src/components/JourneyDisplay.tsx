import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit2, Save } from 'react-feather'
import { JourneyStep } from '@/lib/types'
import CustomerJourneyGenerator from '@/components/JourneyForm'
import { JourneyFormData } from '@/lib/types'
import CsvDownloadButton from './CsvDownloadButton'

interface JourneyDisplayProps {
  journeySteps: JourneyStep[]
  error: string
  loading: boolean
  onSubmit: (formData: JourneyFormData) => Promise<void>
}

interface EditableStep extends JourneyStep {
  isEditing: boolean
}

interface EditingValues {
  title: string
  description: string
}

export default function JourneyDisplay({
  journeySteps,
  error,
  loading,
  onSubmit,
}: JourneyDisplayProps) {
  const [editableSteps, setEditableSteps] = useState<EditableStep[]>([])
  const [editingValues, setEditingValues] = useState<{
    [key: number]: EditingValues
  }>({})

  useEffect(() => {
    setEditableSteps(
      journeySteps.map((step) => ({ ...step, isEditing: false }))
    )
  }, [journeySteps])

  const handleEdit = (stepNumber: number) => {
    const step = editableSteps.find((s) => s?.step === stepNumber)
    if (!step) return

    setEditingValues((current) => ({
      ...current,
      [stepNumber]: {
        title: step.title || '',
        description: step.description || '',
      },
    }))

    setEditableSteps((steps) =>
      steps.map((s) => (s.step === stepNumber ? { ...s, isEditing: true } : s))
    )
  }

  const handleSave = (stepNumber: number) => {
    const values = editingValues[stepNumber]
    if (!values) return

    setEditableSteps((steps) =>
      steps.map((step) =>
        step.step === stepNumber
          ? {
              ...step,
              title: values.title,
              description: values.description,
              isEditing: false,
            }
          : step
      )
    )
    const newEditingValues = { ...editingValues }
    delete newEditingValues[stepNumber]
    setEditingValues(newEditingValues)
  }

  const handleInputChange = (
    stepNumber: number,
    field: keyof EditingValues,
    value: string
  ) => {
    setEditingValues((current) => ({
      ...current,
      [stepNumber]: {
        ...current[stepNumber],
        [field]: value,
      },
    }))
  }

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

      {editableSteps.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">
            {editableSteps[0].responseTitle}
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {editableSteps.map((step) => (
              <Card key={step.step} className="p-4 flex-none w-[250px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {step.isEditing ? (
                      <Textarea
                        value={editingValues[step.step]?.title ?? step.title}
                        className="mb-2"
                        onChange={(e) =>
                          handleInputChange(step.step, 'title', e.target.value)
                        }
                      />
                    ) : (
                      <h3 className="font-medium">
                        {step.step}: {step.title}
                      </h3>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      step.isEditing
                        ? handleSave(step.step)
                        : handleEdit(step.step)
                    }
                    className="ml-2"
                  >
                    {step.isEditing ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Edit2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {step.isEditing ? (
                  <Textarea
                    value={
                      editingValues[step.step]?.description ?? step.description
                    }
                    className="min-h-[160px]"
                    onChange={(e) =>
                      handleInputChange(
                        step.step,
                        'description',
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <p className="text-gray-600">{step.description}</p>
                )}
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <CsvDownloadButton journeySteps={editableSteps} />
          </div>
        </div>
      )}
    </main>
  )
}
