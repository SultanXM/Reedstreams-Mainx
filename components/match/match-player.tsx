"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import "@/styles/match.css"

interface Stream {
  embedUrl: string; streamNo: number; language: string; hd: boolean; sourceIdentifier: string;
}

interface Match {
  id: string; title: string; date: string;
  sources?: Array<{ source: string; id: string }>;
}

export default function MatchPlayer({ matchId }: { matchId: string }) {
  const searchParams = useSearchParams()
  const sportName = searchParams.get("sportName")
  
  const [streams, setStreams] = useState<Stream[]>([])
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [match, setMatch] = useState<Match | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shieldActive, setShieldActive] = useState(true);

  // COUNTDOWN STATE
  const [timeLeft, setTimeLeft] = useState<{h:number, m:number, s:number} | null>(null);
  const [isLive, setIsLive] = useState(false);

  // 1. INITIAL LOAD
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);

        // Load Match Data
        let foundMatch: Match | null = null;
        const stored = sessionStorage.getItem("currentMatch");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (String(parsed.id) === String(matchId)) foundMatch = parsed;
        }

        if (!foundMatch) {
            const res = await fetch("/api/matches");
            if(res.ok) {
                const list = await res.json();
                foundMatch = list.find((m: Match) => String(m.id) === String(matchId));
            }
        }

        if (!foundMatch) { setError("Match data unavailable."); setLoading(false); return; }
        
        setMatch(foundMatch);

        // CHECK TIME LOGIC
        const matchTime = new Date(foundMatch.date).getTime();
        const now = Date.now();
        
        if (matchTime > now) {
            setIsLive(false); // Match hasn't started
            setLoading(false); // Stop loading, show countdown
            return;
        } else {
            setIsLive(true); // Match is live, proceed to load streams
        }

        // Load Streams (Only if live)
        if (!foundMatch.sources || foundMatch.sources.length === 0) {
             setError("No streams found."); setLoading(false); return; 
        }

        const promises = foundMatch.sources.map(src => 
            fetch(`/api/stream/${src.source}/${src.id}`).then(r => r.json()).catch(() => [])
        );
        
        const results = await Promise.all(promises);
        const allStreams: Stream[] = [];
        foundMatch.sources.forEach((src, i) => {
            if(Array.isArray(results[i])) {
                results[i].forEach((s: any) => allStreams.push({...s, sourceIdentifier: src.source}));
            }
        });

        if(allStreams.length === 0) {
            setError("Streams are offline.");
        } else {
            setStreams(allStreams);
            // Priority Logic
            const isBasketball = sportName?.toLowerCase().includes("basketball");
            let best = null;
            if (isBasketball) best = allStreams.find(s => s.sourceIdentifier === "bravo #2");
            if (!best) best = allStreams.find(s => s.sourceIdentifier === "admin" && s.streamNo === 1);
            if (!best) best = allStreams.find(s => s.hd);
            
            setSelectedStream(best || allStreams[0]);
        }
      } catch (e) {
        setError("System Error.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [matchId, sportName]);

  // 2. COUNTDOWN TIMER INTERVAL
  useEffect(() => {
    if (!match || isLive) return;

    const timer = setInterval(() => {
        const matchTime = new Date(match.date).getTime();
        const now = Date.now();
        const diff = matchTime - now;

        if (diff <= 0) {
            setIsLive(true); // Time's up! Reload to get streams
            window.location.reload(); 
            clearInterval(timer);
        } else {
            const h = Math.floor((diff / (1000 * 60 * 60)));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ h, m, s });
        }
    }, 1000);

    return () => clearInterval(timer);
  }, [match, isLive]);


  // RESET SHIELD ON STREAM CHANGE
  useEffect(() => { setShieldActive(true); }, [selectedStream]);


  // RENDER: LOADING
  if (loading) return (
    <div className="player-container loading-state">
        <div className="spinner"></div>
        <span>ESTABLISHING UPLINK...</span>
    </div>
  );

  // RENDER: ERROR
  if (error) return <div className="player-container error-state">{error}</div>;

  // RENDER: COUNTDOWN (If not started)
  if (!isLive && timeLeft) {
      return (
        <div className="player-wrapper">
            <div className="player-container countdown-state" style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                background: '#050505', color:'#fff'
            }}>
                <div style={{fontSize:'12px', color:'#666', letterSpacing:'2px', marginBottom:'15px'}}>BROADCAST BEGINS IN</div>
                <div style={{
                    fontSize:'40px', fontWeight:'900', color:'#8db902', fontFamily:'monospace',
                    textShadow: '0 0 20px rgba(141, 185, 2, 0.4)'
                }}>
                    {String(timeLeft.h).padStart(2,'0')} : {String(timeLeft.m).padStart(2,'0')} : {String(timeLeft.s).padStart(2,'0')}
                </div>
                <div style={{fontSize:'10px', color:'#444', marginTop:'10px'}}>WAITING FOR SATELLITE SIGNAL</div>
            </div>
            
            {/* Show info strip even during countdown */}
            {/* Note: MatchInfo is separate in the page.tsx, so it will still show below! */}
        </div>
      )
  }

  // RENDER: PLAYER (If Live)
  return (
    <div className="player-wrapper">
        <div className="player-container">
            {/* SHIELD */}
            {shieldActive && selectedStream && (
                <div className="shield-overlay" onClick={() => setShieldActive(false)}>
                   {/* Invisible content */}
                </div>
            )}

            {selectedStream ? (
            <iframe
                src={selectedStream.embedUrl}
                className="video-iframe"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
            />
            ) : (
            <div className="no-signal">NO SIGNAL</div>
            )}
        </div>

        {/* STREAM SELECTOR */}
        {streams.length > 1 && (
            <div className="stream-selector">
                <div className="stream-header">AVAILABLE SIGNALS ({streams.length})</div>
                <div className="stream-list">
                    {streams.map((stream, index) => (
                        <button
                            key={index}
                            className={`stream-btn ${selectedStream?.embedUrl === stream.embedUrl ? "active" : ""}`}
                            onClick={() => setSelectedStream(stream)}
                        >
                            <span className="signal-icon"></span>
                            {stream.sourceIdentifier} #{stream.streamNo} 
                            {stream.hd && <span className="hd-badge">HD</span>}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  )
}