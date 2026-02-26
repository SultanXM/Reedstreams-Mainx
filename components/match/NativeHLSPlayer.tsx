import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

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

        setStatus('loading');

        const handleCanPlay = () => {
            console.log('[NativePlayer] Can play!');
            setStatus('playing');
            video.play().catch(e => console.warn('Autoplay blocked:', e));
            onSuccess?.();
        };

        const handleError = (e: any) => {
            console.error('[NativePlayer] Error:', video.error, e);
            setStatus('error');
            onError?.(video.error);
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);

        video.src = streamUrl;
        video.load();

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
        };
    }, [streamUrl, onError, onSuccess]);

    return (
        <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
            {status === 'loading' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: '#8db902', zIndex: 10, background: '#09090b'
                }}>
                    <Loader className="spinner" size={48} />
                    <span style={{ marginTop: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>LOADING STREAM...</span>
                </div>
            )}

            <video
                ref={videoRef}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                playsInline
                controls
                autoPlay
                muted
                preload="auto"
                x-webkit-airplay="allow"
            />
        </div>
    );
}
