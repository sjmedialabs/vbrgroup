/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Vercel Analytics for self-hosted deployment
  experimental: {
    webVitalsAttribution: [],
  },
  // Allow serving static files after build
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve-static/uploads/:path*',
      },
      {
        source: '/images/:path*',
        destination: '/api/serve-static/images/:path*',
      },
    ]
  },
}

export default nextConfig
