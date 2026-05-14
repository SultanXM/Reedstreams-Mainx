'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './Chat.module.css'
import { SERVICE_API_BASE } from '../lib/serviceApi'

interface ChatMessage {
  id: string
  username: string
  content: string
  timestamp: string
}

const ADMIN_KEY_STORAGE = 'reedstreams_admin_key'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [username, setUsername] = useState('')
  const [isNameSet, setIsNameSet] = useState(false)
  const [inputText, setInputText] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [adminFeedback, setAdminFeedback] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
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
        const res = await fetch(`${SERVICE_API_BASE}/chat/messages`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('disconnected')
        }
      } catch (err) {
        setConnectionStatus('disconnected')
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150
    
    if (isNearBottom || shouldAutoScroll) {
      container.scrollTop = container.scrollHeight
      if (shouldAutoScroll) setShouldAutoScroll(false)
    }
  }, [messages, shouldAutoScroll])

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = username.trim()
    if (trimmedName) {
      if (trimmedName.toLowerCase() === '/admin reset') {
        setAdminKey('')
        localStorage.removeItem(ADMIN_KEY_STORAGE)
        setAdminFeedback('Admin Data Cleared!')
        setUsername('')
        setTimeout(() => setAdminFeedback(''), 3000)
        return
      }

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
      const res = await fetch(`${SERVICE_API_BASE}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          content: inputText,
        }),
      })
      if (res.ok) {
        setInputText('')
        setShouldAutoScroll(true)
      }
    } catch (err) {
      console.warn('Failed to send message', err)
    }
  }

  const handleDeleteMessage = async (msgId: string) => {
    if (!adminKey) return
    try {
      const res = await fetch(`${SERVICE_API_BASE}/chat/message/${msgId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_key: adminKey }),
      })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== msgId))
      }
    } catch (err) {
      console.warn('Failed to delete message', err)
    }
  }

  const getUsernameColor = (name: string) => {
    const firstChar = name.charAt(0).toUpperCase()
    if (firstChar === 'H') return '#ef4444' 
    const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#06b6d4', '#eab308', '#6366f1', '#14b8a6', '#fbbf24']
    return colors[firstChar.charCodeAt(0) % colors.length]
  }

  if (!isNameSet) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <span className={styles.headerTitle}>Community Chat</span>
        </div>
        <div className={styles.nameOverlay}>
          <form onSubmit={handleSetName} className={styles.nameForm}>
            <p>Enter a username to join</p>
            {adminFeedback && <div className={styles.adminSuccess}>{adminFeedback}</div>}
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your username..."
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
          <span className={styles.headerTitle}>Community Chat</span>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.statusText} ${styles[`text_${connectionStatus}`]}`}>
            {connectionStatus}
          </span>
          <div className={`${styles.statusDot} ${styles[connectionStatus]}`} />
          <button className={styles.changeNameBtn} onClick={() => setIsNameSet(false)}>Name</button>
        </div>
      </div>
      
      <div className={styles.messagesList} ref={scrollContainerRef}>
        {messages.length === 0 ? (
          <div className={styles.emptyMsg}>Start the conversation...</div>
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
                  <button onClick={() => handleDeleteMessage(msg.id)} className={styles.deleteBtn}>×</button>
                )}
              </div>
              <div className={styles.msgContent}>{msg.content}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  )
}
