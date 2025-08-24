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
        <div className="sticky top-16 z-30 border-b border-stone-gray/20 bg-paper-white/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl px-4">
            {/* Mobile Header - Only visible on mobile */}
            <div className="flex items-center justify-between py-4 md:hidden">
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <h1 className="text-xl font-semibold text-ink-black">Learn</h1>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-soft-gray transition-colors hover:bg-gentle-silver/20"
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
            <nav
              className={`${
                mobileMenuOpen ? 'block' : 'hidden'
              } pb-4 md:block md:pb-3 md:pt-4`}
            >
              <div className="border-t border-stone-gray/10 pt-4 md:border-t-0 md:pt-0">
                {/* Desktop Header - Positioned above nav tabs */}
                <div className="mb-4 hidden items-center justify-center gap-3 md:flex">
                  <span className="text-xl">📚</span>
                  <h1 className="text-xl font-semibold text-ink-black">
                    Learn
                  </h1>
                </div>

                <ul className="flex flex-col gap-2 md:mx-auto md:max-w-4xl md:flex-row md:justify-center md:gap-1">
                  {navItems.map(item => (
                    <li key={item.href} className="md:max-w-48 md:flex-1">
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 rounded-lg px-4 py-3 text-center text-sm font-medium transition-all duration-200 md:justify-center md:py-2.5 ${
                          pathname === item.href ||
                          (pathname.startsWith(item.href) &&
                            item.href !== '/learn')
                            ? 'border border-flowing-water/20 bg-flowing-water/15 text-flowing-water shadow-sm'
                            : 'border border-transparent text-soft-gray hover:bg-gentle-silver/15 hover:text-mountain-stone hover:shadow-sm'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="shrink-0 text-base">{item.icon}</span>
                        <span className="md:text-center">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto max-w-6xl px-4 py-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </Layout>
  );
}
