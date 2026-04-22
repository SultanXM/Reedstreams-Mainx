'use client'

import { useState, useEffect, useRef } from 'react'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
        }
      } catch (err) {
        console.warn('Failed to fetch messages', err)
      }
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

      // Check for secret admin key entry (e.g., "/admin obsessed_boss_2026")
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
    if (firstChar === 'H') return '#ef4444' // Red for H as requested

    const colors = [
      '#3b82f6', // blue
      '#22c55e', // green
      '#a855f7', // purple
      '#f97316', // orange
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#eab308', // yellow
      '#6366f1', // indigo
      '#14b8a6', // teal
      '#fbbf24'  // amber
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
          <span className={styles.liveDot} />
          Community Chat
        </div>
        <button 
           className={styles.changeNameBtn}
           onClick={() => setIsNameSet(false)}
        >
          Change Name
        </button>
      </div>
      
      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.emptyMsg}>No messages yet. Be the first!</div>
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
                    title="Delete Message"
                  >
                    ✕
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
          placeholder="Type a message..."
          maxLength={200}
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  )
}
