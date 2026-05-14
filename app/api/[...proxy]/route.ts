import { NextRequest, NextResponse } from 'next/server'

// Allow self-signed certificates for the proxy in development and if configured
if (process.env.NODE_ENV === 'development' || process.env.ALLOW_SELF_SIGNED === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

// Order of priority for backend:
// 1. BACKEND_URL (env)
// 2. NEXT_PUBLIC_API_URL (env)
// 3. VPS API (default)
const GET_BACKEND_URL = () => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.startsWith('/')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://api.reedstreams.live';
};

export async function GET(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function POST(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function PUT(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function DELETE(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

export async function PATCH(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleRequest(request, params.proxy)
}

async function handleRequest(request: NextRequest, proxyPath: string[]) {
  const { search } = request.nextUrl
  
  // Determine target backend
  let targetBaseUrl = GET_BACKEND_URL()
  let backendPath = proxyPath.join('/')
  
  // Clean up the URL construction
  const baseUrl = targetBaseUrl.endsWith('/') ? targetBaseUrl.slice(0, -1) : targetBaseUrl;
  const url = `${baseUrl}/${backendPath}${search}`
  
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    // Avoid forwarding restricted or hop-by-hop headers
    if (!['host', 'connection', 'content-length', 'content-encoding', 'transfer-encoding', 'cookie'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  // Ensure a reasonable User-Agent is set
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
  }

  // Ensure origin/referer are set correctly for the target if needed
  if (targetBaseUrl.includes('streamed.pk')) {
    headers.set('Origin', 'https://streamed.pk')
    headers.set('Referer', 'https://streamed.pk/')
  }

  // Forward the client's IP address
  const clientIp = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1'
  headers.set('X-Forwarded-For', clientIp)
  
  try {
    const body = ['GET', 'HEAD'].includes(request.method) 
      ? undefined 
      : await request.arrayBuffer()
    
    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
      // Add a timeout to prevent hanging the proxy
      signal: AbortSignal.timeout(20000), 
    })
    
    const responseHeaders = new Headers()
    res.headers.forEach((value, key) => {
      // Don't forward hop-by-hop headers or cookies
      if (!['content-encoding', 'content-length', 'transfer-encoding', 'set-cookie', 'connection', 'keep-alive'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })
    
    // Add CORS headers for local development
    responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    responseHeaders.set('Access-Control-Allow-Credentials', 'true')
    
    // Check if the response is actually valid before streaming
    if (!res.ok && res.status >= 500) {
      console.error(`Upstream error (${res.status}) for: ${url}`);
    }
    
    // Return the response as a blob/stream
    const data = await res.arrayBuffer()
    
    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error(`API proxy error for ${url}:`, error.message)
    
    // Return a more descriptive error if it's a timeout
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backend service timeout', detail: 'The request took too long to respond' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: 'Backend service unavailable', detail: error.message },
      { status: 503 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}
