import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (≈20-30% smaller than WebP), fall back to WebP.
    formats: ['image/avif', 'image/webp'],
    // Cache optimized variants for 1 year to avoid re-optimizing on every request.
    minimumCacheTTL: 31536000,
  },
  experimental: {
    optimizePackageImports: ['@jamsr-ui/react', 'react-icons'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // Match SVG files
      use: ['@svgr/webpack'], // Use the SVGR loader
    });

    return config;
  },
};

export default nextConfig;
