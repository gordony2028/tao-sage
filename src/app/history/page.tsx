'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ConsultationHistory from '@/components/consultation/ConsultationHistory';

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/auth');
        return;
      }

      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="from-paper-white flex min-h-screen items-center justify-center bg-gradient-to-br to-gentle-silver/10">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
            <p className="text-soft-gray">Loading your spiritual journey...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="from-paper-white min-h-screen bg-gradient-to-br to-gentle-silver/10">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <ConsultationHistory userId={user.id} />
        </div>
      </div>
    </Layout>
  );
}
