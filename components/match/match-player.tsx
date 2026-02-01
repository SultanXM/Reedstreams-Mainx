"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import "@/styles/match.css"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"

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

                if (!foundMatch) { 
                    setError("NO SOURCE AVAILABLE FOR THIS MATCH RN"); 
                    setLoading(false); 
                    return; 
                }

                setMatch(foundMatch);
                const matchTime = new Date(foundMatch.date).getTime();
                const now = Date.now();
                if (matchTime > now) { setIsLive(false); setLoading(false); return; } else { setIsLive(true); }

                const allStreams: Stream[] = [];

                // 👑 THE REEDSTREAMS HIJACKER
                const adminSource = foundMatch.sources?.find(s => s.source === 'admin');
                if (adminSource) {
                    try {
                        // Calling Oracle with the Admin ID (The common link)
                        const lookupRes = await fetch(`https://reedstreams-aggregator.fly.dev/api/lookup/${adminSource.id}`);
                        if (lookupRes.ok) {
                            const oracleData = await lookupRes.json();
                            if (oracleData.found_sultan && oracleData.sultan_url) {
                                allStreams.unshift({
                                    embedUrl: oracleData.sultan_url,
                                    streamNo: 1,
                                    language: "English",
                                    hd: true,
                                    sourceIdentifier: "REEDSTREAMS OFFICIAL" // Branding applied
                                });
                            }
                        }
                    } catch (e) { console.error("Oracle lookup failed", e); }
                }

                const promises = (foundMatch.sources || []).map(src =>
                    fetch(`/api/stream/${src.source}/${src.id}`).then(r => r.json()).catch(() => [])
                );

                const results = await Promise.all(promises);
                (foundMatch.sources || []).forEach((src, i) => {
                    if (Array.isArray(results[i])) {
                        results[i].forEach((s: any) => allStreams.push({ ...s, sourceIdentifier: src.source }));
                    }
                });

                if (allStreams.length === 0) {
                    setError("NO SOURCE AVAILABLE FOR THIS MATCH RN");
                } else {
                    setStreams(allStreams);
                    let best = allStreams.find(s => s.sourceIdentifier === "REEDSTREAMS OFFICIAL");
                    if (!best) best = allStreams.find(s => s.sourceIdentifier.toLowerCase().includes("bravo") && s.streamNo === 1);
                    setSelectedStream(best || allStreams[0]);
                }
            } catch (e) { setError("System Error."); } finally { setLoading(false); }
        }
        init();
    }, [matchId, sportName]);

    useEffect(() => {
        if (!match || isLive) return;
        const timer = setInterval(() => {
            const matchTime = new Date(match.date).getTime();
            const now = Date.now();
            const diff = matchTime - now;
            if (diff <= 0) { setIsLive(true); clearInterval(timer); } 
            else {
                const h = Math.floor((diff / (1000 * 60 * 60)));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({ h, m, s });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [match, isLive]);

    useEffect(() => { setPlayerState('initial'); setLoadingProgress(0); }, [selectedStream]);

    const handlePlayClick = () => {
        if (playerState !== 'initial') return;
        setPlayerState('loading');
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            setLoadingProgress(progress);
            if (progress >= 100) { clearInterval(interval); setTimeout(() => { setPlayerState('ready'); }, 500); }
        }, 400);
    };

    if (loading) return <div className="player-container loading-state"><div className="spinner"></div><span>ESTABLISHING UPLINK...</span></div>;
    if (error) return <div className="player-container error-state">{error}</div>;

    if (!isLive && timeLeft) {
        return (
            <div className="player-wrapper">
                <div className="player-container countdown-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #0a0a0a 0%, #050505 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(141, 185, 2, 0.05)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />
                    <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '11px', color: '#8db902', fontWeight: '800', letterSpacing: '4px', marginBottom: '20px', opacity: 0.8, textTransform: 'uppercase' }}>Upcoming Broadcast</div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '56px', fontWeight: '900', color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}>
                            <div style={unitStyle}>{String(timeLeft.h).padStart(2, '0')}</div>
                            <span style={{ opacity: 0.3, fontSize: '40px', paddingBottom: '10px' }}>:</span>
                            <div style={unitStyle}>{String(timeLeft.m).padStart(2, '0')}</div>
                            <span style={{ opacity: 0.3, fontSize: '40px', paddingBottom: '10px' }}>:</span>
                            <div style={unitStyle}>{String(timeLeft.s).padStart(2, '0')}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#666', marginTop: '25px', fontWeight: '600', letterSpacing: '1px' }}>
                            <span className="live-dot" style={{ width: '6px', height: '6px' }} />ESTABLISHING SATELLITE UPLINK
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="player-wrapper">
            <div className="player-container" key={selectedStream?.embedUrl || 'empty'}>
                {playerState === 'initial' && selectedStream && (
                    <div onClick={handlePlayClick} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)', zIndex: 1000, cursor: 'pointer' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #8db902 0%, #6a8c00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(141, 185, 2, 0.4)', marginBottom: '20px' }}>
                            <div style={{ width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '25px solid #000', marginLeft: '5px' }} />
                        </div>
                        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>TAP TO PLAY</div>
                        <div style={{ color: '#666', fontSize: '11px', marginTop: '8px' }}>HD Stream Ready</div>
                    </div>
                )}
                {playerState === 'loading' && selectedStream && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 1000 }}>
                        <div className="spinner-protect" /><div style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>CONNECTING TO STREAM...</div>
                        <div style={{ width: '200px', height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${loadingProgress}%`, height: '100%', background: '#8db902', transition: 'width 0.3s ease' }} /></div>
                    </div>
                )}
                {playerState === 'ready' && selectedStream && (
                    <><PlayerIframe embedUrl={selectedStream.embedUrl} /><ClickThroughShield /></>
                )}
                {!selectedStream && <div className="no-signal">NO SIGNAL</div>}
            </div>
            {streams.length > 0 && (
                <div className="stream-selector">
                    <div className="stream-header">AVAILABLE SIGNALS ({streams.length})</div>
                    <div className="stream-list">
                        {streams.map((stream) => (
                            <button key={stream.embedUrl} className={`stream-btn ${selectedStream?.embedUrl === stream.embedUrl ? "active" : ""}`} onClick={() => setSelectedStream(stream)}>
                                <span className="signal-icon"></span>{stream.sourceIdentifier} #{stream.streamNo}{stream.hd && <span className="hd-badge">HD</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function ClickThroughShield() {
    const [isBlocking, setIsBlocking] = useState(true);
    const [tapCount, setTapCount] = useState(0);
    useEffect(() => { if (!isBlocking) { const timer = setTimeout(() => { setIsBlocking(true); }, 3000); return () => clearTimeout(timer); } }, [isBlocking, tapCount]);
    const handleTap = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); const newCount = tapCount + 1; setTapCount(newCount); if (newCount >= 1) { setIsBlocking(false); } };
    if (!isBlocking) return null;
    return <div onClick={handleTap} onTouchStart={handleTap} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, background: 'transparent', cursor: 'pointer' }} />;
}

function PlayerIframe({ embedUrl }: { embedUrl: string }) {
    const baseProps = { src: embedUrl, className: "video-iframe", frameBorder: "0", allowFullScreen: true, allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", referrerPolicy: "no-referrer" as const, style: { width: '100%', height: '100%', background: '#000' } };
    return <iframe {...baseProps} sandbox="allow-scripts allow-same-origin allow-presentation allow-forms" />;
}