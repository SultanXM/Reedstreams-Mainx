const EXPLICIT_SERVICE_API_BASE =
  process.env.NEXT_PUBLIC_SERVICE_API_URL ||
  process.env.NEXT_PUBLIC_STREAM_API_URL ||
  process.env.NEXT_PUBLIC_VIEW_API ||
  ''

function resolveServiceApiBase(): string {
  if (typeof window === 'undefined') {
    return EXPLICIT_SERVICE_API_BASE || 'http://api.reedstreams.live'
  }

  const { hostname, protocol } = window.location
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0'

  if (EXPLICIT_SERVICE_API_BASE) {
    const isInsecureHttp = EXPLICIT_SERVICE_API_BASE.startsWith('http://')
    if (protocol === 'https:' && isInsecureHttp) {
      return '/api'
    }
    return EXPLICIT_SERVICE_API_BASE
  }

  if (isLocalhost) {
    return 'http://api.reedstreams.live'
  }

  return '/api'
}

export const SERVICE_API_BASE = resolveServiceApiBase()
