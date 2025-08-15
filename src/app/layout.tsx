import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sage - 道 The Way of Wisdom',
  description: 'AI-powered I Ching life guidance for the modern seeker',
  keywords:
    'I Ching, wisdom, guidance, meditation, Taoism, divination, self-reflection',
  authors: [{ name: 'Sage Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4a5c6a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
