/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://reedstreams.live' }, 
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
      {
        source: '/match/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel-scripts.com https://*.cbox.ws https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://*.cbox.ws; img-src 'self' blob: data: https://* https://*.cbox.ws https://www.google-analytics.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'self' https://*.streamed.pk https://*.embedstream.me https://*.sportshub.stream https://*.modistreams.org https://modistreams.org https://*.embedsports.top https://embedsports.top https://*.cbox.ws https://my.cbox.ws https://tlk.io https://*.minnit.chat https://minnit.chat https://reedstreams-edge-v1.fly.dev blob: data:; connect-src 'self' https://*.cbox.ws wss://*.cbox.ws https://tlk.io wss://tlk.io https://*.minnit.chat wss://*.minnit.chat https://streamed.pk https://reedstreams-aggregator.fly.dev https://reedstreams-edge-v1.fly.dev https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com;",
          },
        ],
      },
    ];
  },
  compress: true,
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@vercel/analytics'],
  },
}

export default nextConfig