"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader } from 'lucide-react';

interface HLSPlayerProps {
  src: string;
  matchId?: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

// Detect iOS - must use native HLS
const isIOS = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  if (ua.includes('Mac') && navigator.maxTouchPoints > 1) return true;
  return false;
};

// Detect if browser supports native HLS (Safari, iOS)
const supportsNativeHLS = () => {
  if (typeof document === 'undefined') return false;
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
};

export default function HLSPlayer({ src, matchId, onError, onSuccess }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isIOSDevice = isIOS();
    const canPlayNative = supportsNativeHLS();
    
    console.log('[HLSPlayer] Device:', isIOSDevice ? 'iOS' : 'Other', 'Native HLS:', canPlayNative);

    setStatus('loading');

    // iOS or Safari - use native HLS
    if (isIOSDevice || canPlayNative) {
      console.log('[HLSPlayer] Using native HLS');
      
      const handleCanPlay = () => {
        console.log('[HLSPlayer] Native can play');
        setStatus('playing');
        video.play().catch(e => console.warn('Autoplay blocked:', e));
        onSuccess?.();
      };

      const handleError = (e: Event) => {
        console.error('[HLSPlayer] Native error:', video.error);
        setStatus('error');
        setErrorMsg(`Native HLS error: ${video.error?.message || 'Unknown'}`);
        onError?.(`Native HLS error: ${video.error?.code}`);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      video.src = src;
      video.load();

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.src = '';
        video.load();
      };
    }

    // Non-iOS - use hls.js
    if (Hls.isSupported()) {
      console.log('[HLSPlayer] Using hls.js');
      
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('[HLSPlayer] hls.js media attached');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[HLSPlayer] hls.js manifest parsed');
        setStatus('playing');
        video.play().catch(e => console.warn('Autoplay blocked:', e));
        onSuccess?.();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[HLSPlayer] hls.js error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('[HLSPlayer] Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('[HLSPlayer] Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              setStatus('error');
              setErrorMsg(`HLS error: ${data.type} - ${data.details}`);
              onError?.(`HLS error: ${data.type}`);
              hls.destroy();
              break;
          }
        }
      });

      hls.attachMedia(video);
      hls.loadSource(src);

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    // No HLS support at all
    setStatus('error');
    setErrorMsg('HLS not supported in this browser');
    onError?.('HLS not supported');

  }, [src, onError, onSuccess]);

  if (status === 'error') {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        background: '#000', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff'
      }}>
        <div style={{ color: '#ef4444', marginBottom: '10px' }}>Playback Error</div>
        <div style={{ fontSize: '12px', color: '#666' }}>{errorMsg}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
      {status === 'loading' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#8db902', zIndex: 10, background: '#09090b'
        }}>
          <Loader className="animate-spin" size={48} />
          <span style={{ marginTop: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            {isIOS() ? 'LOADING STREAM (iOS)...' : 'LOADING STREAM...'}
          </span>
        </div>
      )}

      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
