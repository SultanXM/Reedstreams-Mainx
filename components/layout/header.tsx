'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Menu, X, AlertCircle, Calendar, Home, MonitorPlay } from 'lucide-react'
import '../../styles/header.css'

const API_BASE = 'https://streamed.pk/api'

interface Match {
    id: string; title: string; category: string; date: number; popular: boolean;
    teams?: { home?: { badge: string; name: string }; away?: { badge: string; name: string }; };
}

interface Sport { id: string; name: string; }

const DISPLAY_MAP: Record<string, string> = {
    'basketball': 'NBA', 'soccer': 'Football', 'football': 'Football',
    'american-football': 'NFL', 'nfl': 'NFL', 'icehockey': 'NHL',
    'hockey': 'NHL', 'baseball': 'MLB', 'mma': 'UFC', 'ufc': 'UFC',
    'boxing': 'Boxing', 'cricket': 'Cricket', 'motorsports': 'F1',
    'racing': 'F1', 'tennis': 'Tennis', 'rugby': 'Rugby', 'golf': 'Golf', 'darts': 'Darts'
}

const URL_ID_MAP: Record<string, string> = {
    'nfl': 'american-football', 'soccer': 'football', 'icehockey': 'hockey',
    'racing': 'motorsport', 'motorsports': 'motorsport', 'ufc': 'mma'
}

