'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  mindfulNotifications,
  type NotificationPreferences,
} from '@/lib/notifications/mindful-notifications';

export default function NotificationSettings() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsSupported(mindfulNotifications.isNotificationSupported());
      setPermission(mindfulNotifications.getPermissionStatus());
      setPreferences(mindfulNotifications.getPreferences());
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleEnableNotifications = async () => {
    setSaving(true);
    try {
      const success = await mindfulNotifications.enableNotifications();
      if (success) {
        setPermission('granted');
        setPreferences(mindfulNotifications.getPreferences());
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDisableNotifications = async () => {
    setSaving(true);
    try {
      await mindfulNotifications.disableNotifications();
      setPreferences(mindfulNotifications.getPreferences());
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = async (
    updates: Partial<NotificationPreferences>
  ) => {
    if (!preferences) return;

    setSaving(true);
    try {
      const newPreferences = { ...preferences, ...updates };
      await mindfulNotifications.updatePreferences(updates);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTimeChange = (category: string, field: string, value: string) => {
    if (!preferences) return;

    const updates = {
      [category]: {
        ...(preferences as any)[category],
        [field]: value,
      },
    };

    handlePreferenceChange(updates);
  };

  if (loading) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
          <p className="text-soft-gray">Loading notification settings...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isSupported) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">📱</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            Notifications Not Supported
          </h3>
          <p className="text-soft-gray">
            Your browser doesn&apos;t support notifications or you&apos;re using
            a private browsing mode.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            Mindful Notifications
          </CardTitle>
          <p className="text-sm text-soft-gray">
            Receive gentle reminders and wisdom at the right moments
          </p>
        </CardHeader>
      </Card>

      {/* Permission Status */}
      <Card variant="default">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-mountain-stone">
                Notification Permission
              </h3>
              <p className="text-sm text-soft-gray">
                {permission === 'granted'
                  ? 'Notifications are enabled and working'
                  : permission === 'denied'
                    ? 'Notifications are blocked by your browser'
                    : 'Click to enable mindful notifications'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {permission === 'granted' ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-green-600">Active</span>
                </>
              ) : permission === 'denied' ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="text-sm text-red-600">Blocked</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-yellow-600">Pending</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {!preferences.enabled && permission !== 'denied' && (
              <Button
                onClick={handleEnableNotifications}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Enabling...' : 'Enable Notifications'}
              </Button>
            )}

            {preferences.enabled && (
              <Button
                variant="outline"
                onClick={handleDisableNotifications}
                disabled={saving}
              >
                {saving ? 'Disabling...' : 'Disable All'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {preferences.enabled && permission === 'granted' && (
        <>
          {/* Daily Guidance */}
          <Card variant="default">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-mountain-stone">
                    🌅 Daily Guidance
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Your personalized I Ching wisdom delivered each morning
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={preferences.dailyGuidance.enabled}
                    onChange={e =>
                      handlePreferenceChange({
                        dailyGuidance: {
                          ...preferences.dailyGuidance,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gentle-silver after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-flowing-water peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                </label>
              </div>

              {preferences.dailyGuidance.enabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-mountain-stone">
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={preferences.dailyGuidance.time}
                    onChange={e =>
                      handleTimeChange('dailyGuidance', 'time', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reflection Prompts */}
          <Card variant="default">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-mountain-stone">
                    🤔 Reflection Prompts
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Gentle reminders to pause and reflect throughout your day
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={preferences.reflectionPrompts.enabled}
                    onChange={e =>
                      handlePreferenceChange({
                        reflectionPrompts: {
                          ...preferences.reflectionPrompts,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gentle-silver after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-flowing-water peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                </label>
              </div>

              {preferences.reflectionPrompts.enabled && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-mountain-stone">
                      Frequency
                    </label>
                    <select
                      value={preferences.reflectionPrompts.frequency}
                      onChange={e =>
                        handlePreferenceChange({
                          reflectionPrompts: {
                            ...preferences.reflectionPrompts,
                            frequency: e.target.value as
                              | 'daily'
                              | 'weekly'
                              | 'custom',
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {preferences.reflectionPrompts.times.map((time, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-mountain-stone">
                        Time {index + 1}
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={e => {
                          const newTimes = [
                            ...preferences.reflectionPrompts.times,
                          ];
                          newTimes[index] = e.target.value;
                          handlePreferenceChange({
                            reflectionPrompts: {
                              ...preferences.reflectionPrompts,
                              times: newTimes,
                            },
                          });
                        }}
                        className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mindful Moments */}
          <Card variant="default">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-mountain-stone">
                    🍃 Mindful Moments
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Brief moments of mindfulness throughout your day
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={preferences.mindfulMoments.enabled}
                    onChange={e =>
                      handlePreferenceChange({
                        mindfulMoments: {
                          ...preferences.mindfulMoments,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gentle-silver after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-flowing-water peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                </label>
              </div>

              {preferences.mindfulMoments.enabled && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-mountain-stone">
                      Frequency (hours between moments)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={preferences.mindfulMoments.frequency}
                      onChange={e =>
                        handlePreferenceChange({
                          mindfulMoments: {
                            ...preferences.mindfulMoments,
                            frequency: parseInt(e.target.value),
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-mountain-stone">
                        Quiet Hours Start
                      </label>
                      <input
                        type="time"
                        value={preferences.mindfulMoments.quiet_hours.start}
                        onChange={e =>
                          handlePreferenceChange({
                            mindfulMoments: {
                              ...preferences.mindfulMoments,
                              quiet_hours: {
                                ...preferences.mindfulMoments.quiet_hours,
                                start: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mountain-stone">
                        Quiet Hours End
                      </label>
                      <input
                        type="time"
                        value={preferences.mindfulMoments.quiet_hours.end}
                        onChange={e =>
                          handlePreferenceChange({
                            mindfulMoments: {
                              ...preferences.mindfulMoments,
                              quiet_hours: {
                                ...preferences.mindfulMoments.quiet_hours,
                                end: e.target.value,
                              },
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cultural Insights */}
          <Card variant="default">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-mountain-stone">
                    🏛️ Cultural Insights
                  </h3>
                  <p className="text-sm text-soft-gray">
                    Deeper understanding of I Ching philosophy and your progress
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={preferences.culturalInsights.enabled}
                    onChange={e =>
                      handlePreferenceChange({
                        culturalInsights: {
                          ...preferences.culturalInsights,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gentle-silver after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-flowing-water peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                </label>
              </div>

              {preferences.culturalInsights.enabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-mountain-stone">
                    Frequency
                  </label>
                  <select
                    value={preferences.culturalInsights.frequency}
                    onChange={e =>
                      handlePreferenceChange({
                        culturalInsights: {
                          ...preferences.culturalInsights,
                          frequency: e.target.value as
                            | 'weekly'
                            | 'biweekly'
                            | 'monthly',
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gentle-silver px-3 py-2 text-sm focus:border-flowing-water focus:outline-none focus:ring-1 focus:ring-flowing-water"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Permission Denied Help */}
      {permission === 'denied' && (
        <Card variant="default">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="mb-2 text-lg font-medium text-mountain-stone">
                Notifications Blocked
              </h3>
              <p className="mb-4 text-sm text-soft-gray">
                To enable notifications, please:
              </p>
              <div className="text-left text-sm text-soft-gray">
                <p className="mb-2">
                  <strong>Chrome:</strong> Click the lock icon in the address
                  bar
                </p>
                <p className="mb-2">
                  <strong>Firefox:</strong> Click the shield icon in the address
                  bar
                </p>
                <p className="mb-2">
                  <strong>Safari:</strong> Check Safari &gt; Settings &gt;
                  Websites &gt; Notifications
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
