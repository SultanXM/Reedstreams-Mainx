const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reedstreams-backend-app-production.up.railway.app'
const API_URL = API_BASE_URL

export function getFullImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('data:')) return url
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`;
}

function getToken() {
  if (typeof window === 'undefined') return null
  try {
    const user = localStorage.getItem('user')
    if (!user) return null
    try {
      return JSON.parse(user).token
    } catch (e) {
      console.error('Failed to parse user data in getToken:', e)
      return null
    }
  } catch (e) {
    console.error('Failed to access localStorage in getToken:', e)
    return null
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }

    return res.json()
  } catch (error) {
    console.warn('Registration failed:', error)
    throw error
  }
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export interface ChatMessage {
  id: string
  user_id: string
  username: string
  content: string
  created_at: string
  memes?: string[]
  profile_pic_url?: string
  name_color?: string
  name_glow?: number
  badge?: 'admin' | 'dev' | 'vip' | null
}

export async function getMessages(limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/messages?limit=${limit}&offset=${offset}`)

    if (!res.ok) {
      console.warn('Failed to fetch chat messages, returning empty array')
      return []
    }

    return res.json()
  } catch (error) {
    console.warn('Error fetching chat messages:', error)
    return []
  }
}

export async function sendMessage(content: string) {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_BASE_URL}/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export interface Profile {
  user_id: string
  tags?: string[]
  memes?: string[]
  theme?: string
  avatar_url?: string
  profile_pic_url?: string
  name_color?: string
  name_glow?: number
  description?: string
  updated_at: string
}

export async function getProfile(): Promise<Profile> {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('401: Invalid token')
    }
    const error = await res.text()
    throw new Error(error || 'Failed to fetch profile')
  }
  
  return res.json()
}

export async function updateProfile(data: {
  theme?: string
  avatar_url?: string
  description?: string
  name_color?: string
  name_glow?: number
}) {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export async function uploadProfilePic(imageData: string) {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_BASE_URL}/profile/upload-pic`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ image_data: imageData }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export async function deleteProfilePic() {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_BASE_URL}/profile/delete-pic`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export async function changeUsername(newUsername: string) {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_BASE_URL}/auth/change-username`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ new_username: newUsername }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }

  return res.json()
}

export async function trackView(matchId: string) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    
    const res = await fetch(`${API_BASE_URL}/views/all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_id: matchId }),
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return { views: 0 }
    }

    return res.json()
  } catch (error) {
    return { views: 0 }
  }
}

export async function getViews(matchId: string) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    
    const res = await fetch(`${API_BASE_URL}/views/${matchId}`, {
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return { views: 0 }
    }

    return res.json()
  } catch (error) {
    return { views: 0 }
  }
}

export async function getAllViews(): Promise<{ match_id: string, views: number }[]> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    
    const res = await fetch(`${API_BASE_URL}/views/all`, {
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return []
    }

    return res.json()
  } catch (error) {
    return []
  }
}
