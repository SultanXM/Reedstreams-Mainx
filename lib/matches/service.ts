// ============================================
// MATCHES SERVICE - Streamed.pk API Integration
// Documentation: https://streamed.pk/docs
// ============================================

const API_BASE = 'https://streamed.pk/api'

// Types from API documentation
export interface APIMatch {
  id: string
  title: string
  category: string
  date: number
  poster?: string
  popular: boolean
  views?: number
  teams?: {
    home?: {
      name: string
      badge: string
    }
    away?: {
      name: string
      badge: string
    }
  }
  sources: {
    source: string
    id: string
  }[]
}

export interface Stream {
  id: string
  streamNo: number
  language: string
  hd: boolean
  embedUrl: string
  source: string
}

export interface Sport {
  id: string
  name: string
}

// Computed status type
export type MatchStatus = 'live' | 'upcoming' | 'ended'

export interface MatchWithStatus extends APIMatch {
  status: MatchStatus
  formattedDate: string
  formattedTime: string
}

// ============================================
// API ENDPOINTS
// ============================================

/**
 * Get all available sports categories
 * GET /api/sports
 */
export async function fetchSports(): Promise<Sport[]> {
  try {
    const res = await fetch(`${API_BASE}/sports`)
    if (!res.ok) {
      console.warn('Failed to fetch sports, returning empty array')
      return []
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching sports:', error)
    return []
  }
}

/**
 * Get matches for a specific sport
 * GET /api/matches/[SPORT]
 */
export async function fetchMatchesBySport(sport: string): Promise<APIMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/matches/${sport}`)
    if (!res.ok) {
      console.warn(`Failed to fetch matches for ${sport}, returning empty array`)
      return []
    }
    return res.json()
  } catch (error) {
    console.warn(`Error fetching matches for ${sport}:`, error)
    return []
  }
}

/**
 * Get all matches across all sports
 * GET /api/matches/all
 */
export async function fetchAllMatches(): Promise<APIMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/matches/all`)
    if (!res.ok) {
      console.warn('Failed to fetch all matches, returning empty array')
      return []
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching all matches:', error)
    return []
  }
}

/**
 * Get live matches
 * GET /api/matches/live
 */
export async function fetchLiveMatches(): Promise<APIMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/matches/live`)
    if (!res.ok) {
      console.warn('Failed to fetch live matches, returning empty array')
      return []
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching live matches:', error)
    return []
  }
}

/**
 * Get popular matches
 * GET /api/matches/all/popular
 */
export async function fetchPopularMatches(): Promise<APIMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/matches/all/popular`)
    if (!res.ok) {
      console.warn('Failed to fetch popular matches, returning empty array')
      return []
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching popular matches:', error)
    return []
  }
}

/**
 * Get streams for a match
 * GET /api/stream/[source]/[id]
 */
export async function fetchStreams(source: string, id: string): Promise<Stream[]> {
  try {
    const res = await fetch(`${API_BASE}/stream/${source}/${id}`)
    if (!res.ok) {
      console.warn('Failed to fetch streams, returning empty array')
      return []
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching streams:', error)
    return []
  }
}

// ============================================
// IMAGE URL HELPERS
// ============================================

const SITE_BASE = 'https://streamed.pk'

export function getTeamBadgeUrl(badgeId: string): string {
  return `${SITE_BASE}/api/images/badge/${badgeId}.webp`
}

export function getPosterUrl(posterPath: string): string {
  if (posterPath.startsWith('/api/images/')) {
    return `${SITE_BASE}${posterPath}.webp`
  }
  return `${SITE_BASE}/api/images/proxy/${posterPath}.webp`
}

// ============================================
// STATUS COMPUTATION
// ============================================

function computeMatchStatus(dateMs: number): { status: MatchStatus; text: string } {
  const now = Date.now()
  const diff = dateMs - now
  const absDiff = Math.abs(diff)

  // Match is LIVE if it has started (diff <= 0) and within 5 hours of start time
  // This ensures matches that are currently being played show as LIVE
  const isLive = diff <= 0 && absDiff <= 5 * 60 * 60 * 1000

  if (isLive) return { status: 'live', text: 'LIVE' }

  if (diff > 0) {
    // Upcoming - match hasn't started yet
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const days = Math.floor(hours / 24)
    if (days > 0) return { status: 'upcoming', text: `In ${days}d` }
    if (hours > 0) return { status: 'upcoming', text: `In ${hours}h` }
    const mins = Math.floor(diff / (60 * 1000))
    return { status: 'upcoming', text: `In ${mins}m` }
  }

  // Ended - match finished more than 5 hours ago
  const hours = Math.floor(absDiff / (60 * 60 * 1000))
  const days = Math.floor(hours / 24)
  if (days > 0) return { status: 'ended', text: `${days}d ago` }
  if (hours > 0) return { status: 'ended', text: `${hours}h ago` }
  return { status: 'ended', text: 'Ended' }
}

function formatDate(dateMs: number): string {
  const date = new Date(dateMs)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow = date.toDateString() === tomorrow.toDateString()
  
  if (isToday) return 'Today'
  if (isTomorrow) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(dateMs: number): string {
  return new Date(dateMs).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function addMatchStatus(matches: APIMatch[]): MatchWithStatus[] {
  return matches.map(match => {
    const { status, text } = computeMatchStatus(match.date)
    return {
      ...match,
      status,
      formattedDate: formatDate(match.date),
      formattedTime: formatTime(match.date),
    }
  })
}

// ============================================
// FILTERING
// ============================================

export type MatchFilter = 'all' | 'live' | 'upcoming' | 'popular'

export function filterMatches(matches: MatchWithStatus[], filter: MatchFilter): MatchWithStatus[] {
  switch (filter) {
    case 'live':
      return matches.filter(m => m.status === 'live')
    case 'upcoming':
      return matches.filter(m => m.status === 'upcoming')
    case 'popular':
      return matches.filter(m => m.popular)
    default:
      return matches
  }
}
