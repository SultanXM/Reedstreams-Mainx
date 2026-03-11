// Streamed.pk API Service
// API Configuration
const STREAMED_BASE_URL = 'https://streamed.pk'

// Types based on API documentation
export interface StreamedTeam {
  name: string
  badge?: string
}

export interface StreamedTeams {
  home?: StreamedTeam
  away?: StreamedTeam
}

export interface StreamedSource {
  source: string
  id: string
}

export interface StreamedMatch {
  id: string
  title: string
  category: string
  date: number // timestamp in milliseconds
  poster?: string
  popular?: boolean
  teams?: StreamedTeams
  sources: StreamedSource[]
}

export interface StreamedStream {
  id: string
  streamNo: number
  language: string
  hd: boolean
  embedUrl: string
  source: string
}

export interface StreamedSport {
  id: string
  name: string
}

// Unified types for UI compatibility
export interface UnifiedGame {
  id: string
  name: string
  poster: string
  start_time: number // in seconds for compatibility
  end_time: number // in seconds for compatibility
  category: string
  source: 'streamed'
  is_live: boolean
  league?: string
  streamedData?: StreamedMatch // original data
}

export interface UnifiedCategory {
  category: string
  games: UnifiedGame[]
  source: 'streamed'
}

// API Endpoints - fetch directly from StreamD
const ENDPOINTS = {
  matches: (sport?: string) => 
    sport 
      ? `${STREAMED_BASE_URL}/api/matches/${sport}`
      : `${STREAMED_BASE_URL}/api/matches`,
  live: `${STREAMED_BASE_URL}/api/matches/live`,
  stream: (source: string, id: string) => 
    `${STREAMED_BASE_URL}/api/stream/${source}/${id}`,
  sports: `${STREAMED_BASE_URL}/api/sports`,
  badge: (id: string) => `${STREAMED_BASE_URL}/api/images/badge/${id}.webp`,
  poster: (path: string) => `${STREAMED_BASE_URL}${path}.webp`,
  proxy: (path: string) => `${STREAMED_BASE_URL}/api/images/proxy/${path}.webp`,
}

// Get all sports
export async function fetchSports(): Promise<StreamedSport[]> {
  const res = await fetch(ENDPOINTS.sports, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to fetch sports')
  return res.json()
}

// Get live matches (only with posters)
export async function fetchLiveMatches(): Promise<StreamedMatch[]> {
  const res = await fetch(ENDPOINTS.live, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to fetch live matches')
  const data = await res.json()
  const matches = Array.isArray(data) ? data : []
  // Filter out matches WITHOUT posters
  return matches.filter(hasPoster)
}

// Get matches by sport (only with posters)
export async function fetchMatchesBySport(sportId: string): Promise<StreamedMatch[]> {
  const res = await fetch(ENDPOINTS.matches(sportId), { next: { revalidate: 120 } })
  if (!res.ok) throw new Error(`Failed to fetch matches for ${sportId}`)
  const data = await res.json()
  const matches = Array.isArray(data) ? data : []
  // Filter out matches WITHOUT posters
  return matches.filter(hasPoster)
}

// Get all matches across all sports
export async function fetchAllMatches(): Promise<StreamedMatch[]> {
  const sports = await fetchSports()
  const allMatches: StreamedMatch[] = []
  
  // Fetch matches for each sport in parallel
  const results = await Promise.allSettled(
    sports.map(sport => fetchMatchesBySport(sport.id))
  )
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allMatches.push(...result.value)
    }
  })
  
  // Remove duplicates by id
  const seen = new Set<string>()
  return allMatches.filter(match => {
    if (seen.has(match.id)) return false
    seen.add(match.id)
    return true
  })
}

// Get streams for a specific source and match
export async function fetchStreams(source: string, id: string): Promise<StreamedStream[]> {
  const res = await fetch(ENDPOINTS.stream(source, id), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch streams for ${source}/${id}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

// Check if a match is live based on time
export function isMatchLive(match: StreamedMatch): boolean {
  const now = Date.now()
  const startTime = match.date
  // Assume 3 hour duration
  const endTime = startTime + (3 * 60 * 60 * 1000)
  return now >= startTime && now <= endTime
}

// Transform StreamedMatch to UnifiedGame for UI compatibility
export function transformToUnifiedGame(match: StreamedMatch): UnifiedGame {
  // Convert milliseconds to seconds for compatibility
  const startTimeSeconds = Math.floor(match.date / 1000)
  // Assume 3 hour duration if not specified
  const endTimeSeconds = startTimeSeconds + (3 * 60 * 60)
  
  return {
    id: match.id,
    name: match.title,
    poster: match.poster || '',
    start_time: startTimeSeconds,
    end_time: endTimeSeconds,
    category: match.category,
    source: 'streamed',
    is_live: isMatchLive(match), // Calculate based on actual time
    league: match.category,
    streamedData: match,
  }
}

// Check if match actually has a poster (not null/undefined/empty)
export function hasPoster(match: StreamedMatch): boolean {
  return !!match.poster && match.poster.length > 0
}

// Get image URL - returns proxied URL to avoid CORS
export function getImageUrl(path: string, type: 'poster' | 'badge' | 'proxy' = 'poster'): string {
  if (type === 'badge') {
    return `/api/image-proxy?url=${encodeURIComponent(ENDPOINTS.badge(path))}`
  }
  if (type === 'proxy') {
    return `/api/image-proxy?url=${encodeURIComponent(ENDPOINTS.proxy(path))}`
  }
  // Path already includes .webp extension from API
  if (path.startsWith('/api/images/')) {
    return `/api/image-proxy?url=${encodeURIComponent(`${STREAMED_BASE_URL}${path}`)}`
  }
  return path
}

// Categorize matches by sport category
export function categorizeMatches(matches: StreamedMatch[]): UnifiedCategory[] {
  const categories = new Map<string, StreamedMatch[]>()
  
  matches.forEach(match => {
    if (!categories.has(match.category)) {
      categories.set(match.category, [])
    }
    categories.get(match.category)!.push(match)
  })
  
  return Array.from(categories.entries()).map(([category, matches]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    games: matches.map(transformToUnifiedGame),
    source: 'streamed' as const,
  }))
}

// Fetch and categorize for SportsGrid
export async function fetchSportsGridData(): Promise<UnifiedCategory[]> {
  const matches = await fetchLiveMatches()
  
  // Filter out matches without posters
  const validMatches = matches.filter(hasValidPoster)
  
  return categorizeMatches(validMatches)
}

// Source priority for auto-selection (best quality sources first)
const SOURCE_PRIORITY = ['admin', 'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'intel']

// Get best source for a match
export function getBestSource(match: StreamedMatch): StreamedSource | null {
  if (!match.sources || match.sources.length === 0) return null
  
  // Sort by priority
  const sorted = [...match.sources].sort((a, b) => {
    const idxA = SOURCE_PRIORITY.indexOf(a.source)
    const idxB = SOURCE_PRIORITY.indexOf(b.source)
    if (idxA === -1) return 1
    if (idxB === -1) return -1
    return idxA - idxB
  })
  
  return sorted[0]
}
