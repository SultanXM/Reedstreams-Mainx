"use client"

import { useEffect, useState, useRef } from "react"
import Hls from "hls.js"
import "@/styles/match.css"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"

// Base API for the streams
const STREAM_API_BASE = "https://reedstreams-edge-v1.fly.dev"

export default function MatchPlayer({ matchId }: { matchId: string }) {
    // 🛡️ Activate Universal Ad Shield
    useUniversalAdBlocker();

    const [streamUrl, setStreamUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [playerState, setPlayerState] = useState<'initial' | 'ready'>('initial')
    
    // Fetch the M3U8 URL
    useEffect(() => {
        async function fetchStream() {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch the signed URL JSON
                // Using 'ppvsu' as the ads/provider ID based on your snippet
                const res = await fetch(`${STREAM_API_BASE}/api/v1/streams/ppvsu/${matchId}/signed-url`);
                
                if (!res.ok) throw new Error("Stream offline or ID invalid");
                
                const data = await res.json();

                if (data.signed_url) {
                    // 2. Construct the full M3U8 URL (Base + Proxy Path)
                    const fullM3u8 = `${STREAM_API_BASE}${data.signed_url}`;
                    setStreamUrl(fullM3u8);
                } else {
                    setError("Invalid stream response");
                }
            } catch (e) {
                console.error(e);
                setError("Stream is currently offline");
            } finally {
                setLoading(false);
            }
        }

        if (matchId) {
            fetchStream();
        }
    }, [matchId]);

    const handlePlayClick = () => {
        setPlayerState('ready');
    };

    if (loading) return (
        <div className="player-container loading-state">
            <div className="spinner"></div>
            <span>FETCHING STREAM...</span>
        </div>
    );

    if (error) return <div className="player-container error-state">{error}</div>;

    return (
        <div className="player-wrapper">
            <div className="player-container">
                
                {/* Click to Play Overlay (Required for Audio/Video Autoplay policies) */}
                {playerState === 'initial' && (
                    <div
                        onClick={handlePlayClick}
                        onTouchStart={(e) => { e.preventDefault(); handlePlayClick(); }}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)',
                            zIndex: 1000, cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8db902 0%, #6a8c00 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(141, 185, 2, 0.4)', marginBottom: '20px'
                        }}>
                            <div style={{
                                width: 0, height: 0, borderTop: '15px solid transparent',
                                borderBottom: '15px solid transparent', borderLeft: '25px solid #000', marginLeft: '5px'
                            }} />
                        </div>
                        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>TAP TO PLAY</div>
                    </div>
                )}

                {/* The HLS Player Component */}
                {playerState === 'ready' && streamUrl && (
                    <HlsPlayer src={streamUrl} />
                )}
            </div>
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

        // 1. Check if HLS.js is supported (Chrome, Firefox, Edge, Android)
        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log("Autoplay blocked", e));
            });
        }
        // 2. Native HLS support (Safari / iOS)
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log("Autoplay blocked", e));
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
                outline: 'none'
            }}
        />
    );
}