// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Ensure 'sequelize' is treated as an external package
  serverExternalPackages: ['sequelize'],
  // Disable Next.js API routes since we're using Express
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*', // Keep API routes as-is
      },
    ];
  },
};

module.exports = nextConfig;
