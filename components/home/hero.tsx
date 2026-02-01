import Link from 'next/link'
import Header from '@/components/layout/header'

export default function Hero() {
  return (
    <section className="landing-section">
      <Header />
      
      <div className="hero-content">
        <h1 className="hero-title animate-fadeInUp">Get To Know the New ReedsStreams</h1>
        <p className="hero-subtitle animate-fadeInUp delay-1">Watch Any sport game live from anywhere!</p>
        
        <div className="cta-buttons animate-fadeInUp delay-2">
          <Link href="/sports">
            <button className="primary-cta">
              <i className="fas fa-broadcast-tower"></i> Select Sport
            </button>
          </Link>
        </div>
        
        <div className="stats animate-fadeInUp delay-3">
          <div className="stat-item">
            <span className="stat-value">14+</span>
            <span className="stat-label">Sports Coverage</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">HD</span>
            <span className="stat-label">Quality Streams</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <i className="fas fa-chevron-down"></i>
      </div>
      
      <div className="floating-side-image"></div>
    </section>
  )
}
