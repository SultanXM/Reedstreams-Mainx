import FAQ from '@/components/home/faq'
import Footer from '@/components/layout/footer'

export const metadata = {
  title: 'FAQ - ReedStreams',
  description: 'Frequently asked questions about ReedStreams',
}

export const dynamic = 'force-dynamic'

export default function FAQPage() {
  return (
    <>
      <FAQ />
      <Footer />
    </>
  )
}
