'use client'

import { useState, useRef, useContext, useEffect } from 'react'
import { MatchesContext } from '../lib/matches'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const matchesContext = useContext(MatchesContext)
  const setSearchQueryGlobal = matchesContext?.setSearchQuery ?? (() => {})
  const searchQuery = matchesContext?.searchQuery ?? ''

  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (burgerBtnRef.current && burgerBtnRef.current.contains(target)) {
        return
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryGlobal(e.target.value)
  }

  const clearSearch = () => {
    setSearchQueryGlobal('')
    searchInputRef.current?.focus()
  }

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navContent}>

          <a href="/" className={styles.logo}>
            <span className={styles.logoWhite}>Reed</span>
            <span className={styles.logoGreen}>streams</span>
          </a>

          {/* Search Bar */}
          <div className={`${styles.searchBar} ${searchFocused ? styles.searchBarFocused : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={styles.searchBarInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className={styles.searchBarClose}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Desktop Actions */}
          <div className={styles.desktopActions}>
            <a href="/multiview" className={styles.navLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
              <span>Multiview</span>
            </a>

            <a
              href="https://discord.gg/reedstreams"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.942 5.556a16.299 16.299 0 0 0-4.126-1.3 12.045 12.045 0 0 0-.524 1.074 15.19 15.19 0 0 0-4.584 0 12.118 12.118 0 0 0-.526-1.074 16.247 16.247 0 0 0-4.123 1.3C1.87 9.628 1.146 13.603 1.5 17.522a16.541 16.541 0 0 0 5.005 2.526c.406-.553.77-1.14 1.086-1.754a10.893 10.893 0 0 1-1.56-.743c.125-.093.248-.19.368-.29a12.975 12.975 0 0 0 10.052 0c.12.1.244.197.368.29a10.93 10.93 0 0 1-1.563.745c.317.613.682 1.2 1.088 1.752a16.479 16.479 0 0 0 5.012-2.527c.41-4.527-.99-8.473-3.256-11.965zM8.52 14.908c-1.026 0-1.86-.92-1.86-2.048 0-1.128.817-2.048 1.86-2.048 1.047 0 1.878.92 1.86 2.048 0 1.128-.82 2.048-1.86 2.048zm6.96 0c-1.026 0-1.86-.92-1.86-2.048 0-1.128.817-2.048 1.86-2.048 1.047 0 1.878.92 1.86 2.048 0 1.128-.817 2.048-1.86 2.048z"/>
              </svg>
              <span>Discord</span>
            </a>

            <a
              href="https://bingebox.co"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              <span>Movies</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className={styles.mobileMenu}>
            <button
              ref={burgerBtnRef}
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(!menuOpen)
              }}
              className={`${styles.burgerBtn} ${menuOpen ? styles.burgerBtnOpen : ''}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div ref={menuRef} className={styles.mobileDropdown}>
          <div className={styles.mobileDropdownContent}>
            <a
              href="/multiview"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileDropdownItem}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Multiview</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemArrow}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>

            <a
              href="https://discord.gg/reedstreams"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileDropdownItem}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.942 5.556a16.299 16.299 0 0 0-4.126-1.3 12.045 12.045 0 0 0-.524 1.074 15.19 15.19 0 0 0-4.584 0 12.118 12.118 0 0 0-.526-1.074 16.247 16.247 0 0 0-4.123 1.3C1.87 9.628 1.146 13.603 1.5 17.522a16.541 16.541 0 0 0 5.005 2.526c.406-.553.77-1.14 1.086-1.754a10.893 10.893 0 0 1-1.56-.743c.125-.093.248-.19.368-.29a12.975 12.975 0 0 0 10.052 0c.12.1.244.197.368.29a10.93 10.93 0 0 1-1.563.745c.317.613.682 1.2 1.088 1.752a16.479 16.479 0 0 0 5.012-2.527c.41-4.527-.99-8.473-3.256-11.965zM8.52 14.908c-1.026 0-1.86-.92-1.86-2.048 0-1.128.817-2.048 1.86-2.048 1.047 0 1.878.92 1.86 2.048 0 1.128-.82 2.048-1.86 2.048zm6.96 0c-1.026 0-1.86-.92-1.86-2.048 0-1.128.817-2.048 1.86-2.048 1.047 0 1.878.92 1.86 2.048 0 1.128-.817 2.048-1.86 2.048z"/>
              </svg>
              <span>Discord</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemArrow}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>

            <a
              href="https://bingebox.co"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileDropdownItem}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              <span>Movies</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemArrow}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      )}
    </>
  )
}