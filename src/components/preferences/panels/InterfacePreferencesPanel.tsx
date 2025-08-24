'use client';

import { InterfacePreferences } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Select from '@/components/ui/Select';

interface InterfacePreferencesPanelProps {
  preferences: InterfacePreferences;
  onUpdate: (updates: Partial<InterfacePreferences>) => void;
}

export function InterfacePreferencesPanel({
  preferences,
  onUpdate,
}: InterfacePreferencesPanelProps) {
  return (
    <div className="space-y-6">
      {/* Theme & Appearance */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🎨</span>
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Theme Mode 主题模式
            </label>
            <Select
              value={preferences.theme}
              onValueChange={value =>
                onUpdate({ theme: value as InterfacePreferences['theme'] })
              }
            >
              <option value="light">☀️ Light 明亮</option>
              <option value="dark">🌙 Dark 深色</option>
              <option value="auto">🌗 Auto 自动</option>
              <option value="sepia">📜 Sepia 古典</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              Choose your preferred visual theme. Auto follows system settings.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Color Scheme 色彩方案
            </label>
            <Select
              value={preferences.colorScheme}
              onValueChange={value =>
                onUpdate({
                  colorScheme: value as InterfacePreferences['colorScheme'],
                })
              }
            >
              <option value="default">🎨 Default 默认</option>
              <option value="monochrome">⚫ Monochrome 单色</option>
              <option value="high-contrast">🔲 High Contrast 高对比度</option>
              <option value="warm">🔥 Warm Tones 暖色调</option>
              <option value="cool">❄️ Cool Tones 冷色调</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              Adjust the color palette to suit your preferences.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Layout Preferences */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📐</span>
            Layout & Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Sidebar Position 侧边栏位置
            </label>
            <Select
              value={preferences.sidebarPosition}
              onValueChange={value =>
                onUpdate({
                  sidebarPosition:
                    value as InterfacePreferences['sidebarPosition'],
                })
              }
            >
              <option value="left">⬅️ Left 左侧</option>
              <option value="right">➡️ Right 右侧</option>
              <option value="hidden">👁️‍🗨️ Hidden 隐藏</option>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Compact Mode 紧凑模式
              </label>
              <p className="text-xs text-soft-gray">
                Reduce spacing and padding for more content on screen
              </p>
            </div>
            <Toggle
              checked={preferences.compactMode}
              onCheckedChange={checked => onUpdate({ compactMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Show Labels 显示标签
              </label>
              <p className="text-xs text-soft-gray">
                Display text labels alongside icons
              </p>
            </div>
            <Toggle
              checked={preferences.showLabels}
              onCheckedChange={checked => onUpdate({ showLabels: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Show Breadcrumbs 显示面包屑导航
              </label>
              <p className="text-xs text-soft-gray">
                Show navigation path at the top of pages
              </p>
            </div>
            <Toggle
              checked={preferences.showBreadcrumbs}
              onCheckedChange={checked =>
                onUpdate({ showBreadcrumbs: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Information Density */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📊</span>
            Information Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Information Density 信息密度
            </label>
            <Select
              value={preferences.informationDensity}
              onValueChange={value =>
                onUpdate({
                  informationDensity:
                    value as InterfacePreferences['informationDensity'],
                })
              }
            >
              <option value="minimal">📋 Minimal 最小</option>
              <option value="normal">📄 Normal 正常</option>
              <option value="detailed">📚 Detailed 详细</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              Control how much information is shown at once
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Advanced Features 高级功能
              </label>
              <p className="text-xs text-soft-gray">
                Show expert-level options and advanced controls
              </p>
            </div>
            <Toggle
              checked={preferences.showAdvancedFeatures}
              onCheckedChange={checked =>
                onUpdate({ showAdvancedFeatures: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Interaction Preferences */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🎮</span>
            Interaction Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Keyboard Shortcuts 键盘快捷键
              </label>
              <p className="text-xs text-soft-gray">
                Enable keyboard navigation and shortcuts
              </p>
            </div>
            <Toggle
              checked={preferences.enableKeyboardShortcuts}
              onCheckedChange={checked =>
                onUpdate({ enableKeyboardShortcuts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Touch Gestures 触摸手势
              </label>
              <p className="text-xs text-soft-gray">
                Enable swipe and touch gestures on mobile
              </p>
            </div>
            <Toggle
              checked={preferences.enableGestures}
              onCheckedChange={checked => onUpdate({ enableGestures: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">👀</span>
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border-2 p-4 transition-all ${
              preferences.theme === 'dark'
                ? 'border-mountain-stone bg-ink-black text-gentle-silver'
                : preferences.theme === 'sepia'
                  ? 'bg-warm-yellow border-earth-brown text-earth-brown'
                  : 'border-gentle-silver bg-white text-ink-black'
            } ${preferences.compactMode ? 'p-2' : 'p-4'}`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium ${
                  preferences.informationDensity === 'minimal'
                    ? 'text-sm'
                    : preferences.informationDensity === 'detailed'
                      ? 'text-lg'
                      : 'text-base'
                }`}
              >
                {preferences.showLabels ? '🏮 ' : ''}Sample Interface Preview
              </h3>
              {preferences.sidebarPosition !== 'hidden' && (
                <div className="text-xs opacity-60">
                  Sidebar: {preferences.sidebarPosition}
                </div>
              )}
            </div>
            {preferences.showBreadcrumbs && (
              <div className="mt-2 text-xs opacity-75">
                Home › Preferences › Interface
              </div>
            )}
            <div className="mt-2">
              <p className="text-sm opacity-80">
                This preview reflects your current interface settings.
              </p>
              {preferences.informationDensity === 'detailed' && (
                <p className="mt-1 text-xs opacity-60">
                  Additional details are shown in detailed information density
                  mode.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
