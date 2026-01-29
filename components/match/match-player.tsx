"use client"

import React, { useEffect, useState, useRef } from "react"
import Hls from "hls.js"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { AlertCircle, Loader2 } from "lucide-react"

const STREAM_API_BASE = "https://reedstreams-edge-v1.fly.dev"

export default function MatchPlayer({ matchId }: { matchId: string }) {
    useUniversalAdBlocker();

    const [streamUrl, setStreamUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        async function fetchStream() {
            try {
                setLoading(true);
                const res = await fetch(`${STREAM_API_BASE}/api/v1/streams/ppvsu/${matchId}/signed-url`);
                if (!res.ok) throw new Error("Stream Offline");
                const data = await res.json();
                if (data.signed_url) setStreamUrl(`${STREAM_API_BASE}${data.signed_url}`);
                else setError("Invalid stream link");
            } catch (e) { setError("Stream is offline. Check back later."); }
            finally { setLoading(false); }
        }
        fetchStream();
    }, [matchId]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !streamUrl) return;

        let hls: Hls;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // NATIVE IOS SUPPORT - Most reliable for iPhone
            video.src = streamUrl;
        } else if (Hls.isSupported()) {
            // DESKTOP/ANDROID SUPPORT
            hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        }
        return () => hls?.destroy();
    }, [streamUrl]);

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
            
            {loading && (
                <div style={overlayStyle}>
                    <Loader2 size={40} color="#8db902" className="animate-spin" />
                </div>
            )}

            {error && (
                <div style={overlayStyle}>
                    <AlertCircle size={40} color="#ff4d4d" />
                    <span style={{ color: '#aaa', marginTop: '10px' }}>{error}</span>
                </div>
            )}

            {streamUrl && (
                <video 
                    ref={videoRef}
                    controls // Let the browser handle play/pause/fullscreen
                    playsInline
                    webkit-playsinline="true"
                    style={{ width: '100%', height: '100%' }}
                />
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, zIndex: 10,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: '#050505'
};