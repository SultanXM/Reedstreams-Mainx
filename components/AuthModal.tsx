'use client'

import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { login, register } from '../lib/api'
import styles from './AuthModal.module.css'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({ username: false, email: false, password: false })
  const { login: authLogin } = useAuth()

  if (!isOpen) return null

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const getFieldError = (field: string, value: string) => {
    if (!touched[field as keyof typeof touched]) return ''
    if (!value.trim()) return 'Missing Email '
    if (field === 'email' && !validateEmail(value)) return 'Your Email is Incorrect'
    return ''
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ username: true, email: true, password: true })
    setError('')

    if (!username.trim() || !password.trim() || (!isLogin && (!email.trim() || !validateEmail(email)))) {
      return
    }

    setLoading(true)

    try {
      const data = isLogin
        ? await login(username, password)
        : await register(username, email, password)
      authLogin(data)
      onClose()
    } catch (err: any) {
      setError(err.message || (isLogin ? 'Hmm.. There is a problem logging you in' : 'Registration failed please check credentials or retry'))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
    setTouched({ username: false, email: false, password: false })
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >

        <div className={styles.header}>
          <h1 className={styles.title}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur('username')}
              placeholder="Username"
              className={styles.input}
            />
            {getFieldError('username', username) && (
              <span className={styles.fieldError}>
                {getFieldError('username', username)}
              </span>
            )}
          </div>

          {!isLogin && (
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="Email"
                className={styles.input}
              />
              {getFieldError('email', email) && (
                <span className={styles.fieldError}>
                  {getFieldError('email', email)}
                </span>
              )}
            </div>
          )}

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Password"
              className={styles.input}
            />
            {getFieldError('password', password) && (
              <span className={styles.fieldError}>
                {getFieldError('password', password)}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className={styles.footer}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={switchMode}
            className={styles.switchButton}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  )
}
