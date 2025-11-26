import { redirect } from 'next/navigation'

export const metadata = {
  title: 'ReedStreams - Sports',
  description: 'Browse sports and live matches',
}

export default function HomePage() {
  // Redirect the root path to /sports
  redirect('/sports')
}
