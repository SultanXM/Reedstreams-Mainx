'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Search, Globe, MessageCircle, X, Send, AlertOctagon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useLanguage, Language } from '@/context/language-context'
import '../../styles/header.css'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

// Custom Discord Icon
const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.36981C18.796 3.63481 17.153 3.11181 15.442 2.81581C15.442 2.81581 15.373 2.92181 15.303 3.02781C13.849 2.50481 12.325 2.50481 10.87 3.02781C10.8 2.92181 10.731 2.81581 10.731 2.81581C9.02 3.11181 7.377 3.63481 5.856 4.36981C2.503 8.00081 1.631 11.4588 2.474 14.7718C4.582 17.8428 7.822 19.6648 11.532 19.6648C11.532 19.6648 11.602 19.5588 11.671 19.4528C11.39 19.1568 11.109 18.8258 10.897 18.4598C10.054 18.8258 9.142 19.1218 8.16 19.3478C8.16 19.3478 8.09 19.2418 8.021 19.1358C8.443 18.9098 8.865 18.6488 9.218 18.3178C9.218 18.3178 9.288 18.2478 9.357 18.1788C11.465 19.1218 13.714 19.1218 15.822 18.1788C15.892 18.2478 15.961 18.3178 15.961 18.3178C16.314 18.6488 16.736 18.9098 17.158 19.1358C17.089 19.2418 17.019 19.3478 17.019 19.3478C16.037 19.1218 15.125 18.8258 14.282 18.4598C14.07 18.8258 13.789 19.1568 13.508 19.4528C13.578 19.5588 13.647 19.6648 13.647 19.6648C17.357 19.6648 20.597 17.8428 22.705 14.7718C23.548 11.4588 22.677 8.00081 20.317 4.36981ZM9.673 14.0728C8.83 14.0728 8.16 13.3378 8.16 12.4248C8.16 11.5118 8.83 10.7768 9.673 10.7768C10.516 10.7768 11.186 11.5118 11.116 12.4248C11.116 13.3378 10.516 14.0728 9.673 14.0728ZM15.511 14.0728C14.668 14.0728 13.998 13.3378 13.998 12.4248C13.998 11.5118 14.668 10.7768 15.511 10.7768C16.354 10.7768 17.024 11.5118 16.954 12.4248C16.954 13.3378 16.354 14.0728 15.511 14.0728Z" />
  </svg>
)

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const LANGUAGES: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文 (Chinese)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ur', label: 'اردو (Urdu)' },
]

