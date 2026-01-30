"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Hls from "hls.js"
import "@/styles/match.css"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { DAILY_MATCH_MAP } from "@/config/daily-matches"

// --- CONFIGURATION ---
const REED_API_BASE = "https://reedstreams-edge-v1.fly.dev";

// --- STYLING ---
const unitStyle = {
    background: 'rgba(255,255,255,0.03)',
    padding: '0 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    minWidth: '70px',
    textAlign: 'center' as const,
    textShadow: '0 0 30px rgba(141, 185, 2, 0.2)'
};

interface Stream {
    embedUrl: string; streamNo: number; language: string; hd: boolean; sourceIdentifier: string;
    isNative?: boolean; 
}

interface Match {
    id: string; title: string; date: string;
    sources?: Array<{ source: string; id: string }>;
}

export default function MatchPlayer({ matchId }: { matchId: string }) {
    useUniversalAdBlocker();

    const searchParams = useSearchParams()
    const sportName = searchParams.get("sportName")

    const [streams, setStreams] = useState<Stream[]>([])
    const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
    const [match, setMatch] = useState<Match | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [playerState, setPlayerState] = useState<'initial' | 'loading' | 'ready'>('initial');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                setLoading(true);
                setError(null);

                // 1. Get Match Metadata
                let foundMatch: Match | null = null;
                const stored = sessionStorage.getItem("currentMatch");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (String(parsed.id) === String(matchId)) foundMatch = parsed;
                }

                if (!foundMatch) {
                    const res = await fetch("/api/matches");
                    if (res.ok) {
                        const list = await res.json();
                        foundMatch = list.find((m: Match) => String(m.id) === String(matchId));
                    }
                }

                if (foundMatch) {
                    setMatch(foundMatch);
                    const matchTime = new Date(foundMatch.date).getTime();
                    if (matchTime > Date.now()) {
                        setIsLive(false);
                        setLoading(false);
                        return;
                    } else {
                        setIsLive(true);
                    }
                } else if (DAILY_MATCH_MAP[matchId]) {
                    setIsLive(true);
                } else {
                    setError("Match data unavailable."); 
                    setLoading(false); 
                    return; 
                }

                const allStreams: Stream[] = [];

                // --- 2. RUST API INTEGRATION ---
                const mappedRustId = DAILY_MATCH_MAP[matchId];
                if (mappedRustId) {
                    try {
                        const res = await fetch(`${REED_API_BASE}/api/v1/streams/ppvsu/${mappedRustId}/signed-url`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.signed_url) {
                                allStreams.push({
                                    embedUrl: `${REED_API_BASE}${data.signed_url}`,
                                    streamNo: 1,
                                    language: "EN",
                                    hd: true,
                                    sourceIdentifier: "🌟 ReedStreams Official",
                                    isNative: true 
                                });
                            }
                        }
                    } catch (e) { console.error("Rust API Fetch Failed:", e); }
                }

                // --- 3. EXTERNAL SOURCES ---
                if (foundMatch?.sources && foundMatch.sources.length > 0) {
                    const promises = foundMatch.sources.map(src =>
                        fetch(`/api/stream/${src.source}/${src.id}`).then(r => r.json()).catch(() => [])
                    );

                    const results = await Promise.all(promises);
                    foundMatch.sources.forEach((src, i) => {
                        if (Array.isArray(results[i])) {
                            results[i].forEach((s: any) => allStreams.push({ ...s, sourceIdentifier: src.source }));
                        }
                    });
                }

                if (allStreams.length === 0) {
                    setError("Streams are offline.");
                } else {
                    setStreams(allStreams);

                    // --- PRIORITY LOGIC ---
                    let best = null;
                    best = allStreams.find(s => s.isNative);
                    if (!best) best = allStreams.find(s => s.sourceIdentifier.toLowerCase().includes("bravo") && s.streamNo === 1);
                    if (!best) best = allStreams.find(s => s.sourceIdentifier.toLowerCase().includes("golf") && s.streamNo === 1);
                    if (!best) best = allStreams.find(s => s.sourceIdentifier.toLowerCase() === "delta");
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

    // --- COUNTDOWN LOGIC ---
    useEffect(() => {
        if (!match || isLive) return;
        const timer = setInterval(() => {
            const matchTime = new Date(match.date).getTime();
            const diff = matchTime - Date.now();
            if (diff <= 0) {
                setIsLive(true);
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

    // --- PLAYER UI STATE ---
    useEffect(() => {
        setPlayerState('initial');
        setLoadingProgress(0);
    }, [selectedStream]);

    const handlePlayClick = () => {
        if (playerState !== 'initial') return;
        setPlayerState('loading');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            setLoadingProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => setPlayerState('ready'), 500);
            }
        }, 400);
    };

    // --- RENDER ---
    if (loading) return <div className="player-container loading-state"><div className="spinner"></div><span>ESTABLISHING UPLINK...</span></div>;
    if (error) return <div className="player-container error-state">{error}</div>;

    if (!isLive && timeLeft) {
        return (
             <div className="player-wrapper">
                <div className="player-container countdown-state" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'radial-gradient(circle at center, #0a0a0a 0%, #050505 100%)', color: '#fff'
                }}>
                    <div className="countdown-timer">
                         <div style={{display:'flex', gap:'15px', fontSize:'56px', fontWeight:'900'}}>
                            <div style={unitStyle}>{String(timeLeft.h).padStart(2, '0')}</div>:
                            <div style={unitStyle}>{String(timeLeft.m).padStart(2, '0')}</div>:
                            <div style={unitStyle}>{String(timeLeft.s).padStart(2, '0')}</div>
                        </div>
                        <div style={{marginTop:'20px', fontSize:'12px', letterSpacing:'2px'}}>BROADCAST STARTING SOON</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="player-wrapper">
            <div className="player-container" key={selectedStream?.embedUrl || 'empty'}>
                {playerState === 'initial' && selectedStream && (
                    <div onClick={handlePlayClick} style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'pointer',
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.95))'
                    }}>
                         <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', background: '#8db902',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(141,185,2,0.4)'
                        }}>
                            <div style={{borderLeft:'25px solid black', borderTop:'15px solid transparent', borderBottom:'15px solid transparent', marginLeft:'5px'}}/>
                        </div>
                        <div style={{color:'white', marginTop:'20px', fontWeight:'bold'}}>TAP TO PLAY</div>
                    </div>
                )}

                {playerState === 'loading' && (
                    <div style={{position:'absolute', inset:0, background:'black', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                        <div style={{color:'#8db902', marginBottom:'10px'}}>CONNECTING...</div>
                        <div style={{width:'200px', height:'4px', background:'#333'}}><div style={{width:`${loadingProgress}%`, height:'100%', background:'#8db902', transition:'width 0.3s'}}/></div>
                    </div>
                )}

                {playerState === 'ready' && selectedStream && (
                    <>
                        {selectedStream.isNative ? (
                            <NativeHlsPlayer src={selectedStream.embedUrl} />
                        ) : (
                            <PlayerIframe embedUrl={selectedStream.embedUrl} />
                        )}
                        <ClickThroughShield />
                    </>
                )}
            </div>

            {streams.length > 1 && (
                <div className="stream-selector">
                    <div className="stream-header">AVAILABLE SIGNALS ({streams.length})</div>
                    <div className="stream-list">
                        {streams.map((stream, i) => (
                            <button key={i} className={`stream-btn ${selectedStream === stream ? 'active' : ''}`} onClick={() => setSelectedStream(stream)}>
                                {stream.sourceIdentifier} #{stream.streamNo}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// --- COMPONENTS ---

function NativeHlsPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current || !src) return;
        if (Hls.isSupported()) {
            const hls = new Hls({ 
                enableWorker: true, 
                lowLatencyMode: true,
                xhrSetup: function(xhr, url) {
                    xhr.withCredentials = false; 
                }
            });
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => videoRef.current?.play().catch(() => {}));
            return () => hls.destroy();
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = src;
        }
    }, [src]);
    return <video ref={videoRef} controls autoPlay style={{ width: '100%', height: '100%', background: '#000' }} />;
}

// ⬇️ CRASH-PROOF WRAPPER COMPONENT ⬇️
function PlayerIframe({ embedUrl }: { embedUrl: string }) {
    const [isMounted, setIsMounted] = useState(false);
    const [shouldSandbox, setShouldSandbox] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof navigator !== 'undefined') {
             const ua = navigator.userAgent;
             const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
             const isChrome = /Chrome/.test(ua) && !/Edge/.test(ua) && !isMobile;
             if (isMobile && !isChrome) {
                 setShouldSandbox(true);
             }
        }
    }, []);

    // NOTE: We keep a stable <div> wrapper. React controls the div. 
    // The iframe is just a child that appears later. 
    // This prevents the "Failed to execute removeChild" error.
    return (
        <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
            {isMounted && (
                <iframe
                    src={embedUrl}
                    className="video-iframe"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    referrerPolicy="no-referrer"
                    sandbox={shouldSandbox ? "allow-scripts allow-same-origin allow-presentation allow-forms" : undefined}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                />
            )}
        </div>
    );
}

function ClickThroughShield() {
    const [active, setActive] = useState(true);
    useEffect(() => { setTimeout(() => setActive(true), 3000) }, [active]);
    if (!active) return null;
    return <div onClick={(e) => { e.stopPropagation(); setActive(false); }} style={{ position: 'absolute', inset: 0, zIndex: 100 }} />;
}