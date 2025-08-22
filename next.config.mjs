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
  // Docker 部署优化
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // 允许外部图片域名
  images: {
    unoptimized: true,
    domains: ['www.google.com', 'icon.horse'],
  },
}

export default nextConfig