export default function NotFound() {
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
      <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>404</h2>
      <p style={{ color: '#888' }}>Page not found</p>
    </div>
  )
}
