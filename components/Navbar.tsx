// my beloved navbaar <3
'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useContext } from 'react'
import { useAuth } from '../lib/auth'
import AuthModal from './AuthModal'
import { MatchesContext, getPosterUrl } from '../lib/matches'
import styles from './Navbar.module.css'

export default function Navbar() {
  // states for menu and search vibes
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [translateY, setTranslateY] = useState(0)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { user, logout } = useAuth()

  // getting matches data for search popup
  const matchesContext = useContext(MatchesContext)
  const searchQuery = matchesContext?.searchQuery ?? ''
  const setSearchQuery = matchesContext?.setSearchQuery ?? (() => {})
  const filteredMatches = matchesContext?.filteredMatches ?? []

  const touchStartY = useRef(0)
  const touchCurrentY = useRef(0)

  // check if we scrolled to add that blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openMenu = () => {
    setMenuVisible(true)
    setTimeout(() => setMenuOpen(true), 10)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setTranslateY(0)
    setTimeout(() => setMenuVisible(false), 300)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  // mobile swipe logic starts here
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchCurrentY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY
    const diff = touchCurrentY.current - touchStartY.current
    if (diff > 0) {
      setTranslateY(diff)
    }
  }

  const handleTouchEnd = () => {
    const diff = touchCurrentY.current - touchStartY.current
    if (diff > 80) {
      closeMenu() // if swiped down enough, just close it
    } else {
      setTranslateY(0) // otherwise snap back
    }
  }

  useEffect(() => {
    if (!menuOpen) {
      setTranslateY(0)
    }
  }, [menuOpen])

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className={styles.navContent}>

          <Link href="/" className={styles.logo}>
            Reedstreams
          </Link>

          {/* search bar for the site */}
          <div className={styles.desktopSearch}>
            <div className={styles.searchWrapper}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={searchFocused ? "#888" : "#666"}
                strokeWidth="2"
                className={styles.searchIcon}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className={`${styles.searchInput} ${searchFocused ? styles.searchInputFocused : ''}`}
              />
            </div>

            {/* popup when no results for search */}
            {searchFocused && searchQuery.trim() !== '' && filteredMatches.length === 0 && (
              <div className={styles.searchPopup}>
                <div className={styles.noResults}>
                  No results for "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          <div className={styles.desktopLinks}>

            <Link href="/multiview" className={`${styles.navLink} nav-link`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Multiview
            </Link>

            <Link href="/discord" className={`${styles.navLink} nav-link`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Discord
            </Link>

            <Link href="https://bingebox.co" target="_blank" className={`${styles.navLink} nav-link`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
              Movies
            </Link>

            {/* login/logout logic for desktop */}
            {user ? (
              <>
                <Link href="/profile" className={`${styles.navLink} nav-link`}>
                  {user.username}
                </Link>
                <button onClick={logout} className={`${styles.navLink} ${styles.logoutBtn} nav-link logout-btn`}>
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true)
                  closeMenu()
                }}
                className={`${styles.navLink} ${styles.guestBtn} nav-link`}
              >
                Guest
              </button>
            )}
          </div>

          {/* burger menu for mobile */}
          <div className={styles.mobileMenu}>
            <button
              onClick={() => {
                if (!user) {
                  setAuthModalOpen(true)
                } else {
                  window.location.href = '/profile'
                }
              }}
              className={styles.mobileGuestBtn}
            >
              {user ? user.username : 'Guest'}
            </button>
            <button onClick={openMenu} className={styles.burgerBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* mobile menu panel and overlay logic */}
      {menuVisible && (
        <div
          className={`${styles.mobileMenuOverlay} ${menuOpen ? styles.mobileMenuOverlayOpen : ''}`}
          onClick={closeMenu}
        >
          <div
            className={`${styles.mobileMenuPanel} ${menuOpen ? styles.mobileMenuPanelOpen : ''}`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: menuOpen ? 'translateY(0)' : `translateY(${translateY || 100}%)`,
            }}
          >
            {/* drag handle for the mobile sheet */}
            <div
              className={styles.mobileMenuHandle}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            <div className={styles.mobileLinksContainer}>
              <Link
                href="/multiview"
                onClick={closeMenu}
                className={styles.mobileNavLink}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Multiview
              </Link>

              <Link
                href="/discord"
                onClick={closeMenu}
                className={styles.mobileNavLink}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Discord
              </Link>

              <Link
                href="https://bingebox.co"
                target="_blank"
                onClick={closeMenu}
                className={styles.mobileNavLink}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="2" y1="7" x2="7" y2="7"></line>
                  <line x1="2" y1="17" x2="7" y2="17"></line>
                  <line x1="17" y1="17" x2="22" y2="17"></line>
                  <line x1="17" y1="7" x2="22" y2="7"></line>
                </svg>
                Movies
              </Link>

              {/* auth links for mobile panel */}
              {user ? (
                <>
                  <div className={styles.divider} />
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={`${styles.mobileNavLink} ${styles.mobileNavLinkActive}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {user.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`${styles.mobileNavLink} ${styles.mobileLogoutBtn}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.divider} />
                  <button
                    onClick={() => {
                      setAuthModalOpen(true)
                      closeMenu()
                    }}
                    className={`${styles.mobileNavLink} ${styles.mobileNavLinkActive}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Login / Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
