"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { dictionary } from '@/lib/dictionary'

// The 6 Languages
export type Language = 'en' | 'de' | 'zh' | 'es' | 'hi' | 'ur'

interface LanguageContextType {
  lang: Language
  t: typeof dictionary.en
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('site-lang') as Language
    if (saved && dictionary[saved]) {
      setLang(saved)
    }
    setIsLoaded(true)
  }, [])

  // 2. Switcher Function (NO RTL FLIP)
  const setLanguage = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('site-lang', newLang)
    // We removed the "document.dir" logic. Layout stays LTR.
  }

  if (!isLoaded) return <div style={{background:'#000', height:'100vh'}} />

  return (
    <LanguageContext.Provider value={{ lang, t: dictionary[lang], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}