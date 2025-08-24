'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import PreferencesDashboard from '@/components/preferences/PreferencesDashboard';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PreferencesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
          <p className="text-soft-gray">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card variant="default">
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">🔒</div>
            <h2 className="mb-4 text-xl font-semibold text-mountain-stone">
              Authentication Required
            </h2>
            <p className="mb-6 text-soft-gray">
              Please sign in to access your personal preferences and customize
              your I Ching experience.
            </p>
            <Button
              onClick={() => (window.location.href = '/auth')}
              variant="default"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PreferencesDashboard />;
}
