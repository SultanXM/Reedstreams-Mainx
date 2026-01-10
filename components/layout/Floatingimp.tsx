'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import '../../styles/Floatingimp.css'

// 🔥 IMPORT LANGUAGE HOOK
import { useLanguage } from "@/context/language-context"

export default function FloatingImp() {
  const [isVisible, setIsVisible] = useState(true)
  
  // 🔥 ACTIVATE HOOK
  const { t } = useLanguage()

  if (!isVisible) return null

  return (
    <div className="notice-container">
      <div className="notice-box">
        
        <div className="notice-content">
          {/* DYNAMIC BADGE */}
          <span className="notice-badge">{t.notice_badge}</span>
          
          {/* DYNAMIC TEXT */}
          <span className="notice-text">
            {t.notice_text}
          </span>
        </div>
        
        <button 
          className="notice-close-btn" 
          onClick={() => setIsVisible(false)}
          aria-label="Close Notice"
        >
          <X size={16} />
        </button>

      </div>
    </div>
  )
}