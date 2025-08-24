'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UserAnalytics from '@/components/analytics/UserAnalytics';

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  timezone: string;
  notification_preferences: {
    daily_guidance: boolean;
    consultation_reminders: boolean;
  };
  subscription_tier: string;
  consultation_count: number;
  created_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    preferred_language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    daily_guidance: true,
    consultation_reminders: true,
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        redirect('/auth');
        return;
      }

      setUser(user);
      await loadProfile(user.id);
    };

    getUser();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          full_name: data.full_name || '',
          preferred_language: data.preferred_language || 'en',
          timezone:
            data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          daily_guidance: data.notification_preferences?.daily_guidance ?? true,
          consultation_reminders:
            data.notification_preferences?.consultation_reminders ?? true,
        });
      }
    } catch (error: any) {
      setMessage(`Error loading profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const profileData = {
        id: user.id,
        username: formData.username || null,
        full_name: formData.full_name || null,
        preferred_language: formData.preferred_language,
        timezone: formData.timezone,
        notification_preferences: {
          daily_guidance: formData.daily_guidance,
          consultation_reminders: formData.consultation_reminders,
        },
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (error) throw error;

      setMessage('Profile updated successfully!');
      await loadProfile(user.id);
    } catch (error: any) {
      setMessage(`Error saving profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
            <p className="text-soft-gray">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <Card variant="default" className="mb-6">
          <CardContent className="pt-6">
            <h1 className="mb-2 text-2xl font-bold text-ink-black">
              Your Profile
            </h1>
            <p className="text-soft-gray">
              Manage your account settings and preferences for your spiritual
              journey.
            </p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-mountain-stone"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-stone-gray/30 bg-gentle-silver/10 px-3 py-2 text-soft-gray"
                  />
                  <p className="mt-1 text-xs text-soft-gray">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-medium text-mountain-stone"
                  >
                    Full Name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={e =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-mountain-stone"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={e =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4 border-t border-stone-gray/20 pt-6">
                <h3 className="text-lg font-medium text-mountain-stone">
                  Preferences
                </h3>

                <div>
                  <label
                    htmlFor="preferred_language"
                    className="mb-2 block text-sm font-medium text-mountain-stone"
                  >
                    Preferred Language
                  </label>
                  <select
                    id="preferred_language"
                    value={formData.preferred_language}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferred_language: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese (Simplified)</option>
                    <option value="zh-TW">Chinese (Traditional)</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="mb-2 block text-sm font-medium text-mountain-stone"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={e =>
                      setFormData({ ...formData, timezone: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-gray/30 px-3 py-2 focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                    <option value="Asia/Hong_Kong">Hong Kong</option>
                    <option value="Asia/Seoul">Seoul</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4 border-t border-stone-gray/20 pt-6">
                <h3 className="text-lg font-medium text-mountain-stone">
                  Notifications
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.daily_guidance}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          daily_guidance: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-stone-gray/30 text-flowing-water focus:ring-flowing-water"
                    />
                    <span className="ml-3 text-sm text-mountain-stone">
                      Daily guidance notifications
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.consultation_reminders}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          consultation_reminders: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-stone-gray/30 text-flowing-water focus:ring-flowing-water"
                    />
                    <span className="ml-3 text-sm text-mountain-stone">
                      Consultation reminders
                    </span>
                  </label>
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.includes('successfully')
                      ? 'border border-green-200 bg-green-50 text-green-700'
                      : 'border border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Stats */}
        {profile && (
          <Card variant="default" className="mt-6">
            <CardHeader>
              <CardTitle>Your Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
                  <div className="text-2xl font-bold text-flowing-water">
                    {profile.consultation_count}
                  </div>
                  <div className="text-sm text-soft-gray">
                    Total Consultations
                  </div>
                </div>
                <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
                  <div className="text-2xl font-bold text-bamboo-green">
                    {profile.subscription_tier}
                  </div>
                  <div className="text-sm text-soft-gray">Current Plan</div>
                </div>
                <div className="rounded-lg bg-gentle-silver/10 p-4 text-center">
                  <div className="text-2xl font-bold text-sunset-gold">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-soft-gray">Member Since</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Export Section */}
        <Card variant="default" className="mt-6">
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-mountain-stone">
                  Export Your Journey
                </h4>
                <p className="mb-4 text-sm text-soft-gray">
                  Download your consultation history, insights, and analytics in
                  multiple formats. Your data remains completely private and is
                  exported directly to your device.
                </p>
                <Button
                  onClick={() => (window.location.href = '/export')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <span>📊</span>
                  Export Data & Analytics
                </Button>
              </div>

              <div className="border-t border-stone-gray/20 pt-4">
                <h4 className="mb-2 font-medium text-mountain-stone">
                  Privacy Controls
                </h4>
                <div className="space-y-2 text-sm text-soft-gray">
                  <p>
                    • All your spiritual insights and reflections are private
                  </p>
                  <p>• You can export or delete your data at any time</p>
                  <p>• We never share your personal consultation content</p>
                  <p>
                    • Analytics are generated locally and stay on your device
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <div className="mt-6">
          <UserAnalytics />
        </div>
      </div>
    </Layout>
  );
}
