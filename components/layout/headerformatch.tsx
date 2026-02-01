'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function HeaderForMatch() {
    const router = useRouter()

    // 🛡️ HARD REDIRECT LOGIC
    // We use router.push('/') instead of back() to avoid getting stuck 
    // in the player's internal history/fetching states.
    const handleGoBack = () => {
        router.push('/')
    }

    const handleHome = (e: React.MouseEvent) => {
        e.preventDefault()
        window.location.href = '/'
    }

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: '#050505',
            borderBottom: '1px solid #222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1600px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                
                {/* === LEFT: BACK + LOGO === */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    flexShrink: 1 
                }}>
                    
                    {/* BACK BUTTON */}
                    <button 
                        onClick={handleGoBack}
                        className="back-btn-sultan"
                        style={{
                            background: '#111',
                            border: '1px solid #333',
                            color: '#fff',
                            height: '36px',
                            padding: '0 10px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ArrowLeft size={16} />
                        <span className="back-text" style={{ textTransform: 'uppercase' }}>Back</span>
                    </button>

                    <a href="/" onClick={handleHome} style={{
                        fontSize: '18px',
                        fontWeight: '900',
                        color: '#fff',
                        textDecoration: 'none',
                        letterSpacing: '-0.5px',
                        fontFamily: 'sans-serif',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>
                        <span style={{ color: '#8db902' }}>REED</span>STREAMS
                    </a>
                </div>

                {/* === RIGHT: DISCORD === */}
                <div style={{ flexShrink: 0 }}>
                    <a 
                        href="https://discord.gg/PMaUcEKV" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            background: '#5865F2',
                            color: '#fff'
                        }}
                    >
                        <svg viewBox="0 0 127.14 96.36" fill="currentColor" width="18" height="18">
                            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39.2,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.73,11.1,105.32,105.32,0,0,0,32.05-16.15h0C130.11,50.41,122.09,26.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.87,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91,65.69,84.69,65.69Z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <style jsx>{`
                .back-btn-sultan:hover {
                    background: #222 !important;
                    border-color: #8db902 !important;
                    color: #8db902 !important;
                }
                @media (min-width: 768px) {
                    a { font-size: 24px !important; }
                    .back-text { font-size: 13px !important; }
                    div { padding: 0 24px !important; }
                }
            `}</style>
        </header>
    )
}