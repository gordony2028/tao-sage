/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/consultation/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/learn/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, stale-while-revalidate=3600',
          },
        ],
      },
    ];
  },

  images: {
    domains: ['supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },

  async redirects() {
    return [
      {
        source: '/oracle',
        destination: '/consultation',
        permanent: true,
      },
    ];
  },
};

// PWA setup
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  scope: '/',
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, // Cache all external requests
      handler: 'NetworkFirst',
      options: {
        cacheName: 'https-calls',
        networkTimeoutSeconds: 15,
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^\/api\/consultation\/create$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'consultation-api',
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^\/api\/guidance\/daily$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'daily-guidance-api',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^\/api\/cultural\/progress$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cultural-progress-api',
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 10 * 60, // 10 minutes
        },
      },
    },
    {
      urlPattern: /^\/learn\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'learn-pages',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2?)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
  ],
});

// Bundle analyzer setup
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Compose all the configurations
const config = process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer(withPWA(nextConfig))
  : withPWA(nextConfig);

module.exports = config;
