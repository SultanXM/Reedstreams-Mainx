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
    embedUrl: string; 
    streamNo: number; 
    language: string; 
    hd: boolean; 
    sourceIdentifier: string;
}

interface Match {
    id: string; 
    title: string; 
    date: string;
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

                if (matchTime > now) {
                    setIsLive(false);
                    setLoading(false);
                    return;
                } else {
                    setIsLive(true);
                }

                if (!foundMatch.sources || foundMatch.sources.length === 0) {
                    setError("NO SOURCE AVAILABLE FOR THIS MATCH RN"); 
                    setLoading(false); 
                    return;
                }

                const allStreams: Stream[] = [];

                // 🔥 SULTAN HIJACKER V2 (THE SIGNED PROXY PATH)
                const adminSource = foundMatch.sources.find(s => s.source === 'admin');
                if (adminSource) {
                    try {
                        // 1. DNA Lookup to get Sultan ID
                        const oracleRes = await fetch(`https://reedstreams-aggregator.fly.dev/api/lookup/${adminSource.id}`);
                        if (oracleRes.ok) {
                            const oracleData = await oracleRes.json();
                            
                            if (oracleData.found_sultan && oracleData.sultan_id) {
                                // 2. Extract numeric ID (e.g. sultan_87123 -> 87123)
                                const sultanId = oracleData.sultan_id.split('_')[1];
                                
                                // 3. Get the pre-signed Proxy URL from the Edge Scraper
                                const signRes = await fetch(`https://reedstreams-edge-v1.fly.dev/api/v1/streams/ppvsu/${sultanId}/signed-url`);
                                if (signRes.ok) {
                                    const signedData = await signRes.json();
                                    
                                    // 4. Inject into the front of the list as priority
                                    allStreams.unshift({
                                        embedUrl: signedData.proxy_url, // Path to your Rust Proxy Controller
                                        streamNo: 1,
                                        language: "English",
                                        hd: true,
                                        sourceIdentifier: "SULTAN-OFFICIAL"
                                    });
                                    console.log("👑 SULTAN-OFFICIAL: Signed path injected successfully.");
                                }
                            }
                        }
                    } catch (err) {
                        console.error("❌ Sultan Handshake Error:", err);
                    }
                }

                // Fetch other standard sources
                const promises = foundMatch.sources.map(src =>
                    fetch(`/api/stream/${src.source}/${src.id}`).then(r => r.json()).catch(() => [])
                );

                const results = await Promise.all(promises);
                foundMatch.sources.forEach((src, i) => {
                    if (Array.isArray(results[i])) {
                        results[i].forEach((s: any) => allStreams.push({ ...s, sourceIdentifier: src.source }));
                    }
                });

