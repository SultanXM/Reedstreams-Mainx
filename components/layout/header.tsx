'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header 
        className={`top-bar ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="logo">
          <Link href="/">
            <span className="logo-text">Reed</span>
            <span className="logo-accent">Streams</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link href="/live-matches">
              Live
            </Link>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }}>
              Upcoming
            </a>
          </li>
          <li>
            <Link href="/faq">
              FAQ
            </Link>
          </li>
        </ul>
        <div className="nav-actions">
          <Link href="/sports">
            <button className="watch-now-btn rolex">
              <i className="fas fa-play-circle"></i> Browse Sports ?
            </button>
          </Link>
        </div>
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </header>

      {isClient && (
        <div className={`mobile-nav-container ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav">
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <span className="logo-text">Reed</span>
                <span className="logo-accent">Streams</span>
              </div>
              <button 
                className="close-sidebar"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="sidebar-content">
              <ul className="mobile-nav-links">
                <li>
                  <Link href="/sports" onClick={() => setIsMobileMenuOpen(false)}>
                    <i className="fas fa-broadcast-tower"></i> Live
                  </Link>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }}>
                    <i className="fas fa-calendar-alt"></i> Upcoming
                  </a>
                </li>
                <li>
                  <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>
                    <i className="fas fa-question-circle"></i> FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="sidebar-footer">
              <Link href="/sports">
                <button className="mobile-watch-btn">
                  <i className="fas fa-play-circle"></i> Browse Sports
                </button>
              </Link>
              <div className="sidebar-social">
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Follow us on social media!'); }} className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Follow us on social media!'); }} className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
  
          {/* Overlay */}
          <div 
            className="overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        </div>
      )}
    </>
  )
}

      