const SORT_ORDER = [
    'soccer', 'football', 'basketball', 'american-football', 'nfl',
    'baseball', 'icehockey', 'hockey', 'mma', 'ufc', 'cricket',
    'motorsports', 'tennis', 'rugby', 'golf', 'darts', 'boxing'
]

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [sports, setSports] = useState<Sport[]>([])
    const [showSearch, setShowSearch] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [query, setQuery] = useState('')
    const [matches, setMatches] = useState<Match[]>([])
    const [searchResults, setSearchResults] = useState<Match[]>([])
    const [liveMatchesCount, setLiveMatchesCount] = useState(0)

    // --- 1. SEARCH & SIDEBAR AUTO-CLEANUP ---
    // This forces the modals to close whenever you change pages.
    useEffect(() => {
        setShowSearch(false);
        setShowSidebar(false);
    }, [pathname]);

    const fetchLiveCount = async () => {
        try {
            const response = await fetch(`${API_BASE}/matches/live`)
            const data = await response.json()
            setLiveMatchesCount(data.length)
        } catch (error) { console.error(error) }
    }

    const fetchSports = async () => {
        try {
            const response = await fetch(`${API_BASE}/sports`)
            const data: Sport[] = await response.json()
            const sorted = data.sort((a, b) => {
                const idxA = SORT_ORDER.indexOf(a.id); const idxB = SORT_ORDER.indexOf(b.id)
                if (idxA !== -1 && idxB !== -1) return idxA - idxB
                return idxA !== -1 ? -1 : idxB !== -1 ? 1 : a.name.localeCompare(b.name)
            })
            setSports(sorted.slice(0, 12))
        } catch (error) { console.error(error) }
    }

    const fetchSearchMatches = useCallback(async () => {
        if (matches.length > 0) return;
        try {
            const response = await fetch(`${API_BASE}/matches/all-today`)
            const data: Match[] = await response.json()
            setMatches(data)
        } catch (error) { console.error(error) }
    }, [matches.length])

    useEffect(() => {
        setMounted(true)
        const init = async () => { await Promise.all([fetchSports(), fetchLiveCount()]) }
        init()
        const interval = setInterval(fetchLiveCount, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => { if (showSearch) fetchSearchMatches() }, [showSearch, fetchSearchMatches])

    const handleSearch = (value: string) => {
        setQuery(value)
        if (!value.trim()) { setSearchResults([]); return; }
        const lowerVal = value.toLowerCase()
        const filtered = matches.filter(m => m.title.toLowerCase().includes(lowerVal) || m.category.toLowerCase().includes(lowerVal))
        setSearchResults(filtered.slice(0, 10))
    }

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (query.trim()) { 
            router.push(`/search?q=${encodeURIComponent(query)}`); 
            setShowSearch(false); 
            setQuery(''); 
        }
    }

    const getDisplayName = (id: string) => DISPLAY_MAP[id] || sports.find(s => s.id === id)?.name || id
    const getSportUrl = (sport: Sport) => {
        const validId = URL_ID_MAP[sport.id] || sport.id
        return `/live-matches?sportId=${validId}&sportName=${encodeURIComponent(sport.name)}`
    }

    // --- 2. THE GRAND NAVIGATOR (CRASH FIX) ---
    // Instead of router.push, this forces a browser reload.
    // This wipes the "Match Page" memory instantly so no errors can happen.
    const hardNavigate = (e: React.MouseEvent, path: string) => {
        e.preventDefault();
        setShowSidebar(false);
        window.location.href = path;
    }

    return (
        <>
            <header className="site-header">
                <div className="top-bar desktop-only">
                    <div className="top-bar-content">
                        {/* Logo uses hard navigation to prevent crashes */}
                        <a href="/" onClick={(e) => hardNavigate(e, '/')} className="logo-mini">
                            <span className="accent-text">REED</span>STREAMS
                        </a>
                        <nav className="sports-mini-nav">
                            {mounted && sports.map(sport => (
                                <Link key={sport.id} href={getSportUrl(sport)} className="mini-sport-link">
                                    {getDisplayName(sport.id)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="main-bar">
                    <div className="main-bar-content">
                        <div className="nav-left">
                            
                            {/* 🔥 HYDRATION SAFE MOBILE MENU */}
                            <button 
                                className={`icon-btn mobile-menu-btn ${mounted ? 'visible' : 'hidden'}`} 
                                onClick={() => setShowSidebar(true)}
                            >
                                <Menu size={24} />
                            </button>

                            <div className="live-status desktop-only">
                                <div className="pulsing-dot"></div>
                                {/* 🔥 HYDRATION SAFE LIVE COUNT */}
                                <span>{mounted ? (liveMatchesCount > 0 ? `${liveMatchesCount} LIVE` : 'OFFLINE') : '...'}</span>
                            </div>
                            
                            {/* Desktop Logo - Hard Nav */}
                            <a href="/" onClick={(e) => hardNavigate(e, '/')} className="main-logo desktop-only">
                                <span className="accent-text">REED</span>STREAMS
                            </a>
                        </div>

                        <div className="nav-center mobile-only">
                             {/* Mobile Logo - Hard Nav */}
                            <a href="/" onClick={(e) => hardNavigate(e, '/')} className="main-logo mobile">
                                <span className="accent-text">REED</span>STREAMS
                            </a>
                        </div>

                        <div className="nav-right">
                            <div className="nav-links desktop-only">
                                <a href="/" onClick={(e) => hardNavigate(e, '/')} className={`nav-item ${pathname === '/' ? 'active' : ''}`}>Home</a>
                                <Link href="/schedule" className={`nav-item ${pathname === '/schedule' ? 'active' : ''}`}>Schedule</Link>
                            </div>
                            <div className="divider desktop-only"></div>
                            <a href="https://discord.gg/PMaUcEKV" target="_blank" rel="noopener noreferrer" className="icon-btn discord-nav-btn">
                                <svg viewBox="0 0 127.14 96.36" fill="currentColor" width="20" height="20"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39.2,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.73,11.1,105.32,105.32,0,0,0,32.05-16.15h0C130.11,50.41,122.09,26.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.87,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91,65.69,84.69,65.69Z"/></svg>
                            </a>
                            <button className="icon-btn search-trigger" onClick={() => setShowSearch(true)}><Search size={20} /></button>
                            <button className="primary-btn desktop-only" onClick={() => {}}><AlertCircle size={16} className="btn-icon" /> <span>REPORT</span></button>
                        </div>
                    </div>
                </div>
            </header>
            
            {mounted && showSidebar && (
                <>
                    <div className="sidebar-overlay visible" onClick={() => setShowSidebar(false)} />
                    <div className="sidebar-drawer open">
                        <div className="sidebar-header">
                            <span onClick={(e) => hardNavigate(e, '/')} className="sidebar-logo" style={{cursor:'pointer'}}>
                                <span className="accent-text">REED</span>STREAMS
                            </span>
                            <button onClick={() => setShowSidebar(false)} className="close-btn"><X size={24} /></button>
                        </div>
                        <div className="sidebar-content">
                            <div className="live-banner"><div className="pulsing-dot" /> {liveMatchesCount} Matches Live</div>
                            <nav className="sidebar-nav">
                                <a href="/" className="sidebar-item" onClick={(e) => hardNavigate(e, '/')}><Home size={18} /> Home</a>
                                <Link href="/schedule" className="sidebar-item" onClick={() => setShowSidebar(false)}><Calendar size={18} /> Schedule</Link>
                            </nav>
                            <div className="sidebar-divider">SPORTS</div>
                            <div className="sidebar-grid">
                                {sports.map(s => (
                                    <Link key={s.id} href={getSportUrl(s)} className="sidebar-chip" onClick={() => setShowSidebar(false)}>
                                        {getDisplayName(s.id)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {mounted && showSearch && (
                <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowSearch(false)}>
                    <div className="search-modal">
                        <div className="search-header">
                            <Search className="search-icon" size={20} />
                            <input 
                                autoFocus 
                                placeholder="Search teams..." 
                                value={query} 
                                onChange={(e) => handleSearch(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()} 
                            />
                            <button onClick={() => setShowSearch(false)}><X size={20} /></button>
                        </div>
                        <div className="search-results">
                            {searchResults.map(match => (
                                <div key={match.id} onClick={() => { router.push(`/match/${match.id}`); setShowSearch(false); }} className="search-result-row">
                                    <div className="result-info">
                                        <span className="result-teams">{match.title}</span>
                                        <span className="result-meta">{match.category}</span>
                                    </div>
                                    <MonitorPlay size={16} className="play-icon" />
                                </div>
                            ))}
                            {query && searchResults.length === 0 && (
                                <div className="no-results">No matches found for "{query}"</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}