'use client';

import { PerformancePreferences } from '@/types/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Select from '@/components/ui/Select';
import Slider from '@/components/ui/Slider';

interface PerformancePreferencesPanelProps {
  preferences: PerformancePreferences;
  onUpdate: (updates: Partial<PerformancePreferences>) => void;
}

export function PerformancePreferencesPanel({
  preferences,
  onUpdate,
}: PerformancePreferencesPanelProps) {
  const getPerformanceModeDescription = (mode: string) => {
    switch (mode) {
      case 'eco':
        return 'Optimize for battery life and minimal resource usage';
      case 'balanced':
        return 'Balance performance and efficiency';
      case 'high-quality':
        return 'Prioritize visual quality and responsiveness';
      default:
        return '';
    }
  };

  const getImageQualityDescription = (quality: string) => {
    switch (quality) {
      case 'low':
        return 'Faster loading, less data usage, lower quality';
      case 'medium':
        return 'Balanced quality and performance';
      case 'high':
        return 'Best quality, slower loading, more data usage';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Mode */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🚀</span>
            Performance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Performance Mode 性能模式
            </label>
            <Select
              value={preferences.performanceMode}
              onValueChange={value =>
                onUpdate({
                  performanceMode:
                    value as PerformancePreferences['performanceMode'],
                })
              }
            >
              <option value="eco">🌱 Eco Mode 节能模式</option>
              <option value="balanced">⚖️ Balanced 平衡</option>
              <option value="high-quality">🎯 High Quality 高品质</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getPerformanceModeDescription(preferences.performanceMode)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-md bg-gentle-silver/10 p-2 text-center">
              <div className="font-medium">Eco</div>
              <div className="text-soft-gray">Min CPU/Battery</div>
            </div>
            <div className="rounded-md bg-gentle-silver/10 p-2 text-center">
              <div className="font-medium">Balanced</div>
              <div className="text-soft-gray">Optimal Mix</div>
            </div>
            <div className="rounded-md bg-gentle-silver/10 p-2 text-center">
              <div className="font-medium">High Quality</div>
              <div className="text-soft-gray">Max Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Management */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📦</span>
            Resource Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Image Quality 图像质量
            </label>
            <Select
              value={preferences.imageQuality}
              onValueChange={value =>
                onUpdate({
                  imageQuality: value as PerformancePreferences['imageQuality'],
                })
              }
            >
              <option value="low">📱 Low 低质量</option>
              <option value="medium">🖥️ Medium 中等</option>
              <option value="high">🖼️ High 高质量</option>
            </Select>
            <p className="mt-1 text-xs text-soft-gray">
              {getImageQualityDescription(preferences.imageQuality)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Enable Caching 启用缓存
              </label>
              <p className="text-xs text-soft-gray">
                Cache frequently used content for faster loading
              </p>
            </div>
            <Toggle
              checked={preferences.enableCaching}
              onCheckedChange={checked => onUpdate({ enableCaching: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Preload Content 预加载内容
              </label>
              <p className="text-xs text-soft-gray">
                Load content before it&apos;s needed for smoother experience
              </p>
            </div>
            <Toggle
              checked={preferences.preloadContent}
              onCheckedChange={checked => onUpdate({ preloadContent: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Network & Processing */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🌐</span>
            Network & Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Background Sync 后台同步
              </label>
              <p className="text-xs text-soft-gray">
                Sync data in the background when app is not active
              </p>
            </div>
            <Toggle
              checked={preferences.enableBackgroundSync}
              onCheckedChange={checked =>
                onUpdate({ enableBackgroundSync: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Prefetching 预取数据
              </label>
              <p className="text-xs text-soft-gray">
                Preload next likely content based on usage patterns
              </p>
            </div>
            <Toggle
              checked={preferences.enablePrefetching}
              onCheckedChange={checked =>
                onUpdate({ enablePrefetching: checked })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-mountain-stone">
              Max Concurrent Requests 最大并发请求
            </label>
            <div className="px-3">
              <Slider
                value={preferences.maxConcurrentRequests}
                onValueChange={value =>
                  onUpdate({ maxConcurrentRequests: value })
                }
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-soft-gray">
              <span>Conservative (1)</span>
              <span className="font-medium">
                Current: {preferences.maxConcurrentRequests}
              </span>
              <span>Aggressive (10)</span>
            </div>
            <p className="mt-1 text-xs text-soft-gray">
              Higher values improve speed but increase resource usage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Battery Optimization */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔋</span>
            Battery & Power Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Battery Optimization 电池优化
              </label>
              <p className="text-xs text-soft-gray">
                Reduce CPU usage and background activity on battery power
              </p>
            </div>
            <Toggle
              checked={preferences.enableBatteryOptimization}
              onCheckedChange={checked =>
                onUpdate({ enableBatteryOptimization: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-mountain-stone">
                Reduced Frame Rate 降低帧率
              </label>
              <p className="text-xs text-soft-gray">
                Limit animations and scroll rate to save battery
              </p>
            </div>
            <Toggle
              checked={preferences.reducedFrameRate}
              onCheckedChange={checked =>
                onUpdate({ reducedFrameRate: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">📊</span>
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Current Settings Impact */}
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Current Settings Impact
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Load Speed</span>
                  <span
                    className={
                      preferences.enableCaching && preferences.preloadContent
                        ? 'text-green-600'
                        : preferences.enableCaching ||
                            preferences.preloadContent
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }
                  >
                    {preferences.enableCaching && preferences.preloadContent
                      ? 'Fast'
                      : preferences.enableCaching || preferences.preloadContent
                        ? 'Medium'
                        : 'Slow'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Battery Usage</span>
                  <span
                    className={
                      preferences.enableBatteryOptimization &&
                      preferences.reducedFrameRate
                        ? 'text-green-600'
                        : preferences.enableBatteryOptimization ||
                            preferences.reducedFrameRate
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }
                  >
                    {preferences.enableBatteryOptimization &&
                    preferences.reducedFrameRate
                      ? 'Low'
                      : preferences.enableBatteryOptimization ||
                          preferences.reducedFrameRate
                        ? 'Medium'
                        : 'High'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data Usage</span>
                  <span
                    className={
                      preferences.imageQuality === 'low' &&
                      !preferences.enablePrefetching
                        ? 'text-green-600'
                        : preferences.imageQuality === 'medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }
                  >
                    {preferences.imageQuality === 'low' &&
                    !preferences.enablePrefetching
                      ? 'Low'
                      : preferences.imageQuality === 'medium'
                        ? 'Medium'
                        : 'High'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-lg border border-gentle-silver p-3">
              <h4 className="mb-2 text-sm font-medium text-mountain-stone">
                Recommendations
              </h4>
              <div className="space-y-2 text-xs text-soft-gray">
                {preferences.performanceMode === 'eco' && (
                  <div className="flex items-start">
                    <span className="mr-1">🌱</span>
                    <span>Eco mode active - battery optimized</span>
                  </div>
                )}
                {preferences.maxConcurrentRequests > 5 && (
                  <div className="flex items-start">
                    <span className="mr-1">⚠️</span>
                    <span>High concurrent requests may impact battery</span>
                  </div>
                )}
                {preferences.imageQuality === 'high' &&
                  !preferences.enableCaching && (
                    <div className="flex items-start">
                      <span className="mr-1">💡</span>
                      <span>Enable caching with high quality images</span>
                    </div>
                  )}
                {!preferences.enableBatteryOptimization &&
                  preferences.performanceMode !== 'high-quality' && (
                    <div className="flex items-start">
                      <span className="mr-1">🔋</span>
                      <span>Consider enabling battery optimization</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
