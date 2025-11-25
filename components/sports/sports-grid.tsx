import Link from 'next/link'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

// Sport icon and name mappings
const sportIcons: Record<string, string> = {
  football: '⚽',
  americanfootball: '🏈',
  basketball: '🏀',
  baseball: '⚾',
  hockey: '🏒',
  tennis: '🎾',
  mma: '🥊',
  boxing: '🥊',
  cricket: '🏏',
  rugby: '🏉',
  motorsport: '🏁',
  racing: '🏎️',
  volleyball: '🏐',
  golf: '⛳',
  darts: '🎯',
}

const sportNames: Record<string, string> = {
  football: 'Soccer',
  americanfootball: 'Football',
  basketball: 'Basketball',
  baseball: 'Baseball',
  hockey: 'Ice Hockey',
  tennis: 'Tennis',
  mma: 'MMA / UFC',
  boxing: 'Boxing',
  cricket: 'Cricket',
  rugby: 'Rugby',
  motorsport: 'Auto Racing',
  racing: 'Auto Racing',
  volleyball: 'Volleyball',
  golf: 'Golf',
  darts: 'Darts',
}

function normalizeSportKey(sportName: string) {
  if (!sportName) return ''
  return sportName.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')
}

function getSportIcon(sportName: string) {
  const normalizedKey = normalizeSportKey(sportName)
  if (normalizedKey.includes('fight')) return sportIcons.mma
  return sportIcons[normalizedKey] || undefined
}

function getDisplaySportName(sport: string) {
  const normalizedKey = normalizeSportKey(sport)
  if (normalizedKey.includes('fight')) return sportNames.mma
  return sportNames[normalizedKey] || sport.charAt(0).toUpperCase() + sport.slice(1)
}

function hasMatchStarted(dateString: string) {
  try {
    const matchTime = new Date(dateString)
    const currentTime = new Date()
    return matchTime <= currentTime
  } catch {
    return false
  }
}

async function fetchMatchCount(sportId: string) {
  try {
    const res = await fetch(`${STREAMED_API_BASE}/matches/${sportId}`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return 0
    
    const matches = await res.json()
    if (!Array.isArray(matches)) return 0
    
    const liveMatches = matches.filter(match => 
      match.sources?.length > 0 && hasMatchStarted(match.date)
    )
    
    return liveMatches.length
  } catch {
    return 0
  }
}

export default async function SportsGrid() {
  const res = await fetch(`${STREAMED_API_BASE}/sports`, {
    next: { revalidate: 300 }
  })
  
  const sports = await res.json()
  
  const sportsWithCounts = await Promise.all(
    sports.map(async (sport: any) => ({
      ...sport,
      matchCount: await fetchMatchCount(sport.id)
    }))
  )

  return (
    <div className="sports-grid">
      {sportsWithCounts.map((sport: any) => {
        const icon = getSportIcon(sport.name)
        const displayName = getDisplaySportName(sport.name)
        
        if (!icon) return null
        
        return (
          <Link 
            key={sport.id}
            href={`/live-matches?sportId=${sport.id}&sportName=${encodeURIComponent(sport.name)}`}
          >
            <div className="category-card">
              <div className="category-icon">{icon}</div>
              <h3 className="category-name">{displayName}</h3>
              <div className="category-matches">
                {sport.matchCount} Live {sport.matchCount === 1 ? 'Match' : 'Matches'}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
