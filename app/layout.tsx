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
      <head>
        {/* 🔄 Auto-recover from DOM errors caused by browser extensions */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              if(typeof window==='undefined')return;
              var recovered=false;
              window.addEventListener('error',function(e){
                if(e.message&&/removeChild|removeChildFrom/.test(e.message)&&!recovered){
                  recovered=true;
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  setTimeout(function(){window.location.reload()},150);
                }
              },true);
              window.addEventListener('unhandledrejection',function(e){
                if(e.reason&&/removeChild|removeChildFrom/.test(e.reason)&&!recovered){
                  recovered=true;
                  e.preventDefault();
                  setTimeout(function(){window.location.reload()},150);
                }
              },true);
            })();
          `
        }} />
      </head>
      <body>
        <AuthProvider>
          <MatchesProvider>
            {children}
          </MatchesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
