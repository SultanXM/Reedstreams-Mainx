/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://187.127.106.231:8080/:path*',
      },
    ]
  },
}

module.exports = nextConfig
