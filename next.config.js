/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Netlify handling rewrites via netlify.toml for better production performance
}

module.exports = nextConfig
