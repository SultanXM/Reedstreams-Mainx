import './globals.css'
import { AuthProvider } from '../lib/auth'
import { MatchesProvider } from '../lib/matches'

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
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1LLX3T93LK"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1LLX3T93LK');
        </script>
        </body>    </html>
  )
}
