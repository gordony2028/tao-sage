import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import PerformanceMonitor from '@/components/common/PerformanceMonitor';
import PWAPerformanceOptimizer from '@/components/pwa/PWAPerformanceOptimizer';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sage - 道 The Way of Wisdom',
  description: 'AI-powered I Ching life guidance for the modern seeker',
  keywords:
    'I Ching, wisdom, guidance, meditation, Taoism, divination, self-reflection',
  authors: [{ name: 'Sage Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sage - I Ching Guidance',
    startupImage: [
      {
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-startup-320x568.png',
      },
      {
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-startup-375x667.png',
      },
      {
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-startup-414x896.png',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/icons/sage-icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8b7355',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <PerformanceMonitor />
        <PWAPerformanceOptimizer />
        {children}
      </body>
    </html>
  );
}
