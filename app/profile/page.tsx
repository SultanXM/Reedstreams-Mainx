'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../lib/auth'
import { getProfile, updateProfile, uploadProfilePic, deleteProfilePic, changeUsername, Profile } from '../../lib/api'
import styles from './ProfilePage.module.css'

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#ffffff',
]

const GLOW_OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Small', value: 4 },
  { label: 'Medium', value: 8 },
  { label: 'Large', value: 12 },
  { label: 'Extra', value: 20 }
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, login, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [newUsername, setNewUsername] = useState('')
  const [nameColor, setNameColor] = useState('#3b82f6')
  const [customColor, setCustomColor] = useState('#3b82f6')
  const [glowAmount, setGlowAmount] = useState(8)
  const [glowOpen, setGlowOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadProfile()
  }, [user, authLoading])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (glowRef.current && !glowRef.current.contains(e.target as Node)) {
        setGlowOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getProfile()
      setProfile(data)
      const color = data.name_color || '#3b82f6'
      setNameColor(color)
      setCustomColor(color)
      setNewUsername(user?.username || '')
      setGlowAmount(data.name_glow || 8)
    } catch (err: any) {
      if (err.message?.includes('401')) {
        logout()
        router.push('/')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      if (newUsername && newUsername !== user?.username) {
        await changeUsername(newUsername.trim())
        if (user) login({ ...user, username: newUsername.trim() })
      }
      await updateProfile({ 
        name_color: nameColor,
        name_glow: glowAmount
      })
      setMessage('Saved successfully')
      setTimeout(() => setMessage(''), 3000)
      loadProfile()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Image too large (max 2MB)')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        await uploadProfilePic(reader.result as string)
        setMessage('Picture updated')
        loadProfile()
      } catch (err: any) {
        setError(err.message)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDeletePic = async () => {
    try {
      await deleteProfilePic()
      setMessage('Picture removed')
      loadProfile()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)
    setNameColor(color)
  }

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className={styles.main} />
      </>
    )
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              Profile Settings
            </h1>
            <p className={styles.subtitle}>
              Manage your account and chat appearance
            </p>
          </div>

          {/* Alerts */}
          {message && (
            <div className={styles.successAlert}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {message}
            </div>
          )}
          
          {error && (
            <div className={styles.errorAlert}>
              {error}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className={styles.sectionTitle}>
                Profile Picture
              </span>
            </div>
            
            <div className={styles.sectionBody}>
              <div className={styles.profilePicWrapper}>
                <div className={styles.profilePic}>
                  {profile?.profile_pic_url ? (
                    <img 
                      src={profile.profile_pic_url} 
                      alt="" 
                      className={styles.profilePicImg} 
                    />
                  ) : (
                    <div className={styles.profilePicPlaceholder}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className={styles.buttonGroup}>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.btnSecondary}
                  >
                    Change
                  </button>
                  {profile?.profile_pic_url && (
                    <button 
                      onClick={handleDeletePic}
                      className={styles.btnRemove}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </div>
            </div>
          </div>

          {/* Username Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span className={styles.sectionTitle}>
                Username
              </span>
            </div>
            
            <div className={styles.sectionBody}>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className={styles.usernameInput}
              />
            </div>
          </div>

          {/* Chat Appearance Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m18.9 9.9h-6m-6 0H2.1m16.12 4.24l4.24 4.24M6.34 17.66l-4.24 4.24"></path>
              </svg>
              <span className={styles.sectionTitle}>
                Chat Appearance
              </span>
            </div>
            
            <div className={styles.sectionBody}>
              
              {/* Color Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label className={styles.label}>
                  Name Color
                </label>
                <div className={styles.colorGrid}>
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNameColor(color)}
                      className={`${styles.colorButton} ${nameColor === color ? styles.colorButtonActive : ''}`}
                      style={{ background: color }}
                    />
                  ))}
                  
                  <div className={styles.customColorWrapper}>
                    <div className={styles.colorPickerContainer}>
                      <input
                        type="color"
                        value={customColor}
                        onChange={handleColorChange}
                        className={styles.colorPicker}
                      />
                      <div className={`${styles.colorPickerOverlay} ${!PRESET_COLORS.includes(nameColor) ? styles.colorPickerOverlayActive : ''}`} />
                    </div>
                    <span className={styles.customLabel}>Custom</span>
                  </div>
                </div>
              </div>

              {/* Glow Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label className={styles.label}>
                  Glow Effect
                </label>
                <div ref={glowRef} className={styles.selectWrapper}>
                  <button
                    onClick={() => setGlowOpen(!glowOpen)}
                    className={styles.selectButton}
                  >
                    <span>{GLOW_OPTIONS.find(o => o.value === glowAmount)?.label}</span>
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#666" 
                      strokeWidth="2"
                      className={`${styles.chevron} ${glowOpen ? styles.chevronOpen : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  {glowOpen && (
                    <div className={styles.dropdown}>
                      {GLOW_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setGlowAmount(option.value)
                            setGlowOpen(false)
                          }}
                          className={`${styles.dropdownItem} ${glowAmount === option.value ? styles.dropdownItemActive : ''}`}
                        >
                          {option.label}
                          <span className={styles.dropdownValue}>
                            {option.value}px
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className={styles.previewContainer}>
                <div className={styles.previewLabel}>
                  Preview
                </div>
                <div className={styles.previewBody}>
                  <div className={styles.previewAvatar} style={{ background: profile?.profile_pic_url ? 'transparent' : '#252530' }}>
                    {profile?.profile_pic_url ? (
                      <img 
                        src={profile.profile_pic_url} 
                        alt="" 
                        className={styles.profilePicImg} 
                      />
                    ) : (
                      <div className={styles.previewAvatarPlaceholder}>
                        {(newUsername || user.username).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span 
                    className={styles.previewName}
                    style={{ 
                      color: nameColor,
                      textShadow: glowAmount > 0 ? `0 0 ${glowAmount}px ${nameColor}` : 'none'
                    }}
                  >
                    {newUsername || user.username}
                  </span>
                  <span className={styles.previewText}>
                    Hey everyone!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className={styles.footerButtons}>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={styles.btnSave}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button 
              onClick={logout}
              className={styles.btnLogout}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>

        </div>
      </main>
    </>
  )
}
