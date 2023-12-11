/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    typedRoutes: true,
    // swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

// eslint-disable-next-line no-undef
module.exports = nextConfig
