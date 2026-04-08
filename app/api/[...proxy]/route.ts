import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://187.127.106.231:8080'

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}

export async function PUT(request: NextRequest) {
  return handleRequest(request)
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request)
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request)
}

async function handleRequest(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  
  // Remove /api prefix
  const backendPath = pathname.replace(/^\/api/, '') || '/'
  const url = `${BACKEND_URL}${backendPath}${search}`
  
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })
  
  try {
    const body = ['GET', 'HEAD'].includes(request.method) 
      ? undefined 
      : await request.text()
    
    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
    })
    
    const responseHeaders = new Headers()
    res.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })
    
    // Add CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    const data = await res.text()
    
    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { error: 'Backend service unavailable' },
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
