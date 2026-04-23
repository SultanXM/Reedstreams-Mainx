'use client'

import { useState, useEffect } from 'react'
import styles from './InternetStatusBanner.module.css'

export function InternetStatusBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Hide after 3 seconds of being back online
      setTimeout(() => setShow(false), 3000)
    }
    const handleOffline = () => {
      setIsOnline(false)
      setShow(true)
    }

    // Initial check
    if (!window.navigator.onLine) {
      handleOffline()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!show) return null

  return (
    <div className={`${styles.banner} ${isOnline ? styles.online : styles.offline}`}>
      <div className={styles.content}>
        {isOnline ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Internet connection restored</span>
          </>
        ) : (
          <>
            <div className={styles.pulseDot} />
            <span>Unstable internet connection detected. Matches might lag.</span>
          </>
        )}
      </div>
    </div>
  )
}
