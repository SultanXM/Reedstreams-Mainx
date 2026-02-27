// Centralized API Configuration
// Direct connection to edge server (CORS enabled)
export const API_BASE_URL = 'https://reedstreams-edge-v2.fly.dev'
export const API_V1_URL = `${API_BASE_URL}/api/v1`
export const API_STREAMS_URL = `${API_V1_URL}/streams`

// For backward compatibility
export const REED_API_BASE = API_BASE_URL
export const REED_API_V1 = API_V1_URL
