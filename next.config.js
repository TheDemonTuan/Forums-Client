/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig
