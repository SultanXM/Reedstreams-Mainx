'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Menu, X, AlertCircle, Calendar, Home, Heart, Play, Send } from 'lucide-react'
import '../../styles/header.css'

const API_BASE = 'https://streamed.pk/api'

interface Match {
    id: string; title: string; category: string; date: number; popular: boolean;
    teams?: { home?: { badge: string; name: string }; away?: { badge: string; name: string }; };
    sources?: { source: string; id: string }[];
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
    const [showReport, setShowReport] = useState(false)
    const [reportText, setReportText] = useState('')
    const [query, setQuery] = useState('')
    const [matches, setMatches] = useState<Match[]>([])
    const [searchResults, setSearchResults] = useState<Match[]>([])
    const [liveMatchesCount, setLiveMatchesCount] = useState(0)

    useEffect(() => {
        setShowSearch(false);
        setShowSidebar(false);
        setShowReport(false);
    }, [pathname]);

    const fetchLiveCount = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/matches/live`)
            if (!response.ok) throw new Error('Failed to fetch live count')
            const data = await response.json()
            setLiveMatchesCount(Array.isArray(data) ? data.length : 0)
        } catch (error) { console.error('Live count error:', error) }
    }, [])

    const fetchSports = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/sports`)
            if (!response.ok) throw new Error('Failed to fetch sports')
            const data: Sport[] = await response.json()
            if (!Array.isArray(data)) return
            const sorted = data.sort((a, b) => {
                const idxA = SORT_ORDER.indexOf(a.id); const idxB = SORT_ORDER.indexOf(b.id)
                if (idxA !== -1 && idxB !== -1) return idxA - idxB
                return idxA !== -1 ? -1 : idxB !== -1 ? 1 : a.name.localeCompare(b.name)
            })
            setSports(sorted.slice(0, 12))
        } catch (error) { console.error('Sports fetch error:', error) }
    }, [])

    const fetchSearchMatches = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/matches/all-today`)
            if (!response.ok) throw new Error('Failed to fetch matches')
            const data: Match[] = await response.json()
            setMatches(Array.isArray(data) ? data : [])
        } catch (error) { console.error('Search matches error:', error) }
    }, [])

    useEffect(() => {
        setMounted(true)
        const init = async () => { 
            await Promise.all([fetchSports(), fetchLiveCount(), fetchSearchMatches()]) 
        }
        init()
        const interval = setInterval(fetchLiveCount, 30000)
        return () => clearInterval(interval)
    }, [fetchLiveCount, fetchSports, fetchSearchMatches])

    const handleSearch = (value: string) => {
        setQuery(value)
        if (!value.trim()) { setSearchResults([]); return; }
        const lowerVal = value.toLowerCase()
        const filtered = matches.filter(m => 
            m.title.toLowerCase().includes(lowerVal) || 
            m.category.toLowerCase().includes(lowerVal)
        )
        setSearchResults(filtered.slice(0, 10))
    }

    const handleResultClick = (match: Match) => {
        sessionStorage.setItem("currentMatch", JSON.stringify(match));
        router.push(`/match/${match.id}`);
        setShowSearch(false);
        setQuery('');
        setSearchResults([]);
    }

    const handleSendReport = () => {
        if (!reportText.trim()) {
            alert("Please enter a message before sending.");
            return;
        }
        const subject = encodeURIComponent("ReedStreams - Issue Report");
        const body = encodeURIComponent(reportText);
        window.location.href = `mailto:reedstreams000@gmail.com?subject=${subject}&body=${body}`;
        setReportText('');
        setShowReport(false);
    }

    const getDisplayName = (id: string) => DISPLAY_MAP[id] || sports.find(s => s.id === id)?.name || id
    const getSportUrl = (sport: Sport) => {
        const validId = URL_ID_MAP[sport.id] || sport.id
        return `/live-matches?sportId=${validId}&sportName=${encodeURIComponent(sport.name)}`
    }

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
                            <button className={`icon-btn mobile-menu-btn ${mounted ? 'visible' : 'hidden'}`} onClick={() => setShowSidebar(true)}>
                                <Menu size={24} />
                            </button>
                            <div className="live-status desktop-only">
                                <div className="pulsing-dot"></div>
                                <span>{mounted ? (liveMatchesCount > 0 ? `${liveMatchesCount} LIVE` : 'OFFLINE') : '...'}</span>
                            </div>
                            <a href="/" onClick={(e) => hardNavigate(e, '/')} className="main-logo desktop-only">
                                <span className="accent-text">REED</span>STREAMS
                            </a>
                        </div>
                        <div className="nav-center mobile-only">
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
                            <button className="primary-btn desktop-only" onClick={() => setShowReport(true)}>
                                <AlertCircle size={16} className="btn-icon" /> <span>REPORT</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            {mounted && showSidebar && (
                <>
                    <div className="sidebar-overlay visible" onClick={() => setShowSidebar(false)} />
                    <div className="sidebar-drawer open">
                        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #222' }}>
                            <span onClick={(e) => hardNavigate(e, '/')} className="sidebar-logo" style={{cursor:'pointer', fontSize: '22px', fontWeight: '900', letterSpacing: '-1px', display: 'flex', alignItems: 'center', color: '#fff'}}>
                                <span className="accent-text" style={{ color: '#8db902' }}>REED</span>
                                <span>STREAMS</span>
                            </span>
                            <button onClick={() => setShowSidebar(false)} className="close-btn" style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
                        </div>
                        <div className="sidebar-content">
                            <div className="live-banner"><div className="pulsing-dot" /> {liveMatchesCount} Matches Live</div>
                            <nav className="sidebar-nav">
                                <a href="/" className="sidebar-item" onClick={(e) => hardNavigate(e, '/')}><Home size={18} /> Home</a>
                                <Link href="/schedule" className="sidebar-item" onClick={() => setShowSidebar(false)}><Calendar size={18} /> Schedule</Link>
                                {/* Mobile Report Button */}
                                <button className="sidebar-item" onClick={() => { setShowSidebar(false); setShowReport(true); }} style={{width:'100%', background:'none', border:'none', color:'inherit', cursor:'pointer'}}>
                                    <AlertCircle size={18} /> Report Issue
                                </button>
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

            {/* SEARCH MODAL */}
            {mounted && showSearch && (
                <div className="modal-backdrop" onClick={() => setShowSearch(false)}>
                    <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="search-header">
                            <Search className="search-icon" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search matches..." 
                                autoFocus
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <button className="close-btn" onClick={() => setShowSearch(false)}><X size={20} /></button>
                        </div>
                        <div className="search-results">
                            {searchResults.length > 0 ? (
                                searchResults.map((match) => (
                                    <div key={match.id} className="search-result-row" onClick={() => handleResultClick(match)}>
                                        <div className="result-info">
                                            <span className="result-teams">{match.title}</span>
                                            <span className="result-meta">{getDisplayName(match.category)} • {new Date(match.date * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <Play size={16} className="play-icon" />
                                    </div>
                                ))
                            ) : query.length > 0 ? (
                                <div className="no-results">No matches found.</div>
                            ) : (
                                <div className="no-results">Type to search...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* REPORT MODAL */}
            {mounted && showReport && (
                <div className="modal-backdrop" onClick={() => setShowReport(false)}>
                    <div className="search-modal report-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px', background: '#09090b', border: '1px solid #333', borderRadius: '12px'}}>
                        <div className="search-header" style={{borderBottom: '1px solid #222', padding: '15px 20px'}}>
                            <AlertCircle className="search-icon" size={20} style={{color: '#8db902'}} />
                            <span style={{flex: 1, fontWeight: '800', marginLeft: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px'}}>Report an Issue</span>
                            <button className="close-btn" onClick={() => setShowReport(false)}><X size={20} /></button>
                        </div>
                        <div style={{padding: '20px'}}>
                            <p style={{color: '#a1a1aa', fontSize: '13px', marginBottom: '15px', lineHeight: '1.5'}}>Describe the problem (stream down, wrong score, etc.) and we'll fix it ASAP.</p>
                            <textarea 
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Write your message here..."
                                style={{
                                    width: '100%', 
                                    height: '120px', 
                                    background: '#18181b', 
                                    border: '1px solid #333', 
                                    borderRadius: '8px', 
                                    color: 'white', 
                                    padding: '12px', 
                                    outline: 'none', 
                                    resize: 'none',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            />
                            <button 
                                className="primary-btn" 
                                onClick={handleSendReport}
                                style={{
                                    width: '100%', 
                                    marginTop: '15px', 
                                    justifyContent: 'center', 
                                    height: '45px',
                                    background: '#8db902',
                                    color: '#000',
                                    fontWeight: '800',
                                    border: 'none',
                                    borderRadius: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s'
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Send size={16} className="btn-icon" /> <span>SEND REPORT</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}