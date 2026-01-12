'use client'

import React from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, ChevronLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #050505 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      
      {/* ERROR ICON */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        background: 'rgba(141, 185, 2, 0.1)', 
        borderRadius: '50%',
        border: '2px solid #8db902'
      }}>
        <AlertTriangle size={60} color="#8db902" />
      </div>

      <h1 style={{ 
        fontSize: 'clamp(24px, 8vw, 48px)', 
        fontWeight: '900', 
        marginBottom: '10px',
        letterSpacing: '-1px'
      }}>
        OH MY F*CKING GOD
      </h1>
      
      <p style={{ 
        fontSize: '18px', 
        color: '#9ca3af', 
        marginBottom: '30px',
        maxWidth: '500px'
      }}>
        The page you are looking for is not created yet. 
        Don't stress, the Developer is working on it.
      </p>

      {/* BACK TO SAFETY BUTTON */}
      <Link href="/" style={{
        background: '#8db902',
        color: '#000',
        padding: '12px 30px',
        borderRadius: '8px',
        fontWeight: '800',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: '0.3s',
        boxShadow: '0 0 20px rgba(141, 185, 2, 0.3)'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Home size={18} />
        BACK TO REEDSTREAMS
      </Link>

      <div style={{ marginTop: '40px', fontSize: '12px', color: '#333' }}>
        ERROR 404 | REEDSTREAMS V2.0
      </div>
    </div>
  )
}