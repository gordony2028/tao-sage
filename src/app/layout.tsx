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
  },
  icons: {
    icon: [{ url: '/icons/sage-icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/sage-icon.svg', type: 'image/svg+xml' }],
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
