"use client"

import React, { useEffect, useRef, useState } from 'react';

/**
 * 🍎 Native iOS HLS Player
 * 
 * Uses the native HTML5 <video> tag which supports HLS directly on iOS Safari.
 * Crucially, it uses our server-side proxy to bypass CORS restrictions.
 */

interface NativeHLSPlayerProps {
    streamUrl: string;
    onError?: (e: any) => void;
    onSuccess?: () => void;
}

export default function NativeHLSPlayer({ streamUrl, onError, onSuccess }: NativeHLSPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading');

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Reset
        setStatus('loading');

        const handleCanPlay = () => {
            console.log('🍎 [NativePlayer] Can play!');
            setStatus('playing');
            video.play().catch(e => console.warn('Autoplay blocked:', e));
            onSuccess?.();
        };

        const handleError = (e: any) => {
            console.error('🍎 [NativePlayer] Error:', video.error, e);
            setStatus('error');
            onError?.(video.error);
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);

        // Load content
        video.src = streamUrl;
        video.load();

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
        };
    }, [streamUrl]);

    return (
        <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
            {/* Status Overlay */}
            {status === 'loading' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#8db902', zIndex: 10
                }}>
                    <div className="spinner-protect" />
                </div>
            )}

            {/* Native Video Element */}
            <video
                ref={videoRef}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                playsInline
                controls
                autoPlay
                muted // Muted needed for autoplay usually
            />
        </div>
    );
}