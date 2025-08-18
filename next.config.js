/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['cdn.jsdelivr.net', 'raw.githubusercontent.com']
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: true,
  distDir: '.next',
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config, { isServer }) => {
    // Handle file imports
    config.module.rules.push({
      test: /\.(pdf|svg|png|jpe?g|gif)$/,
      type: 'asset/resource',
    });

    return config;
  },
}

module.exports = nextConfig
