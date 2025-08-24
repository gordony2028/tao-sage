'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface LearnLayoutProps {
  children: React.ReactNode;
}

export default function LearnLayout({ children }: LearnLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/learn', label: 'Overview', icon: '📚' },
    { href: '/learn/basics', label: 'I Ching Basics', icon: '☯️' },
    { href: '/learn/hexagrams', label: '64 Hexagrams', icon: '⚏' },
    { href: '/learn/philosophy', label: 'Taoist Philosophy', icon: '🏮' },
    { href: '/learn/faq', label: 'FAQ', icon: '❓' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-paper-white to-gentle-silver/10">
        {/* Learn Section Sub-Navigation */}
        <div className="border-b border-stone-gray/20 bg-paper-white/80 backdrop-blur-sm sticky top-16 z-30">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">學</span>
                <h1 className="text-xl font-medium text-ink-black">Learn</h1>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-lg p-2 text-soft-gray hover:bg-gentle-silver/20"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Learn Sub-Navigation */}
            <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block pb-4 md:pb-0`}>
              <ul className="flex flex-col md:flex-row gap-1 md:gap-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/learn')
                          ? 'bg-flowing-water/10 text-flowing-water font-medium'
                          : 'text-soft-gray hover:text-mountain-stone hover:bg-gentle-silver/10'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
      </div>
    </Layout>
  );
}