// Centralized API Configuration
export const API_BASE_URL = 'https://api-reedstreams-lb.fly.dev'
export const API_V1_URL = `${API_BASE_URL}/api/v1`

// PPVSU Streams (custom player)
export const API_STREAMS_URL = `${API_V1_URL}/streams`
export const getStreamSignedUrl = (id: string) => `${API_V1_URL}/streams/ppvsu/${id}/signed-url`
export const getStreamProxyUrl = (signedUrlPath: string) => 
  signedUrlPath.startsWith('http') ? signedUrlPath : `${API_BASE_URL}${signedUrlPath}`

// Sportsurge Streams (iframe player) - kept for backward compatibility
export const getSportsurgeEmbedUrl = (id: string) => `${API_V1_URL}/streams/sportsurge/${id}/embed`

// Games/Matches
export const API_GAMES_URL = `${API_BASE_URL}/reedstreams/games`
export const getMatchesUrl = (sportId?: string) => 
  sportId ? `${API_BASE_URL}/matches/${sportId}` : `${API_BASE_URL}/matches`

// Sports
export const API_SPORTS_URL = `${API_BASE_URL}/sports`

// Views
export const API_VIEWS_BATCH_COUNT = `${API_BASE_URL}/views/batch/count`

// Admin
export const API_ADMIN_MATCHES = `${API_BASE_URL}/matches`
export const API_STREAM_CONTROL = `${API_BASE_URL}/stream-control`

// Analytics
export const API_ANALYTICS_ERROR = `${API_BASE_URL}/analytics/error`
export const API_ANALYTICS_TELEMETRY = `${API_BASE_URL}/analytics/shield-telemetry`
export const API_ANALYTICS_AD_EVENTS = `${API_BASE_URL}/analytics/ad-events`
export const API_ANALYTICS_BREAKTHROUGH = `${API_BASE_URL}/analytics/breakthrough`
export const API_ANALYTICS_AB_TEST = `${API_BASE_URL}/analytics/ab-test-results`

// Source identifiers for routing
export const STREAM_SOURCE = {
  PPVSU: 'ppvsu',
  SPORTSURGE: 'sportsurge'
} as const

// For backward compatibility
export const REED_API_BASE = API_BASE_URL
export const REED_API_V1 = API_V1_URL
