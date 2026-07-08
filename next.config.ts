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
  // Éco-conception : le HTML des pages (hors API et assets Next) est mis en cache
  // par le CDN pendant 1h, servi obsolète jusqu'à 24h le temps de revalider en fond.
  // max-age=0 côté navigateur → l'utilisateur reçoit toujours le HTML à jour après
  // un redéploiement, mais le CDN absorbe les rendus SSR (moins d'énergie à l'origine).
  async headers() {
    return [
      {
        source: '/((?!api|_next).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
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
