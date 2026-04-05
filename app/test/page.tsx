'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function TestPage() {
  const [token, setToken] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' })
  const [forgotData, setForgotData] = useState({ email: '' })
  const [resetData, setResetData] = useState({ token: '', new_password: '' })
  const [changeUsernameData, setChangeUsernameData] = useState({ new_username: '' })
  const [profileData, setProfileData] = useState({
    theme: 'dark',
    avatar_url: '',
    description: '',
    name_color: '#3b82f6'
  })

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token')
      const savedUserId = localStorage.getItem('userId')
      const savedUsername = localStorage.getItem('username')
      const savedIsAdmin = localStorage.getItem('isAdmin') === 'true'
      if (savedToken) {
        setToken(savedToken)
        setUserId(savedUserId || '')
        setUsername(savedUsername || '')
        setIsAdmin(savedIsAdmin)
      }
    } catch (err) {
      console.error('Failed to access localStorage:', err)
    }
  }, [])

  const parseResponse = async (res: Response) => {
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/chat/messages?limit=50`)
      const data = await parseResponse(res)
      if (res.ok) {
        setMessages(data.reverse())
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [token, fetchMessages])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setToken(data.token)
        setUserId(data.user_id)
        setUsername(data.username)
        setIsAdmin(data.is_admin)
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user_id)
        localStorage.setItem('username', data.username)
        localStorage.setItem('isAdmin', data.is_admin)
        setMessage('Signup successful!')
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setToken(data.token)
        setUserId(data.user_id)
        setUsername(data.username)
        setIsAdmin(data.is_admin)
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user_id)
        localStorage.setItem('username', data.username)
        localStorage.setItem('isAdmin', data.is_admin)
        setMessage('Login successful!')
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forgotData)
      })
      const data = await parseResponse(res)
      if (res.ok) {
        if (data.token) {
          setMessage(`TOKEN: ${data.token}`)
        } else {
          setMessage('If email exists, reset sent')
        }
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setMessage('Password reset successful!')
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/auth/change-username`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changeUsernameData)
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setUsername(data.username)
        localStorage.setItem('username', data.username)
        setMessage('Username changed!')
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setProfile(data)
        setProfileData({
          theme: data.theme || 'dark',
          avatar_url: data.avatar_url || '',
          description: data.description || '',
          name_color: data.name_color || '#3b82f6'
        })
        setMessage('Profile loaded!')
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = {
        theme: profileData.theme,
        avatar_url: profileData.avatar_url || null,
        description: profileData.description || null,
        name_color: profileData.name_color
      }
      const res = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setProfile(data)
        setMessage('Profile updated!')
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setMessage('File too large! Max 2MB')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        const base64 = reader.result as string
        const res = await fetch(`${API_URL}/profile/upload-pic`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ image_data: base64 })
        })
        const data = await parseResponse(res)
        if (res.ok) {
          setMessage('Profile picture uploaded!')
          fetchProfile()
        } else {
          setMessage(`Error: ${JSON.stringify(data)}`)
        }
      } catch (err: any) {
        setMessage(`Error: ${err.message}`)
      }
    }
  }

  const deleteProfilePic = async () => {
    try {
      const res = await fetch(`${API_URL}/profile/delete-pic`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setMessage('Profile picture deleted!')
        fetchProfile()
      } else {
        const data = await parseResponse(res)
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    try {
      const res = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ content: chatInput })
      })
      const data = await parseResponse(res)
      if (res.ok) {
        setChatInput('')
        fetchMessages()
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setMessage(`Network Error: ${err.message}`)
    }
  }

  const logout = () => {
    setToken('')
    setUserId('')
    setUsername('')
    setIsAdmin(false)
    setProfile(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('isAdmin')
    setMessage('Logged out')
  }

  const renderUserWithData = (msg: any) => {
    const color = msg.name_color || '#3b82f6'
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {msg.profile_pic_url && (
          <img 
            src={msg.profile_pic_url} 
            alt="" 
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        {msg.memes && msg.memes.length > 0 && (
          <span>
            {msg.memes.map((meme: string, i: number) => (
              <img 
                key={i} 
                src={meme} 
                alt="" 
                style={{ width: '20px', height: '20px', marginRight: '2px' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ))}
          </span>
        )}
        <strong style={{ color }}>{msg.username}</strong>
      </span>
    )
  }

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#050505',
    border: '1px solid #2563eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#050505',
    border: '1px solid #2563eb',
    borderRadius: '4px',
    color: '#d1d5db'
  }

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  }

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#dc2626'
  }

  const warningButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#d97706'
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#050505', minHeight: '100vh', color: '#d1d5db' }}>
      <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>Reedstreams Test Page</h1>
      
      {message && (
        <div style={{ 
          ...sectionStyle, 
          backgroundColor: message.includes('Error') ? '#450a0a' : '#052e16',
          borderColor: message.includes('Error') ? '#dc2626' : '#22c55e'
        }}>
          <strong>{message.includes('Error') ? 'Error:' : 'Success:'}</strong> {message}
        </div>
      )}

      {!token ? (
        <>
          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Signup</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>Signup</button>
            </form>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>Login</button>
            </form>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email"
                value={forgotData.email}
                onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                style={inputStyle}
              />
              <button type="submit" style={warningButtonStyle}>Get Reset Token</button>
            </form>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Reset Token"
                value={resetData.token}
                onChange={(e) => setResetData({...resetData, token: e.target.value})}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="New Password"
                value={resetData.new_password}
                onChange={(e) => setResetData({...resetData, new_password: e.target.value})}
                style={inputStyle}
              />
              <button type="submit" style={dangerButtonStyle}>Reset Password</button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Logged In</h2>
            <p>Username: <strong>{username}</strong></p>
            <p>User ID: {userId}</p>
            <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
            {isAdmin && <p><a href="/admin" style={{ color: '#f59e0b' }}>Go to Admin Panel</a></p>}
            <button onClick={logout} style={dangerButtonStyle}>Logout</button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Profile Picture</h2>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ marginBottom: '10px', color: '#d1d5db' }}
            />
            <button onClick={() => fileInputRef.current?.click()} style={buttonStyle}>Upload Picture</button>
            <button onClick={deleteProfilePic} style={dangerButtonStyle}>Delete Picture</button>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px' }}>Max 2MB</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Profile Settings</h2>
            <button onClick={fetchProfile} style={buttonStyle}>Load Profile</button>
            <form onSubmit={updateProfile}>
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name Color:</label>
                <input
                  type="color"
                  value={profileData.name_color}
                  onChange={(e) => setProfileData({...profileData, name_color: e.target.value})}
                  style={{ marginRight: '10px' }}
                />
                <input
                  type="text"
                  value={profileData.name_color}
                  onChange={(e) => setProfileData({...profileData, name_color: e.target.value})}
                  style={{ ...inputStyle, display: 'inline-block', width: '100px' }}
                />
              </div>
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                <textarea
                  placeholder="Description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                  style={{ ...inputStyle, minHeight: '80px' }}
                />
              </div>
              <button type="submit" style={buttonStyle}>Update Profile</button>
            </form>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Change Username</h2>
            <form onSubmit={handleChangeUsername}>
              <input
                type="text"
                placeholder="New Username"
                value={changeUsernameData.new_username}
                onChange={(e) => setChangeUsernameData({...changeUsernameData, new_username: e.target.value})}
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>Change Username</button>
            </form>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Chat</h2>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto', 
              marginBottom: '15px',
              backgroundColor: '#0a0a0a',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {messages.length === 0 ? (
                <p>No messages...</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ 
                    marginBottom: '8px', 
                    padding: '8px',
                    borderBottom: '1px solid #1f2937'
                  }}>
                    <div>{renderUserWithData(msg)}</div>
                    <div style={{ marginLeft: '32px', color: '#e5e7eb' }}>{msg.content}</div>
                    <small style={{ color: '#6b7280' }}>{new Date(msg.created_at).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>Send</button>
            </form>
          </div>

          {profile && (
            <div style={sectionStyle}>
              <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>Current Profile</h2>
              <pre style={{ 
                backgroundColor: '#0a0a0a', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
