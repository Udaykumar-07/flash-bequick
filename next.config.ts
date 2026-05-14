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
      // All pre-rendered HTML files load the same SPA bundle, so we can
      // serve any of them — the routing fix script normalises the path to "/".
      {
        source: '/Dashboard',
        destination: '/webapp/Dashboard.html',
      },
      {
        source: '/Categories',
        destination: '/webapp/Categories.html',
      },
      {
        source: '/Orders',
        destination: '/webapp/Orders.html',
      },
      {
        source: '/Bookmarks',
        destination: '/webapp/Bookmarks.html',
      },
      {
        source: '/Profile',
        destination: '/webapp/Profile.html',
      },
      {
        source: '/Cart',
        destination: '/webapp/Cart.html',
      },
      {
        source: '/Checkout',
        destination: '/webapp/Checkout.html',
      },
    ];
  },
};

export default nextConfig;
