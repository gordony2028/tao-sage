'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { usePerformanceMonitoring } from '@/lib/monitoring/performance';
import type { DailyGuidance } from '@/lib/iching/daily';
import type { AIPersonality } from '@/lib/ai/personalities';
import { AI_PERSONALITIES, selectAIPersonality } from '@/lib/ai/personalities';

interface DailyGuidanceDashboardProps {
  userId: string;
}

interface DailyGuidanceResponse {
  guidance: DailyGuidance;
  accessed_today: boolean;
  streak: number;
}

export default function DailyGuidanceDashboard({
  userId,
}: DailyGuidanceDashboardProps) {
  const [guidance, setGuidance] = useState<DailyGuidanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] =
    useState<AIPersonality | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionComplete, setReflectionComplete] = useState(false);

  const { trackAPIStart, trackAPIEnd, trackInteraction } =
    usePerformanceMonitoring();

  const fetchDailyGuidance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const endpoint = `/api/guidance/daily?user_id=${userId}&timezone=${timezone}`;

      trackAPIStart(endpoint);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch daily guidance');
      }

      const data = await response.json();
      trackAPIEnd(endpoint);
      setGuidance(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load daily guidance'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDailyGuidance();
  }, [userId, fetchDailyGuidance]);

  useEffect(() => {
    if (guidance) {
      // Select AI personality based on today's hexagram
      const personality = selectAIPersonality(
        guidance.guidance.hexagram,
        guidance.guidance.focus
      );
      setSelectedPersonality(personality);
    }
  }, [guidance]);

  const handleReflectionSubmit = async () => {
    if (!guidance || !reflectionText.trim()) return;

    try {
      await fetch('/api/guidance/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action: 'mark_reflection_complete',
          data: {
            hexagram_number: guidance.guidance.hexagram.number,
            reflection_text: reflectionText,
            completion_time: new Date().toISOString(),
          },
        }),
      });

      setReflectionComplete(true);
      setShowReflection(false);
    } catch (error) {
      console.error('Failed to save reflection:', error);
    }
  };

  const handleShareWisdom = async (platform: string) => {
    if (!guidance) return;

    try {
      await fetch('/api/guidance/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          action: 'share_daily_wisdom',
          data: {
            hexagram_number: guidance.guidance.hexagram.number,
            platform,
            type: 'daily_wisdom',
          },
        }),
      });

      // Create shareable text
      const shareText = `Today's I Ching Wisdom:\n\n"${guidance.guidance.wisdom}"\n\n- Hexagram ${guidance.guidance.hexagram.number}: ${guidance.guidance.hexagram.name}\n\nFrom Sage - AI-powered I Ching guidance`;

      if (navigator.share) {
        await navigator.share({
          title: "Today's I Ching Wisdom",
          text: shareText,
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Wisdom copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share wisdom:', error);
    }
  };

  const renderHexagramVisualization = (hexagram: any) => {
    return (
      <div className="flex flex-col items-center space-y-1">
        {hexagram.lines.map((line: number, index: number) => {
          const isChanging = hexagram.changingLines.includes(6 - index);
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex w-16 items-center justify-center">
                {line === 6 ? (
                  // Old Yin (broken, changing)
                  <div className="flex gap-1">
                    <div
                      className={`h-1 w-6 ${
                        isChanging ? 'bg-flowing-water' : 'bg-gentle-silver'
                      }`}
                    ></div>
                    <div
                      className={`h-1 w-6 ${
                        isChanging ? 'bg-flowing-water' : 'bg-gentle-silver'
                      }`}
                    ></div>
                  </div>
                ) : line === 7 ? (
                  // Young Yang (solid)
                  <div className="h-1 w-14 bg-ink-black"></div>
                ) : line === 8 ? (
                  // Young Yin (broken)
                  <div className="flex gap-1">
                    <div className="h-1 w-6 bg-ink-black"></div>
                    <div className="h-1 w-6 bg-ink-black"></div>
                  </div>
                ) : (
                  // Old Yang (solid, changing)
                  <div
                    className={`h-1 w-14 ${
                      isChanging ? 'bg-flowing-water' : 'bg-gentle-silver'
                    }`}
                  ></div>
                )}
              </div>
              {isChanging && (
                <span className="text-xs font-medium text-flowing-water">
                  Changing
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-flowing-water"></div>
        <p className="text-soft-gray">Loading today&apos;s guidance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            Failed to Load Daily Guidance
          </h3>
          <p className="mb-4 text-soft-gray">{error}</p>
          <Button onClick={fetchDailyGuidance} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!guidance) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with Streak */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌅</span>
                Today&apos;s Guidance
              </CardTitle>
              <p className="text-sm text-soft-gray">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-2xl font-bold text-flowing-water">
                    {guidance.streak}
                  </div>
                  <div className="text-xs text-soft-gray">day streak</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {guidance.accessed_today && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">
                ✅ You&apos;ve already accessed your daily guidance today! Keep
                your streak going tomorrow.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hexagram Display */}
      <Card variant="default">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Hexagram Visualization */}
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-flowing-water text-2xl font-bold text-white">
                  {guidance.guidance.hexagram.number}
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold text-ink-black">
                {guidance.guidance.hexagram.name}
              </h2>
              <div className="mb-4">
                {renderHexagramVisualization(guidance.guidance.hexagram)}
              </div>
            </div>

            {/* AI Personality & Focus */}
            <div className="space-y-4">
              {selectedPersonality && (
                <div className="rounded-lg bg-gentle-silver/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">{selectedPersonality.emoji}</span>
                    <div>
                      <h3 className="font-medium text-mountain-stone">
                        {selectedPersonality.name}
                      </h3>
                      <p className="text-xs text-soft-gray">
                        Your AI guide for today
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-soft-gray">
                    {selectedPersonality.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-medium text-mountain-stone">
                  Today&apos;s Focus
                </h3>
                <p className="rounded-lg bg-flowing-water/10 p-3 text-sm font-medium text-flowing-water">
                  {guidance.guidance.focus}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wisdom & Reflection */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Today&apos;s Wisdom</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="mb-4 border-l-4 border-flowing-water pl-4 text-lg italic text-gentle-silver">
            &quot;{guidance.guidance.wisdom}&quot;
          </blockquote>

          <div className="mb-6">
            <h3 className="mb-2 font-medium text-mountain-stone">
              Reflection Question
            </h3>
            <p className="text-soft-gray">{guidance.guidance.reflection}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                trackInteraction('toggle-reflection');
                setShowReflection(!showReflection);
              }}
              variant={reflectionComplete ? 'default' : 'outline'}
            >
              {reflectionComplete ? '✅ Reflected' : '📝 Reflect'}
            </Button>
            <Button
              onClick={() => {
                trackInteraction('share-wisdom');
                handleShareWisdom('general');
              }}
              variant="outline"
              size="sm"
            >
              🔗 Share Wisdom
            </Button>
          </div>

          {/* Reflection Input */}
          {showReflection && (
            <div className="mt-4 space-y-3 border-t border-stone-gray/20 pt-4">
              <textarea
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Write your thoughts and insights about today's wisdom..."
                className="min-h-[100px] w-full rounded-lg border border-stone-gray/30 p-3 text-sm focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/50"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    trackInteraction('submit-reflection');
                    handleReflectionSubmit();
                  }}
                  disabled={!reflectionText.trim()}
                  size="sm"
                >
                  Save Reflection
                </Button>
                <Button
                  onClick={() => {
                    trackInteraction('cancel-reflection');
                    setShowReflection(false);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
