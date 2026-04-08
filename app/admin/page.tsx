'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import DefaultSourceTab from './DefaultSourceTab'
import styles from './AdminPage.module.css'

const API_URL = '/api'

interface User {
  user_id: string
  username: string
  email: string
  is_admin: boolean
  tags?: string[]
  memes?: string[]
  name_color?: string
  name_glow?: number
  profile_pic_url?: string
  timeout_until?: string
  badge?: 'admin' | 'dev' | 'vip' | null
}

interface ChatMessage {
  id: string
  user_id: string
  username: string
  content: string
  created_at: string
  name_color?: string
  name_glow?: number
  profile_pic_url?: string
  memes?: string[]
  badge?: 'admin' | 'dev' | 'vip' | null
}

const BADGE_CONFIG = {
  admin: { label: 'ADMIN', className: 'badgeAdmin' },
  dev: { label: 'DEV', className: 'badgeDev' },
  vip: { label: 'VIP', className: 'badgeVip' }
}

export default function AdminPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Login form
  const [loginData, setLoginData] = useState({ username: '', password: '' })

  // Data
  const [users, setUsers] = useState<User[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'sources'>('users')
  
  // Search & Filter
  const [userSearch, setUserSearch] = useState('')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  
  // Edit modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editData, setEditData] = useState({ 
    tags: '', 
    memes: '', 
    name_color: '#3b82f6',
    name_glow: 8,
    badge: '' as 'admin' | 'dev' | 'vip' | ''
  })
  const [timeoutMinutes, setTimeoutMinutes] = useState(60)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const isAdminFlag = localStorage.getItem('isAdmin') === 'true'
    if (savedToken) {
      setToken(savedToken)
      setIsAdmin(isAdminFlag)
    }
    setLoading(false)
  }, [])

  const parseResponse = async (res: Response) => {
    const text = await res.text()
    try { return JSON.parse(text) } catch { return text }
  }

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg)
      setTimeout(() => setError(''), 4000)
    } else {
      setMessage(msg)
      setTimeout(() => setMessage(''), 3000)
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
      if (res.ok && data.is_admin) {
        setToken(data.token)
        setIsAdmin(true)
        localStorage.setItem('token', data.token)
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('username', data.username)
        showMessage('Welcome, Admin!')
      } else if (res.ok && !data.is_admin) {
        showMessage('Access denied: Not an admin', true)
      } else {
        showMessage(`Error: ${JSON.stringify(data)}`, true)
      }
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const logout = () => {
    setToken('')
    setIsAdmin(false)
    setUsers([])
    setChatMessages([])
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    showMessage('Logged out')
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await parseResponse(res)
      if (res.ok) setUsers(data)
      else showMessage(`Error: ${JSON.stringify(data)}`, true)
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const fetchChatMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/messages?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await parseResponse(res)
      if (res.ok) setChatMessages(data.reverse())
      else showMessage(`Error: ${JSON.stringify(data)}`, true)
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const clearAllChat = async () => {
    if (!confirm('Are you sure you want to delete ALL chat messages? This cannot be undone!')) return
    try {
      const res = await fetch(`${API_URL}/admin/chat/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        showMessage('All chat messages cleared!')
        setChatMessages([])
      } else if (res.status === 404) {
        showMessage('Cleared locally (API endpoint not available)')
        setChatMessages([])
      } else {
        const data = await parseResponse(res)
        showMessage(`Error: ${JSON.stringify(data)}`, true)
      }
    } catch (err: any) {
      showMessage('Cleared locally')
      setChatMessages([])
    }
  }

  const updateUser = async (userId: string) => {
    try {
      const body = {
        tags: editData.tags.split(',').map(t => t.trim()).filter(Boolean),
        memes: editData.memes.split(',').map(m => m.trim()).filter(Boolean),
        name_color: editData.name_color,
        name_glow: editData.name_glow,
        badge: editData.badge || null
      }
      const res = await fetch(`${API_URL}/admin/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        showMessage('User updated!')
        setSelectedUser(null)
        fetchUsers()
      } else {
        const data = await parseResponse(res)
        showMessage(`Error: ${JSON.stringify(data)}`, true)
      }
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const timeoutUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/timeout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ user_id: userId, minutes: timeoutMinutes })
      })
      if (res.ok) {
        showMessage(`Timed out for ${timeoutMinutes} minutes`)
        fetchUsers()
      } else {
        const data = await parseResponse(res)
        showMessage(`Error: ${JSON.stringify(data)}`, true)
      }
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const unbanUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        showMessage('User unbanned!')
        fetchUsers()
      } else {
        const data = await parseResponse(res)
        showMessage(`Error: ${JSON.stringify(data)}`, true)
      }
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        showMessage('Message deleted!')
        fetchChatMessages()
      } else {
        const data = await parseResponse(res)
        showMessage(`Error: ${JSON.stringify(data)}`, true)
      }
    } catch (err: any) {
      showMessage(`Network Error: ${err.message}`, true)
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditData({
      tags: user.tags?.join(', ') || '',
      memes: user.memes?.join(', ') || '',
      name_color: user.name_color || '#3b82f6',
      name_glow: user.name_glow || 8,
      badge: user.badge || ''
    })
  }

  const isUserTimedOut = (user: User) => {
    if (!user.timeout_until) return false
    return new Date(user.timeout_until) > new Date()
  }

  const formatTimeRemaining = (timeoutUntil: string) => {
    const diff = new Date(timeoutUntil).getTime() - new Date().getTime()
    const mins = Math.floor(diff / 60000)
    return `${mins}m left`
  }

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users
    const search = userSearch.toLowerCase()
    return users.filter(u => 
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.user_id.toLowerCase().includes(search)
    )
  }, [users, userSearch])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.dashboardMain} />
      </>
    )
  }

  // LOGIN VIEW
  if (!isAdmin || !token) {
    return (
      <>
        <Navbar />
        <main className={styles.loginMain}>
          <div className={styles.loginCard}>
            
            <div className={styles.loginHeader}>
              <h1 className={styles.loginTitle}>
                Admin Sign In
              </h1>
            </div>

            {/* Alerts */}
            {error && (
              <div className={styles.errorAlert}>
                {error}
              </div>
            )}
            {message && (
              <div className={styles.successAlert}>
                {message}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.inputWrapper}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                  className={styles.inputIcon}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Username"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.inputWrapper}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                  className={styles.inputIcon}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Password"
                  className={styles.input}
                />
              </div>
              
              <button 
                type="submit"
                className={styles.submitButton}
              >
                Sign In
              </button>
            </form>
          </div>
        </main>
      </>
    )
  }

  // ADMIN DASHBOARD
  return (
    <>
      <Navbar />
      <main className={styles.dashboardMain}>
        <div className={styles.dashboardContainer}>
          
          {/* Header */}
          <div className={styles.dashboardHeader}>
            <div>
              <h1 className={styles.dashboardTitle}>
                Admin Dashboard
              </h1>
              <p className={styles.dashboardSubtitle}>
                Manage users, badges & moderate chat
              </p>
            </div>
            <button 
              onClick={logout}
              className={styles.logoutButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
              </svg>
              Sign Out
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className={styles.errorAlert}>
              {error}
            </div>
          )}
          {message && (
            <div className={styles.successAlert}>
              {message}
            </div>
          )}

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              onClick={() => setActiveTab('users')}
              className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Users
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`${styles.tab} ${activeTab === 'chat' ? styles.tabActive : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat Moderation
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`${styles.tab} ${activeTab === 'sources' ? styles.tabActive : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              Source Control
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              {/* Search & Actions */}
              <div className={styles.searchActions}>
                <div className={styles.searchWrapper}>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#666" 
                    strokeWidth="2"
                    className={styles.inputIcon}
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email or ID..."
                    className={styles.searchInput}
                  />
                </div>
                <button 
                  onClick={fetchUsers}
                  className={styles.actionButton}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh
                </button>
              </div>

              {/* Users Grid */}
              <div className={styles.listContainer}>
                {filteredUsers.length === 0 ? (
                  <div className={styles.emptyState}>
                    {users.length === 0 ? 'Click "Refresh" to load users' : 'No users found'}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.user_id} className={`${styles.itemCard} ${expandedUser === user.user_id ? styles.itemCardExpanded : ''}`}>
                      {/* User Row (Always Visible) */}
                      <div 
                        onClick={() => setExpandedUser(expandedUser === user.user_id ? null : user.user_id)}
                        className={styles.itemRow}
                      >
                        {/* Avatar */}
                        <div className={styles.avatar} style={{ border: `2px solid ${user.name_color || '#1a1a25'}` }}>
                          {user.profile_pic_url ? (
                            <img src={user.profile_pic_url} alt="" className={styles.avatarImg} />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Username & Badge */}
                        <div className={styles.itemInfo}>
                          <div className={styles.usernameRow}>
                            <span 
                              className={styles.username}
                              style={{ 
                                color: user.name_color || '#fff',
                                textShadow: (user.name_glow || 0) > 0 ? `0 0 ${user.name_glow}px ${user.name_color || '#fff'}` : 'none'
                              }}
                            >
                              {user.username}
                            </span>
                            {user.badge && (
                              <span
                                className={`${styles.badge} ${styles[BADGE_CONFIG[user.badge].className]}`}
                              >
                                {BADGE_CONFIG[user.badge].label}
                              </span>
                            )}
                            {isUserTimedOut(user) && (
                              <span className={styles.timeoutBadge}>
                                TIMEOUT
                              </span>
                            )}
                          </div>
                          <p className={styles.itemSubtext}>
                            ID: {user.user_id.slice(0, 8)}... • {user.email}
                          </p>
                        </div>

                        {/* Expand Icon */}
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="#666" 
                          strokeWidth="2"
                          className={`${styles.expandIcon} ${expandedUser === user.user_id ? styles.expandIconOpen : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>

                      {/* Expanded Details */}
                      {expandedUser === user.user_id && (
                        <div className={styles.itemDetails}>
                          {/* Tags */}
                          {user.tags && user.tags.length > 0 && (
                            <div className={styles.tagContainer}>
                              {user.tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className={styles.itemActions}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                              className={styles.btnSmall}
                            >
                              Edit
                            </button>
                            
                            {!isUserTimedOut(user) ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); timeoutUser(user.user_id); }}
                                className={`${styles.btnSmall} ${styles.btnTimeout}`}
                              >
                                Timeout ({timeoutMinutes}m)
                              </button>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); unbanUser(user.user_id); }}
                                className={`${styles.btnSmall} ${styles.btnUnban}`}
                              >
                                Unban
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <>
              {/* Chat Actions */}
              <div className={styles.searchActions}>
                <button 
                  onClick={fetchChatMessages}
                  className={styles.actionButton}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Refresh Messages
                </button>
                <button 
                  onClick={clearAllChat}
                  className={`${styles.actionButton} ${styles.clearButton}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Clear All Chat
                </button>
              </div>

              {/* Messages */}
              <div className={styles.listContainer}>
                {chatMessages.length === 0 ? (
                  <div className={styles.emptyState}>
                    Click "Refresh Messages" to load chat
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className={styles.messageCard}>
                      <div className={styles.messageHeader}>
                        <div className={styles.messageContentWrapper}>
                          <div className={styles.messageUserRow}>
                            {msg.profile_pic_url && (
                              <img 
                                src={msg.profile_pic_url} 
                                alt="" 
                                className={styles.messageAvatar}
                              />
                            )}
                            <span 
                              className={styles.messageUsername}
                              style={{ 
                                color: msg.name_color || '#888',
                                textShadow: (msg.name_glow || 0) > 0 ? `0 0 ${msg.name_glow}px ${msg.name_color || '#888'}` : 'none'
                              }}
                            >
                              {msg.username}
                            </span>
                            {msg.badge && (
                              <span
                                className={`${styles.badge} ${styles[BADGE_CONFIG[msg.badge].className]}`}
                              >
                                {BADGE_CONFIG[msg.badge].label}
                              </span>
                            )}
                            <span className={styles.messageTimestamp}>
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className={styles.messageText}>
                            {msg.content}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className={styles.btnDelete}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Source Control Tab */}
          {activeTab === 'sources' && (
            <DefaultSourceTab token={token} showMessage={showMessage} />
          )}

        </div>
      </main>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Edit {selectedUser.username}
              </h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className={styles.closeButton}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* Badge Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label className={styles.modalLabel}>
                  Badge
                </label>
                <div className={styles.badgeGrid}>
                  {[
                    { value: '', label: 'None' },
                    { value: 'admin', label: 'ADMIN', className: 'badgeAdmin' },
                    { value: 'dev', label: 'DEV', className: 'badgeDev' },
                    { value: 'vip', label: 'VIP', className: 'badgeVip' }
                  ].map((badge) => (
                    <button
                      key={badge.value}
                      onClick={() => setEditData({...editData, badge: badge.value as any})}
                      className={`${styles.badgeButton} ${editData.badge === badge.value ? (badge.className ? styles[badge.className as keyof typeof styles] : '') : ''}`}
                      style={{
                        background: editData.badge === badge.value && badge.className ? undefined : '#0a0a0f',
                      }}
                    >
                      {badge.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memes */}
              <div style={{ marginBottom: '24px' }}>
                <label className={styles.modalLabel}>
                  Meme URLs (comma separated)
                </label>
                <textarea
                  value={editData.memes}
                  onChange={(e) => setEditData({...editData, memes: e.target.value})}
                  placeholder="https://example.com/meme1.png, https://example.com/meme2.png"
                  className={styles.textarea}
                />
              </div>

              {/* Actions */}
              <div className={styles.modalFooter}>
                <button 
                  onClick={() => updateUser(selectedUser.user_id)}
                  className={styles.btnSaveModal}
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className={styles.btnCancelModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
