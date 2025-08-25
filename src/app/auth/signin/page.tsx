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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/guidance`,
        },
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage('Google sign-in temporarily unavailable');
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gentle-silver/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-cloud-white px-2 text-soft-gray">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="mt-4 w-full"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
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
