'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function HeaderForMatch() {
    const router = useRouter()

    // 🛡️ SMART BACK LOGIC
    // If user has history, go back. If they opened link directly, go Home.
    const handleGoBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 2) {
            router.back()
        } else {
            window.location.href = '/' // Hard redirect to clear memory
        }
    }

    // 🛡️ HARD HOME LOGIC
    // Wipes the page memory to prevent player crash
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
            height: '70px',
            background: '#050505',
            borderBottom: '1px solid #222',
            display: 'flex',
            marginBottom: '10vh',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1600px',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                
                {/* === LEFT: LOGO === */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href="/" onClick={handleHome} style={{
                        fontSize: '26px',
                        fontWeight: '900',
                        color: '#fff',
                        textDecoration: 'none',
                        letterSpacing: '-1px',
                        fontFamily: 'sans-serif',
                        cursor: 'pointer'
                    }}>
                        <span style={{ color: '#8db902' }}>REED</span>STREAMS
                    </a>
                </div>

                {/* === RIGHT: CONTROLS === */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    {/* BACK BUTTON */}
                    <button 
                        onClick={handleGoBack}
                        style={{
                            background: '#111',
                            border: '1px solid #333',
                            color: '#fff',
                            height: '40px',
                            padding: '0 20px',
                            borderRadius: '8px',
                            fontWeight: '800',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: '0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#8db902'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                    >
                        <ArrowLeft size={16} />
                        <span style={{ textTransform: 'uppercase' }}>Back</span>
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#222' }} className="desktop-only"></div>

                    {/* DISCORD BUTTON */}
                    <a 
                        href="https://discord.gg/PMaUcEKV" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: '1px solid #222',
                            color: '#fff',
                            transition: '0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#5865F2';
                            e.currentTarget.style.borderColor = '#5865F2';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#222';
                        }}
                    >
                        <svg viewBox="0 0 127.14 96.36" fill="currentColor" width="20" height="20">
                            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39.2,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.73,11.1,105.32,105.32,0,0,0,32.05-16.15h0C130.11,50.41,122.09,26.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.87,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91,65.69,84.69,65.69Z"/>
                        </svg>
                    </a>

                </div>
            </div>
        </header>
    )
}