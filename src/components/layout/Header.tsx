'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gentle-silver/20 bg-cloud-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-flowing-water to-bamboo-green">
              <span className="text-sm font-bold text-cloud-white">道</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-mountain-stone">
                Sage
              </span>
              <span className="-mt-1 text-xs text-soft-gray">
                The Way of Wisdom
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/guidance"
              className="text-mountain-stone transition-colors hover:text-flowing-water"
            >
              導 Daily Guidance
            </Link>
            <Link
              href="/consultation"
              className="text-mountain-stone transition-colors hover:text-flowing-water"
            >
              卜 Consultation
            </Link>
            <Link
              href="/history"
              className="text-mountain-stone transition-colors hover:text-flowing-water"
            >
              史 History
            </Link>
            <Link
              href="/learn"
              className="text-mountain-stone transition-colors hover:text-flowing-water"
            >
              學 Learn
            </Link>
            <Link
              href="/cultural-progress"
              className="text-mountain-stone transition-colors hover:text-flowing-water"
            >
              進 Progress
            </Link>
            <Link
              href="/pricing"
              className="text-mountain-stone transition-colors hover:text-flowing-water"
            >
              價 Pricing
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gentle-silver/30"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="text-sm text-mountain-stone transition-colors hover:text-flowing-water"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm text-mountain-stone transition-colors hover:text-flowing-water"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm text-mountain-stone transition-colors hover:text-flowing-water"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-flowing-water px-4 py-2 text-sm text-cloud-white transition-colors hover:bg-mountain-stone"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="mt-4 flex space-x-6 overflow-x-auto md:hidden">
          <Link
            href="/guidance"
            className="whitespace-nowrap text-sm text-mountain-stone transition-colors hover:text-flowing-water"
          >
            導 Daily Guidance
          </Link>
          <Link
            href="/consultation"
            className="whitespace-nowrap text-sm text-mountain-stone transition-colors hover:text-flowing-water"
          >
            卜 Consultation
          </Link>
          <Link
            href="/history"
            className="whitespace-nowrap text-sm text-mountain-stone transition-colors hover:text-flowing-water"
          >
            史 History
          </Link>
          <Link
            href="/learn"
            className="whitespace-nowrap text-sm text-mountain-stone transition-colors hover:text-flowing-water"
          >
            學 Learn
          </Link>
          <Link
            href="/cultural-progress"
            className="whitespace-nowrap text-sm text-mountain-stone transition-colors hover:text-flowing-water"
          >
            進 Progress
          </Link>
          <Link
            href="/pricing"
            className="whitespace-nowrap text-sm text-mountain-stone transition-colors hover:text-flowing-water"
          >
            價 Pricing
          </Link>
        </nav>
      </div>
    </header>
  );
}
