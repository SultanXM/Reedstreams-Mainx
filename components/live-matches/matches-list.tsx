'use client'

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, AlertTriangle, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

// 🔥 Import the new CSS file
import '../../styles/live-matches.css'

/* =========================================
   BLIZZARD ENGINE (Global Background)
   ========================================= */
const globalCss = `
  body { background-color: #020305 !important; margin: 0; overflow-x: hidden; }
  .snow-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none; background: radial-gradient(circle at 50% 100%, #0f1c30 0%, #020305 70%); }
  .snow-layer { position: absolute; top: -100vh; left: 0; right: 0; bottom: 0; background: transparent; border-radius: 50%; animation: snowfall linear infinite; }
  .layer-1 { width: 2px; height: 2px; opacity: 0.6; animation-duration: 20s; box-shadow: 10vw 10vh #fff, 60vw 40vh #fff, 15vw 80vh #fff; }
  .layer-2 { width: 3px; height: 3px; opacity: 0.8; animation-duration: 12s; box-shadow: 5vw 5vh rgba(255,255,255,0.8), 55vw 55vh rgba(255,255,255,0.8); }
  @keyframes snowfall { 0% { transform: translateY(0); } 100% { transform: translateY(100vh); } }
`;

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'
const STREAMED_BASE_URL = 'https://streamed.pk' 

const SPORT_ID_MAP: Record<string, string> = {
  "1": "Football", "2": "Basketball", "3": "Cricket", "4": "Tennis", "5": "Rugby", 
  "6": "Ice Hockey", "7": "American Football", "8": "Baseball", "9": "Motorsport", 
  "10": "Fighting", "12": "Volleyball"
};

