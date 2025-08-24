'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push('/history');
      }
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/history');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card variant="elevated" className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <p className="text-center text-sm text-soft-gray">
              Access your spiritual journey and consultation history
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-mountain-stone"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-mountain-stone"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                  placeholder="••••••••"
                />
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.includes('error') || message.includes('Error')
                      ? 'border border-red-200 bg-red-50 text-red-700'
                      : 'border border-green-200 bg-green-50 text-green-700'
                  }`}
                >
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-flowing-water hover:text-mountain-stone"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : 'Need an account? Sign up'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
