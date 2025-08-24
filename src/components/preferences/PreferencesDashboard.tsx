'use client';

import { useState } from 'react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { PreferenceCategory, PREFERENCE_PRESETS } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { AnimationPreferencesPanel } from './panels/AnimationPreferencesPanel';
import { PerformancePreferencesPanel } from './panels/PerformancePreferencesPanel';
import { AccessibilityPreferencesPanel } from './panels/AccessibilityPreferencesPanel';
import { CulturalPreferencesPanel } from './panels/CulturalPreferencesPanel';
import { InterfacePreferencesPanel } from './panels/InterfacePreferencesPanel';
import { PrivacyPreferencesPanel } from './panels/PrivacyPreferencesPanel';

interface PreferencesDashboardProps {
  className?: string;
}

export default function PreferencesDashboard({
  className,
}: PreferencesDashboardProps) {
  const {
    preferences,
    loading,
    error,
    updatePreferences,
    resetToDefaults,
    applyPreset,
    exportPreferences,
    importPreferences,
  } = useUserPreferences();

  const [activeTab, setActiveTab] = useState<PreferenceCategory>('interface');
  const [importData, setImportData] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handlePresetApply = async (
    presetName: keyof typeof PREFERENCE_PRESETS
  ) => {
    try {
      await applyPreset(presetName);
    } catch (err) {
      console.error('Failed to apply preset:', err);
    }
  };

  const handleImport = async () => {
    try {
      await importPreferences(importData);
      setImportData('');
      setShowImportModal(false);
    } catch (err) {
      console.error('Failed to import preferences:', err);
    }
  };

  const handleExport = () => {
    const data = exportPreferences();
    navigator.clipboard.writeText(data);
    setShowExportModal(false);
  };

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

  if (error) {
    return (
      <Card variant="default">
        <CardContent className="p-8 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-4 text-xl font-semibold text-mountain-stone">
            Error Loading Preferences
          </h2>
          <p className="mb-6 text-soft-gray">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tabs = [
    { id: 'interface', label: '界面', icon: '🎨', title: 'Interface & Theme' },
    { id: 'cultural', label: '文化', icon: '🏛️', title: 'Cultural Context' },
    { id: 'animation', label: '动画', icon: '⚡', title: 'Animation & Motion' },
    { id: 'performance', label: '性能', icon: '🚀', title: 'Performance' },
    {
      id: 'accessibility',
      label: '无障碍',
      icon: '♿',
      title: 'Accessibility',
    },
    { id: 'privacy', label: '隐私', icon: '🔒', title: 'Privacy & Data' },
  ];

  return (
    <div className={`container mx-auto px-4 py-8 ${className || ''}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-ink-black">
          个人偏好设置 Personal Preferences
        </h1>
        <p className="text-soft-gray">
          Customize your I Ching experience to align with your spiritual
          practice and accessibility needs.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">⚙️</span>
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Presets */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-mountain-stone">
                  Preset Configurations
                </h3>
                <div className="space-y-2">
                  {Object.keys(PREFERENCE_PRESETS).map(presetName => (
                    <Button
                      key={presetName}
                      onClick={() =>
                        handlePresetApply(
                          presetName as keyof typeof PREFERENCE_PRESETS
                        )
                      }
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <span className="capitalize">
                        {presetName === 'accessibility' && '♿ Accessibility'}
                        {presetName === 'performance' && '🚀 Performance'}
                        {presetName === 'traditional' && '🏛️ Traditional'}
                        {presetName === 'modern' && '🖥️ Modern'}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Data Management */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-mountain-stone">
                  Data Management
                </h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowExportModal(true)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📤 Export Settings
                  </Button>
                  <Button
                    onClick={() => setShowImportModal(true)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📥 Import Settings
                  </Button>
                  <Button
                    onClick={resetToDefaults}
                    variant="outline"
                    className="w-full justify-start text-mountain-stone hover:text-red-600"
                  >
                    🔄 Reset to Defaults
                  </Button>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-mountain-stone">
                  Current Configuration
                </h3>
                <div className="space-y-1 text-sm text-soft-gray">
                  <div>Theme: {preferences.interface.theme}</div>
                  <div>Language: {preferences.cultural.displayLanguage}</div>
                  <div>
                    Performance: {preferences.performance.performanceMode}
                  </div>
                  {preferences.presetName && (
                    <div className="mt-2 rounded-md bg-earth-brown/10 px-2 py-1">
                      Preset:{' '}
                      <span className="capitalize">
                        {preferences.presetName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* System Info */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-mountain-stone">
                  System Info
                </h3>
                <div className="space-y-1 text-sm text-soft-gray">
                  <div>Version: {preferences.version}</div>
                  <div>
                    Updated:{' '}
                    {new Date(preferences.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preference Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as PreferenceCategory)}
        className="w-full"
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PreferenceCategory)}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-flowing-water text-white'
                  : 'bg-gentle-silver/20 text-mountain-stone hover:bg-gentle-silver/30'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="mr-1">{tab.label}</span>
              <span className="text-xs opacity-75">{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'interface' && (
            <InterfacePreferencesPanel
              preferences={preferences.interface}
              onUpdate={updates => updatePreferences('interface', updates)}
            />
          )}
          {activeTab === 'cultural' && (
            <CulturalPreferencesPanel
              preferences={preferences.cultural}
              onUpdate={updates => updatePreferences('cultural', updates)}
            />
          )}
          {activeTab === 'animation' && (
            <AnimationPreferencesPanel
              preferences={preferences.animation}
              onUpdate={updates => updatePreferences('animation', updates)}
            />
          )}
          {activeTab === 'performance' && (
            <PerformancePreferencesPanel
              preferences={preferences.performance}
              onUpdate={updates => updatePreferences('performance', updates)}
            />
          )}
          {activeTab === 'accessibility' && (
            <AccessibilityPreferencesPanel
              preferences={preferences.accessibility}
              onUpdate={updates => updatePreferences('accessibility', updates)}
            />
          )}
          {activeTab === 'privacy' && (
            <PrivacyPreferencesPanel
              preferences={preferences.privacy}
              onUpdate={updates => updatePreferences('privacy', updates)}
            />
          )}
        </div>
      </Tabs>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card variant="default" className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Export Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-soft-gray">
                Your preferences will be copied to your clipboard as JSON data.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  variant="default"
                  className="flex-1"
                >
                  📋 Copy to Clipboard
                </Button>
                <Button
                  onClick={() => setShowExportModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card variant="default" className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Import Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-soft-gray">
                Paste your exported preferences JSON data below:
              </p>
              <textarea
                value={importData}
                onChange={e => setImportData(e.target.value)}
                className="mb-4 w-full rounded-md border border-gentle-silver p-2 text-sm"
                rows={6}
                placeholder="Paste JSON data here..."
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleImport}
                  variant="default"
                  className="flex-1"
                  disabled={!importData.trim()}
                >
                  📥 Import Settings
                </Button>
                <Button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportData('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