function getBadgeUrl(badgeId: string | undefined): string {
  if (!badgeId) return '/placeholder-badge.webp' 
  return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`
}

function getMatchBackground(match: any) {
  if (match.poster) {
    return `${STREAMED_BASE_URL}${match.poster}.webp`;
  }
  return null;
}

// Deterministic Gradient for "Logo Only" cards
function getGradientClass(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 15;
    return `gradient-${index}`;
}

interface Match {
  id: string; title?: string; date?: string; competition?: string; category?: string;
  teams?: { home?: { name?: string; badge?: string }; away?: { name?: string; badge?: string }; };
  sources?: any[];
  poster?: string;
}

export default function MatchesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const sportId = searchParams.get("sportId");
  const rawSportName = searchParams.get("sportName") || (sportId ? SPORT_ID_MAP[sportId] : "Matches") || "Matches";
  const displaySportName = rawSportName === "Matches" ? t.matches_fallback : rawSportName;

  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState("live"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchMatches() {
      try {
        setLoading(true);
        setError(false);
        const url = sportId ? `${STREAMED_API_BASE}/matches/${sportId}` : `${STREAMED_API_BASE}/matches/all-today`;
        
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error("API_ERROR");
        const data = await res.json();
        const dataArray = Array.isArray(data) ? data : [];
        const validMatches = dataArray; 

        validMatches.sort((a, b) => (a.date ? new Date(a.date).getTime() : 0) - (b.date ? new Date(b.date).getTime() : 0));
        
        if (isMounted) setMatches(validMatches);
      } catch (err) {
        console.error(err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchMatches();
    return () => { isMounted = false; };
  }, [sportId]);

  useEffect(() => {
    const now = new Date(); 
    const result = matches.filter(match => {
        if (!match.date) return filter === "all"; 
        const matchDate = new Date(match.date);
        const isLive = matchDate <= now && matchDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
        const isUpcoming = matchDate > now;

        if (filter === 'all') return true; 
        if (filter === 'upcoming') return isUpcoming;
        if (filter === 'live') return isLive;
        return false;
    });
    setFilteredMatches(result);
  }, [filter, matches]);

  const grouped = filteredMatches.reduce((acc, match) => {
      if (!match.date) return acc;
      const d = new Date(match.date);
      if (isNaN(d.getTime())) return acc;
      const dateKey = d.toLocaleDateString(lang === 'ur' ? 'en-US' : lang, { weekday: 'short', month: 'short', day: 'numeric' });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(match);
      return acc;
  }, {} as Record<string, Match[]>);

  // Helper Wrapper for Global Styles
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <>
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
        <div className="snow-wrapper"><div className="snow-layer layer-1"></div><div className="snow-layer layer-2"></div></div>
        <div className="live-matches-container">{children}</div>
    </>
  );

  if (loading) return ( 
    <PageWrapper>
      <div className="page-header">
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
           <div className="skeleton-shimmer" style={{width:'4px', height:'24px', background:'#222', borderRadius:'2px'}}></div>
           <div className="skeleton-shimmer" style={{width: '200px', height: '30px', borderRadius: '4px'}}></div>
        </div>
      </div>
      <div className="matches-grid">
        {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card skeleton-shimmer"></div>)}
      </div>
    </PageWrapper> 
  )

  if (error) return ( <PageWrapper><div style={{textAlign:'center', color:'#ff4444'}}>{t.server_error} <button onClick={() => window.location.reload()}>Retry</button></div></PageWrapper> )

  return (
    <PageWrapper>
        <div className="page-header">
            <div className="page-title"><span className="title-bar"></span>{displaySportName}</div>
            <Link href="/" className="back-link">{t.back_to_home} <ArrowUpRight size={14} /></Link>
        </div>
        
        <div className="filter-bar">
            <button className={`filter-btn ${filter === 'live' ? 'active' : ''}`} onClick={() => setFilter('live')}>{t.live}</button>
            <button className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>{t.upcoming}</button>
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>{t.filter_all}</button>
        </div>

        {Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <div style={{fontSize: '16px', fontWeight: 'bold', color: '#fff'}}>
                    {filter === 'live' ? t.no_live_matches : t.no_matches_found}
                </div>
            </div>
        ) : (
            Object.entries(grouped).map(([date, dateMatches]) => (
                <div key={date}>
                    <div className="date-header">
                        <Calendar size={16} color="#8db902" />
                        <span className="date-text">{date}</span>
                        <div className="date-line"></div>
                    </div>
                    
                    <div className="matches-grid">
                        {dateMatches.map(match => {
                            const now = new Date();
                            const mDate = new Date(match.date!);
                            const isLive = mDate <= now && mDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
                            
                            const bgImage = getMatchBackground(match);
                            const home = match.teams?.home;
                            const away = match.teams?.away;
                            const hasLogos = home?.badge && away?.badge;
                            const matchTitle = (home?.name && away?.name) ? `${home.name} vs ${away.name}` : match.title;

                            // EXACT SPORTSGRID LOGIC
                            let cardStyle: React.CSSProperties = {};
                            let cardClass = "match-card-visual";

                            if (bgImage) {
                                cardStyle = { backgroundImage: `url(${bgImage})` };
                            } else if (hasLogos) {
                                cardStyle = { backgroundColor: '#020305' }; 
                                const gradientClass = getGradientClass(match.id);
                                cardClass += ` has-logos ${gradientClass}`;
                            } else {
                                cardStyle = { backgroundColor: '#0a0a0a' }; 
                                cardClass += " is-fallback";
                            }

                            return (
                                <Link 
                                    key={match.id} 
                                    href={`/match/${match.id}?sportName=${encodeURIComponent(displaySportName)}`}
                                    className="match-card-link"
                                    onClick={() => {
                                        sessionStorage.setItem("currentMatch", JSON.stringify({
                                            ...match, 
                                            id: String(match.id)
                                        }));
                                    }}
                                >
                                    {/* --- CARD VISUAL --- */}
                                    <div className={cardClass} style={cardStyle}>
                                        <div className="match-card-overlay"></div>
                                        
                                        {isLive && <span className="card-live-badge">{t.live}</span>}

                                        {!bgImage && hasLogos ? (
                                            <div className="match-logos-container">
                                                <img src={getBadgeUrl(home?.badge)} alt="Home" className="card-team-logo" loading="lazy" />
                                                <span className="card-vs-text">VS</span>
                                                <img src={getBadgeUrl(away?.badge)} alt="Away" className="card-team-logo" loading="lazy" />
                                            </div>
                                        ) : !bgImage && !hasLogos ? (
                                            <div className="fallback-content">
                                                <span className="reed-logo-text">REED<span className="reed-highlight">STREAMS</span></span>
                                                <div className="reed-underline"></div>
                                                <span className="fallback-category">{match.category || match.competition || 'MATCH'}</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* --- CARD INFO --- */}
                                    <div className="match-card-info">
                                        <span className="match-card-title">{matchTitle}</span>
                                        <div className="match-card-sub">
                                            <span className="match-league-name">{match.competition || match.category}</span>
                                            <span className="sub-sep">•</span>
                                            <span>{isLive ? t.live : mDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12: false})}</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))
        )}
    </PageWrapper>
  )
}