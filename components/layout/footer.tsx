'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span className="logo-text">Reed</span>
          <span className="logo-accent">Streams</span>
        </div>
        
        <p className="footer-tagline">
          Your gateway to live sports streaming. Experience the game like never before.
        </p>
        
        <div className="footer-links">
          <Link href="/sports" className="footer-link">Sports</Link>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }} 
            className="footer-link"
          >
            Upcoming
          </a>
          <Link href="/faq" className="footer-link">FAQ</Link>
        </div>
        
        <div className="legal-notice">
          <p className="legal-text">
            <span className="legal-highlight">Notice:</span> We do not host any content. All streams are sourced from third-party providers.
          </p>
        </div>
        
        <div className="copyright">
          &copy; 2025 ReedStreams. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
