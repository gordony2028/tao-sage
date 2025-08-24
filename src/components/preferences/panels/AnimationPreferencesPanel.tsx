'use client';

import { AnimationPreferences } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Select from '@/components/ui/Select';

interface AnimationPreferencesPanelProps {
  preferences: AnimationPreferences;
  onUpdate: (updates: Partial<AnimationPreferences>) => void;
}

export function AnimationPreferencesPanel({
  preferences,
  onUpdate,
}: AnimationPreferencesPanelProps) {
  return (
    <div className="space-y-6">
      {/* General Animation Settings */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">⚡</span>
            General Animation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Enable Animations 启用动画
              </label>
              <p className="text-xs text-soft-gray">
                Master switch for all animations and transitions
              </p>
            </div>
            <Toggle
              checked={preferences.enableAnimations}
              onCheckedChange={checked =>
                onUpdate({ enableAnimations: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Reduce Motion 减少动画
              </label>
              <p className="text-xs text-soft-gray">
                Minimize motion for users with vestibular sensitivity
              </p>
            </div>
            <Toggle
              checked={preferences.reduceMotion}
              onCheckedChange={checked => onUpdate({ reduceMotion: checked })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Animation Speed 动画速度
            </label>
            <Select
              value={preferences.animationSpeed}
              onValueChange={value =>
                onUpdate({
                  animationSpeed:
                    value as AnimationPreferences['animationSpeed'],
                })
              }
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            >
              <option value="slow">🐌 Slow 慢</option>
              <option value="normal">🚶 Normal 正常</option>
              <option value="fast">🏃 Fast 快</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              Adjust the overall speed of animations and transitions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Specific Animation Types */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🎭</span>
            Specific Animation Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Coin Casting Animation 投币动画
              </label>
              <p className="text-xs text-soft-gray">
                Animated coin flips during I Ching consultations
              </p>
            </div>
            <Toggle
              checked={preferences.coinCasting}
              onCheckedChange={checked => onUpdate({ coinCasting: checked })}
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Hexagram Transitions 卦象转换
              </label>
              <p className="text-xs text-soft-gray">
                Smooth transitions when hexagrams change or transform
              </p>
            </div>
            <Toggle
              checked={preferences.hexagramTransitions}
              onCheckedChange={checked =>
                onUpdate({ hexagramTransitions: checked })
              }
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Page Transitions 页面转换
              </label>
              <p className="text-xs text-soft-gray">
                Animated transitions between different pages
              </p>
            </div>
            <Toggle
              checked={preferences.pageTransitions}
              onCheckedChange={checked =>
                onUpdate({ pageTransitions: checked })
              }
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Loading Animations 加载动画
              </label>
              <p className="text-xs text-soft-gray">
                Spinning icons and progress indicators
              </p>
            </div>
            <Toggle
              checked={preferences.loadingAnimations}
              onCheckedChange={checked =>
                onUpdate({ loadingAnimations: checked })
              }
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Hover Effects 悬停效果
              </label>
              <p className="text-xs text-soft-gray">
                Subtle animations when hovering over interactive elements
              </p>
            </div>
            <Toggle
              checked={preferences.hoverEffects}
              onCheckedChange={checked => onUpdate({ hoverEffects: checked })}
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Cultural Animations */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🏮</span>
            Cultural & Traditional Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Traditional Effects 传统效果
              </label>
              <p className="text-xs text-soft-gray">
                Zen-like fading, traditional brush strokes, calligraphy effects
              </p>
            </div>
            <Toggle
              checked={preferences.traditionalEffects}
              onCheckedChange={checked =>
                onUpdate({ traditionalEffects: checked })
              }
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Particle Effects 粒子效果
              </label>
              <p className="text-xs text-soft-gray">
                Flowing water, falling leaves, coin particles during casting
              </p>
            </div>
            <Toggle
              checked={preferences.particleEffects}
              onCheckedChange={checked =>
                onUpdate({ particleEffects: checked })
              }
              disabled={
                !preferences.enableAnimations || preferences.reduceMotion
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Animation Preview */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🎬</span>
            Animation Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Sample Coin Animation */}
            <div className="rounded-lg border border-gentle-silver p-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Coin Casting Preview
              </h4>
              <div className="flex justify-center">
                <div
                  className={`bg-warm-yellow h-12 w-12 rounded-full border-2 border-earth-brown ${
                    preferences.enableAnimations &&
                    preferences.coinCasting &&
                    !preferences.reduceMotion
                      ? preferences.animationSpeed === 'fast'
                        ? 'animate-spin'
                        : preferences.animationSpeed === 'slow'
                          ? 'animate-pulse'
                          : 'animate-bounce'
                      : ''
                  } flex items-center justify-center text-earth-brown`}
                  style={{
                    animationDuration:
                      preferences.animationSpeed === 'fast'
                        ? '0.7s'
                        : preferences.animationSpeed === 'slow'
                          ? '2s'
                          : '1s',
                  }}
                >
                  ☯
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-soft-gray">
                {preferences.enableAnimations &&
                preferences.coinCasting &&
                !preferences.reduceMotion
                  ? 'Animation active'
                  : 'Animation disabled'}
              </p>
            </div>

            {/* Sample Traditional Effect */}
            <div className="rounded-lg border border-gentle-silver p-4">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Traditional Effects Preview
              </h4>
              <div className="from-warm-yellow relative h-16 overflow-hidden rounded-md bg-gradient-to-r to-gentle-silver">
                {preferences.enableAnimations &&
                  preferences.traditionalEffects &&
                  !preferences.reduceMotion && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${
                        preferences.animationSpeed === 'fast'
                          ? 'animate-pulse'
                          : 'animate-pulse'
                      }`}
                      style={{
                        animationDuration:
                          preferences.animationSpeed === 'fast'
                            ? '1s'
                            : preferences.animationSpeed === 'slow'
                              ? '3s'
                              : '2s',
                      }}
                    />
                  )}
                <div className="absolute inset-0 flex items-center justify-center text-earth-brown">
                  易經
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-soft-gray">
                {preferences.enableAnimations &&
                preferences.traditionalEffects &&
                !preferences.reduceMotion
                  ? 'Traditional effects active'
                  : 'Traditional effects disabled'}
              </p>
            </div>
          </div>

          {/* Animation Performance Impact */}
          <div className="mt-4 rounded-lg bg-earth-brown/5 p-3">
            <h5 className="mb-1 text-sm font-medium text-mountain-stone">
              Performance Impact
            </h5>
            <div className="text-xs text-soft-gray">
              <div>
                Battery Impact:{' '}
                {preferences.enableAnimations &&
                (preferences.particleEffects || preferences.traditionalEffects)
                  ? 'Higher'
                  : preferences.enableAnimations
                    ? 'Medium'
                    : 'Minimal'}
              </div>
              <div>
                CPU Usage:{' '}
                {preferences.enableAnimations && preferences.particleEffects
                  ? 'Higher'
                  : preferences.enableAnimations
                    ? 'Low'
                    : 'Minimal'}
              </div>
              <div className="mt-1 italic">
                {preferences.reduceMotion &&
                  'Reduced motion mode overrides individual settings for accessibility.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