export default function Header() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [allMatches, setAllMatches] = useState<any[]>([])
  const [filteredMatches, setFilteredMatches] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  
  // FEEDBACK STATE
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  
  const { t, lang, setLanguage } = useLanguage()

  useEffect(() => {
    setIsMounted(true)
    async function fetchMatches() {
      try {
        const res = await fetch(`${STREAMED_API_BASE}/matches/all-today`)
        if (res.ok) {
          const data = await res.json()
          setAllMatches(data)
        }
      } catch (e) {
        console.error("Search pre-fetch failed", e)
      }
    }
    fetchMatches()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      const lowerQuery = query.toLowerCase()
      const results = allMatches.filter((match: any) => 
        match.title.toLowerCase().includes(lowerQuery) ||
        (match.teams?.home?.name && match.teams.home.name.toLowerCase().includes(lowerQuery)) ||
        (match.teams?.away?.name && match.teams.away.name.toLowerCase().includes(lowerQuery))
      )
      setFilteredMatches(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const closeSearch = () => {
    setShowResults(false)
    setSearchQuery('')
  }

  const handleSendFeedback = () => {
    if (!feedbackText) return
    const subject = encodeURIComponent("ReedStreams Feedback")
    const body = encodeURIComponent(feedbackText)
    window.location.href = `mailto:reedstreams000@gmail.com?subject=${subject}&body=${body}`
    setShowFeedback(false)
    setFeedbackText('')
  }

  const handleNavClick = (e: React.MouseEvent, action: string) => {
    e.preventDefault()
    if (action === 'feedback') setShowFeedback(true)
    if (action === 'discord') window.open('https://discord.gg/yourcode', '_blank')
  }

  return (
    <header className="site-header">
      
      {/* FEEDBACK MODAL */}
      {showFeedback && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#111', border: '1px solid #222', padding: '25px', borderRadius: '12px',
            width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <button 
              onClick={() => setShowFeedback(false)}
              style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', color:'#666', cursor:'pointer'}}
            >
              <X size={20} />
            </button>
            
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
               <AlertOctagon color="#8db902" size={24} />
               <h3 style={{margin:0, color:'#fff', fontSize:'18px', fontWeight:'800'}}>Feedback / Report</h3>
            </div>
            
            <p style={{color:'#888', fontSize:'12px', marginBottom:'15px'}}>
              Tell us about any bugs or suggestions.
            </p>

            <textarea 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              style={{
                width: '100%', background: '#050505', border: '1px solid #333', 
                color: '#fff', padding: '12px', borderRadius: '6px', fontSize: '13px', 
                outline: 'none', marginBottom: '15px', resize: 'none'
              }}
            />

            <button 
              onClick={handleSendFeedback}
              style={{
                width: '100%', background: '#8db902', color: '#000', border: 'none',
                padding: '12px', borderRadius: '6px', fontWeight: '800', fontSize: '13px',
                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                textTransform: 'uppercase'
              }}
            >
              <Send size={14} /> Send Email
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP LAYOUT */}
      <div className="desktop-layout">
        <div className="header-left">
          <Link href="/" className="site-logo">
            <span className="logo-accent">🎅🏻reed</span>
            <span className="logo-white">streams</span>
          </Link>
          <nav className="desktop-nav">
            <Link href="/" className="nav-link">{t.home}</Link>
            <a href="#" onClick={(e) => handleNavClick(e, 'feedback')} className="nav-link">Feedback</a>
            <a href="#" onClick={(e) => handleNavClick(e, 'discord')} className="nav-link">Discord</a>
          </nav>
          
          <div className="search-wrapper-desktop">
            <div className="static-search-bar desktop-search">
               <Search className="search-icon" width={18} />
               <input 
                 type="text" 
                 placeholder={t.search} 
                 className="static-search-input" 
                 value={searchQuery}
                 onChange={handleSearch}
                 onFocus={() => searchQuery.length > 0 && setShowResults(true)}
               />
               {searchQuery && (
                 <X className="search-clear-icon" width={14} onClick={closeSearch} />
               )}
            </div>

            {showResults && (
              <div className="search-dropdown">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    // 🔥 UPDATED LINK LOGIC:
                    // 1. Point to /match/ID
                    // 2. Save match to session storage so page loads correct data
                    <Link 
                      key={match.id} 
                      href={`/match/${match.id}`} 
                      className="search-result-item"
                      onClick={() => {
                        sessionStorage.setItem("currentMatch", JSON.stringify(match))
                        closeSearch()
                      }}
                    >
                      <span className="result-time">{formatTime(match.date)}</span>
                      <span className="result-title">{match.title}</span>
                    </Link>
                  ))
                ) : (
                  <div className="search-no-results">No matches found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="boxed-btn">
            <DiscordIcon />
          </a>
          
          <button className="boxed-btn" onClick={() => setShowFeedback(true)} title="Send Feedback">
            <MessageCircle width={18} />
          </button>
          
          {/* LANGUAGE DROPDOWN */}
          {isMounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="boxed-btn">
                  <Globe width={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="lang-dropdown-content"
                style={{
                  background: '#111', 
                  border: '1px solid #222', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  minWidth: '150px'
                }}
              >
                {LANGUAGES.map((l) => (
                    <DropdownMenuItem 
                        key={l.code} 
                        onClick={() => setLanguage(l.code)}
                        style={{
                          color: lang === l.code ? '#8db902' : '#ccc',
                          fontWeight: lang === l.code ? '800' : '500',
                          cursor: 'pointer',
                          fontSize: '13px',
                          padding: '10px 15px'
                        }}
                    >
                        {l.label}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="boxed-btn">
              <Globe width={18} />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="mobile-layout">
        
        {isMounted ? (
          <Sheet>
            <SheetTrigger asChild>
              <button className="boxed-btn mobile-menu-btn">
                <Menu width={20} />
              </button>
            </SheetTrigger>
            
            <SheetContent side="left" className="sidebar-panel">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Nav</SheetDescription>
              </SheetHeader>
              
              <div className="sidebar-header-row">
                 <Link href="/" className="mobile-sidebar-logo">
                    <span style={{ color: '#8db902' }}>reed</span>
                    <span style={{ color: 'white' }}>streams</span>
                 </Link>
              </div>

              <div className="sidebar-nav-list">
                 <Link href="/" className="mobile-link">{t.home}</Link>
                 <a href="#" onClick={(e) => handleNavClick(e, 'feedback')} className="mobile-link">Feedback</a>
                 <a href="#" onClick={(e) => handleNavClick(e, 'discord')} className="mobile-link">Discord</a>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <button className="boxed-btn mobile-menu-btn">
            <Menu width={20} />
          </button>
        )}

        <button className="boxed-btn" onClick={() => setShowFeedback(true)}>
          <MessageCircle width={20} />
        </button>

        <div className="search-wrapper-mobile">
          <div className="static-search-bar mobile-search">
             <Search className="search-icon" width={16} />
             <input 
                type="text" 
                placeholder={t.search} 
                className="static-search-input" 
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length > 0 && setShowResults(true)}
             />
             {searchQuery && (
                <X className="search-clear-icon" width={14} onClick={closeSearch} />
             )}
          </div>

          {showResults && (
            <div className="search-dropdown mobile-dropdown">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <Link 
                    key={match.id} 
                    href={`/match/${match.id}`} 
                    className="search-result-item"
                    onClick={() => {
                        sessionStorage.setItem("currentMatch", JSON.stringify(match))
                        closeSearch()
                    }}
                  >
                    <span className="result-time">{formatTime(match.date)}</span>
                    <span className="result-title">{match.title}</span>
                  </Link>
                ))
              ) : (
                <div className="search-no-results">No matches found</div>
              )}
            </div>
          )}
        </div>

        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="boxed-btn">
          <DiscordIcon />
        </a>

        {/* MOBILE LANGUAGE DROPDOWN */}
        {isMounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="boxed-btn">
                <Globe width={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              style={{
                background: '#111', 
                border: '1px solid #222', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                minWidth: '150px'
              }}
            >
                {LANGUAGES.map((l) => (
                    <DropdownMenuItem 
                        key={l.code} 
                        onClick={() => setLanguage(l.code)}
                        style={{
                          color: lang === l.code ? '#8db902' : '#ccc',
                          fontWeight: lang === l.code ? '800' : '500',
                          cursor: 'pointer',
                          fontSize: '13px',
                          padding: '10px 15px'
                        }}
                    >
                        {l.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button className="boxed-btn">
            <Globe width={20} />
          </button>
        )}

      </div>
    </header>
  )
}