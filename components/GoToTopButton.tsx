'use client'

import { useState, useEffect } from 'react'
import styles from './GoToTopButton.module.css'

export function GoToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!show) return null

  return (
    <button onClick={scrollToTop} className={styles.goToTopBtn} aria-label="Go to top">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  )
}
