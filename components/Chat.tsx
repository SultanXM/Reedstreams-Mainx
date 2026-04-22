'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './Chat.module.css'

interface ChatMessage {
  id: string
  username: string
  content: string
  timestamp: string
}

const API_BASE = process.env.NEXT_PUBLIC_VIEW_API || 'https://api.reedstreams.live'
const ADMIN_KEY_STORAGE = 'reedstreams_admin_key'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [username, setUsername] = useState('')
  const [isNameSet, setIsNameSet] = useState(false)
  const [inputText, setInputText] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [adminFeedback, setAdminFeedback] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  useEffect(() => {
    const savedName = localStorage.getItem('chat_username')
    if (savedName) {
      setUsername(savedName)
      setIsNameSet(true)
    }
    const savedAdminKey = localStorage.getItem(ADMIN_KEY_STORAGE)
    if (savedAdminKey) {
      setAdminKey(savedAdminKey)
    }
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/messages`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('disconnected')
        }
      } catch (err) {
        console.warn('Failed to fetch messages', err)
        setConnectionStatus('disconnected')
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  // Smart scrolling: Only scroll to bottom if shouldAutoScroll is true
  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, shouldAutoScroll])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    setShouldAutoScroll(isAtBottom)
  }

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = username.trim()
    if (trimmedName) {
      // Secret reset command
      if (trimmedName.toLowerCase() === '/admin reset') {
        setAdminKey('')
        localStorage.removeItem(ADMIN_KEY_STORAGE)
        setAdminFeedback('Admin Data Cleared!')
        setUsername('')
        setTimeout(() => setAdminFeedback(''), 3000)
        return
      }

      // Check for secret admin key entry
      if (trimmedName.toLowerCase().startsWith('/admin ')) {
        const key = trimmedName.slice(7).trim().toLowerCase()
        setAdminKey(key)
        localStorage.setItem(ADMIN_KEY_STORAGE, key)
        setAdminFeedback('Admin Key Saved!')
        setUsername('')
        setTimeout(() => setAdminFeedback(''), 3000)
        return
      }
      localStorage.setItem('chat_username', trimmedName)
      setIsNameSet(true)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    try {
      const res = await fetch(`${API_BASE}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          content: inputText,
        }),
      })
      if (res.ok) {
        setInputText('')
        setShouldAutoScroll(true) // Force scroll when user sends message
      }
    } catch (err) {
      console.warn('Failed to send message', err)
    }
  }

  const handleDeleteMessage = async (msgId: string) => {
    if (!adminKey) return
    try {
      const res = await fetch(`${API_BASE}/chat/message/${msgId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_key: adminKey }),
      })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== msgId))
      } else if (res.status === 401) {
        alert('Invalid Admin Key')
        setAdminKey('')
        localStorage.removeItem(ADMIN_KEY_STORAGE)
      }
    } catch (err) {
      console.warn('Failed to delete message', err)
    }
  }

  const getUsernameColor = (name: string) => {
    const firstChar = name.charAt(0).toUpperCase()
    if (firstChar === 'H') return '#ef4444' // Red for H

    const colors = [
      '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', 
      '#06b6d4', '#eab308', '#6366f1', '#14b8a6', '#fbbf24'
    ]
    const index = firstChar.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (!isNameSet) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>Community Chat</div>
        <div className={styles.nameOverlay}>
          <form onSubmit={handleSetName} className={styles.nameForm}>
            <p>Enter a username to join the chat</p>
            {adminFeedback && <div className={styles.adminSuccess}>{adminFeedback}</div>}
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={adminFeedback ? "Now enter your username..." : "Your username..."}
              maxLength={20}
              className={styles.nameInput}
            />
            <button type="submit" className={styles.nameBtn}>Join Chat</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <div className={`${styles.statusDot} ${styles[connectionStatus]}`} />
          <span className={styles.headerTitle}>Community Chat</span>
          {connectionStatus !== 'connected' && (
            <span className={styles.statusText}>
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          )}
        </div>
        <button 
           className={styles.changeNameBtn}
           onClick={() => setIsNameSet(false)}
        >
          Name
        </button>
      </div>
      
      <div 
        className={styles.messagesList} 
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className={styles.emptyMsg}>No messages yet.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={styles.messageItem}>
              <div className={styles.msgTop}>
                <span className={styles.msgUser} style={{ color: getUsernameColor(msg.username) }}>
                  {msg.username}
                </span>
                <span className={styles.msgTime}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {adminKey && (
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className={styles.msgContent}>{msg.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Message..."
          maxLength={200}
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  )
}
