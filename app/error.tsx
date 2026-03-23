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
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          background: '#141420',
          border: '1px solid #1e1e2d',
          borderRadius: '6px',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  )
}
