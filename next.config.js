/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    esmExternals: false
  }
};

module.exports = nextConfig;
