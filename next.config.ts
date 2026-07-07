import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (≈20-30% smaller than WebP), fall back to WebP.
    formats: ['image/avif', 'image/webp'],
    // Cache optimized variants for 1 year to avoid re-optimizing on every request.
    minimumCacheTTL: 31536000,
    // Éco-conception : images servies EN DIRECT depuis le bucket/CDN (pas de proxy
    // backend). On autorise le domaine défini par NEXT_PUBLIC_IMAGE_CDN pour que
    // next/image puisse les optimiser (AVIF/WebP). Local (var non définie) : /public.
    remotePatterns: process.env.NEXT_PUBLIC_IMAGE_CDN
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_IMAGE_CDN).hostname,
          },
        ]
      : [],
  },
  experimental: {
    optimizePackageImports: ['@jamsr-ui/react', 'react-icons'],
  },
  // Empêche webpack de bundler les modules natifs Pyroscope (bindings N-API)
  serverExternalPackages: ['@pyroscope/nodejs', '@datadog/pprof', 'node-gyp-build'],
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Externalise les dépendances natives côté serveur pour éviter le bundling
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@pyroscope/nodejs',
        '@datadog/pprof',
        'node-gyp-build',
      ];
    }

    return config;
  },
};

export default nextConfig;
