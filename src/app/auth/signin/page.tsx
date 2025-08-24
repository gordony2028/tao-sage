'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        // Redirect to guidance page on successful login
        window.location.href = '/guidance';
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address first');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      setMessage('Failed to send password reset email');
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-paper-white to-gentle-silver/20 px-4 py-12">
        <Card variant="elevated" className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-flowing-water to-bamboo-green">
              <span className="text-2xl font-bold text-cloud-white">道</span>
            </div>
            <CardTitle className="text-2xl font-bold text-mountain-stone">
              Welcome Back
            </CardTitle>
            <p className="text-soft-gray">Continue your journey of wisdom</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-mountain-stone"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gentle-silver/30 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-flowing-water"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-mountain-stone"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gentle-silver/30 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-flowing-water"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 text-center text-sm ${
                    message.includes('reset email sent') ||
                    message.includes('Check your inbox')
                      ? 'bg-bamboo-green/10 text-bamboo-green'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {message}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-flowing-water hover:text-mountain-stone"
              >
                Forgot your password?
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-soft-gray">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-flowing-water hover:text-mountain-stone"
                >
                  Create one here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-soft-gray">
                By signing in, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-flowing-water hover:text-mountain-stone"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-flowing-water hover:text-mountain-stone"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
