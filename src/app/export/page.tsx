'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  getUserConsultations,
  type Consultation,
} from '@/lib/supabase/consultations';
import DataExportDashboard from '@/components/export/DataExportDashboard';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ExportPage() {
  const [user, setUser] = useState<any>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          // Fetch user's consultations
          const result = await getUserConsultations(user.id, {
            limit: 1000, // Get all for export
            status: 'active',
          });
          setConsultations(result.data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to load consultations'
          );
        }
      }

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
          <p className="text-soft-gray">Loading your data...</p>
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
              Please sign in to access your I Ching journey data and export
              features.
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card variant="default">
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">⚠️</div>
            <h2 className="mb-4 text-xl font-semibold text-mountain-stone">
              Unable to Load Data
            </h2>
            <p className="mb-6 text-soft-gray">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-ink-black">
          Export Your I Ching Journey
        </h1>
        <p className="text-soft-gray">
          Download your consultation history, insights, and personal reflections
          in various formats with comprehensive analytics.
        </p>
      </div>

      {/* Navigation breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-soft-gray">
          <a href="/" className="hover:text-mountain-stone">
            Home
          </a>
          <span className="mx-2">›</span>
          <a href="/profile" className="hover:text-mountain-stone">
            Profile
          </a>
          <span className="mx-2">›</span>
          <span className="text-mountain-stone">Data Export</span>
        </nav>
      </div>

      {/* Export Dashboard */}
      {consultations.length > 0 ? (
        <DataExportDashboard userId={user.id} consultations={consultations} />
      ) : (
        <Card variant="default">
          <CardContent className="p-12 text-center">
            <div className="mb-4 text-6xl opacity-50">📝</div>
            <h3 className="mb-2 text-xl font-medium text-mountain-stone">
              No Consultations Yet
            </h3>
            <p className="mb-6 text-soft-gray">
              You haven&apos;t completed any I Ching consultations yet. Create
              your first consultation to start building your spiritual journey
              data.
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => (window.location.href = '/')}
                variant="default"
              >
                ☯️ Start Your First Consultation
              </Button>
              <Button
                onClick={() => (window.location.href = '/guidance')}
                variant="outline"
              >
                📚 Explore Daily Guidance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy & Data Notice */}
      <div className="mt-8">
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="rounded-lg bg-gentle-silver/10 p-4">
              <h4 className="mb-2 flex items-center font-medium text-mountain-stone">
                <span className="mr-2">🔒</span>
                Privacy & Data Security
              </h4>
              <div className="space-y-2 text-sm text-soft-gray">
                <p>
                  • Your data is exported directly to your device - we do not
                  store copies on external servers
                </p>
                <p>
                  • All personal reflections and spiritual insights remain
                  completely private
                </p>
                <p>
                  • Export files contain only your own consultation data and
                  analytics
                </p>
                <p>
                  • You can delete or modify your data at any time through your
                  profile settings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cultural Context Notice */}
      <div className="mt-4">
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="rounded-lg border-l-4 border-earth-brown bg-earth-brown/5 p-4">
              <h4 className="mb-2 flex items-center font-medium text-mountain-stone">
                <span className="mr-2">🏛️</span>
                Cultural Integrity Notice
              </h4>
              <div className="space-y-2 text-sm text-soft-gray">
                <p>
                  The I Ching (易經) is a profound cultural and philosophical
                  work from ancient China. Our AI interpretations are designed
                  to respectfully bridge traditional wisdom with modern
                  understanding.
                </p>
                <p>
                  Your exported data includes cultural context and traditional
                  elements to help you continue learning about this rich
                  philosophical tradition.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
