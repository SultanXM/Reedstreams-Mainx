import './globals.css'
import { AuthProvider } from '../lib/auth'
import { MatchesProvider } from '../lib/matches'
import Script from 'next/script'

export const metadata = {
  title: 'Reedstreams',
  description: 'Live sports streaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <MatchesProvider>
            {children}
          </MatchesProvider>
        </AuthProvider>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-1LLX3T93LK" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1LLX3T93LK');
          `}
        </Script>
      </body>
    </html>
  )
}
