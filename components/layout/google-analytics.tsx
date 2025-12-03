"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const GTM_ID = "G-1LLX3T93LK"

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (GTM_ID) {
      const url = pathname + searchParams.toString()
      window.gtag("config", GTM_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  if (!GTM_ID) {
    return null
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GTM_ID}');
          `,
        }}
      />
    </>
  )
}
