'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getMessages, sendMessage, ChatMessage, getFullImageUrl } from '../lib/api'
import { useAuth } from '../lib/auth'
import AuthModal from './AuthModal'
import styles from './Chat.module.css'

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
    if (!showScrollButton && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, showScrollButton])

  const handleScroll = () => {
    if (!chatContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
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
    <div className={`${styles.chatSection} ${className}`} style={{
      width: width,
      minWidth: width,
      maxWidth: width,
      ...style
    }}>
      <div className={styles.chatHeader}>
        <span>chat</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`${styles.statusDot} ${styles[`statusDot${chatStatus === 'connecting..' ? 'Connecting' : chatStatus === 'connected' ? 'Connected' : 'Disconnected'}`]}`} />
          <span className={`${styles.statusText} ${styles[`statusText${chatStatus === 'connecting..' ? 'Connecting' : chatStatus === 'connected' ? 'Connected' : 'Disconnected'}`]}`}>
            {chatStatus === 'connecting..' ? 'connecting' : chatStatus === 'connected' ? 'connected' : 'disconnected'}
          </span>
        </div>
      </div>

      {showChatWarning && (
        <div className={styles.chatRulesNotice}>
          <div className={styles.rulesContent}>
            <div className={styles.rulesHeader}>
              <span className={styles.rulesTitle}>Chat Rules</span>
            </div>
            <div className={styles.rulesList}>
              <div className={`${styles.rule} ${styles.ruleCritical}`}>
                <span className={styles.ruleBullet}>•</span>
                <span>Promoting other sites = <strong>Instant Ban</strong></span>
              </div>
              <div className={styles.rule}>
                <span className={styles.ruleBullet}>•</span>
                <span>No hate speech or harassment</span>
              </div>
              <div className={styles.rule}>
                <span className={styles.ruleBullet}>•</span>
                <span>Admins can ban for inappropriate behavior</span>
              </div>
            </div>
            <button
              onClick={() => setShowChatWarning(false)}
              className={styles.agreeBtn}
              disabled={dismissTimer > 0}
            >
              {dismissTimer > 0 ? `Wait ${dismissTimer}s` : 'I Agree'}
            </button>
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className={styles.messagesContainer}
      >
        {messages.length === 0 && !showChatWarning ? (
          <p className={styles.emptyMessage}>
            No messages yet. Be the first to chat!
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={styles.messageWrapper}>
              <div className={styles.messageAvatarWrapper}>
                {msg.profile_pic_url ? (
                  <img
                    src={getFullImageUrl(msg.profile_pic_url)}
                    alt={msg.username}
                    className={styles.messageAvatar}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const placeholder = (e.target as HTMLImageElement).parentElement?.querySelector(`.${styles.messageAvatarPlaceholder}`);
                      if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className={styles.messageAvatarPlaceholder}>
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className={styles.messageBody}>
                <div className={styles.messageMeta}>
                  <button
                    onClick={() => handleTagUser(msg.username)}
                    className={styles.messageUsername}
                    style={{
                      color: msg.name_color || '#888',
                      textShadow: (msg.name_glow || 0) > 0 && msg.name_color
                        ? `0 0 ${msg.name_glow}px ${msg.name_color}`
                        : 'none'
                    }}
                  >
                    {msg.username}
                  </button>
                  {msg.badge && (
                    <span className={`${styles.badge} ${styles[`badge${msg.badge === 'admin' ? 'Admin' : msg.badge === 'dev' ? 'Dev' : 'Vip'}`]}`}>
                      {msg.badge === 'admin' ? 'ADMIN' : msg.badge === 'dev' ? 'DEV' : 'VIP'}
                    </span>
                  )}
                  <span className={styles.messageTimestamp}>
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
          className={styles.scrollButtonAbsolute}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}

      <div className={styles.inputSection}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {taggingUser && (
          <div className={styles.tagUserDisplay}>
            <span className={styles.tagUserText}>
              Tagging <strong>@{taggingUser}</strong>
            </span>
            <button
              onClick={handleCancelTag}
              className={styles.cancelTagBtn}
            >
              ✕
            </button>
          </div>
        )}

        {!user && (
          <div className={styles.loginPrompt}>
            <span className={styles.loginPromptText}>
              Please{' '}
              <button
                onClick={() => setAuthModalOpen(true)}
                className={styles.loginPromptBtn}
              >
                login
              </button>
              {' '}to chat
            </span>
          </div>
        )}

        <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
          {/* Sticker Picker */}
          <div ref={memePickerRef} className={styles.stickerPickerContainer}>
            <button
              type="button"
              onClick={() => user && setShowMemePicker(!showMemePicker)}
              disabled={!user}
              className={`${styles.stickerPickerBtn} ${showMemePicker ? styles.stickerPickerBtnActive : ''}`}
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
              <div className={styles.stickerPickerDropdown}>
                <div className={styles.stickerPickerHeader}>
                  <span className={styles.stickerPickerTitle}>
                    Pepe Stickers
                  </span>
                  <span className={styles.stickerPickerCount}>
                    {PEPE_STICKERS.length}
                  </span>
                </div>

                <div className={styles.stickerGrid}>
                  {PEPE_STICKERS.map((sticker, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSendMeme(sticker.url)
                        setShowMemePicker(false)
                      }}
                      className={styles.stickerBtn}
                    >
                      <img
                        src={sticker.url}
                        alt={sticker.name}
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
            className={styles.chatInput}
          />
          <button
            type="submit"
            disabled={!user || loading || !newMessage.trim()}
            className={`${styles.sendButton} ${(!user || loading || !newMessage.trim()) ? '' : styles.sendButtonEnabled}`}
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
        @media (max-width: 1200px) {
          .chatSection {
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }
        }
        @media (max-width: 1024px) {
          .chatSection {
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
    <div className={styles.messageContentWrapper}>
      {parts.map((part, idx) => {
        if (part.type === 'image') {
          const isSticker = part.content.includes('iconify.design') || part.content.includes('cdnstep.com')
          return (
            <img
              key={idx}
              src={part.content}
              alt=""
              loading="lazy"
              className={isSticker ? styles.sticker : styles.image}
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
              className={styles.link}
            >
              {part.content}
            </a>
          )
        }
        if (part.type === 'mention') {
          return (
            <span
              key={idx}
              className={styles.mention}
            >
              @{part.content}
            </span>
          )
        }
        return (
          <span key={idx} className={styles.text}>
            {part.content}
          </span>
        )
      })}
    </div>
  )
}
