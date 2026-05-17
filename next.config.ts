import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Serve the Expo web app at /app-entry/ so Expo Router reads pathname
      // as "/" and matches the index (login) route correctly.
      {
        source: '/app-entry',
        destination: '/webapp/index.html',
      },
      {
        source: '/app-entry/',
        destination: '/webapp/index.html',
      },
      // Proxy Expo web app asset paths so the iframe works correctly.
      // The Expo build uses absolute paths like /assets/... and /_expo/...
      {
        source: '/_expo/:path*',
        destination: '/webapp/_expo/:path*',
      },
      {
        source: '/assets/:path*',
        destination: '/webapp/assets/:path*',
      },
      // Expo Router in-app navigation routes.
      // Since the app is built as a single-page app (output: 'single'),
      // all routes should be handled by the main index.html file.
      {
        source: '/Dashboard',
        destination: '/webapp/index.html',
      },
      {
        source: '/Categories',
        destination: '/webapp/index.html',
      },
      {
        source: '/Orders',
        destination: '/webapp/index.html',
      },
      {
        source: '/Bookmarks',
        destination: '/webapp/index.html',
      },
      {
        source: '/Profile',
        destination: '/webapp/index.html',
      },
      {
        source: '/Cart',
        destination: '/webapp/index.html',
      },
      {
        source: '/Checkout',
        destination: '/webapp/index.html',
      },
    ];
  },
};

export default nextConfig;
