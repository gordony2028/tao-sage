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
  const [showMeditation, setShowMeditation] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes default
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0);

  const { trackAPIStart, trackAPIEnd, trackInteraction } =
    usePerformanceMonitoring();

  // Meditation timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meditationActive && meditationTimeLeft > 0) {
      interval = setInterval(() => {
        setMeditationTimeLeft(time => {
          if (time <= 1) {
            setMeditationActive(false);
            // Optional: Play a gentle sound or notification
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [meditationActive, meditationTimeLeft]);

  const fetchDailyGuidance = useCallback(async () => {
    // Guard: Don't make API calls if userId is undefined
    if (!userId) {
      setLoading(false);
      setError('User ID is required');
      return;
    }

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
  }, [userId, trackAPIStart, trackAPIEnd]);

  useEffect(() => {
    if (userId) {
      fetchDailyGuidance();
    }
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

  const startMeditation = () => {
    setMeditationTimeLeft(meditationTime);
    setMeditationActive(true);
    trackInteraction('start-meditation');
  };

  const stopMeditation = () => {
    setMeditationActive(false);
    setMeditationTimeLeft(0);
    trackInteraction('stop-meditation');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHexagramVisualization = (hexagram: any) => {
    // Traditional Chinese characters for trigrams
    const trigramNames = {
      '111': { name: '乾 Qián', element: 'Heaven', nature: 'Creative' },
      '110': { name: '兌 Duì', element: 'Lake', nature: 'Joyful' },
      '101': { name: '離 Lí', element: 'Fire', nature: 'Clinging' },
      '100': { name: '震 Zhèn', element: 'Thunder', nature: 'Arousing' },
      '011': { name: '巽 Xùn', element: 'Wind', nature: 'Gentle' },
      '010': { name: '坎 Kǎn', element: 'Water', nature: 'Abysmal' },
      '001': { name: '艮 Gèn', element: 'Mountain', nature: 'Keeping Still' },
      '000': { name: '坤 Kūn', element: 'Earth', nature: 'Receptive' },
    };

    // Convert lines to trigrams
    const upperTrigram = hexagram.lines
      .slice(0, 3)
      .map((line: number) => (line === 7 || line === 9 ? '1' : '0'))
      .join('');
    const lowerTrigram = hexagram.lines
      .slice(3, 6)
      .map((line: number) => (line === 7 || line === 9 ? '1' : '0'))
      .join('');

    const upperTrigramInfo =
      trigramNames[upperTrigram as keyof typeof trigramNames];
    const lowerTrigramInfo =
      trigramNames[lowerTrigram as keyof typeof trigramNames];

    return (
      <div className="space-y-6">
        {/* Main Hexagram */}
        <div className="flex flex-col items-center space-y-2">
          {hexagram.lines.map((line: number, index: number) => {
            const isChanging = hexagram.changingLines.includes(6 - index);
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex w-20 items-center justify-center">
                  {line === 6 ? (
                    // Old Yin (broken, changing)
                    <div className="flex gap-1">
                      <div
                        className={`h-2 w-8 rounded-sm transition-all duration-500 ${
                          isChanging
                            ? 'bg-gradient-to-r from-flowing-water to-bamboo-green shadow-lg'
                            : 'bg-gentle-silver'
                        }`}
                      ></div>
                      <div
                        className={`h-2 w-8 rounded-sm transition-all duration-500 ${
                          isChanging
                            ? 'bg-gradient-to-r from-flowing-water to-bamboo-green shadow-lg'
                            : 'bg-gentle-silver'
                        }`}
                      ></div>
                    </div>
                  ) : line === 7 ? (
                    // Young Yang (solid)
                    <div className="h-2 w-20 rounded-sm bg-gradient-to-r from-ink-black to-mountain-stone"></div>
                  ) : line === 8 ? (
                    // Young Yin (broken)
                    <div className="flex gap-1">
                      <div className="h-2 w-8 rounded-sm bg-gradient-to-r from-ink-black to-mountain-stone"></div>
                      <div className="h-2 w-8 rounded-sm bg-gradient-to-r from-ink-black to-mountain-stone"></div>
                    </div>
                  ) : (
                    // Old Yang (solid, changing)
                    <div
                      className={`h-2 w-20 rounded-sm transition-all duration-500 ${
                        isChanging
                          ? 'bg-gradient-to-r from-flowing-water to-bamboo-green shadow-lg'
                          : 'bg-gradient-to-r from-ink-black to-mountain-stone'
                      }`}
                    ></div>
                  )}
                </div>
                {isChanging && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-flowing-water"></div>
                    <span className="text-xs font-medium text-flowing-water">
                      Changing
                    </span>
                  </div>
                )}
                {/* Line position number */}
                <span className="w-8 text-center text-xs text-soft-gray">
                  {6 - index}
                </span>
              </div>
            );
          })}
        </div>

        {/* Trigram Breakdown */}
        <div
          className={`grid grid-cols-1 gap-4 ${
            hexagram.changingLines.length > 0
              ? 'md:grid-cols-3'
              : 'md:grid-cols-2'
          }`}
        >
          {/* Upper Trigram */}
          <div className="text-center">
            <div className="mb-2 text-sm font-medium text-mountain-stone">
              Upper Trigram
            </div>
            <div className="rounded-lg bg-gentle-silver/10 p-3">
              <div className="mb-2 text-lg font-bold text-ink-black">
                {upperTrigramInfo?.name || upperTrigram}
              </div>
              <div className="text-xs text-soft-gray">
                {upperTrigramInfo?.element} • {upperTrigramInfo?.nature}
              </div>
            </div>
          </div>

          {/* Lower Trigram */}
          <div className="text-center">
            <div className="mb-2 text-sm font-medium text-mountain-stone">
              Lower Trigram
            </div>
            <div className="rounded-lg bg-gentle-silver/10 p-3">
              <div className="mb-2 text-lg font-bold text-ink-black">
                {lowerTrigramInfo?.name || lowerTrigram}
              </div>
              <div className="text-xs text-soft-gray">
                {lowerTrigramInfo?.element} • {lowerTrigramInfo?.nature}
              </div>
            </div>
          </div>

          {/* Changing Lines Explanation - Only show when there are changing lines */}
          {hexagram.changingLines.length > 0 && (
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-mountain-stone">
                Changing Lines
              </div>
              <div className="rounded-lg bg-gentle-silver/10 p-3">
                <div className="mb-2 text-lg font-bold text-flowing-water">
                  變 Biàn
                </div>
                <div className="mb-2 text-xs text-soft-gray">
                  Transformation • Dynamic Change
                </div>
                <div className="text-xs text-soft-gray">
                  {hexagram.changingLines.length === 1
                    ? `Line ${hexagram.changingLines[0]} is changing`
                    : `Lines ${hexagram.changingLines.join(', ')} are changing`}
                </div>
                <div className="mt-2 text-xs font-medium text-soft-gray">
                  Focus on areas of transition and emerging potential
                </div>
              </div>
            </div>
          )}
        </div>
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

      {/* Ancient Wisdom Quote */}
      <Card variant="default">
        <CardContent className="pt-6">
          <div className="mb-6 text-center">
            <div className="mb-3 text-2xl">📜</div>
            <h3 className="mb-4 text-lg font-medium text-mountain-stone">
              Ancient Wisdom
            </h3>
            <blockquote className="relative text-base italic text-gentle-silver">
              <span className="absolute -left-2 -top-2 text-3xl text-flowing-water opacity-50">
                &ldquo;
              </span>
              {guidance.guidance.wisdom}
              <span className="absolute -bottom-4 -right-2 text-3xl text-flowing-water opacity-50">
                &rdquo;
              </span>
            </blockquote>
            <p className="mt-4 text-xs text-soft-gray">
              — Traditional I Ching Wisdom
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Guidance Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Practical Application */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Today&apos;s Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="mb-1 font-medium text-mountain-stone">
                  Morning Intention
                </h4>
                <p className="text-sm text-soft-gray">
                  Begin your day by embodying the essence of{' '}
                  {guidance.guidance.hexagram.name}. Focus on{' '}
                  {guidance.guidance.focus.toLowerCase()}.
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-mountain-stone">
                  Key Actions
                </h4>
                <ul className="space-y-1 text-sm text-soft-gray">
                  <li>• Observe moments of change throughout your day</li>
                  <li>• Practice mindful decision-making</li>
                  <li>• Stay open to unexpected opportunities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Context */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              Seasonal Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="mb-1 font-medium text-mountain-stone">
                  Current Phase
                </h4>
                <p className="text-sm text-soft-gray">
                  {new Date().toLocaleDateString('en-US', { month: 'long' })}{' '}
                  brings energy of
                  {new Date().getMonth() < 3 || new Date().getMonth() > 10
                    ? ' reflection and inner growth'
                    : new Date().getMonth() < 6
                      ? ' renewal and expansion'
                      : new Date().getMonth() < 9
                        ? ' abundance and activity'
                        : ' harvest and preparation'}
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-mountain-stone">
                  Alignment
                </h4>
                <p className="text-sm text-soft-gray">
                  Today&apos;s hexagram harmonizes with the natural rhythm of
                  this season, encouraging balanced action and mindful
                  awareness.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deep Reflection Section */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🤔</span>
            Reflection & Contemplation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                Today&apos;s Question
              </h4>
              <p className="mb-4 text-soft-gray">
                {guidance.guidance.reflection}
              </p>
            </div>

            <div className="rounded-lg bg-flowing-water/5 p-4">
              <h4 className="mb-2 font-medium text-mountain-stone">
                Additional Contemplations
              </h4>
              <ul className="space-y-2 text-sm text-soft-gray">
                <li>
                  • How can I embody the qualities of{' '}
                  {guidance.guidance.hexagram.name} today?
                </li>
                <li>• What patterns of change am I noticing in my life?</li>
                <li>• Where can I practice greater acceptance and flow?</li>
                <li>• What wisdom is this moment trying to teach me?</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                trackInteraction('toggle-reflection');
                setShowReflection(!showReflection);
              }}
              variant={reflectionComplete ? 'default' : 'outline'}
              size="sm"
            >
              {reflectionComplete ? '✅ Reflected' : '📝 Reflect'}
            </Button>

            <Button
              onClick={() => {
                trackInteraction('toggle-meditation');
                setShowMeditation(!showMeditation);
              }}
              variant="outline"
              size="sm"
            >
              🧘 Meditate
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

          {/* Meditation Timer */}
          {showMeditation && (
            <div className="mt-6 space-y-4 border-t border-stone-gray/20 pt-6">
              <div className="text-center">
                <h4 className="mb-4 font-medium text-mountain-stone">
                  🧘 Mindful Meditation with {guidance.guidance.hexagram.name}
                </h4>

                {!meditationActive ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-mountain-stone">
                        Meditation Duration
                      </label>
                      <div className="flex justify-center gap-2">
                        {[180, 300, 600, 900].map(duration => (
                          <button
                            key={duration}
                            onClick={() => setMeditationTime(duration)}
                            className={`rounded-md px-3 py-1 text-sm transition-colors ${
                              meditationTime === duration
                                ? 'bg-flowing-water text-white'
                                : 'bg-gentle-silver/20 text-soft-gray hover:bg-gentle-silver/30'
                            }`}
                          >
                            {duration / 60}min
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={startMeditation} className="w-full">
                      Start Meditation ({formatTime(meditationTime)})
                    </Button>

                    <p className="text-xs text-soft-gray">
                      Focus on the qualities of{' '}
                      {guidance.guidance.hexagram.name}:
                      {selectedPersonality?.description.toLowerCase()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative mx-auto h-32 w-32">
                      <div className="absolute inset-0 rounded-full border-4 border-gentle-silver/20"></div>
                      <div
                        className="absolute inset-0 animate-spin rounded-full border-4 border-flowing-water border-t-transparent"
                        style={{
                          animation: 'spin 2s linear infinite',
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-flowing-water">
                            {formatTime(meditationTimeLeft)}
                          </div>
                          <div className="text-xs text-soft-gray">
                            remaining
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-center text-sm text-soft-gray">
                        Breathe deeply and reflect on today&apos;s wisdom...
                      </p>
                      <Button
                        onClick={stopMeditation}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        End Meditation
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
