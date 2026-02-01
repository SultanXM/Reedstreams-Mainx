/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // Allow cross-origin requests in development
  allowedDevOrigins: [
    'http://192.168.100.5:3000',
    'http://localhost:3000',
  ],

  // Security headers for production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy (limit what features can be used)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // CORS headers for HLS proxy APIs (iOS compatibility)
      {
        source: '/api/proxy/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
          {
            key: 'Access-Control-Expose-Headers',
            value: 'Content-Length, Content-Type',
          },
        ],
      },
      // CORS headers for stream API
      {
        source: '/api/stream/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
      // Allow iframes from trusted stream sources
      {
        source: '/match/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://*.streamed.pk https://*.embedstream.me https://*.sportshub.stream blob: data:; media-src 'self' https://*.streamed.pk https://*.embedstream.me https://*.sportshub.stream blob: data: *; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },

  // Compression and performance
  compress: true,

  // Enable React strict mode for development
  reactStrictMode: false, // Disabled to prevent double-mounting issues with ad shield

  // Experimental features for performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@vercel/analytics'],
  },
}

export default nextConfig
