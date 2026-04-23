/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/matches/:path*',
        destination: 'https://streamed.pk/api/matches/:path*',
      },
      {
        source: '/api/sports',
        destination: 'https://streamed.pk/api/sports',
      },
      {
        source: '/api/stream/:path*',
        destination: 'https://streamed.pk/api/stream/:path*',
      },
      {
        source: '/api/images/:path*',
        destination: 'https://streamed.pk/api/images/:path*',
      }
    ]
  },
}

module.exports = nextConfig
