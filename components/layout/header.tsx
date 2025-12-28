'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, AlertOctagon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import '../../styles/header.css'

const API_BASE = 'https://streamed.pk/api'

// 1. CLEAN DISPLAY NAMES
const DISPLAY_MAP: Record<string, string> = {
  'american-football': 'NFL',
  'football': 'Soccer',
  'basketball': 'NBA',
  'mma': 'UFC',
  'boxing': 'Boxing',
  'cricket': 'Cricket',
  'motorsports': 'F1',
  'baseball': 'MLB',
  'hockey': 'NHL',
  'rugby': 'Rugby',
  'tennis': 'Tennis',
  'golf': 'Golf',
  'darts': 'Darts'
}

// 2. FORCED ORDER
const SORT_ORDER = [
  'american-football', 
  'football', 
  'basketball', 
  'mma', 
  'boxing', 
  'cricket', 
  'motorsports', 
  'baseball', 
  'hockey'
]

export default function Header() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [sports, setSports] = useState<any[]>([]) 
  const [showSearch, setShowSearch] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [query, setQuery] = useState('')
  const [reportText, setReportText] = useState('')
  const [matches, setMatches] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)

    // Fetch Matches
    fetch(`${API_BASE}/matches/all-today`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(e => console.error(e))

    // Fetch Sports
    fetch(`${API_BASE}/sports`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => {
           const idxA = SORT_ORDER.indexOf(a.id)
           const idxB = SORT_ORDER.indexOf(b.id)
           if (idxA !== -1 && idxB !== -1) return idxA - idxB
           if (idxA !== -1) return -1
           if (idxB !== -1) return 1
           return a.name.localeCompare(b.name)
        })
        setSports(sorted)
      })
      .catch(e => console.error(e))
  }, [])

  const handleSearch = (val: string) => {
    setQuery(val)
    if (val.length > 0) {
      setResults(matches.filter(m => m.title.toLowerCase().includes(val.toLowerCase())))
    } else {
      setResults([])
    }
  }

  const handleResultClick = (e: any, matchId: string) => {
    e.preventDefault(); 
    setShowSearch(false);
    window.open("https://google.com", '_blank');
    router.push(`/match/${matchId}`);
  }

  const sendReport = () => {
    window.location.href = `mailto:reedstreams000@gmail.com?subject=ISSUE&body=${encodeURIComponent(reportText)}`
    setShowReport(false)
  }

  // --- BRAND COMPONENT (REEDSTREAMS LOGO) ---
  const BrandLogo = ({ size = 18 }: { size?: number }) => (
    <Link href="/" className="logo-text" style={{ fontSize: `${size}px` }}>
      REED<span style={{ color: '#8db902' }}>STREAMS</span>
    </Link>
  )

  if (!mounted) return null

  return (
    <>
      <header className="site-header">
        
        {/* DESKTOP BAR (Top Strip) */}
        <div className="top-bar desktop-only">
          <BrandLogo />
          <nav className="sports-links">
            {sports.slice(0, 8).map(sport => (
              <Link 
                key={sport.id} 
                href={`/live-matches?sportId=${sport.id}&sportName=${encodeURIComponent(sport.name)}`} 
                className="sport-link"
              >
                {DISPLAY_MAP[sport.id] || sport.name}
              </Link>
            ))}
          </nav>
          <div style={{width: '20px'}}></div>
        </div>

        {/* MAIN BAR */}
        <div className="main-bar">
          <div className="nav-left">
            
            {/* MOBILE HAMBURGER */}
            <div className="mobile-visible"> 
              <Sheet>
                <SheetTrigger asChild>
                  <button className="icon-btn"><Menu size={24} /></button>
                </SheetTrigger>
                <SheetContent side="left" style={{background:'#020305', borderRight:'1px solid #2a2e38', color:'#fff', width:'300px'}}>
                  <div style={{display:'flex', flexDirection:'column', gap:'20px', marginTop:'20px'}}>
                    <BrandLogo size={22} />
                    <div style={{height:'1px', background:'#2a2e38', width:'100%'}}></div>
                    <Link href="/" className="mobile-menu-link" style={{color: '#fff', textDecoration: 'none', fontWeight: 'bold'}}>HOME</Link>
                    <Link href="/schedule" className="mobile-menu-link" style={{color: '#fff', textDecoration: 'none', fontWeight: 'bold'}}>SCHEDULE</Link>
                    
                    <div style={{marginTop:'10px', display:'flex', flexDirection:'column', gap:'15px'}}>
                        <span style={{color:'#8db902', fontSize:'12px', fontWeight:'bold', textTransform:'uppercase'}}>Sports</span>
                        {sports.map(sport => (
                             <Link 
                                key={sport.id} 
                                href={`/live-matches?sportId=${sport.id}&sportName=${encodeURIComponent(sport.name)}`}
                                className="mobile-menu-link"
                                style={{fontSize:'14px', marginLeft:'10px', color: '#a0aec0', textDecoration: 'none'}}
                             >
                                {DISPLAY_MAP[sport.id] || sport.name}
                             </Link>
                        ))}
                    </div>

                    <div style={{height:'1px', background:'#2a2e38', width:'100%', marginTop:'20px'}}></div>
                    <button className="sidebar-report-btn" onClick={() => setShowReport(true)}>
                      <AlertOctagon size={18} style={{marginRight:'10px', verticalAlign:'middle'}} />
                      REPORT ISSUE
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* LIVE INDICATOR (Desktop) */}
            <div className="watch-indicator desktop-only">
              <div className="live-dot"></div> LIVE
            </div>
            
            <nav className="main-links desktop-only">
              <Link href="/" className="main-link active">Home</Link>
              <Link href="/schedule" className="main-link">Schedule</Link>
            </nav>
          </div>

          {/* MOBILE LOGO (CENTERED) */}
          <div className="mobile-center-logo mobile-visible">
            <BrandLogo size={20} />
          </div>

          <div className="nav-right">
            <button className="icon-btn" onClick={() => setShowSearch(true)}>
              <Search size={22} />
            </button>
            <button className="report-btn desktop-only" onClick={() => setShowReport(true)}>
              Report
            </button>
          </div>
        </div>

        {/* MOBILE PILLS (Clean Names) */}
        <div className="mobile-sports-bar mobile-visible">
            {sports.map(sport => (
              <Link 
                key={sport.id} 
                href={`/live-matches?sportId=${sport.id}&sportName=${encodeURIComponent(sport.name)}`} 
                className="mobile-sport-pill"
              >
                {DISPLAY_MAP[sport.id] || sport.name}
              </Link>
            ))}
        </div>
      </header>
      
      {/* THE FIX: INVISIBLE SPACER DIVS 
         These push the content down so the header doesn't cover it.
      */}
      <div className="header-spacer-desktop"></div>
      <div className="header-spacer-mobile"></div>

      {/* --- SEARCH MODAL --- */}
      {showSearch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">SEARCH MATCH</span>
              <button className="icon-btn" onClick={() => setShowSearch(false)}><X /></button>
            </div>
            <input 
              autoFocus
              className="search-input-lg" 
              placeholder="TYPE TEAM OR SPORT..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div style={{maxHeight:'300px', overflowY:'auto'}}>
              {results.map(m => (
                <div 
                  key={m.id} 
                  onClick={(e) => handleResultClick(e, m.id)}
                  className="result-row"
                  style={{cursor:'pointer'}}
                >
                  {m.title}
                </div>
              ))}
              {query && results.length === 0 && <div style={{color:'#666', textAlign:'center', padding:'20px'}}>No matches found</div>}
            </div>
          </div>
        </div>
      )}

      {/* --- REPORT MODAL --- */}
      {showReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">REPORT SIGNAL</span>
              <button className="icon-btn" onClick={() => setShowReport(false)}><X /></button>
            </div>
            <textarea 
              className="report-area" 
              placeholder="Describe issue..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
            <button className="report-btn" style={{width:'100%', justifyContent: 'center'}} onClick={sendReport}>
              SEND REPORT
            </button>
          </div>
        </div>
      )}
    </>
  )
}