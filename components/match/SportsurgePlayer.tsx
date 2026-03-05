'use client'

import { useEffect, useRef } from 'react'
import { getSportsurgeEmbedUrl } from '@/config/api'

interface SportsurgePlayerProps {
  matchId: string
}

const WORKER_URL = 'https://embed-proxy.reedstreams000.workers.dev'

export default function SportsurgePlayer({ matchId }: SportsurgePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Only run once - strict mode can't touch this
    if (hasInitialized.current || !containerRef.current) return
    hasInitialized.current = true

    const container = containerRef.current
    
    // Create loading placeholder
    container.innerHTML = '<div style="width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;color:#666;font-family:monospace;">Loading...</div>'

    // Fetch stream URL
    fetch(getSportsurgeEmbedUrl(matchId))
      .then(res => res.json())
      .then(data => {
        if (!data.embed_url) {
          container.innerHTML = '<div style="width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;color:#c44;font-family:monospace;">Stream unavailable</div>'
          return
        }

        const proxyUrl = `${WORKER_URL}?url=${encodeURIComponent(data.embed_url)}`
        
        // Create iframe manually
        const iframe = document.createElement('iframe')
        iframe.src = proxyUrl
        iframe.style.cssText = 'width:100%;height:100%;border:none;position:absolute;top:0;left:0;'
        
        // Clear and append
        container.innerHTML = ''
        container.style.position = 'relative'
        container.appendChild(iframe)
      })
      .catch(() => {
        container.innerHTML = '<div style="width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;color:#c44;font-family:monospace;">Error loading stream</div>'
      })

    // Cleanup only on unmount
    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [matchId])

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        background: '#000',
      }}
    />
  )
}
