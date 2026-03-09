import GoogleAnalytics from "@/components/layout/google-analytics"
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "@/styles/main.css"
import "@/styles/home.css"
import "@/styles/responsive.css"
import "@/styles/faq.css"
import "@/styles/scroll.css"
import "@/styles/sports.css"
import "@/styles/live-matches.css"
import "@/styles/match.css"
import "@/styles/header.css"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/context/language-context"
import { IsraelBlocker } from "@/components/block-israel"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReedStreams - Your Home for Free Live Sports",
  description: "Watch Any sport game live from anywhere! Free HD sports streaming.",
  generator: 'v0.app',
  icons: {
    icon: '/Images/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🛡️ NUCLEAR AD SHIELD v5.0 - Runs BEFORE React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                console.log('🛡️ EARLY SHIELD: Activating...');
                
                var blocked = function() { 
                  console.log('🛡️ BLOCKED: window.open');
                  return null; 
                };
                
                // Block window.open on all levels
                try {
                  Object.defineProperty(window, 'open', {
                    get: function() { return blocked; },
                    set: function() {},
                    configurable: false
                  });
                } catch(e) {
                  window.open = blocked;
                }
                
                // Block parent/top
                try { 
                  if (window.parent !== window) {
                    Object.defineProperty(window.parent, 'open', {
                      get: function() { return blocked; },
                      set: function() {},
                      configurable: false
                    });
                  }
                } catch(e) {}
                
                try { 
                  if (window.top !== window) {
                    Object.defineProperty(window.top, 'open', {
                      get: function() { return blocked; },
                      set: function() {},
                      configurable: false
                    });
                  }
                } catch(e) {}
                
                // Block location hijacking
                try {
                  var originalAssign = window.location.assign;
                  window.location.assign = function(url) {
                    if (url && typeof url === 'string' && 
                        (url.includes('ad') || url.includes('pop') || url.includes('click'))) {
                      console.log('🛡️ BLOCKED: location.assign to', url);
                      return;
                    }
                    return originalAssign.apply(window.location, arguments);
                  };
                } catch(e) {}
                
                console.log('🛡️ EARLY SHIELD: ACTIVE');
              })();
            `
          }}
        />
        <link rel="icon" href="/Images/logo.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.7.0/fonts/remixicon.css" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <IsraelBlocker />
        <LanguageProvider>
          <GoogleAnalytics />
          {children}
          <Analytics />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}