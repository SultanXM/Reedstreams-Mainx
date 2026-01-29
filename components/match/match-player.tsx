"use client"

import React, { useEffect, useState, useRef } from "react"
import Hls from "hls.js"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { Clock, AlertCircle, Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react"

const STREAM_API_BASE = "https://reedstreams-edge-v1.fly.dev"

export default function MatchPlayer({ matchId }: { matchId: string }) {
    useUniversalAdBlocker();

    const [streamUrl, setStreamUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [playerState, setPlayerState] = useState<'countdown' | 'initial' | 'ready'>('initial')
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    // Video Control States
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        try {
            const cached = sessionStorage.getItem("currentMatch");
            if (cached) {
                const data = JSON.parse(cached);
                if (String(data.id) === String(matchId)) setStartTime(data.date);
            }
        } catch (e) { console.error(e); }
    }, [matchId]);

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
                if (playerState === 'countdown') setPlayerState('initial');
            }
        };
        checkTime();
        const timer = setInterval(checkTime, 1000);
        return () => clearInterval(timer);
    }, [startTime, playerState]);

    useEffect(() => {
        async function fetchStream() {
            if (playerState === 'countdown') return;
            try {
                setLoading(true);
                const res = await fetch(`${STREAM_API_BASE}/api/v1/streams/ppvsu/${matchId}/signed-url`);
                if (!res.ok) throw new Error("Offline");
                const data = await res.json();
                if (data.signed_url) setStreamUrl(`${STREAM_API_BASE}${data.signed_url}`);
                else setError("Invalid response");
            } catch (e) { setError("Stream is offline. Check back later."); }
            finally { setLoading(false); }
        }
        fetchStream();
    }, [matchId, playerState]);

    // Controller Logic
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (containerRef.current?.requestFullscreen) containerRef.current.requestFullscreen();
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const getFormattedTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        return { hours, minutes, seconds };
    };

    const countdown = getFormattedTime(timeRemaining);

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{
                width: '100%', maxWidth: '1200px', margin: '0 auto', 
                aspectRatio: '16/9', background: '#000', 
                position: 'relative', overflow: 'hidden',
                border: '1px solid #111'
            }}
        >
            {/* 1. COUNTDOWN VIEW */}
            {playerState === 'countdown' && (
                <div style={overlayStyle}>
                    <div style={liveBadgeStyle}>PRE-SHOW</div>
                    <h2 style={titleStyle}>EVENT STARTING SOON</h2>
                    <div style={timerContainer}>
                        <TimeBox value={countdown.hours} label="HRS" />
                        <span style={separator}>:</span>
                        <TimeBox value={countdown.minutes} label="MIN" />
                        <span style={separator}>:</span>
                        <TimeBox value={countdown.seconds} label="SEC" />
                    </div>
                </div>
            )}

            {/* 2. INITIAL VIEW */}
            {playerState === 'initial' && !loading && !error && (
                <div onClick={() => setPlayerState('ready')} style={clickableOverlay}>
                    <div style={playBtnOuter}>
                        <Play size={32} fill="#fff" color="#fff" />
                    </div>
                    <div style={statusText}>START STREAM</div>
                </div>
            )}

            {/* 3. LOADING / ERROR */}
            {loading && playerState !== 'countdown' && (
                <div style={overlayStyle}>
                    <Loader2 size={40} color="#8db902" className="animate-spin" />
                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600', marginTop: '12px', letterSpacing: '2px' }}>ESTABLISHING LINK...</span>
                </div>
            )}

            {error && (
                <div style={overlayStyle}>
                    <AlertCircle size={40} color="#ff4d4d" />
                    <span style={{ color: '#aaa', fontSize: '14px', margin: '15px 0' }}>{error}</span>
                    <button onClick={() => window.location.reload()} style={retryBtn}>RECONNECT</button>
                </div>
            )}

            {/* 4. ACTUAL PLAYER */}
            {streamUrl && (
                <div style={{ width: '100%', height: '100%', visibility: playerState === 'ready' ? 'visible' : 'hidden' }}>
                     <HlsSource src={streamUrl} videoRef={videoRef} setIsPlaying={setIsPlaying} />
                     
                     {/* CUSTOM SLEEK CONTROLS */}
                     <div style={{
                         ...controlsWrapper,
                         opacity: showControls ? 1 : 0,
                         transform: showControls ? 'translateY(0)' : 'translateY(20px)'
                     }}>
                         <div style={progressBar}><div style={progressFill} /></div>
                         <div style={controlsRow}>
                             <div style={leftControls}>
                                <button onClick={togglePlay} style={iconBtn}>
                                    {isPlaying ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
                                </button>
                                <button onClick={toggleMute} style={iconBtn}>
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <div style={liveTag}><span style={liveDot} /> LIVE</div>
                             </div>
                             <div style={rightControls}>
                                <button onClick={toggleFullscreen} style={iconBtn}><Maximize size={20} /></button>
                             </div>
                         </div>
                     </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse-live { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            `}} />
        </div>
    );
}

// Sub-components for cleaner code
function TimeBox({ value, label }: { value: number, label: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
            <span style={{ color: '#8db902', fontSize: '36px', fontWeight: '900', fontFamily: 'monospace' }}>
                {String(value).padStart(2, '0')}
            </span>
            <span style={{ color: '#555', fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>{label}</span>
        </div>
    );
}

function HlsSource({ src, videoRef, setIsPlaying }: any) {
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        let hls: Hls;
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().then(() => setIsPlaying(true)).catch(() => {});
            });
        }
        return () => hls?.destroy();
    }, [src]);

    return <video ref={videoRef} playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
}

// --- STYLES ---

const overlayStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, zIndex: 50,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: '#050505'
};

const clickableOverlay: React.CSSProperties = {
    ...overlayStyle, cursor: 'pointer', background: 'radial-gradient(circle, rgba(141, 185, 2, 0.1) 0%, #000 100%)'
};

const liveBadgeStyle: React.CSSProperties = {
    background: '#8db902', color: '#000', padding: '4px 12px', fontSize: '10px', 
    fontWeight: '900', letterSpacing: '2px', marginBottom: '20px'
};

const titleStyle: React.CSSProperties = {
    color: '#fff', fontSize: '20px', fontWeight: '900', letterSpacing: '3px', marginBottom: '30px'
};

const timerContainer: React.CSSProperties = { display: 'flex', gap: '15px', alignItems: 'center' };
const separator: React.CSSProperties = { color: '#222', fontSize: '24px', fontWeight: 'bold', paddingBottom: '20px' };

const playBtnOuter: React.CSSProperties = {
    width: '80px', height: '80px', border: '1px solid rgba(141, 185, 2, 0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s',
    background: 'rgba(0,0,0,0.5)', marginBottom: '20px'
};

const statusText: React.CSSProperties = { color: '#fff', fontSize: '12px', fontWeight: '800', letterSpacing: '2px' };

const retryBtn: React.CSSProperties = {
    background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d',
    padding: '10px 25px', cursor: 'pointer', fontWeight: '800', fontSize: '11px', letterSpacing: '1px'
};

// Controls Styles
const controlsWrapper: React.CSSProperties = {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
    padding: '20px', transition: '0.4s ease-in-out', zIndex: 100
};

const controlsRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const leftControls: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '20px' };
const rightControls: React.CSSProperties = { display: 'flex', alignItems: 'center' };

const iconBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px'
};

const liveTag: React.CSSProperties = {
    color: '#fff', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px'
};

const liveDot: React.CSSProperties = {
    width: '6px', height: '6px', background: '#ff0000', borderRadius: '50%',
    animation: 'pulse-live 1.5s infinite'
};

const progressBar: React.CSSProperties = {
    width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', marginBottom: '15px', position: 'relative'
};

const progressFill: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', background: '#8db902'
};