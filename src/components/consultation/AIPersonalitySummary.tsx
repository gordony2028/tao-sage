'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  analyzeAIPersonality,
  getPersonalityIndicator,
  type AIPersonalityProfile,
} from '@/lib/ai/personality-analysis';
import type { Consultation } from '@/lib/supabase/consultations';

interface AIPersonalitySummaryProps {
  consultations: Consultation[];
}

export default function AIPersonalitySummary({
  consultations,
}: AIPersonalitySummaryProps) {
  const personalityAnalysis = useMemo(() => {
    if (consultations.length === 0) return null;

    // Analyze each consultation's AI personality
    const analyses = consultations.map(consultation => {
      const profile = analyzeAIPersonality(consultation.interpretation);
      const indicator = getPersonalityIndicator(profile);
      return {
        consultationId: consultation.id,
        profile,
        indicator,
        date: consultation.created_at,
      };
    });

    // Count archetypes
    const archetypeCounts = analyses.reduce(
      (counts, analysis) => {
        const archetype = analysis.indicator.archetype;
        counts[archetype] = (counts[archetype] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>
    );

    // Calculate overall personality trends
    const overallTrends = analyses.reduce(
      (trends, analysis) => {
        const profile = analysis.profile;

        // Aggregate style trends
        trends.tones[profile.style.tone] =
          (trends.tones[profile.style.tone] || 0) + 1;
        trends.formality[profile.style.formality] =
          (trends.formality[profile.style.formality] || 0) + 1;
        trends.depth[profile.style.depth] =
          (trends.depth[profile.style.depth] || 0) + 1;

        // Aggregate tradition emphasis
        Object.entries(profile.tradition).forEach(([tradition, score]) => {
          trends.tradition[tradition] =
            (trends.tradition[tradition] || 0) + score;
        });

        // Aggregate themes
        profile.themes.emphasis.forEach(theme => {
          trends.themes[theme] = (trends.themes[theme] || 0) + 1;
        });

        return trends;
      },
      {
        tones: {} as Record<string, number>,
        formality: {} as Record<string, number>,
        depth: {} as Record<string, number>,
        tradition: {} as Record<string, number>,
        themes: {} as Record<string, number>,
      }
    );

    // Get evolution over time (compare first half vs second half)
    const midpoint = Math.floor(analyses.length / 2);
    const firstHalf = analyses.slice(0, midpoint);
    const secondHalf = analyses.slice(midpoint);

    const getAverageEmpathy = (group: typeof analyses) => {
      return group.length > 0
        ? group.reduce((sum, a) => sum + a.profile.resonance.empathy, 0) /
            group.length
        : 0;
    };

    const evolution = {
      empathyChange:
        getAverageEmpathy(secondHalf) - getAverageEmpathy(firstHalf),
      archetypeShift:
        secondHalf.length > 0 && firstHalf.length > 0
          ? {
              from: firstHalf[firstHalf.length - 1]?.indicator.archetype,
              to: secondHalf[0]?.indicator.archetype,
            }
          : null,
    };

    return {
      total: analyses.length,
      archetypeCounts,
      overallTrends,
      evolution,
      recentArchetype: analyses[0]?.indicator, // Most recent consultation
      analyses,
    };
  }, [consultations]);

  if (!personalityAnalysis || personalityAnalysis.total === 0) {
    return null;
  }

  const { archetypeCounts, overallTrends, evolution, recentArchetype } =
    personalityAnalysis;

  // Get top archetypes
  const topArchetypes = Object.entries(archetypeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Get top themes
  const topThemes = Object.entries(overallTrends.themes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Get dominant tradition
  const dominantTradition = Object.entries(overallTrends.tradition).sort(
    ([, a], [, b]) => b - a
  )[0];

  const formatPercentage = (value: number, total: number) =>
    Math.round((value / total) * 100);

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          AI Personality Journey
        </CardTitle>
        <p className="text-sm text-soft-gray">
          Discover how the AI has adapted its wisdom style across your{' '}
          {personalityAnalysis.total} consultations
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Recent AI Style */}
        {recentArchetype && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Current AI Style
            </h3>
            <div className="flex items-center gap-3 rounded-lg bg-gentle-silver/10 p-3">
              <div
                className={`h-10 w-10 rounded-full bg-gradient-to-br ${recentArchetype.color} 
                              flex items-center justify-center`}
              >
                <span className="text-sm font-bold text-white">
                  {recentArchetype.character}
                </span>
              </div>
              <div>
                <p className="font-medium capitalize text-mountain-stone">
                  {recentArchetype.archetype}
                </p>
                <p className="text-xs text-soft-gray">
                  {recentArchetype.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Personality Distribution */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-mountain-stone">
            AI Personality Distribution
          </h3>
          <div className="space-y-2">
            {topArchetypes.map(([archetype, count]) => {
              const percentage = formatPercentage(
                count,
                personalityAnalysis.total
              );
              const indicator = personalityAnalysis.analyses.find(
                a => a.indicator.archetype === archetype
              )?.indicator;

              return (
                <div key={archetype} className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-full bg-gradient-to-br ${
                      indicator?.color ?? 'from-gentle-silver to-soft-gray'
                    } 
                                  flex flex-shrink-0 items-center justify-center`}
                  >
                    <span className="text-xs font-bold text-white">
                      {indicator?.character ?? '?'}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm capitalize text-mountain-stone">
                      {archetype}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gentle-silver/30">
                        <div
                          className="h-full rounded-full bg-flowing-water transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-soft-gray">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wisdom Traditions */}
        {dominantTradition && dominantTradition[1] > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Dominant Wisdom Tradition
            </h3>
            <div className="rounded-lg bg-gentle-silver/10 p-3">
              <p className="mb-1 text-sm font-medium capitalize text-mountain-stone">
                {dominantTradition[0] === 'confucian'
                  ? 'Confucian'
                  : dominantTradition[0] === 'taoist'
                    ? 'Taoist'
                    : dominantTradition[0] === 'buddhist'
                      ? 'Buddhist'
                      : 'Modern'}{' '}
                Influence
              </p>
              <p className="text-xs text-soft-gray">
                The AI frequently draws from{' '}
                {dominantTradition[0] === 'confucian'
                  ? 'Confucian values of virtue and wisdom'
                  : dominantTradition[0] === 'taoist'
                    ? 'Taoist principles of natural flow and balance'
                    : dominantTradition[0] === 'buddhist'
                      ? 'Buddhist insights on mindfulness and compassion'
                      : 'modern psychological and therapeutic approaches'}
              </p>
            </div>
          </div>
        )}

        {/* Top Themes */}
        {topThemes.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-mountain-stone">
              Recurring Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {topThemes.map(([theme, count]) => {
                const percentage = formatPercentage(
                  count,
                  personalityAnalysis.total
                );
                return (
                  <div
                    key={theme}
                    className="flex items-center gap-1 rounded-full bg-gentle-silver/20 px-2 py-1"
                  >
                    <span className="text-xs capitalize text-mountain-stone">
                      {theme}
                    </span>
                    <span className="text-xs text-soft-gray">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evolution Insights */}
        {evolution.empathyChange !== 0 &&
          Math.abs(evolution.empathyChange) > 0.1 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-mountain-stone">
                AI Evolution
              </h3>
              <div className="rounded-lg bg-gentle-silver/10 p-3">
                <p className="mb-1 text-sm text-mountain-stone">
                  {evolution.empathyChange > 0
                    ? '📈 Increasing Empathy'
                    : '📉 More Analytical'}
                </p>
                <p className="text-xs text-soft-gray">
                  Over time, the AI has become{' '}
                  {evolution.empathyChange > 0
                    ? 'more empathetic and emotionally attuned'
                    : 'more analytical and direct'}{' '}
                  in its responses to your questions.
                </p>
              </div>
            </div>
          )}

        {/* Quick Stats */}
        <div className="border-t border-gentle-silver/20 pt-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-flowing-water">
                {personalityAnalysis.total}
              </div>
              <div className="text-xs text-soft-gray">Consultations</div>
            </div>
            <div>
              <div className="text-lg font-bold text-flowing-water">
                {Object.keys(archetypeCounts).length}
              </div>
              <div className="text-xs text-soft-gray">AI Styles</div>
            </div>
            <div>
              <div className="text-lg font-bold text-flowing-water">
                {topThemes.length}
              </div>
              <div className="text-xs text-soft-gray">Main Themes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