                if (allStreams.length === 0) {
                    setError("NO SOURCE AVAILABLE FOR THIS MATCH RN");
                } else {
                    setStreams(allStreams);
                    
                    // Priority selection: Official -> Sultan V1 -> Bravo -> HD
                    let best = allStreams.find(s => s.sourceIdentifier === "SULTAN-OFFICIAL");
                    if (!best) best = allStreams.find(s => s.sourceIdentifier === "SULTAN-V1");
                    if (!best) best = allStreams.find(s => s.sourceIdentifier.toLowerCase().includes("bravo") && s.streamNo === 1);
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

    useEffect(() => {
        if (!match || isLive) return;
        const timer = setInterval(() => {
            const matchTime = new Date(match.date).getTime();
            const now = Date.now();
            const diff = matchTime - now;
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
                setTimeout(() => {
                    setPlayerState('ready');
                }, 500);
            }
        }, 400);
    };

    if (loading) return (
        <div className="player-container loading-state">
            <div className="spinner"></div>
            <span>ESTABLISHING UPLINK...</span>
        </div>
    );

    if (error) return <div className="player-container error-state">{error}</div>;

    // --- COUNTDOWN STATE ---
    if (!isLive && timeLeft) {
        return (
            <div className="player-wrapper">
                <div className="player-container countdown-state">
                    <div className="countdown-content">
                        <div style={{ fontSize: '11px', color: '#8db902', fontWeight: '800', letterSpacing: '4px', marginBottom: '10px', opacity: 0.8, textAlign: 'center' }}>
                            UPCOMING BROADCAST
                        </div>
                        
                        <div className="timer-display">
                            <div className="timer-unit">{String(timeLeft.h).padStart(2, '0')}</div>
                            <span className="timer-sep">:</span>
                            <div className="timer-unit">{String(timeLeft.m).padStart(2, '0')}</div>
                            <span className="timer-sep">:</span>
                            <div className="timer-unit">{String(timeLeft.s).padStart(2, '0')}</div>
                        </div>

                        <div className="uplink-label">
                            <span className="live-dot-pulse" />
                            ESTABLISHING SATELLITE UPLINK
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="player-wrapper">
            <div className="player-container" key={selectedStream?.embedUrl || 'empty'}>

                {playerState === 'initial' && selectedStream && (
                    <div className="overlay-start" onClick={handlePlayClick}>
                        <div className="play-button-outer">
                            <div className="play-triangle" />
                        </div>
                        <div className="play-text">TAP TO PLAY</div>
                        <div className="play-subtext">HD Stream Ready</div>
                    </div>
                )}

                {playerState === 'loading' && selectedStream && (
                    <div className="overlay-loading">
                        <div className="spinner-protect" />
                        <div className="loading-text">CONNECTING TO STREAM...</div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${loadingProgress}%` }} />
                        </div>
                    </div>
                )}

                {playerState === 'ready' && selectedStream && (
                    <>
                        <PlayerIframe 
                            embedUrl={selectedStream.embedUrl} 
                            isOfficial={selectedStream.sourceIdentifier === "SULTAN-OFFICIAL"}
                        />
                        <ClickThroughShield />
                    </>
                )}

                {!selectedStream && (
                    <div className="no-signal">NO SIGNAL</div>
                )}
            </div>

            {streams.length > 0 && (
                <div className="stream-selector">
                    <div className="stream-header">AVAILABLE SIGNALS ({streams.length})</div>
                    <div className="stream-list">
                        {streams.map((stream) => (
                            <button
                                key={stream.embedUrl}
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

function ClickThroughShield() {
    const [isBlocking, setIsBlocking] = useState(true);
    const [tapCount, setTapCount] = useState(0);

    useEffect(() => {
        if (!isBlocking) {
            const timer = setTimeout(() => {
                setIsBlocking(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isBlocking, tapCount]);

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newCount = tapCount + 1;
        setTapCount(newCount);
        if (newCount >= 1) {
            setIsBlocking(false);
        }
    };

    if (!isBlocking) return null;

    return (
        <div className="shield-layer" onClick={handleTap} onTouchStart={handleTap} />
    );
}

function PlayerIframe({ embedUrl, isOfficial }: { embedUrl: string; isOfficial: boolean }) {
    // If it's official, we're hitting our raw stream. 
    // Note: Iframe will work for now, but Shaka is the final move.
    
    const [deviceInfo] = useState(() => {
        if (typeof navigator === 'undefined') return { isMobile: true, isChrome: false };
        const ua = navigator.userAgent;
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
        const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
        const isChrome = /Chrome/.test(ua) && !/Edge/.test(ua) && !isMobile;
        return { isMobile: isMobile || isSafari, isChrome: isChrome && !isMobile };
    });

    const useSandbox = deviceInfo.isMobile && !deviceInfo.isChrome;

    const baseProps = {
        src: embedUrl,
        className: "video-iframe",
        frameBorder: "0",
        allowFullScreen: true,
        allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
        referrerPolicy: "no-referrer" as const,
        style: { width: '100%', height: '100%', background: '#000', pointerEvents: 'auto' as const }
    };

    if (useSandbox) {
        return (
            <iframe
                {...baseProps}
                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            />
        );
    }
    return <iframe {...baseProps} />;
}