const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function getToken() {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  if (!user) return null
  return JSON.parse(user).token
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }
  
  return res.json()
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
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
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
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
  const res = await fetch(`${API_URL}/chat/messages?limit=${limit}&offset=${offset}`)
  
  if (!res.ok) {
    throw new Error('Failed to fetch messages')
  }
  
  return res.json()
}

export async function sendMessage(content: string) {
  const token = getToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const res = await fetch(`${API_URL}/chat/send`, {
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

  const res = await fetch(`${API_URL}/profile`, {
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

  const res = await fetch(`${API_URL}/profile`, {
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

  const res = await fetch(`${API_URL}/profile/upload-pic`, {
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

  const res = await fetch(`${API_URL}/profile/delete-pic`, {
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

  const res = await fetch(`${API_URL}/auth/change-username`, {
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
  const res = await fetch(`${API_URL}/views/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ match_id: matchId }),
  })

  if (!res.ok) {
    return { views: 0 }
  }

  return res.json()
}

export async function getViews(matchId: string) {
  const res = await fetch(`${API_URL}/views/${matchId}`)

  if (!res.ok) {
    return { views: 0 }
  }

  return res.json()
}

export async function getAllViews(): Promise<{ match_id: string, views: number }[]> {
  const res = await fetch(`${API_URL}/views/all`)

  if (!res.ok) {
    return []
  }

  return res.json()
}
