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

// 🔥 NEW IMPORTS (Make sure you created these files!)
import { LanguageProvider } from "@/context/language-context"

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
        {/* 🛡️ NUCLEAR AD SHIELD - Runs BEFORE React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                console.log('🛡️ EARLY SHIELD: Blocking window.open');
                var blocked = function() { console.log('🛡️ BLOCKED'); return null; };
                try {
                  Object.defineProperty(window, 'open', {
                    get: function() { return blocked; },
                    set: function() {},
                    configurable: false
                  });
                } catch(e) {
                  window.open = blocked;
                }
                // Block on parent/top too
                try { if (window.parent !== window) window.parent.open = blocked; } catch(e) {}
                try { if (window.top !== window) window.top.open = blocked; } catch(e) {}
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
      <body className={`font-sans antialiased`}>

        {/* WRAP EVERYTHING IN LANGUAGE PROVIDER */}
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