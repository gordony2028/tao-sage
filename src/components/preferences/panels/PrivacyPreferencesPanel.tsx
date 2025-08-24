'use client';

import { PrivacyPreferences } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Slider from '@/components/ui/Slider';

interface PrivacyPreferencesPanelProps {
  preferences: PrivacyPreferences;
  onUpdate: (updates: Partial<PrivacyPreferences>) => void;
}

export function PrivacyPreferencesPanel({
  preferences,
  onUpdate,
}: PrivacyPreferencesPanelProps) {
  const getDataRetentionDescription = (months: number) => {
    if (months <= 6) return 'Short-term retention for immediate needs';
    if (months <= 12) return 'Standard retention for pattern recognition';
    if (months <= 24) return 'Extended retention for long-term insights';
    return 'Maximum retention for comprehensive analysis';
  };

  return (
    <div className="space-y-6">
      {/* Data Collection */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📊</span>
            Data Collection & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Enable Analytics 启用分析
              </label>
              <p className="text-xs text-soft-gray">
                Allow collection of usage data to improve the app experience
              </p>
            </div>
            <Toggle
              checked={preferences.enableAnalytics}
              onCheckedChange={checked =>
                onUpdate({ enableAnalytics: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Crash Reporting 崩溃报告
              </label>
              <p className="text-xs text-soft-gray">
                Automatically report app crashes to help fix bugs
              </p>
            </div>
            <Toggle
              checked={preferences.enableCrashReporting}
              onCheckedChange={checked =>
                onUpdate({ enableCrashReporting: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Share Usage Data 分享使用数据
              </label>
              <p className="text-xs text-soft-gray">
                Share anonymous usage patterns to improve I Ching
                interpretations
              </p>
            </div>
            <Toggle
              checked={preferences.shareUsageData}
              onCheckedChange={checked => onUpdate({ shareUsageData: checked })}
            />
          </div>

          {/* What Data is Collected */}
          <div className="rounded-lg bg-gentle-silver/10 p-3">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              What Data Do We Collect? 我们收集哪些数据？
            </h4>
            <div className="space-y-1 text-xs text-soft-gray">
              {preferences.enableAnalytics && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">📈</span>
                  <span>
                    App usage patterns, feature interactions, performance
                    metrics
                  </span>
                </div>
              )}
              {preferences.enableCrashReporting && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">🔧</span>
                  <span>Error logs, crash reports, device information</span>
                </div>
              )}
              {preferences.shareUsageData && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">🔄</span>
                  <span>
                    Anonymous consultation patterns, hexagram frequencies
                  </span>
                </div>
              )}
              {!preferences.enableAnalytics &&
                !preferences.enableCrashReporting &&
                !preferences.shareUsageData && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-0.5">🚫</span>
                    <span>
                      No data collection - completely private experience
                    </span>
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sharing */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🤝</span>
            Content Sharing & Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Public Profile 公开档案
              </label>
              <p className="text-xs text-soft-gray">
                Allow others to see your profile and shared insights
              </p>
            </div>
            <Toggle
              checked={preferences.enablePublicProfile}
              onCheckedChange={checked =>
                onUpdate({ enablePublicProfile: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Share Consultation Insights 分享咨询洞察
              </label>
              <p className="text-xs text-soft-gray">
                Contribute anonymous insights to help improve interpretations
                for all users
              </p>
            </div>
            <Toggle
              checked={preferences.shareConsultationInsights}
              onCheckedChange={checked =>
                onUpdate({ shareConsultationInsights: checked })
              }
            />
          </div>

          {/* Sharing Details */}
          <div className="rounded-lg bg-gentle-silver/10 p-3">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              What Gets Shared? 分享什么内容？
            </h4>
            <div className="space-y-1 text-xs text-soft-gray">
              {preferences.enablePublicProfile && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">👤</span>
                  <span>
                    Profile name, practice duration, preferred interpretation
                    style
                  </span>
                </div>
              )}
              {preferences.shareConsultationInsights && (
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">💡</span>
                  <span>
                    Anonymous patterns, effectiveness ratings, general themes
                    (never personal questions)
                  </span>
                </div>
              )}
              {!preferences.enablePublicProfile &&
                !preferences.shareConsultationInsights && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-0.5">🔒</span>
                    <span>Nothing shared - completely private practice</span>
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Preferences */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">💾</span>
            Data Storage & Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Local Storage Only 仅本地存储
              </label>
              <p className="text-xs text-soft-gray">
                Store all data locally on your device, never sync to cloud
              </p>
            </div>
            <Toggle
              checked={preferences.localStorageOnly}
              onCheckedChange={checked =>
                onUpdate({ localStorageOnly: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Auto-Delete Old Data 自动删除旧数据
              </label>
              <p className="text-xs text-soft-gray">
                Automatically remove old consultations based on retention period
              </p>
            </div>
            <Toggle
              checked={preferences.autoDeleteOldData}
              onCheckedChange={checked =>
                onUpdate({ autoDeleteOldData: checked })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Data Retention Period 数据保留期限 (
              {preferences.dataRetentionMonths} months)
            </label>
            <div className="px-3">
              <Slider
                value={preferences.dataRetentionMonths}
                onValueChange={value =>
                  onUpdate({ dataRetentionMonths: value })
                }
                min={3}
                max={60}
                step={3}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-soft-gray">
              <span>3 months</span>
              <span>5 years</span>
            </div>
            <p className="mt-1 text-xs text-soft-gray">
              {getDataRetentionDescription(preferences.dataRetentionMonths)}
            </p>
          </div>

          {/* Storage Impact */}
          <div className="rounded-lg bg-gentle-silver/10 p-3">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Storage Impact 存储影响
            </h4>
            <div className="space-y-1 text-xs text-soft-gray">
              <div className="flex justify-between">
                <span>Estimated Storage:</span>
                <span className="font-medium">
                  {preferences.localStorageOnly
                    ? '5-20 MB (local only)'
                    : '2-10 MB (with cloud sync)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Data Portability:</span>
                <span className="font-medium">
                  {preferences.localStorageOnly
                    ? 'Export required'
                    : 'Always accessible'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Backup Status:</span>
                <span className="font-medium">
                  {preferences.localStorageOnly
                    ? 'Manual only'
                    : 'Automatic cloud backup'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Summary */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🛡️</span>
            Privacy Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Current Privacy Level */}
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Current Privacy Level
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
                      preferences.localStorageOnly &&
                      !preferences.enableAnalytics &&
                      !preferences.shareUsageData
                        ? 'bg-green-100 text-green-700'
                        : !preferences.enableAnalytics ||
                            preferences.localStorageOnly
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {preferences.localStorageOnly &&
                    !preferences.enableAnalytics &&
                    !preferences.shareUsageData
                      ? '🔒'
                      : !preferences.enableAnalytics ||
                          preferences.localStorageOnly
                        ? '🛡️'
                        : '📊'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {preferences.localStorageOnly &&
                    !preferences.enableAnalytics &&
                    !preferences.shareUsageData
                      ? 'Maximum Privacy'
                      : !preferences.enableAnalytics ||
                          preferences.localStorageOnly
                        ? 'Enhanced Privacy'
                        : 'Standard Privacy'}
                  </div>
                  <div className="text-xs text-soft-gray">
                    {preferences.localStorageOnly &&
                    !preferences.enableAnalytics &&
                    !preferences.shareUsageData
                      ? 'Complete local control'
                      : !preferences.enableAnalytics ||
                          preferences.localStorageOnly
                        ? 'Minimal data sharing'
                        : 'Balanced privacy & features'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Privacy Actions */}
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Quick Privacy Setup
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onUpdate({
                      localStorageOnly: true,
                      enableAnalytics: false,
                      shareUsageData: false,
                      enablePublicProfile: false,
                      shareConsultationInsights: false,
                      dataRetentionMonths: 6,
                    })
                  }
                  className="w-full rounded-md bg-green-600 px-3 py-2 text-xs text-white hover:bg-green-700"
                >
                  🔒 Maximum Privacy
                </button>
                <button
                  onClick={() =>
                    onUpdate({
                      localStorageOnly: false,
                      enableAnalytics: false,
                      enableCrashReporting: true,
                      shareUsageData: false,
                      enablePublicProfile: false,
                      shareConsultationInsights: false,
                      dataRetentionMonths: 12,
                    })
                  }
                  className="w-full rounded-md bg-yellow-600 px-3 py-2 text-xs text-white hover:bg-yellow-700"
                >
                  🛡️ Balanced Privacy
                </button>
                <button
                  onClick={() =>
                    onUpdate({
                      localStorageOnly: false,
                      enableAnalytics: true,
                      enableCrashReporting: true,
                      shareUsageData: true,
                      shareConsultationInsights: true,
                      dataRetentionMonths: 24,
                    })
                  }
                  className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700"
                >
                  📊 Help Improve App
                </button>
              </div>
            </div>
          </div>

          {/* Data Rights */}
          <div className="mt-4 rounded-lg border-l-4 border-flowing-water bg-flowing-water/5 p-3">
            <h5 className="mb-2 text-sm font-medium text-mountain-stone">
              Your Data Rights 您的数据权利
            </h5>
            <div className="space-y-1 text-xs text-soft-gray">
              <div className="flex items-start">
                <span className="mr-2 mt-0.5">📥</span>
                <span>
                  <strong>Export:</strong> Download all your data at any time
                  through the export feature
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 mt-0.5">🗑️</span>
                <span>
                  <strong>Delete:</strong> Remove your account and all
                  associated data permanently
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 mt-0.5">✏️</span>
                <span>
                  <strong>Modify:</strong> Update or correct any personal
                  information
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 mt-0.5">🔍</span>
                <span>
                  <strong>Transparency:</strong> See exactly what data is
                  collected and how it&apos;s used
                </span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="/privacy-policy"
                className="rounded-md bg-flowing-water px-2 py-1 text-xs text-white hover:bg-flowing-water/80"
              >
                Full Privacy Policy
              </a>
              <a
                href="/export"
                className="rounded-md bg-mountain-stone px-2 py-1 text-xs text-white hover:bg-mountain-stone/80"
              >
                Export My Data
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
