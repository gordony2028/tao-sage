'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface HexagramReading {
  hexagram: {
    number: number;
    name: string;
    chineseName: string;
    lines: number[];
    changingLines: number[];
    upperTrigram?: string;
    lowerTrigram?: string;
  };
  wisdom?: string;
  focus?: string;
  reflection?: string;
  interpretation?: {
    general: string;
    guidance: string;
    cultural: string;
  };
  date?: string;
  timestamp?: string;
}

export default function DailyGuidanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyReading, setDailyReading] = useState<HexagramReading | null>(
    null
  );
  const [reflection, setReflection] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showReflectionInput, setShowReflectionInput] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setError('Please sign in to view your daily guidance');
        setLoading(false);
      }
    };
    getUser();
  }, []);

  // Fetch daily guidance when user is available
  useEffect(() => {
    if (user) {
      fetchDailyGuidance();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setMeditationTimer(seconds => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && meditationTimer !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, meditationTimer]);

  const fetchDailyGuidance = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching daily guidance for user:', user.id);
      const response = await fetch(`/api/guidance/daily?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error:', errorData);
        throw new Error('Failed to fetch daily guidance');
      }

      const data = await response.json();
      const guidance = data.guidance || data;
      setDailyReading(guidance);

      // Generate a simple affirmation based on the hexagram
      const affirmations = [
        `I embrace the wisdom of ${guidance.hexagram.name} today`,
        `The energy of ${guidance.hexagram.name} guides my path`,
        `I am aligned with the flow of ${guidance.hexagram.name}`,
        `Today, I embody the essence of ${guidance.hexagram.name}`,
      ];
      setAffirmation(
        affirmations[Math.floor(Math.random() * affirmations.length)]
      );
    } catch (err) {
      console.error('Error fetching daily guidance:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load daily guidance'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async () => {
    if (!reflection.trim() || !user) return;

    try {
      // Track the reflection submission
      await supabase.from('user_events').insert({
        user_id: user.id,
        event_type: 'daily_reflection_completed',
        event_data: {
          reflection: reflection,
          hexagram_number: dailyReading?.hexagram.number,
          date: new Date().toISOString(),
        },
      });

      setShowReflectionInput(false);
      setReflection('');
      alert('Your reflection has been saved 🙏');
    } catch (error) {
      console.error('Error saving reflection:', error);
      alert('Failed to save reflection. Please try again.');
    }
  };

  const trackMeditationSession = async () => {
    if (meditationTimer < 60 || !user) return; // Minimum 1 minute

    try {
      await supabase.from('user_events').insert({
        user_id: user.id,
        event_type: 'meditation_completed',
        event_data: {
          duration_seconds: meditationTimer,
          hexagram_number: dailyReading?.hexagram.number,
          date: new Date().toISOString(),
        },
      });

      alert(`Meditation session completed: ${formatTime(meditationTimer)} 🧘`);
      setMeditationTimer(0);
    } catch (error) {
      console.error('Error tracking meditation:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHexagramVisualization = (hexagram: any) => {
    // Traditional Chinese characters for trigrams with expanded information
    const trigramNames = {
      '111': {
        name: '乾 Qián',
        element: 'Heaven',
        nature: 'Creative',
        represents: 'Sky, father, leadership',
        direction: 'Northwest',
        season: 'Late autumn',
        meaning: 'Pure yang energy, strength, and creative power',
      },
      '110': {
        name: '兌 Duì',
        element: 'Lake',
        nature: 'Joyful',
        represents: 'Marsh, youngest daughter, communication',
        direction: 'West',
        season: 'Autumn',
        meaning: 'Joy, expression, and pleasurable exchange',
      },
      '101': {
        name: '離 Lí',
        element: 'Fire',
        nature: 'Clinging',
        represents: 'Flame, middle daughter, clarity',
        direction: 'South',
        season: 'Summer',
        meaning: 'Light, beauty, and intelligent attachment',
      },
      '100': {
        name: '震 Zhèn',
        element: 'Thunder',
        nature: 'Arousing',
        represents: 'Storm, eldest son, movement',
        direction: 'East',
        season: 'Spring',
        meaning: 'Sudden movement, awakening, and new beginnings',
      },
      '011': {
        name: '巽 Xùn',
        element: 'Wind',
        nature: 'Gentle',
        represents: 'Breeze, eldest daughter, influence',
        direction: 'Southeast',
        season: 'Late spring',
        meaning: 'Gentle penetration, flexibility, and gradual influence',
      },
      '010': {
        name: '坎 Kǎn',
        element: 'Water',
        nature: 'Abysmal',
        represents: 'Deep water, middle son, danger',
        direction: 'North',
        season: 'Winter',
        meaning: 'Depth, flow, and navigating through difficulties',
      },
      '001': {
        name: '艮 Gèn',
        element: 'Mountain',
        nature: 'Keeping Still',
        represents: 'Peak, youngest son, meditation',
        direction: 'Northeast',
        season: 'Late winter',
        meaning: 'Stillness, boundaries, and inner contemplation',
      },
      '000': {
        name: '坤 Kūn',
        element: 'Earth',
        nature: 'Receptive',
        represents: 'Ground, mother, nurturing',
        direction: 'Southwest',
        season: 'Late summer',
        meaning: 'Pure yin energy, receptivity, and nurturing support',
      },
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
        {/* Main Hexagram - positioned to align with Lower Trigram */}
        <div className="flex justify-center">
          <div className="ml-16 flex w-64 flex-col items-center space-y-2">
            {hexagram.lines.map((line: number, index: number) => {
              const isChanging = hexagram.changingLines.includes(6 - index);
              return (
                <div
                  key={index}
                  className="flex w-full items-center justify-between"
                >
                  {/* Line position number - left aligned */}
                  <span className="w-8 text-center text-xs font-medium text-soft-gray">
                    {6 - index}
                  </span>

                  {/* Hexagram line - centered */}
                  <div className="flex w-28 items-center justify-center">
                    {line === 6 ? (
                      // Old Yin (broken, changing)
                      <div className="flex w-24 gap-1">
                        <div
                          className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
                            isChanging
                              ? 'bg-gradient-to-r from-flowing-water to-bamboo-green shadow-lg'
                              : 'bg-gentle-silver'
                          }`}
                        ></div>
                        <div
                          className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
                            isChanging
                              ? 'bg-gradient-to-r from-flowing-water to-bamboo-green shadow-lg'
                              : 'bg-gentle-silver'
                          }`}
                        ></div>
                      </div>
                    ) : line === 7 ? (
                      // Young Yang (solid)
                      <div className="h-2 w-24 rounded-sm bg-gradient-to-r from-ink-black to-mountain-stone"></div>
                    ) : line === 8 ? (
                      // Young Yin (broken)
                      <div className="flex w-24 gap-1">
                        <div className="h-2 flex-1 rounded-sm bg-gradient-to-r from-ink-black to-mountain-stone"></div>
                        <div className="h-2 flex-1 rounded-sm bg-gradient-to-r from-ink-black to-mountain-stone"></div>
                      </div>
                    ) : (
                      // Old Yang (solid, changing)
                      <div
                        className={`h-2 w-24 rounded-sm transition-all duration-500 ${
                          isChanging
                            ? 'bg-gradient-to-r from-flowing-water to-bamboo-green shadow-lg'
                            : 'bg-gradient-to-r from-ink-black to-mountain-stone'
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Changing indicator - right aligned */}
                  <div className="flex w-24 justify-end">
                    {isChanging && (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-flowing-water"></div>
                        <span className="text-xs font-medium text-flowing-water">
                          Changing
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trigram Breakdown */}
        <div
          className={`grid grid-cols-1 gap-4 ${
            hexagram.changingLines.length > 0
              ? 'md:grid-cols-3'
              : 'md:grid-cols-2'
          } mx-auto max-w-4xl`}
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
              <div className="mb-2 text-sm text-soft-gray">
                {upperTrigramInfo?.element} • {upperTrigramInfo?.nature}
              </div>
              {upperTrigramInfo && (
                <div className="space-y-2">
                  <div className="text-sm text-soft-gray">
                    <strong>Symbolizes:</strong> {upperTrigramInfo.represents}
                  </div>
                  <div className="border-t pt-2 text-sm italic text-soft-gray">
                    {upperTrigramInfo.meaning}
                  </div>
                  <div className="rounded bg-white/50 px-2 py-1 text-sm font-medium text-mountain-stone">
                    Outer influence • Approach to situations
                  </div>
                </div>
              )}
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
              <div className="mb-2 text-sm text-soft-gray">
                {lowerTrigramInfo?.element} • {lowerTrigramInfo?.nature}
              </div>
              {lowerTrigramInfo && (
                <div className="space-y-2">
                  <div className="text-sm text-soft-gray">
                    <strong>Symbolizes:</strong> {lowerTrigramInfo.represents}
                  </div>
                  <div className="border-t pt-2 text-sm italic text-soft-gray">
                    {lowerTrigramInfo.meaning}
                  </div>
                  <div className="rounded bg-white/50 px-2 py-1 text-sm font-medium text-mountain-stone">
                    Inner foundation • Core energy source
                  </div>
                </div>
              )}
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
                <div className="mb-2 text-sm text-soft-gray">
                  Transformation • Dynamic Change
                </div>
                <div className="text-sm text-soft-gray">
                  {hexagram.changingLines.length === 1
                    ? `Line ${hexagram.changingLines[0]} is changing`
                    : `Lines ${hexagram.changingLines.join(', ')} are changing`}
                </div>
                <div className="border-t pt-2 text-sm font-medium text-soft-gray">
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

  if (!dailyReading) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <p className="text-soft-gray">No guidance available</p>
          <Button
            onClick={fetchDailyGuidance}
            variant="outline"
            className="mt-4"
          >
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Hexagram Display */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="space-y-3 text-center">
            <div className="text-4xl font-bold text-ink-black">
              Today&apos;s Hexagram
            </div>
            <div className="text-5xl font-bold text-flowing-water">
              {dailyReading.hexagram.number}
            </div>
            <div className="text-2xl font-semibold text-ink-black">
              {dailyReading.hexagram.chineseName} • {dailyReading.hexagram.name}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Hexagram Visualization */}
          {renderHexagramVisualization(dailyReading.hexagram)}
        </CardContent>
      </Card>

      {/* Interpretation */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            Today&apos;s Wisdom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyReading.wisdom && (
            <div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                Daily Wisdom
              </h4>
              <p className="text-soft-gray">{dailyReading.wisdom}</p>
            </div>
          )}
          {dailyReading.focus && (
            <div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                Today&apos;s Focus
              </h4>
              <p className="text-soft-gray">{dailyReading.focus}</p>
            </div>
          )}
          {dailyReading.reflection && (
            <div>
              <h4 className="mb-2 font-medium text-mountain-stone">
                Reflection Point
              </h4>
              <p className="text-soft-gray">{dailyReading.reflection}</p>
            </div>
          )}
          {dailyReading.interpretation && (
            <>
              {dailyReading.interpretation.general && (
                <div>
                  <h4 className="mb-2 font-medium text-mountain-stone">
                    General Meaning
                  </h4>
                  <p className="text-soft-gray">
                    {dailyReading.interpretation.general}
                  </p>
                </div>
              )}
              {dailyReading.interpretation.guidance && (
                <div>
                  <h4 className="mb-2 font-medium text-mountain-stone">
                    Personal Guidance
                  </h4>
                  <p className="text-soft-gray">
                    {dailyReading.interpretation.guidance}
                  </p>
                </div>
              )}
              {dailyReading.interpretation.cultural && (
                <div>
                  <h4 className="mb-2 font-medium text-mountain-stone">
                    Cultural Insight
                  </h4>
                  <p className="text-soft-gray">
                    {dailyReading.interpretation.cultural}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Daily Affirmation */}
      <Card
        variant="default"
        className="border-bamboo-green/20 bg-bamboo-green/5"
      >
        <CardContent className="py-4 text-center">
          <div className="mb-2 text-sm font-medium text-bamboo-green">
            Daily Affirmation
          </div>
          <p className="text-lg font-medium text-mountain-stone">
            {affirmation}
          </p>
        </CardContent>
      </Card>

      {/* Meditation Timer */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🧘</span>
            Meditation Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4 text-3xl font-bold text-flowing-water">
            {formatTime(meditationTimer)}
          </div>
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setIsTimerActive(!isTimerActive)}
              variant={isTimerActive ? 'secondary' : 'primary'}
            >
              {isTimerActive ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={() => {
                setIsTimerActive(false);
                trackMeditationSession();
              }}
              variant="outline"
              disabled={meditationTimer < 60}
            >
              Complete
            </Button>
            <Button
              onClick={() => {
                setIsTimerActive(false);
                setMeditationTimer(0);
              }}
              variant="ghost"
            >
              Reset
            </Button>
          </div>
          <p className="mt-2 text-xs text-soft-gray">
            Meditate on today&apos;s hexagram for deeper understanding
          </p>
        </CardContent>
      </Card>

      {/* Daily Reflection */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            Daily Reflection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showReflectionInput ? (
            <div className="text-center">
              <p className="mb-4 text-soft-gray">
                Take a moment to reflect on how today&apos;s guidance applies to
                your life
              </p>
              <Button
                onClick={() => setShowReflectionInput(true)}
                variant="outline"
              >
                Write Reflection
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="How does today's hexagram relate to your current situation? What insights have you gained?"
                className="min-h-32 w-full rounded-lg border border-stone-gray/20 bg-paper-white p-3 text-ink-black placeholder:text-soft-gray focus:border-flowing-water focus:outline-none focus:ring-2 focus:ring-flowing-water/20"
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setShowReflectionInput(false);
                    setReflection('');
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveReflection}
                  disabled={!reflection.trim()}
                  variant="primary"
                >
                  Save Reflection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
