import Navbar from '../components/Navbar'
import { MatchesProvider } from '../lib/matches'
import { HomeContent } from '../components/HomeContent'

export default function Home() {
  return (
    <MatchesProvider>
      <Navbar />
      <HomeContent />
    </MatchesProvider>
  )
}
