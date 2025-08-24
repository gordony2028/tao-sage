'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Layout from '@/components/layout/Layout';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import NotificationTester from '@/components/notifications/NotificationTester';

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'test'>(
    'settings'
  );
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
            <p className="text-soft-gray">
              Loading your notification settings...
            </p>
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
          {/* Navigation Tabs */}
          <div className="mb-8 flex space-x-1 rounded-lg bg-gentle-silver/20 p-1">
            {[
              { id: 'settings', name: 'Settings', icon: '⚙️' },
              { id: 'history', name: 'History', icon: '📖' },
              { id: 'test', name: 'Test', icon: '🧪' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'settings' | 'history' | 'test')
                }
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-flowing-water shadow-sm'
                    : 'text-soft-gray hover:text-mountain-stone'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'settings' && <NotificationSettings />}
          {activeTab === 'history' && <NotificationHistory />}
          {activeTab === 'test' && <NotificationTester />}
        </div>
      </div>
    </Layout>
  );
}
