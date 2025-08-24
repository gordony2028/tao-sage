'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Consultation } from '@/lib/supabase/consultations';

interface NoteTakingAnalyticsProps {
  consultations: Consultation[];
}

interface NoteAnalytics {
  totalNotes: number;
  averageLength: number;
  topTags: { tag: string; count: number }[];
  notesOverTime: { month: string; count: number }[];
  reflectionPatterns: {
    type: string;
    count: number;
    description: string;
    icon: string;
  }[];
  culturalThemes: {
    theme: string;
    count: number;
    examples: string[];
  }[];
}

export default function NoteTakingAnalytics({
  consultations,
}: NoteTakingAnalyticsProps) {
  const analytics = useMemo(() => {
    const consultationsWithNotes = consultations.filter(
      c => c.notes && c.notes.trim()
    );

    if (consultationsWithNotes.length === 0) return null;

    // Calculate basic metrics
    const totalNotes = consultationsWithNotes.length;
    const averageLength = Math.round(
      consultationsWithNotes.reduce(
        (sum, c) => sum + (c.notes?.length || 0),
        0
      ) / totalNotes
    );

    // Analyze tags
    const tagCounts = consultationsWithNotes.reduce(
      (counts, consultation) => {
        consultation.tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
        return counts;
      },
      {} as Record<string, number>
    );

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));

    // Notes over time
    const notesByMonth = consultationsWithNotes.reduce(
      (months, consultation) => {
        const date = new Date(consultation.created_at);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;
        months[monthKey] = (months[monthKey] || 0) + 1;
        return months;
      },
      {} as Record<string, number>
    );

    const notesOverTime = Object.entries(notesByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en', {
          month: 'short',
          year: 'numeric',
        }),
        count,
      }));

    // Detect reflection patterns
    const reflectionPatterns = [
      {
        type: 'Decision Making',
        count: consultationsWithNotes.filter(
          c =>
            c.notes?.toLowerCase().includes('decision') ||
            c.notes?.toLowerCase().includes('choice') ||
            c.notes?.toLowerCase().includes('should i')
        ).length,
        description: 'Notes about decisions and choices',
        icon: '⚖️',
      },
      {
        type: 'Relationships',
        count: consultationsWithNotes.filter(
          c =>
            c.notes?.toLowerCase().includes('relationship') ||
            c.notes?.toLowerCase().includes('family') ||
            c.notes?.toLowerCase().includes('friend') ||
            c.notes?.toLowerCase().includes('partner')
        ).length,
        description: 'Insights about relationships and connections',
        icon: '🫶',
      },
      {
        type: 'Personal Growth',
        count: consultationsWithNotes.filter(
          c =>
            c.notes?.toLowerCase().includes('growth') ||
            c.notes?.toLowerCase().includes('learn') ||
            c.notes?.toLowerCase().includes('change') ||
            c.notes?.toLowerCase().includes('improve')
        ).length,
        description: 'Reflections on self-development',
        icon: '🌱',
      },
      {
        type: 'Gratitude & Appreciation',
        count: consultationsWithNotes.filter(
          c =>
            c.notes?.toLowerCase().includes('grateful') ||
            c.notes?.toLowerCase().includes('thank') ||
            c.notes?.toLowerCase().includes('appreciate') ||
            c.notes?.toLowerCase().includes('blessed')
        ).length,
        description: 'Notes expressing gratitude',
        icon: '🙏',
      },
      {
        type: 'Challenges & Obstacles',
        count: consultationsWithNotes.filter(
          c =>
            c.notes?.toLowerCase().includes('difficult') ||
            c.notes?.toLowerCase().includes('challenge') ||
            c.notes?.toLowerCase().includes('struggle') ||
            c.notes?.toLowerCase().includes('hard')
        ).length,
        description: 'Processing difficulties and obstacles',
        icon: '💪',
      },
      {
        type: 'Spiritual Insights',
        count: consultationsWithNotes.filter(
          c =>
            c.notes?.toLowerCase().includes('spiritual') ||
            c.notes?.toLowerCase().includes('wisdom') ||
            c.notes?.toLowerCase().includes('universe') ||
            c.notes?.toLowerCase().includes('divine')
        ).length,
        description: 'Spiritual and philosophical reflections',
        icon: '✨',
      },
    ]
      .filter(pattern => pattern.count > 0)
      .sort((a, b) => b.count - a.count);

    // Cultural themes analysis
    const culturalKeywords = {
      'Yin-Yang Balance': ['yin', 'yang', 'balance', 'opposite', 'complement'],
      'Five Elements': ['earth', 'water', 'fire', 'metal', 'wood', 'element'],
      'Confucian Values': [
        'virtue',
        'righteousness',
        'harmony',
        'respect',
        'duty',
      ],
      'Taoist Flow': ['flow', 'nature', 'wu wei', 'effortless', 'natural'],
      'Buddhist Mindfulness': [
        'mindful',
        'present',
        'meditation',
        'compassion',
        'awareness',
      ],
      'Seasonal Wisdom': [
        'season',
        'spring',
        'summer',
        'autumn',
        'winter',
        'cycle',
      ],
      'Ancestral Connection': [
        'ancestor',
        'tradition',
        'heritage',
        'family wisdom',
        'generation',
      ],
    };

    const culturalThemes = Object.entries(culturalKeywords)
      .map(([theme, keywords]) => {
        const matchingNotes = consultationsWithNotes.filter(c =>
          keywords.some(keyword => c.notes?.toLowerCase().includes(keyword))
        );

        return {
          theme,
          count: matchingNotes.length,
          examples: matchingNotes
            .slice(0, 2)
            .map(
              c =>
                c.notes?.substring(0, 80) +
                  (c.notes && c.notes.length > 80 ? '...' : '') || ''
            ),
        };
      })
      .filter(theme => theme.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      totalNotes,
      averageLength,
      topTags,
      notesOverTime,
      reflectionPatterns,
      culturalThemes,
    };
  }, [consultations]);

  if (!analytics) {
    return (
      <Card variant="default">
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl opacity-50">📝</div>
          <h3 className="mb-2 text-lg font-medium text-mountain-stone">
            No Reflection Notes Yet
          </h3>
          <p className="text-soft-gray">
            Start adding notes to your consultations to see your wisdom journey
            patterns and insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          Reflection Analytics
        </CardTitle>
        <p className="text-sm text-soft-gray">
          Insights into your note-taking patterns and reflection journey
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-flowing-water">
              {analytics.totalNotes}
            </div>
            <div className="text-xs text-soft-gray">Notes Written</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-flowing-water">
              {analytics.averageLength}
            </div>
            <div className="text-xs text-soft-gray">Avg Characters</div>
          </div>
          <div className="col-span-2 text-center md:col-span-1">
            <div className="text-2xl font-bold text-flowing-water">
              {analytics.topTags.length}
            </div>
            <div className="text-xs text-soft-gray">Unique Tags</div>
          </div>
        </div>

        {/* Notes Over Time */}
        {analytics.notesOverTime.length > 1 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Reflection Activity
            </h3>
            <div className="flex h-20 items-end gap-2">
              {analytics.notesOverTime.map((month, index) => {
                const maxCount = Math.max(
                  ...analytics.notesOverTime.map(m => m.count)
                );
                const height = Math.max((month.count / maxCount) * 100, 10);

                return (
                  <div
                    key={month.month}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div
                      className="min-h-[8px] w-full rounded-t bg-flowing-water transition-all duration-500"
                      style={{ height: `${height}%` }}
                      title={`${month.count} notes in ${month.month}`}
                    />
                    <span className="mt-1 text-center text-xs text-soft-gray">
                      {month.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Tags */}
        {analytics.topTags.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Most Used Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {analytics.topTags.map((tag, index) => (
                <div
                  key={tag.tag}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                    index === 0
                      ? 'bg-flowing-water text-white'
                      : index === 1
                        ? 'bg-bamboo-green text-white'
                        : index === 2
                          ? 'bg-sunset-gold text-white'
                          : 'bg-gentle-silver/20 text-mountain-stone'
                  }`}
                >
                  <span>{tag.tag}</span>
                  <span className="text-xs opacity-80">({tag.count})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reflection Patterns */}
        {analytics.reflectionPatterns.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Reflection Patterns
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {analytics.reflectionPatterns.map(pattern => (
                <div
                  key={pattern.type}
                  className="flex items-center gap-3 rounded-lg bg-gentle-silver/10 p-3"
                >
                  <span className="text-2xl">{pattern.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-mountain-stone">
                      {pattern.type}
                    </div>
                    <div className="text-xs text-soft-gray">
                      {pattern.description}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-flowing-water">
                    {pattern.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cultural Themes */}
        {analytics.culturalThemes.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Cultural Themes in Your Reflections
            </h3>
            <div className="space-y-3">
              {analytics.culturalThemes.slice(0, 5).map(theme => (
                <div
                  key={theme.theme}
                  className="border-l-2 border-earth-brown pl-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-mountain-stone">
                      {theme.theme}
                    </span>
                    <span className="text-sm text-flowing-water">
                      {theme.count} notes
                    </span>
                  </div>
                  {theme.examples.length > 0 && (
                    <div className="space-y-1">
                      {theme.examples.map((example, index) => (
                        <p
                          key={index}
                          className="text-xs italic text-soft-gray"
                        >
                          &ldquo;{example}&rdquo;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        <div className="border-t border-gentle-silver/20 pt-4">
          <div className="text-center">
            <div className="mb-2 text-2xl">🌟</div>
            <p className="text-sm text-mountain-stone">
              Your consistent reflection practice is building wisdom and
              self-awareness.
            </p>
            <p className="mt-1 text-xs text-soft-gray">
              Keep exploring your inner landscape through thoughtful notes and
              cultural insights.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
