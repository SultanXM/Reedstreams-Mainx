'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft, Terminal } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: '#050505',
      backgroundImage: `
        radial-gradient(circle at 50% 50%, rgba(141, 185, 2, 0.05) 0%, transparent 50%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 30px 30px, 30px 30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'inherit'
    }}>
      
      {/* GLITCH ICON CONTAINER */}
      <div style={{ 
        position: 'relative',
        marginBottom: '30px', 
        padding: '24px', 
        background: 'rgba(141, 185, 2, 0.03)', 
        borderRadius: '20px',
        border: '1px solid rgba(141, 185, 2, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Terminal size={48} color="#8db902" strokeWidth={1.5} />
        {/* Decorative corner accents */}
        <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '10px', height: '10px', borderTop: '2px solid #8db902', borderLeft: '2px solid #8db902' }} />
        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '10px', height: '10px', borderBottom: '2px solid #8db902', borderRight: '2px solid #8db902' }} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: 'clamp(60px, 15vw, 120px)', 
          fontWeight: '950', 
          lineHeight: '0.9',
          margin: '0',
          letterSpacing: '-4px',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.1)',
          position: 'relative'
        }}>
          404
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            color: '#fff',
            clipPath: 'inset(45% 0 0 0)',
            WebkitTextStroke: '0px'
          }}>404</span>
        </h1>
        
        <h2 style={{
          fontSize: '18px',
          fontWeight: '800',
          color: '#8db902',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          marginTop: '10px'
        }}>
          Not Found
        </h2>
      </div>
      
      <p style={{ 
        fontSize: '16px', 
        color: '#888', 
        marginBottom: '40px',
        maxWidth: '420px',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        The requested channel or page is currently offline or hasn't been broadcasted yet. Our developers are working on it.
      </p>

      {/* NAVIGATION BUTTONS */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          background: '#8db902',
          color: '#000',
          padding: '14px 28px',
          borderRadius: '12px',
          fontWeight: '800',
          fontSize: '14px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 20px rgba(141, 185, 2, 0.2)'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 25px rgba(141, 185, 2, 0.3)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(141, 185, 2, 0.2)';
        }}
        >
          <Home size={18} />
          RETURN HOME
        </Link>

        <button 
          onClick={() => window.history.back()}
          style={{
            background: 'transparent',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '14px',
            border: '1px solid #333',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#666'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
        >
          <ArrowLeft size={18} />
          GO BACK
        </button>
      </div>

      {/* LOGO FOOTER */}
      <div style={{ 
        marginTop: '60px', 
        fontSize: '11px', 
        fontWeight: '900', 
        color: '#222',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        <span style={{ color: '#333' }}>REED</span>STREAMS V2.0
      </div>
    </div>
  )
}