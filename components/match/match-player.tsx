"use client"

import { useEffect, useState, useRef } from "react"
import Hls from "hls.js"
import "@/styles/match.css"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { Calendar, Clock, Play, AlertCircle } from "lucide-react"

// Base API for the streams
const STREAM_API_BASE = "https://reedstreams-edge-v1.fly.dev"

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MatchPlayer({ matchId }: { matchId: string }) {
    // 🛡️ Activate Universal Ad Shield
    useUniversalAdBlocker();

    const [streamUrl, setStreamUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [playerState, setPlayerState] = useState<'countdown' | 'initial' | 'ready'>('initial')
    
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    // 1. Check Match Start Time from Session
    useEffect(() => {
        try {
            const cached = sessionStorage.getItem("currentMatch");
            if (cached) {
                const data = JSON.parse(cached);
                // Loose equality check for ID
                if (String(data.id) === String(matchId)) {
                    // data.date is already in ms (from live-matches page)
                    setStartTime(data.date);
                }
            }
        } catch (e) {
            console.error("Failed to parse match info", e);
        }
    }, [matchId]);

    // 2. Countdown Logic
    useEffect(() => {
        if (!startTime) return;

        const checkTime = () => {
            const now = Date.now();
            const diff = startTime - now;
            
            if (diff > 0) {
                setTimeRemaining(diff);
                setPlayerState('countdown');
            } else {
                setTimeRemaining(0);
                // If we were in countdown, move to initial (tap to play) or auto-load
                if (playerState === 'countdown') {
                    setPlayerState('initial');
                }
            }
        };

        checkTime(); // Initial check
        const timer = setInterval(checkTime, 1000);
        return () => clearInterval(timer);
    }, [startTime, playerState]);

    // 3. Fetch the M3U8 URL (Only if not in countdown)
    useEffect(() => {
        async function fetchStream() {
            if (playerState === 'countdown') return;

            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${STREAM_API_BASE}/api/v1/streams/ppvsu/${matchId}/signed-url`);
                
                if (!res.ok) throw new Error("Stream offline or ID invalid");
                
                const data = await res.json();

                if (data.signed_url) {
                    const fullM3u8 = `${STREAM_API_BASE}${data.signed_url}`;
                    setStreamUrl(fullM3u8);
                } else {
                    setError("Invalid stream response");
                }
            } catch (e) {
                console.error(e);
                setError("Stream is currently offline. Please check back later.");
            } finally {
                setLoading(false);
            }
        }

        if (matchId && playerState !== 'countdown') {
            fetchStream();
        }
    }, [matchId, playerState]);

    const handlePlayClick = () => {
        setPlayerState('ready');
    };

    // Helper to format ms into D:H:M:S
    const getFormattedTime = (ms: number): CountdownTime => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return { days, hours, minutes, seconds };
    };

    const countdown = getFormattedTime(timeRemaining);

    // -- RENDER STATES --

    // 1. Countdown UI
    if (playerState === 'countdown') {
        return (
            <div className="player-wrapper responsive-wrapper">
                 <div className="player-container countdown-container">
                    <div className="countdown-content">
                        <div className="countdown-icon-pulse">
                            <Clock size={48} color="#8db902" />
                        </div>
                        <h2 className="countdown-title">EVENT STARTING SOON</h2>
                        <div className="countdown-timer">
                            {countdown.days > 0 && (
                                <div className="time-block">
                                    <span className="time-val">{countdown.days}</span>
                                    <span className="time-label">DAYS</span>
                                </div>
                            )}
                            <div className="time-block">
                                <span className="time-val">{String(countdown.hours).padStart(2, '0')}</span>
                                <span className="time-label">HRS</span>
                            </div>
                            <div className="time-separator">:</div>
                            <div className="time-block">
                                <span className="time-val">{String(countdown.minutes).padStart(2, '0')}</span>
                                <span className="time-label">MIN</span>
                            </div>
                            <div className="time-separator">:</div>
                            <div className="time-block">
                                <span className="time-val">{String(countdown.seconds).padStart(2, '0')}</span>
                                <span className="time-label">SEC</span>
                            </div>
                        </div>
                        <p className="countdown-sub">The stream will become available automatically when the event begins.</p>
                    </div>
                    {/* Visual Background Effect */}
                    <div className="countdown-bg" />
                 </div>
            </div>
        );
    }

    // 2. Loading State
    if (loading) return (
        <div className="player-wrapper responsive-wrapper">
            <div className="player-container loading-state">
                <div className="spinner"></div>
                <span>CONNECTING TO SATELLITE...</span>
            </div>
        </div>
    );

    // 3. Error State
    if (error) return (
        <div className="player-wrapper responsive-wrapper">
            <div className="player-container error-state">
                <AlertCircle size={40} color="#e53935" style={{ marginBottom: 15 }} />
                <span className="error-msg">{error}</span>
                <button className="retry-btn" onClick={() => window.location.reload()}>RETRY CONNECTION</button>
            </div>
        </div>
    );

    // 4. Player UI (Initial Overlay + Video)
    return (
        <div className="player-wrapper responsive-wrapper">
            <div className="player-container">
                
                {/* Click to Play Overlay */}
                {playerState === 'initial' && (
                    <div
                        onClick={handlePlayClick}
                        onTouchStart={(e) => { e.preventDefault(); handlePlayClick(); }}
                        className="play-overlay"
                    >
                        <div className="play-button-circle">
                            <div className="play-triangle" />
                        </div>
                        <div className="play-text">TAP TO WATCH LIVE</div>
                    </div>
                )}

                {/* HLS Player */}
                {(playerState === 'ready' || playerState === 'initial') && streamUrl && (
                    <div style={{ width: '100%', height: '100%', visibility: playerState === 'ready' ? 'visible' : 'hidden' }}>
                         <HlsPlayer src={streamUrl} />
                    </div>
                )}
            </div>
            
            <style jsx>{`
            
                /* Responsiveness Fixes */
                .responsive-wrapper {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    aspect-ratio: 16/9;
                    position: relative;
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                
                @media (max-width: 768px) {
                    .responsive-wrapper {
                        border-radius: 0;
                        width: 100%;
                        max-width: 100%;
                    }
                }

                .player-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #000;
                }

                /* Play Overlay Styling */
                .play-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    background: radial-gradient(circle, rgba(20,20,20,0.8) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 50; cursor: pointer;
                }
                .play-button-circle {
                    width: 90px; height: 90px; border-radius: 50%;
                    background: rgba(141, 185, 2, 0.1);
                    border: 2px solid #8db902;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 30px rgba(141, 185, 2, 0.2);
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }
                .play-overlay:hover .play-button-circle {
                    background: rgba(141, 185, 2, 0.2);
                    transform: scale(1.05);
                    box-shadow: 0 0 50px rgba(141, 185, 2, 0.4);
                }
                .play-triangle {
                    width: 0; height: 0;
                    border-top: 15px solid transparent;
                    border-bottom: 15px solid transparent;
                    border-left: 26px solid #fff;
                    margin-left: 6px;
                }
                .play-text { font-weight: 800; color: #fff; letter-spacing: 2px; font-size: 14px; }

                /* Countdown Styling */
                .countdown-container {
                    background: #0a0a0a;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                }
                .countdown-bg {
                    position: absolute; inset: 0;
                    background: radial-gradient(circle at center, rgba(141, 185, 2, 0.05) 0%, transparent 70%);
                    z-index: 1;
                }
                .countdown-content {
                    z-index: 2;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    text-align: center;
                    padding: 20px;
                }
                .countdown-icon-pulse {
                    margin-bottom: 20px;
                    animation: pulse-green 2s infinite;
                }
                .countdown-title {
                    font-size: 24px; font-weight: 900; letter-spacing: 2px;
                    margin: 0 0 30px 0; color: #fff;
                }
                .countdown-timer {
                    display: flex; align-items: center; gap: 15px; margin-bottom: 25px;
                }
                .time-block {
                    display: flex; flex-direction: column; align-items: center;
                    background: rgba(255,255,255,0.05);
                    padding: 10px 15px; border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                    min-width: 70px;
                }
                .time-val { font-size: 32px; font-weight: 700; line-height: 1; color: #fff; }
                .time-label { font-size: 10px; color: #888; font-weight: 700; margin-top: 5px; letter-spacing: 1px; }
                .time-separator { font-size: 24px; color: #444; font-weight: 300; margin-top: -15px; }
                .countdown-sub { color: #666; font-size: 13px; max-width: 400px; line-height: 1.5; }

                /* Error & Loading */
                .loading-state, .error-state {
                    color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 1.5px;
                    text-transform: uppercase;
                }
                .error-msg { color: #aaa; margin-bottom: 20px; text-align: center; max-width: 80%; }
                .retry-btn {
                    background: transparent; border: 1px solid #e53935; color: #e53935;
                    padding: 8px 20px; font-weight: 700; font-size: 11px; cursor: pointer;
                    transition: 0.2s;
                }
                .retry-btn:hover { background: #e53935; color: #fff; }

                .spinner {
                    width: 40px; height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-top-color: #8db902;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }

                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse-green { 0% { opacity: 0.6; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.6; transform: scale(0.95); } }
                
                @media (max-width: 480px) {
                    .countdown-title { font-size: 18px; }
                    .time-val { font-size: 24px; }
                    .time-block { min-width: 55px; padding: 8px 10px; }
                }
            `}</style>
        </div>
    )
}

// --- HLS VIDEO PLAYER COMPONENT ---
function HlsPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls;

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {
                    // Autoplay might fail, expected behavior in some browsers
                });
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                   // Handle fatal errors (maybe retry logic)
                   console.error("HLS Fatal Error", data);
                }
            });
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(() => {});
            });
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            playsInline
            style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#000',
                outline: 'none',
                objectFit: 'contain'
            }}
        />
    );
}