/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  distDir: '.next',
  generateBuildId: async () => {
    return 'build'
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
  assetPrefix: '',
  images: {
    domains: ['localhost'],
    unoptimized: true,
    path: '/_next/image'
  },
  env: {
    PORT: process.env.PORT || '10000'
  },
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig; 