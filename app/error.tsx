'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Auto-recover from hydration/DOM errors
    if (error.message?.includes('removeChild') || error.message?.includes('hydrate')) {
      if (!sessionStorage.getItem('hydrationRecovered')) {
        sessionStorage.setItem('hydrationRecovered', '1')
        setTimeout(() => window.location.reload(), 200)
      }
    }
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      color: '#fff',
      padding: '20px'
    }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong!</h2>
      <p style={{ color: '#888', marginBottom: '16px' }}>Reloading may fix this...</p>
      <button
        onClick={() => {
          sessionStorage.removeItem('hydrationRecovered')
          window.location.reload()
        }}
        style={{
          padding: '12px 24px',
          background: '#141420',
          border: '1px solid #1e1e2d',
          borderRadius: '6px',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Reload Page
      </button>
    </div>
  )
}
