/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    esmExternals: false
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
