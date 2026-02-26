"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  matchId?: string;
  startTime?: number;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onReady?: () => void;
  onSuccess?: () => void;
}

const isIOS = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  if (ua.includes('Mac') && navigator.maxTouchPoints > 1) return true;
  return false;
};

const supportsNativeHLS = () => {
  if (typeof document === 'undefined') return false;
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
};

export default function HLSPlayer({ 
  src, 
  matchId, 
  startTime, 
  autoPlay = true,
  onError, 
  onReady,
  onSuccess 
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasSeekedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isIOSDevice = isIOS();
    const canPlayNative = supportsNativeHLS();
    
    console.log('[HLSPlayer] Starting playback, seeking to:', startTime);

    // Native HLS (iOS/Safari)
    if (isIOSDevice || canPlayNative) {
      const handleCanPlay = () => {
        console.log('[HLSPlayer] Native ready, currentTime:', video.currentTime);
        
        // Seek to start time if provided and not already seeked
        if (startTime && startTime > 0 && !hasSeekedRef.current) {
          hasSeekedRef.current = true;
          video.currentTime = startTime;
        }
        
        setIsLoaded(true);
        onReady?.();
        
        if (autoPlay) {
          video.play().catch(e => console.warn('[HLSPlayer] Autoplay blocked:', e));
        }
        onSuccess?.();
      };

      const handleError = (e: Event) => {
        console.error('[HLSPlayer] Native error:', video.error);
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

    // hls.js for other browsers
    if (Hls.isSupported()) {
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

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('[HLSPlayer] Manifest parsed');
        setIsLoaded(true);
        onReady?.();
        
        // Seek to start time if provided
        if (startTime && startTime > 0 && !hasSeekedRef.current) {
          hasSeekedRef.current = true;
          video.currentTime = startTime;
        }
        
        if (autoPlay) {
          video.play().catch(e => console.warn('[HLSPlayer] Autoplay blocked:', e));
        }
        onSuccess?.();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('[HLSPlayer] Error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
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

    onError?.('HLS not supported');
  }, [src]); // Only re-run if src changes, not startTime

  // Handle startTime updates separately
  useEffect(() => {
    const video = videoRef.current;
    if (video && startTime && startTime > 0 && !hasSeekedRef.current) {
      hasSeekedRef.current = true;
      video.currentTime = startTime;
    }
  }, [startTime]);

  return (
    <video
      ref={videoRef}
      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 0 }}
      playsInline
      controls
      autoPlay={autoPlay}
      muted={!isLoaded}
      preload="auto"
      x-webkit-airplay="allow"
    />
  );
}
