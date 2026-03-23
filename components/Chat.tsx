'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getMessages, sendMessage, ChatMessage } from '../lib/api'
import { useAuth } from '../lib/auth'
import AuthModal from './AuthModal'

//Bro i had no way i added this stickers with jugad

const PEPE_STICKERS = [
  { name: 'Pepe #1', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/0.webp' },
  { name: 'Pepe #2', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/1.webp' },
  { name: 'Pepe #3', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/2.webp' },
  { name: 'Pepe #4', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/3.webp' },
  { name: 'Pepe #5', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/4.webp' },
  { name: 'Pepe #6', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/5.webp' },
  { name: 'Pepe #7', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/6.webp' },
  { name: 'Pepe #8', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/7.webp' },
  { name: 'Pepe #9', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/8.webp' },
  { name: 'Pepe #10', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/9.webp' },
  { name: 'Pepe #11', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/10.webp' },
  { name: 'Pepe #12', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/11.webp' },
  { name: 'Pepe #13', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/12.webp' },
  { name: 'Pepe #14', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/13.webp' },
  { name: 'Pepe #15', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/14.webp' },
  { name: 'Pepe #16', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/15.webp' },
  { name: 'Pepe #17', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/16.webp' },
  { name: 'Pepe #18', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/17.webp' },
  { name: 'Pepe #19', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/18.webp' },
  { name: 'Pepe #20', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/19.webp' },
  { name: 'Pepe #21', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/20.webp' },
  { name: 'Pepe #22', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/21.webp' },
  { name: 'Pepe #23', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/22.webp' },
  { name: 'Pepe #24', url: 'https://cdn2.cdnstep.com/96PteJn7zvMxj8V1BtpU/23.webp' },
]

interface ChatProps {
  showRules?: boolean
  width?: string
  className?: string
  style?: React.CSSProperties
}

export default function Chat({ showRules = true, width = '420px', className = '', style = {} }: ChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showMemePicker, setShowMemePicker] = useState(false)
  const [taggingUser, setTaggingUser] = useState<string | null>(null)
  const [showChatWarning, setShowChatWarning] = useState(showRules)
  const [dismissTimer, setDismissTimer] = useState(3)
  const [chatStatus, setChatStatus] = useState<'connecting..' | 'connected' | 'disconnected!'>('connecting..')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const memePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showChatWarning && dismissTimer > 0) {
      const timer = setTimeout(() => {
        setDismissTimer(dismissTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [dismissTimer, showChatWarning])

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages(50)
      setMessages(data.reverse())
      setChatStatus('connected')
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setChatStatus('disconnected!')
    }
  }, [])

  useEffect(() => {
    setChatStatus('connecting..')
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memePickerRef.current && !memePickerRef.current.contains(event.target as Node)) {
        setShowMemePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!showScrollButton) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, showScrollButton])

  const handleScroll = () => {
    if (!chatContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowScrollButton(false)
  }

  const handleTagUser = (username: string) => {
    setTaggingUser(username)
    setNewMessage(`@${username} `)
  }

  const handleCancelTag = () => {
    setTaggingUser(null)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    if (!user) {
      setAuthModalOpen(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      await sendMessage(newMessage.trim())
      setNewMessage('')
      setTaggingUser(null)
      await fetchMessages()
      setShowScrollButton(false)
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
      if (err.message?.includes('auth') || err.message?.includes('token')) {
        setAuthModalOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendMeme = async (memeUrl: string) => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }

    setLoading(true)
    setError('')

    try {
      await sendMessage(memeUrl)
      await fetchMessages()
      setShowScrollButton(false)
    } catch (err: any) {
      setError(err.message || 'Failed to send meme')
      if (err.message?.includes('auth') || err.message?.includes('token')) {
        setAuthModalOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`chat-section ${className}`} style={{
      width: width,
      minWidth: width,
      maxWidth: width,
      background: '#050505',
      borderLeft: '1px solid #1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      ...style
    }}>
      <div className="chat-header" style={{
        padding: '10px 14px',
        background: '#050505',
        borderBottom: '1px solid #1a1a2e',
        fontSize: '13px',
        fontWeight: '600',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        textTransform: 'lowercase'
      }}>
        <span>chat</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`status-dot ${chatStatus}`} style={{ width: '5px', height: '5px' }} />
          <span className={`status-text ${chatStatus}`} style={{ fontSize: '11px' }}>
            {chatStatus === 'connecting..' ? 'connecting' : chatStatus === 'connected' ? 'connected' : 'disconnected'}
          </span>
        </div>
      </div>

      {showChatWarning && (
        <div className="chat-rules-notice">
          <div className="rules-header">
            <span className="rules-title">Chat Rules</span>
            <button 
              onClick={() => setShowChatWarning(false)} 
              className={`dismiss-btn-icon ${dismissTimer > 0 ? 'disabled' : ''}`}
              disabled={dismissTimer > 0}
            >
              {dismissTimer > 0 ? dismissTimer : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
          <div className="rules-list">
            <div className="rule critical">
              <span className="rule-bullet">•</span>
              <span>Do not promote other streaming sites — <strong>Instant Ban</strong></span>
            </div>
            <div className="rule">
              <span className="rule-bullet">•</span>
              <span>No hate speech or harassment</span>
            </div>
            <div className="rule">
              <span className="rule-bullet">•</span>
              <span>Admins can ban for inappropriate behavior</span>
            </div>
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: 0
        }}
      >
        {messages.length === 0 && !showChatWarning ? (
          <p style={{ color: '#555', fontSize: '13px', textAlign: 'center', marginTop: '80px' }}>
            No messages yet. Be the first to chat!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start'
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {msg.profile_pic_url ? (
                  <img 
                    src={msg.profile_pic_url} 
                    alt={msg.username}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#333',
                    display: msg.profile_pic_url ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: '#666'
                  }}
                >
                  {msg.username.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => handleTagUser(msg.username)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: msg.name_color || '#888',
                      textShadow: (msg.name_glow || 0) > 0 && msg.name_color 
                        ? `0 0 ${msg.name_glow}px ${msg.name_color}` 
                        : 'none'
                    }}
                  >
                    {msg.username}
                  </button>
                  {msg.badge && (
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      ...(msg.badge === 'admin' ? {
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#3b82f6',
                        boxShadow: '0 0 6px rgba(59, 130, 246, 0.4)'
                      } : msg.badge === 'dev' ? {
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#8b5cf6',
                        boxShadow: '0 0 6px rgba(139, 92, 246, 0.3)'
                      } : {
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#ef4444'
                      })
                    }}>
                      {msg.badge === 'admin' ? 'ADMIN' : msg.badge === 'dev' ? 'DEV' : 'VIP'}
                    </span>
                  )}
                  <span style={{
                    fontSize: '10px',
                    color: '#555'
                  }}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                <MessageContent content={msg.content} />
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '20px',
            width: '32px',
            height: '32px',
            background: '#141420',
            border: '1px solid #1e1e2d',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}

      <div style={{
        padding: '10px',
        borderTop: '1px solid #1a1a2e',
        flexShrink: 0
      }}>
          {error && (
          <div style={{
            padding: '6px 10px',
            background: '#1a0f0f',
            border: '1px solid #3a1f1f',
            borderRadius: '6px',
            color: '#ff6b6b',
            fontSize: '11px',
            marginBottom: '8px'
          }}>
            {error}
          </div>
        )}

        {taggingUser && (
          <div style={{
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '6px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '12px', color: '#3b82f6' }}>
              Tagging <strong style={{ color: '#fff' }}>@{taggingUser}</strong>
            </span>
            <button
              onClick={handleCancelTag}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '11px',
                color: '#888'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {!user && (
          <div style={{
            padding: '8px',
            background: '#141420',
            borderRadius: '6px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '12px', color: '#888' }}>
              Please{' '}
              <button 
                onClick={() => setAuthModalOpen(true)}
                style={{
                  color: '#4a9eff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                login
              </button>
              {' '}to chat
            </span>
          </div>
        )}

        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '6px', alignItems: 'center', position: 'relative' }}>
          {/* Sticker Picker */}
          <div ref={memePickerRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => user && setShowMemePicker(!showMemePicker)}
              disabled={!user}
              style={{
                background: showMemePicker ? '#1a1a2e' : 'none',
                border: 'none',
                cursor: user ? 'pointer' : 'not-allowed',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: user ? 1 : 0.3,
                borderRadius: '6px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            
            {/* Sticker Picker Dropdown */}
            {showMemePicker && user && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 0,
                width: '300px',
                maxHeight: '400px',
                background: '#0a0a0f',
                border: '1px solid #1a1a2e',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 9999,
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
              }}>
                <div style={{
                  padding: '12px 16px',
                  background: '#141420',
                  borderBottom: '1px solid #1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                    Pepe Stickers
                  </span>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    {PEPE_STICKERS.length}
                  </span>
                </div>
                
                <div style={{
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  maxHeight: '320px',
                  overflowY: 'auto'
                }}>
                  {PEPE_STICKERS.map((sticker, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSendMeme(sticker.url)
                        setShowMemePicker(false)
                      }}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #1a1a2e',
                        background: '#141420',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={sticker.url} 
                        alt={sticker.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? "Type a message..." : "Login to chat"}
            disabled={!user || loading}
            style={{
              flex: 1,
              padding: '10px 12px',
              background: '#141420',
              border: '1px solid #1e1e2d',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              opacity: !user ? 0.5 : 1
            }}
          />
          <button 
            type="submit"
            disabled={!user || loading || !newMessage.trim()}
            style={{
              background: 'none',
              border: 'none',
              cursor: (user && !loading) ? 'pointer' : 'not-allowed',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              opacity: (user && !loading && newMessage.trim()) ? 1 : 0.3
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <style jsx>{`
        .chat-rules-notice {
          background: #0d0d14;
          border-bottom: 1px solid #1a1a2e;
          padding: 12px 14px;
          margin: 0;
          position: relative;
        }
        .rules-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .rules-title {
          font-size: 11px;
          font-weight: 700;
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .rule {
          font-size: 11px;
          color: #888;
          line-height: 1.4;
          display: flex;
          gap: 6px;
        }
        .rule-bullet {
          color: #333;
          flex-shrink: 0;
        }
        .rule.critical {
          color: #bbb;
        }
        .rule.critical strong {
          color: #ef4444;
          font-weight: 600;
        }
        .dismiss-btn-icon {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          background: #1a1a2e;
          border: none;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 10px;
          font-weight: bold;
        }
        .dismiss-btn-icon:hover:not(.disabled) {
          background: #ef4444;
          color: #fff;
        }
        .dismiss-btn-icon.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #141420;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot.connecting {
          background: #fbbf24;
          animation: pulse-yellow 1.5s ease-in-out infinite;
        }
        .status-dot.connected {
          background: #22c55e;
        }
        .status-dot.disconnected {
          background: #ef4444;
        }
        .status-text {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .status-text.connecting { color: #fbbf24; }
        .status-text.connected { color: #22c55e; }
        .status-text.disconnected { color: #ef4444; }

        @keyframes pulse-yellow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        @media (max-width: 1200px) {
          .chat-section {
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }
        }
        @media (max-width: 1024px) {
          .chat-section {
            width: 100% !important;
            min-width: auto !important;
            max-width: none !important;
            height: auto !important;
            flex: 1 !important;
            border-left: none !important;
          }
        }
      `}</style>
    </div>
  )
}

function MessageContent({ content }: { content: string }) {
  const urlRegex = /https?:\/\/[^\s]+/g
  const mentionRegex = /@(\w+)/g

  const parts: { type: 'text' | 'image' | 'link' | 'mention'; content: string }[] = []
  let lastIndex = 0
  let match

  const contentWithMentions = content.replace(mentionRegex, (match, username) => {
    return `\u0000MENTION:${username}\u0000`
  })

  while ((match = urlRegex.exec(contentWithMentions)) !== null) {
    const url = match[0]
    const index = match.index
    
    if (index > lastIndex) {
      const textPart = contentWithMentions.slice(lastIndex, index)
      const textSegments = textPart.split(/\u0000MENTION:|\u0000/)
      textSegments.forEach((seg, i) => {
        if (i % 2 === 0 && seg) {
          parts.push({ type: 'text', content: seg })
        } else if (seg) {
          parts.push({ type: 'mention', content: seg })
        }
      })
    }
    
    const isImage = /\.(gif|jpg|jpeg|png|webp|svg)(\?.*)?$/i.test(url) || 
                    /giphy\.com\/media/i.test(url) ||
                    /media\d+\.giphy\.com/i.test(url) ||
                    /iconify\.design/i.test(url) ||
                    /cdnstep\.com/i.test(url)
    
    parts.push({ type: isImage ? 'image' : 'link', content: url })
    
    lastIndex = index + url.length
  }
  
  if (lastIndex < contentWithMentions.length) {
    const textPart = contentWithMentions.slice(lastIndex)
    const textSegments = textPart.split(/\u0000MENTION:|\u0000/)
    textSegments.forEach((seg, i) => {
      if (i % 2 === 0 && seg) {
        parts.push({ type: 'text', content: seg })
      } else if (seg) {
        parts.push({ type: 'mention', content: seg })
      }
    })
  }
  
  if (parts.length === 0) {
    parts.push({ type: 'text', content })
  }
  
  return (
    <div style={{ display: 'inline', marginTop: '2px' }}>
      {parts.map((part, idx) => {
        if (part.type === 'image') {
          const isSticker = part.content.includes('iconify.design') || part.content.includes('cdnstep.com')
          return (
            <img 
              key={idx}
              src={part.content}
              alt=""
              loading="lazy"
              style={{ 
                maxWidth: isSticker ? '48px' : '200px', 
                maxHeight: isSticker ? '48px' : '150px', 
                borderRadius: isSticker ? '0' : '6px', 
                objectFit: isSticker ? 'contain' : 'cover',
                display: 'block'
              }}
              onError={(e) => { 
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )
        }
        if (part.type === 'link') {
          return (
            <a 
              key={idx}
              href={part.content}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '12px', color: '#4a9eff', wordBreak: 'break-all' }}
            >
              {part.content}
            </a>
          )
        }
        if (part.type === 'mention') {
          return (
            <span 
              key={idx} 
              style={{ 
                fontSize: '13px', 
                color: '#3b82f6', 
                fontWeight: 500,
                background: 'rgba(59, 130, 246, 0.12)',
                padding: '1px 5px',
                borderRadius: '4px',
                display: 'inline',
                lineHeight: '1.4'
              }}
            >
              @{part.content}
            </span>
          )
        }
        return (
          <span key={idx} style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
            {part.content}
          </span>
        )
      })}
    </div>
  )
}
