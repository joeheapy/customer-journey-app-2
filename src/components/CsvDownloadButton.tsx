import { Download } from 'react-feather'
import { Button } from '@/components/ui/button'
import { JourneyStep } from '@/lib/types'

interface CsvDownloadButtonProps {
  journeySteps: JourneyStep[]
}

export default function CsvDownloadButton({
  journeySteps,
}: CsvDownloadButtonProps) {
  const handleDownload = () => {
    const headers = ['Step', 'Title', 'Description']
    const rows = journeySteps.map((step) => [
      step.step,
      step.title,
      step.description,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'customer_journey.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Download CSV
    </Button>
  )
}
