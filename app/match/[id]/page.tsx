'use client'

import { Suspense, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import MatchPlayer from "@/components/match/match-player"
import { 
  ArrowLeft, 
  Minimize, 
  Share2, 
  Copy, 
  AlertTriangle,
  CheckCircle,
  Twitter,
  Facebook,
  Tv,
  X,
  Clock,
  Wifi,
  MessageCircle,
  AlertOctagon,
  Send,
  Smartphone,
  ShieldAlert
} from "lucide-react"
import "@/styles/match.css"
import Header from "@/components/layout/header"

// 🔥 IMPORT LANGUAGE HOOK
import { useLanguage } from "@/context/language-context"

// 🔥 RESPONSIVE CSS ENGINE
const pageStyles = `
  /* BASE RESET */
  .match-page-container {
    min-height: 100vh;
    width: 100%;
    background: #050505;
    padding-bottom: 40px;
    overflow-x: hidden;
  }

  /* TOP NAV */
  .top-nav {
    max-width: 1600px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-back-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .nav-back-icon {
    width: 36px;
    height: 36px;
    background: #1a1a1a;
    border-radius: 6px; 
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: 1px solid #222;
  }

  /* GRID SYSTEM */
  .match-grid {
    display: grid;
    gap: 25px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 25px 20px;
    width: 100%;
    box-sizing: border-box;
  }
  
  /* LAYOUTS */
  .layout-standard { grid-template-columns: 1fr 380px; } 
  .layout-cinema { grid-template-columns: 1fr; max-width: 1400px; }

  /* PLAYER */
  .player-wrapper {
    width: 100%;
    background: #000;
    aspect-ratio: 16/9;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    z-index: 2;
  }

  /* INFO BAR */
  .info-bar {
    margin-top: 20px;
    background: #0a0a0a; 
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 20px 25px; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .match-title-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .match-main-title {
    color: #fff;
    font-size: 26px; 
    font-weight: 800;
    line-height: 1.1;
    font-family: sans-serif;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  /* PULSING LIVE TAG */
  @keyframes pulse-live {
    0% { box-shadow: 0 0 0 0 rgba(141, 185, 2, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(141, 185, 2, 0); }
    100% { box-shadow: 0 0 0 0 rgba(141, 185, 2, 0); }
  }
  .live-tag {
    background: #8db902;
    color: #000;
    font-size: 11px;
    font-weight: 900;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    animation: pulse-live 2s infinite;
  }

  .time-tag {
    color: #666;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    background: #111;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid #222;
  }

  /* CONTROLS GROUP */
  .controls-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  /* CHAT PANEL */
  .chat-panel {
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 700px;
    overflow: hidden;
    border-radius: 8px;
  }

  /* LOADING SCREEN */
  .loading-container {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8db902;
    font-family: monospace;
    letter-spacing: 2px;
    border: 1px solid #111;
  }
  .loading-text {
    font-size: 14px;
    font-weight: bold;
    margin-top: 15px;
    animation: blink 1.5s infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

  /* FEEDBACK MODAL */
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
    z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s;
  }
  .feedback-modal {
    background: #111;
    border: 1px solid #222;
    width: 90%; max-width: 400px;
    border-radius: 12px;
    padding: 25px;
    position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }

  /* 🛡️ APPLE SYSTEM ALERT POPUP */
  .apple-alert-box {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    max-width: 450px;
    background: #000;
    border: 1px solid #8db902;
    border-radius: 12px;
    z-index: 20000; /* Ensure it stays above everything */
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 30px 60px rgba(0,0,0,1);
    animation: alertSlideDown 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  @keyframes alertSlideDown {
    from { transform: translate(-50%, -100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }

  /* MOBILE OPTIMIZATIONS */
  @media (max-width: 1024px) {
    .match-grid {
      grid-template-columns: 100%;
      padding: 0;
      gap: 0;
    }
    .player-wrapper { width: 100vw; }
    
    .info-bar { 
      margin-top: 0px !important; 
      border: none;
      background: transparent;
      padding: 12px 15px; 
      flex-direction: column; 
      gap: 15px; 
      align-items: stretch;
      border-bottom: 1px solid #1a1a1a;
      border-radius: 0;
    }
    
    .match-main-title {
        font-size: 18px; 
    }

    .controls-group {
      justify-content: space-between;
      width: 100%;
    }
    
    .chat-panel {
      height: 500px;
      margin-top: 10px;
      border-radius: 0;
      border-left: none; 
      border-right: none;
    }
  }
`

// LOADING COMPONENT
function MatchPageLoading() {
  const { t } = useLanguage()
  return (
    <>
      <style jsx global>{pageStyles}</style>
      <Header />
      <div className="match-page-container">
        <div className="match-grid layout-standard">
           <div className="player-section">
              <div className="loading-container">
                 <Wifi size={40} className="loading-text" />
                 <div className="loading-text">{t.establishing_connection || "ESTABLISHING SECURE UPLINK..."}</div>
              </div>
           </div>
           <div className="chat-panel" style={{background:'#050505', border:'1px solid #111'}}></div>
        </div>
      </div>
    </>
  )
}

function MatchPageContent() {
  const router = useRouter()
  const params = useParams()
  const matchId = String(params.id)
  const { t } = useLanguage()

  // --- STATES ---
  const [cinemaMode, setCinemaMode] = useState(false)
  const [chatAgreed, setChatAgreed] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [issueType, setIssueType] = useState('Stream Lag / Buffering')
  
  // 🛡️ POPUP STATES
  const [isAppleDevice, setIsAppleDevice] = useState(false)
  const [timerCount, setTimerCount] = useState(-1)

  // MATCH DATA
  const [matchTitle, setMatchTitle] = useState("Loading Stream...")
  const [startTime, setStartTime] = useState<string | null>(null)
  
  useEffect(() => {
    // 1. Data Fetch
    const stored = sessionStorage.getItem("currentMatch")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        const displayTitle = data.title || `${data.teams?.home?.name || 'Home'} vs ${data.teams?.away?.name || 'Away'}`
        setMatchTitle(displayTitle)
        if (data.date) {
            const dateObj = new Date(data.date)
            setStartTime(dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))
        }
      } catch (e) {
        setMatchTitle("Live Stream")
      }
    }

    // 2. 🛡️ APPLE DETECTION (IOS + MAC)
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isMac = /Macintosh/.test(ua) && 'ontouchend' in document === false; // Detects Mac Safari
    const isIPadPro = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // Specific for iPad Pro desktop mode

    if (isIOS || isMac || isIPadPro) {
      setIsAppleDevice(true);
      const countdown = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsAppleDevice(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [])

  // SHARING LOGIC
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://reedstreams.com'
  const shareText = `Watch ${matchTitle} Live on ReedStreams!`
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`
  }
  const openShare = (url: string) => { window.open(url, '_blank', 'width=600,height=400') }

  // FEEDBACK SUBMIT
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Issue Report: ${issueType}`)
    const body = encodeURIComponent(`Match: ${matchTitle} (ID: ${matchId})\nDetails: ${feedbackText}`)
    window.location.href = `mailto:reedstreams000@gmail.com?subject=${subject}&body=${body}`
    setFeedbackSent(true)
    setTimeout(() => { setFeedbackSent(false); setShowFeedback(false); setFeedbackText('') }, 2000)
  }

  return (
    <>
      <style jsx global>{pageStyles}</style>
      
      

      {showFeedback && (
        <div className="modal-overlay">
          <div className="feedback-modal">
             <button onClick={() => setShowFeedback(false)} style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', color:'#666', cursor:'pointer'}}><X size={18} /></button>
             {!feedbackSent ? (
               <form onSubmit={handleFeedbackSubmit}>
                 <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}><AlertOctagon size={24} color="#8db902" /><h2 style={{color:'#fff', fontSize:'18px', fontWeight:'800', margin:0}}>{t.report || "Report Issue"}</h2></div>
                 <label style={{color:'#888', fontSize:'11px', display:'block', marginBottom:'6px', fontWeight:'bold'}}>ISSUE TYPE</label>
                 <select className="feedback-select" value={issueType} onChange={(e) => setIssueType(e.target.value)}><option>{t.stream_lag || "Stream Lag"}</option><option>{t.audio_sync || "Audio Sync"}</option><option>{t.stream_down || "Stream Down"}</option><option>{t.other_issue || "Other"}</option></select>
                 <label style={{color:'#888', fontSize:'11px', display:'block', marginBottom:'6px', fontWeight:'bold'}}>DETAILS</label>
                 <textarea className="feedback-input" rows={3} placeholder={t.describe_issue || "Describe..."} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}></textarea>
                 <button type="submit" style={{width:'100%', background:'#8db902', color:'#000', border:'none', padding:'12px', borderRadius:'6px', fontWeight:'800', fontSize:'13px', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px'}}><Send size={14} /> {t.submit_report || "Submit"}</button>
               </form>
             ) : (
               <div style={{textAlign:'center', padding:'30px 0'}}><CheckCircle size={48} color="#8db902" style={{margin:'0 auto 15px auto'}} /><h3 style={{color:'#fff', margin:'0 0 5px 0'}}>{t.report_sent || "Report Sent!"}</h3><p style={{color:'#666', fontSize:'12px'}}>{t.thank_you_report || "Thanks"}</p></div>
             )}
          </div>
        </div>
      )}

      {!cinemaMode && <Header />}

      <div className="match-page-container" style={{ background: cinemaMode ? '#000' : '#050505', paddingTop: cinemaMode ? '0' : 'calc(0px + 3vh)' }}>
        <div className={`match-grid ${cinemaMode ? 'layout-cinema' : 'layout-standard'}`}>
          <div className="player-section">
              <div className="player-wrapper"><MatchPlayer matchId={matchId} /></div>
              <div className="info-bar">
                <div className="match-title-group">
                  <div className="meta-row"><span className="live-tag">{t.live || "LIVE"}</span>{startTime && (<span className="time-tag"><Clock size={12} /> {startTime}</span>)}</div>
                  <h1 className="match-main-title">{matchTitle}</h1>
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px', width: '100%', flex: '1', maxWidth: '500px'}}>
                   <div className="controls-group">
                      <button className="action-btn" onClick={() => setCinemaMode(!cinemaMode)} style={{ background: '#111', border: '1px solid #222', color: cinemaMode ? '#8db902' : '#ccc', padding: '10px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', flex: 1, justifyContent: 'center' }}>
                        {cinemaMode ? <Minimize size={14}/> : <Tv size={14}/>}{cinemaMode ? (t.exit_cinema || "Exit") : (t.cinema_mode || "Cinema")}
                      </button>
                      {!cinemaMode && (
                         <div style={{display:'flex', gap:'8px', flex:1, justifyContent:'center'}}>
                            <button onClick={() => openShare(shareLinks.twitter)} style={{background:'#000', border:'1px solid #222', padding:'10px', borderRadius:'6px', cursor:'pointer'}}><Twitter size={16} color="#1DA1F2" /></button>
                            <button onClick={() => openShare(shareLinks.facebook)} style={{background:'#000', border:'1px solid #222', padding:'10px', borderRadius:'6px', cursor:'pointer'}}><Facebook size={16} color="#1877F2" /></button>
                            <button onClick={() => openShare(shareLinks.whatsapp)} style={{background:'#000', border:'1px solid #222', padding:'10px', borderRadius:'6px', cursor:'pointer'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></button>
                         </div>
                      )}
                      {!cinemaMode && (<button onClick={() => setShowFeedback(true)} style={{ background: '#111', border: '1px solid #222', color: '#ccc', padding: '10px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertOctagon size={14} color="#f00" /><span style={{display: 'none', lg: 'inline'}}>{t.report || "Report"}</span></button>)}
                   </div>
                </div>
              </div>
          </div>

          {!cinemaMode && (
            <div className="chat-panel">
                <div style={{padding:'15px', borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#0f0f0f'}}><span style={{color:'#fff', fontWeight:'bold', fontSize:'13px'}}>{t.live_chat || "Live Chat"}</span><div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color:'#888'}}><div style={{width:'6px', height:'6px', background:'#8db902', borderRadius:'50%'}}></div> <span style={{color:'#8db902', fontWeight:'bold'}}>{t.online || "Online"}</span></div></div>
                <div style={{flex:1, position:'relative', background:'#050505'}}>
                  {!chatAgreed && (
                    <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(5,5,5,0.95)', backdropFilter:'blur(4px)', zIndex:10, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'20px', textAlign:'center' }}>
                      <AlertTriangle size={32} color="#8db902" style={{marginBottom:'15px'}} /><h3 style={{color:'#fff', fontSize:'16px', fontWeight:'800', margin:'0 0 5px 0'}}>{t.chat_rules_heading || "Rules"}</h3><p style={{color:'#888', fontSize:'12px', lineHeight:'1.5', marginBottom:'20px', maxWidth:'200px'}}>1. {t.chat_rule_1 || "No hate speech."}<br/>2. {t.chat_rule_2 || "No spam."}<br/>3. {t.chat_rule_3 || "Respect all."}</p>
                      <button onClick={() => setChatAgreed(true)} style={{ background:'#8db902', color:'#000', border:'none', padding:'10px 30px', borderRadius:'6px', fontSize:'12px', fontWeight:'800', cursor:'pointer', textTransform:'uppercase', letterSpacing:'1px' }}>{t.i_agree || "I Agree"}</button>
                    </div>
                  )}
                  <iframe src="https://my.cbox.ws/Reedstreams" width="100%" height="100%" allow="autoplay" frameBorder="0" scrolling="auto" style={{display: 'block', width: '100%', height: '100%'}}></iframe>
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function MatchPage() {
  return (
    <Suspense fallback={<MatchPageLoading />}>
        <MatchPageContent />
    </Suspense>
  )
}