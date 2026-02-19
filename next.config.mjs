/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // 🟢 DUAL REWRITE: This handles both the JSON data and the Video Fragments
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.reedstreams.live/api/v1/:path*',
      },
    ]
  },

  allowedDevOrigins: [
    'http://192.168.100.5:3000',
    'http://localhost:3000',
  ],

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  compress: true,
  reactStrictMode: false,
}

export default nextConfig