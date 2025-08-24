'use client';

import { AccessibilityPreferences } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Select from '@/components/ui/Select';
import Slider from '@/components/ui/Slider';

interface AccessibilityPreferencesPanelProps {
  preferences: AccessibilityPreferences;
  onUpdate: (updates: Partial<AccessibilityPreferences>) => void;
}

export function AccessibilityPreferencesPanel({
  preferences,
  onUpdate,
}: AccessibilityPreferencesPanelProps) {
  const getFontSizeDescription = (size: string) => {
    switch (size) {
      case 'small':
        return '14px - Compact text for more content';
      case 'medium':
        return '16px - Standard readable size';
      case 'large':
        return '18px - Enhanced readability';
      case 'extra-large':
        return '20px - Maximum accessibility';
      default:
        return '';
    }
  };

  const getFontFamilyDescription = (family: string) => {
    switch (family) {
      case 'system':
        return 'Use system default fonts';
      case 'serif':
        return 'Traditional serif fonts (Times, etc.)';
      case 'sans-serif':
        return 'Modern sans-serif fonts (Arial, etc.)';
      case 'dyslexic-friendly':
        return 'Optimized for dyslexia (OpenDyslexic)';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Accessibility */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">👁️</span>
            Visual Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                High Contrast Mode 高对比度模式
              </label>
              <p className="text-xs text-soft-gray">
                Enhance color contrast for better visibility
              </p>
            </div>
            <Toggle
              checked={preferences.highContrast}
              onCheckedChange={checked => onUpdate({ highContrast: checked })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Font Size 字体大小
            </label>
            <Select
              value={preferences.fontSize}
              onValueChange={value =>
                onUpdate({
                  fontSize: value as AccessibilityPreferences['fontSize'],
                })
              }
            >
              <option value="small">Small 小 (14px)</option>
              <option value="medium">Medium 中 (16px)</option>
              <option value="large">Large 大 (18px)</option>
              <option value="extra-large">Extra Large 特大 (20px)</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getFontSizeDescription(preferences.fontSize)}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Font Family 字体族
            </label>
            <Select
              value={preferences.fontFamily}
              onValueChange={value =>
                onUpdate({
                  fontFamily: value as AccessibilityPreferences['fontFamily'],
                })
              }
            >
              <option value="system">System Default 系统默认</option>
              <option value="serif">Serif 衬线字体</option>
              <option value="sans-serif">Sans-serif 无衬线字体</option>
              <option value="dyslexic-friendly">
                Dyslexic Friendly 阅读障碍友好
              </option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getFontFamilyDescription(preferences.fontFamily)}
            </p>
          </div>

          {/* Font Preview */}
          <div className="rounded-lg border border-gentle-silver p-4">
            <h4 className="mb-2 text-sm font-medium text-mountain-stone">
              Font Preview 字体预览
            </h4>
            <div
              className={`${
                preferences.highContrast
                  ? 'bg-black text-white'
                  : 'bg-gentle-silver/10 text-ink-black'
              } rounded-md p-3 transition-all`}
              style={{
                fontSize:
                  preferences.fontSize === 'small'
                    ? '14px'
                    : preferences.fontSize === 'large'
                      ? '18px'
                      : preferences.fontSize === 'extra-large'
                        ? '20px'
                        : '16px',
                fontFamily:
                  preferences.fontFamily === 'serif'
                    ? 'serif'
                    : preferences.fontFamily === 'sans-serif'
                      ? 'sans-serif'
                      : preferences.fontFamily === 'dyslexic-friendly'
                        ? 'OpenDyslexic, sans-serif'
                        : 'system-ui',
              }}
            >
              <p>
                The I Ching (易經) is a fundamental text in Chinese philosophy
                and divination.
              </p>
              <p className="mt-2">易經是中國哲學和占卜的基本文本。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motor Accessibility */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🤝</span>
            Motor & Interaction Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Larger Touch Targets 更大的触摸目标
              </label>
              <p className="text-xs text-soft-gray">
                Make buttons and interactive elements easier to tap
              </p>
            </div>
            <Toggle
              checked={!preferences.reducedTouchTargets}
              onCheckedChange={checked =>
                onUpdate({ reducedTouchTargets: !checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Extended Timeouts 延长超时时间
              </label>
              <p className="text-xs text-soft-gray">
                Give more time for interactions and form completion
              </p>
            </div>
            <Toggle
              checked={preferences.extendedTimeouts}
              onCheckedChange={checked =>
                onUpdate({ extendedTimeouts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Sticky Hover States 持久悬停状态
              </label>
              <p className="text-xs text-soft-gray">
                Keep hover states active longer for easier interaction
              </p>
            </div>
            <Toggle
              checked={preferences.stickyHover}
              onCheckedChange={checked => onUpdate({ stickyHover: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Accessibility */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🧠</span>
            Cognitive Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Simplified Interface 简化界面
              </label>
              <p className="text-xs text-soft-gray">
                Hide advanced features and reduce cognitive load
              </p>
            </div>
            <Toggle
              checked={preferences.simplifiedInterface}
              onCheckedChange={checked =>
                onUpdate({ simplifiedInterface: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Enable Tooltips 启用工具提示
              </label>
              <p className="text-xs text-soft-gray">
                Show helpful explanations when hovering over elements
              </p>
            </div>
            <Toggle
              checked={preferences.enableTooltips}
              onCheckedChange={checked => onUpdate({ enableTooltips: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Show Progress Indicators 显示进度指示器
              </label>
              <p className="text-xs text-soft-gray">
                Display progress bars and status updates for clarity
              </p>
            </div>
            <Toggle
              checked={preferences.showProgress}
              onCheckedChange={checked => onUpdate({ showProgress: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Accessibility */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔊</span>
            Audio Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Enable Sound Effects 启用音效
              </label>
              <p className="text-xs text-soft-gray">
                Play sounds for interactions and notifications
              </p>
            </div>
            <Toggle
              checked={preferences.enableSoundEffects}
              onCheckedChange={checked =>
                onUpdate({ enableSoundEffects: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Audio Descriptions 音频描述
              </label>
              <p className="text-xs text-soft-gray">
                Provide audio descriptions for visual content
              </p>
            </div>
            <Toggle
              checked={preferences.enableAudioDescriptions}
              onCheckedChange={checked =>
                onUpdate({ enableAudioDescriptions: checked })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Sound Volume 音量 ({preferences.soundVolume}%)
            </label>
            <div className="px-3">
              <Slider
                value={preferences.soundVolume}
                onValueChange={value => onUpdate({ soundVolume: value })}
                min={0}
                max={100}
                step={5}
                className="w-full"
                disabled={!preferences.enableSoundEffects}
              />
            </div>
            <div className="flex justify-between text-xs text-soft-gray">
              <span>Mute (0%)</span>
              <span>Max (100%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Summary */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📋</span>
            Accessibility Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Current Accessibility Level */}
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Current Accessibility Level
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span>Visual Support</span>
                  <span
                    className={
                      preferences.highContrast ||
                      preferences.fontSize === 'large' ||
                      preferences.fontSize === 'extra-large'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }
                  >
                    {preferences.highContrast ||
                    preferences.fontSize === 'large' ||
                    preferences.fontSize === 'extra-large'
                      ? 'Enhanced'
                      : 'Standard'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Motor Support</span>
                  <span
                    className={
                      !preferences.reducedTouchTargets ||
                      preferences.extendedTimeouts
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }
                  >
                    {!preferences.reducedTouchTargets ||
                    preferences.extendedTimeouts
                      ? 'Enhanced'
                      : 'Standard'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cognitive Support</span>
                  <span
                    className={
                      preferences.simplifiedInterface ||
                      preferences.enableTooltips
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }
                  >
                    {preferences.simplifiedInterface ||
                    preferences.enableTooltips
                      ? 'Enhanced'
                      : 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* WCAG Compliance */}
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                WCAG 2.1 Compliance
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-start">
                  <span
                    className={`mr-2 mt-0.5 ${
                      preferences.highContrast
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {preferences.highContrast ? '✅' : '⚠️'}
                  </span>
                  <div>
                    <div className="font-medium">Contrast (AA)</div>
                    <div className="text-soft-gray">
                      {preferences.highContrast
                        ? 'Enhanced contrast active'
                        : 'Standard contrast'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span
                    className={`mr-2 mt-0.5 ${
                      preferences.fontSize === 'large' ||
                      preferences.fontSize === 'extra-large'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {preferences.fontSize === 'large' ||
                    preferences.fontSize === 'extra-large'
                      ? '✅'
                      : '⚠️'}
                  </span>
                  <div>
                    <div className="font-medium">Resize Text (AA)</div>
                    <div className="text-soft-gray">
                      {preferences.fontSize === 'large' ||
                      preferences.fontSize === 'extra-large'
                        ? 'Large text enabled'
                        : 'Standard text size'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span
                    className={`mr-2 mt-0.5 ${
                      preferences.enableTooltips
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {preferences.enableTooltips ? '✅' : '⚠️'}
                  </span>
                  <div>
                    <div className="font-medium">Help (AAA)</div>
                    <div className="text-soft-gray">
                      {preferences.enableTooltips
                        ? 'Contextual help enabled'
                        : 'Limited help'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 rounded-lg bg-flowing-water/10 p-3">
            <h5 className="mb-2 text-sm font-medium text-mountain-stone">
              Quick Accessibility Setup
            </h5>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  onUpdate({
                    highContrast: true,
                    fontSize: 'large',
                    enableTooltips: true,
                    simplifiedInterface: true,
                  })
                }
                className="rounded-md bg-flowing-water px-3 py-1 text-xs text-white hover:bg-flowing-water/80"
              >
                ♿ Full Accessibility
              </button>
              <button
                onClick={() =>
                  onUpdate({
                    fontSize: 'large',
                    enableTooltips: true,
                    extendedTimeouts: true,
                  })
                }
                className="rounded-md bg-earth-brown px-3 py-1 text-xs text-white hover:bg-earth-brown/80"
              >
                👁️ Vision Support
              </button>
              <button
                onClick={() =>
                  onUpdate({
                    reducedTouchTargets: false,
                    extendedTimeouts: true,
                    stickyHover: true,
                  })
                }
                className="rounded-md bg-mountain-stone px-3 py-1 text-xs text-white hover:bg-mountain-stone/80"
              >
                🤝 Motor Support
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
