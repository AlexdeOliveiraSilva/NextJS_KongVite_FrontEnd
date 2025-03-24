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
  webpack: (config) => {
    config.optimization.minimize = false; // Desativa minificação para ver erros reais
    return config;
  },
};

module.exports = nextConfig;
