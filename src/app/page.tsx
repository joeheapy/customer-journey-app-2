import JourneyContainer from '@/components/JourneyContainer'
import PainPointsContainer from '@/components/PainPointsContainer'

export default function Home() {
  return (
    <main className="min-h-screen ">
      <section>
        <JourneyContainer />
      </section>
      <section>
        <PainPointsContainer />
      </section>
    </main>
  )
}
