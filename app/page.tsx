'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/layout/header'
import SportsGrid from '@/components/sports/Sportsgrid'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* --- MILLION DOLLAR SNOWFALL SYSTEM --- */}
      {/* Guarded by mounted to prevent Hydration Error */}
      <div className="snow-wrapper" style={{ opacity: mounted ? 1 : 0 }}>
         <div className="snow-layer layer-1"></div>
         <div className="snow-layer layer-2"></div>
         <div className="snow-layer layer-3"></div>
      </div>
       
      {/* Content sits ON TOP of the snow */}
      <div className="relative z-10" style={{ opacity: mounted ? 1 : 0 }}>
        <Header />
        <SportsGrid />
      </div>

    </main>
  )
}