/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  compiler: {
    removeConsole: true,
  },
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "react-toastify",
      "zustand",
      "zod",
      "react-hook-form",
      "@hookform/resolvers",
      "react-google-recaptcha",
      "react-google-recaptcha-v3",
    ],
  },
};

module.exports = nextConfig;
