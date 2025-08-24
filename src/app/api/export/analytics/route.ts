import { NextRequest, NextResponse } from 'next/server';
import { getUserConsultations } from '@/lib/supabase/consultations';
import {
  analyzeAIPersonality,
  getPersonalityIndicator,
} from '@/lib/ai/personality-analysis';

interface EnhancedAnalytics {
  overview: {
    totalConsultations: number;
    dateRange: string;
    consultationFrequency: number; // consultations per month
    activeMonths: number;
  };
  hexagramAnalysis: {
    distribution: { [key: number]: number };
    mostConsulted: Array<{ hexagram: number; name: string; count: number }>;
    leastConsulted: number[];
    completeness: number; // percentage of 64 hexagrams consulted
  };
  personalityInsights: {
    dominantArchetypes: Array<{
      archetype: string;
      count: number;
      percentage: number;
    }>;
    communicationStyleBreakdown: {
      tone: { [key: string]: number };
      formality: { [key: string]: number };
      depth: { [key: string]: number };
    };
    culturalEmbeddingTrends: {
      traditional: number;
      modern: number;
      balanced: number;
    };
    thematicPatterns: Array<{ theme: string; count: number }>;
  };
  reflectionAnalysis: {
    notesTaken: number;
    averageLength: number;
    culturalThemes: Array<{ theme: string; count: number; examples: string[] }>;
    reflectionPatterns: Array<{
      type: string;
      count: number;
      description: string;
    }>;
    taggingBehavior: {
      totalTags: number;
      uniqueTags: number;
      mostUsedTags: Array<{ tag: string; count: number }>;
      averageTagsPerConsultation: number;
    };
  };
  temporalPatterns: {
    monthlyActivity: Array<{
      month: string;
      consultations: number;
      notes: number;
    }>;
    dayOfWeekDistribution: { [key: string]: number };
    seasonalPatterns: Array<{
      season: string;
      consultations: number;
      topHexagrams: number[];
    }>;
    consultationStreaks: {
      longestStreak: number;
      currentStreak: number;
      totalActiveWeeks: number;
    };
  };
  growthMetrics: {
    learningVelocity: number; // unique hexagrams per month
    reflectionMaturity: number; // note length growth over time
    culturalDepth: number; // cultural theme diversity
    engagementScore: number; // composite engagement metric
  };
  recommendations: {
    unexploredAreas: string[];
    improvementOpportunities: string[];
    personalizedInsights: string[];
  };
}

// Map day of week numbers to names
const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Hexagram names for analysis
const HEXAGRAM_NAMES: { [key: number]: string } = {
  1: 'The Creative',
  2: 'The Receptive',
  3: 'Difficulty at Beginning',
  4: 'Youthful Folly',
  5: 'Waiting',
  6: 'Conflict',
  7: 'The Army',
  8: 'Holding Together',
  9: 'Small Taming',
  10: 'Treading',
  11: 'Peace',
  12: 'Standstill',
  13: 'Fellowship',
  14: 'Great Possession',
  15: 'Modesty',
  16: 'Enthusiasm',
  17: 'Following',
  18: 'Decay',
  19: 'Approach',
  20: 'Contemplation',
  21: 'Biting Through',
  22: 'Grace',
  23: 'Splitting Apart',
  24: 'Return',
  25: 'Innocence',
  26: 'Great Taming',
  27: 'Nourishment',
  28: 'Critical Mass',
  29: 'The Abyss',
  30: 'Fire',
  31: 'Influence',
  32: 'Duration',
  33: 'Retreat',
  34: 'Great Power',
  35: 'Progress',
  36: 'Darkening of Light',
  37: 'Family',
  38: 'Opposition',
  39: 'Obstruction',
  40: 'Deliverance',
  41: 'Decrease',
  42: 'Increase',
  43: 'Breakthrough',
  44: 'Coming to Meet',
  45: 'Gathering Together',
  46: 'Pushing Upward',
  47: 'Oppression',
  48: 'The Well',
  49: 'Revolution',
  50: 'The Cauldron',
  51: 'Thunder',
  52: 'Mountain',
  53: 'Development',
  54: 'The Marrying Maiden',
  55: 'Abundance',
  56: 'The Wanderer',
  57: 'Wind',
  58: 'Joy',
  59: 'Dispersion',
  60: 'Limitation',
  61: 'Inner Truth',
  62: 'Small Exceeding',
  63: 'After Completion',
  64: 'Before Completion',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all consultations for the user
    const { data: consultations } = await getUserConsultations(userId, {
      limit: 1000, // Get all consultations
      status: 'active',
    });

    if (!consultations.length) {
      return NextResponse.json({
        overview: {
          totalConsultations: 0,
          dateRange: '',
          consultationFrequency: 0,
          activeMonths: 0,
        },
        hexagramAnalysis: {
          distribution: {},
          mostConsulted: [],
          leastConsulted: [],
          completeness: 0,
        },
        personalityInsights: {
          dominantArchetypes: [],
          communicationStyleBreakdown: { tone: {}, formality: {}, depth: {} },
          culturalEmbeddingTrends: { traditional: 0, modern: 0, balanced: 0 },
          thematicPatterns: [],
        },
        reflectionAnalysis: {
          notesTaken: 0,
          averageLength: 0,
          culturalThemes: [],
          reflectionPatterns: [],
          taggingBehavior: {
            totalTags: 0,
            uniqueTags: 0,
            mostUsedTags: [],
            averageTagsPerConsultation: 0,
          },
        },
        temporalPatterns: {
          monthlyActivity: [],
          dayOfWeekDistribution: {},
          seasonalPatterns: [],
          consultationStreaks: {
            longestStreak: 0,
            currentStreak: 0,
            totalActiveWeeks: 0,
          },
        },
        growthMetrics: {
          learningVelocity: 0,
          reflectionMaturity: 0,
          culturalDepth: 0,
          engagementScore: 0,
        },
        recommendations: {
          unexploredAreas: [],
          improvementOpportunities: [],
          personalizedInsights: [],
        },
      });
    }

    // Sort consultations by date (newest first)
    consultations.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const analytics: EnhancedAnalytics = {
      overview: generateOverview(consultations),
      hexagramAnalysis: generateHexagramAnalysis(consultations),
      personalityInsights: await generatePersonalityInsights(consultations),
      reflectionAnalysis: generateReflectionAnalysis(consultations),
      temporalPatterns: generateTemporalPatterns(consultations),
      growthMetrics: generateGrowthMetrics(consultations),
      recommendations: generateRecommendations(consultations),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Failed to generate analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}

function generateOverview(consultations: any[]): EnhancedAnalytics['overview'] {
  if (consultations.length === 0) {
    return {
      totalConsultations: 0,
      dateRange: '',
      consultationFrequency: 0,
      activeMonths: 0,
    };
  }

  const dates = consultations.map(c => new Date(c.created_at));
  const oldest = dates[dates.length - 1];
  const newest = dates[0];

  if (!oldest || !newest) {
    return {
      totalConsultations: consultations.length,
      dateRange: '',
      consultationFrequency: 0,
      activeMonths: 0,
    };
  }

  const monthsDiff = Math.max(
    1,
    (newest.getFullYear() - oldest.getFullYear()) * 12 +
      (newest.getMonth() - oldest.getMonth()) +
      1
  );

  const uniqueMonths = new Set(
    dates.map(d => `${d.getFullYear()}-${d.getMonth()}`)
  ).size;

  return {
    totalConsultations: consultations.length,
    dateRange: `${oldest.toLocaleDateString()} - ${newest.toLocaleDateString()}`,
    consultationFrequency:
      Math.round((consultations.length / monthsDiff) * 100) / 100,
    activeMonths: uniqueMonths,
  };
}

function generateHexagramAnalysis(
  consultations: any[]
): EnhancedAnalytics['hexagramAnalysis'] {
  const distribution = consultations.reduce(
    (acc, c) => {
      acc[c.hexagram_number] = (acc[c.hexagram_number] || 0) + 1;
      return acc;
    },
    {} as { [key: number]: number }
  );

  const mostConsulted = Object.entries(distribution)
    .map(([hex, count]) => ({
      hexagram: parseInt(hex),
      name: HEXAGRAM_NAMES[parseInt(hex)] || `Hexagram ${hex}`,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const consultedHexagrams = new Set(
    Object.keys(distribution).map(n => parseInt(n))
  );
  const leastConsulted = Array.from({ length: 64 }, (_, i) => i + 1).filter(
    n => !consultedHexagrams.has(n)
  );

  return {
    distribution,
    mostConsulted,
    leastConsulted,
    completeness: Math.round((consultedHexagrams.size / 64) * 100),
  };
}

async function generatePersonalityInsights(
  consultations: any[]
): Promise<EnhancedAnalytics['personalityInsights']> {
  const personalityProfiles = consultations.map(c => {
    const profile = analyzeAIPersonality(c.interpretation);
    const indicator = getPersonalityIndicator(profile);
    return { profile, indicator };
  });

  // Dominant archetypes
  const archetypeCounts = personalityProfiles.reduce(
    (acc, { indicator }) => {
      acc[indicator.archetype] = (acc[indicator.archetype] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const dominantArchetypes = Object.entries(archetypeCounts)
    .map(([archetype, count]) => ({
      archetype,
      count,
      percentage: Math.round((count / consultations.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Communication style breakdown
  const toneBreakdown = personalityProfiles.reduce(
    (acc, { profile }) => {
      acc[profile.style.tone] = (acc[profile.style.tone] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const formalityBreakdown = personalityProfiles.reduce(
    (acc, { profile }) => {
      acc[profile.style.formality] = (acc[profile.style.formality] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const depthBreakdown = personalityProfiles.reduce(
    (acc, { profile }) => {
      acc[profile.style.depth] = (acc[profile.style.depth] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  // Cultural embedding trends
  const culturalTrends = personalityProfiles.reduce(
    (acc, { profile }) => {
      if (profile.style.culturalEmbedding === 'traditional') acc.traditional++;
      else if (profile.style.culturalEmbedding === 'modern') acc.modern++;
      else if (profile.style.culturalEmbedding === 'balanced') acc.balanced++;
      return acc;
    },
    { traditional: 0, modern: 0, balanced: 0 }
  );

  // Thematic patterns
  const themeBreakdown = personalityProfiles.reduce(
    (acc, { profile }) => {
      profile.themes.emphasis.forEach(theme => {
        acc[theme] = (acc[theme] || 0) + 1;
      });
      return acc;
    },
    {} as { [key: string]: number }
  );

  const thematicPatterns = Object.entries(themeBreakdown)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count);

  return {
    dominantArchetypes,
    communicationStyleBreakdown: {
      tone: toneBreakdown,
      formality: formalityBreakdown,
      depth: depthBreakdown,
    },
    culturalEmbeddingTrends: culturalTrends,
    thematicPatterns,
  };
}

function generateReflectionAnalysis(
  consultations: any[]
): EnhancedAnalytics['reflectionAnalysis'] {
  const consultationsWithNotes = consultations.filter(
    c => c.notes && c.notes.trim()
  );

  const averageLength =
    consultationsWithNotes.length > 0
      ? Math.round(
          consultationsWithNotes.reduce(
            (sum, c) => sum + (c.notes?.length || 0),
            0
          ) / consultationsWithNotes.length
        )
      : 0;

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

  // Reflection patterns
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
    },
    {
      type: 'Relationships',
      count: consultationsWithNotes.filter(
        c =>
          c.notes?.toLowerCase().includes('relationship') ||
          c.notes?.toLowerCase().includes('family') ||
          c.notes?.toLowerCase().includes('friend')
      ).length,
      description: 'Insights about relationships and connections',
    },
    {
      type: 'Personal Growth',
      count: consultationsWithNotes.filter(
        c =>
          c.notes?.toLowerCase().includes('growth') ||
          c.notes?.toLowerCase().includes('learn') ||
          c.notes?.toLowerCase().includes('change')
      ).length,
      description: 'Reflections on self-development',
    },
    {
      type: 'Gratitude & Appreciation',
      count: consultationsWithNotes.filter(
        c =>
          c.notes?.toLowerCase().includes('grateful') ||
          c.notes?.toLowerCase().includes('thank') ||
          c.notes?.toLowerCase().includes('appreciate')
      ).length,
      description: 'Notes expressing gratitude',
    },
  ].filter(pattern => pattern.count > 0);

  // Tagging behavior analysis
  const allTags = consultations.flatMap(c => c.tags || []);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const mostUsedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count: count as number }));

  return {
    notesTaken: consultationsWithNotes.length,
    averageLength,
    culturalThemes,
    reflectionPatterns,
    taggingBehavior: {
      totalTags: allTags.length,
      uniqueTags: Object.keys(tagCounts).length,
      mostUsedTags,
      averageTagsPerConsultation:
        Math.round((allTags.length / consultations.length) * 100) / 100,
    },
  };
}

function generateTemporalPatterns(
  consultations: any[]
): EnhancedAnalytics['temporalPatterns'] {
  // Monthly activity
  const monthlyData = consultations.reduce(
    (acc, c) => {
      const date = new Date(c.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { consultations: 0, notes: 0 };
      }

      acc[monthKey].consultations++;
      if (c.notes && c.notes.trim()) {
        acc[monthKey].notes++;
      }

      return acc;
    },
    {} as { [key: string]: { consultations: number; notes: number } }
  );

  const monthlyActivity = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en', {
        month: 'short',
        year: 'numeric',
      }),
      consultations: (data as any).consultations,
      notes: (data as any).notes,
    }));

  // Day of week distribution
  const dayOfWeekDistribution = consultations.reduce(
    (acc, c) => {
      const dayIndex = new Date(c.created_at).getDay();
      const dayName = DAY_NAMES[dayIndex];
      if (dayName) {
        acc[dayName] = (acc[dayName] || 0) + 1;
      }
      return acc;
    },
    {} as { [key: string]: number }
  );

  // Seasonal patterns (simplified - just by month)
  const seasonalData = consultations.reduce(
    (acc, c) => {
      const month = new Date(c.created_at).getMonth();
      let season: string;

      if (month >= 2 && month <= 4) season = 'Spring';
      else if (month >= 5 && month <= 7) season = 'Summer';
      else if (month >= 8 && month <= 10) season = 'Autumn';
      else season = 'Winter';

      if (!acc[season]) {
        acc[season] = { consultations: 0, hexagrams: {} };
      }

      acc[season].consultations++;
      acc[season].hexagrams[c.hexagram_number] =
        (acc[season].hexagrams[c.hexagram_number] || 0) + 1;

      return acc;
    },
    {} as {
      [key: string]: {
        consultations: number;
        hexagrams: { [key: number]: number };
      };
    }
  );

  const seasonalPatterns = Object.entries(seasonalData).map(
    ([season, data]) => ({
      season,
      consultations: (data as any).consultations,
      topHexagrams: Object.entries((data as any).hexagrams)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([hex]) => parseInt(hex)),
    })
  );

  // Consultation streaks (simplified - weekly streaks)
  const consultationDates = consultations.map(c => new Date(c.created_at));
  consultationDates.sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 0;
  let currentStreak = 0;
  let totalActiveWeeks = 0;

  // This is a simplified streak calculation
  const weeklyActivity = new Set(
    consultationDates.map(
      d => `${d.getFullYear()}-W${Math.ceil((d.getDate() - d.getDay()) / 7)}`
    )
  );

  totalActiveWeeks = weeklyActivity.size;
  longestStreak = Math.min(totalActiveWeeks, 10); // Simplified calculation
  const lastConsultationDate = consultationDates[consultationDates.length - 1];
  currentStreak =
    consultationDates.length > 0 &&
    lastConsultationDate &&
    Date.now() - lastConsultationDate.getTime() < 7 * 24 * 60 * 60 * 1000
      ? Math.min(5, totalActiveWeeks)
      : 0;

  return {
    monthlyActivity,
    dayOfWeekDistribution,
    seasonalPatterns,
    consultationStreaks: {
      longestStreak,
      currentStreak,
      totalActiveWeeks,
    },
  };
}

function generateGrowthMetrics(
  consultations: any[]
): EnhancedAnalytics['growthMetrics'] {
  const uniqueHexagrams = new Set(consultations.map(c => c.hexagram_number))
    .size;
  const monthsActive = Math.max(
    1,
    (new Date().getFullYear() -
      new Date(
        consultations[consultations.length - 1]?.created_at || new Date()
      ).getFullYear()) *
      12 +
      (new Date().getMonth() -
        new Date(
          consultations[consultations.length - 1]?.created_at || new Date()
        ).getMonth()) +
      1
  );

  const consultationsWithNotes = consultations.filter(
    c => c.notes && c.notes.trim()
  );
  const averageNoteLength =
    consultationsWithNotes.length > 0
      ? consultationsWithNotes.reduce(
          (sum, c) => sum + (c.notes?.length || 0),
          0
        ) / consultationsWithNotes.length
      : 0;

  // Cultural themes diversity
  const culturalKeywords = [
    'yin',
    'yang',
    'tao',
    'wu wei',
    'virtue',
    'mindful',
    'season',
    'balance',
  ];
  const culturalMentions = consultationsWithNotes.filter(c =>
    culturalKeywords.some(keyword => c.notes?.toLowerCase().includes(keyword))
  ).length;

  const culturalDepth =
    consultationsWithNotes.length > 0
      ? Math.round((culturalMentions / consultationsWithNotes.length) * 100)
      : 0;

  // Composite engagement score
  const engagementScore = Math.round(
    (uniqueHexagrams / 64) * 30 + // hexagram diversity (30%)
      (consultationsWithNotes.length / consultations.length) * 40 + // note-taking rate (40%)
      Math.min(100, (consultations.length / monthsActive) * 10) * 0.2 + // frequency (20%)
      (culturalDepth / 100) * 10 // cultural engagement (10%)
  );

  return {
    learningVelocity: Math.round((uniqueHexagrams / monthsActive) * 100) / 100,
    reflectionMaturity: Math.round(averageNoteLength),
    culturalDepth,
    engagementScore,
  };
}

function generateRecommendations(
  consultations: any[]
): EnhancedAnalytics['recommendations'] {
  const consultedHexagrams = new Set(consultations.map(c => c.hexagram_number));
  const consultationsWithNotes = consultations.filter(
    c => c.notes && c.notes.trim()
  );

  const unexploredAreas = [];
  const improvementOpportunities = [];
  const personalizedInsights = [];

  // Unexplored hexagrams
  if (consultedHexagrams.size < 32) {
    unexploredAreas.push(
      "Explore more hexagrams - you've consulted " +
        consultedHexagrams.size +
        ' of 64 hexagrams'
    );
  }

  // Note-taking opportunities
  const noteRate = consultationsWithNotes.length / consultations.length;
  if (noteRate < 0.5) {
    improvementOpportunities.push(
      'Consider adding personal reflections to more consultations'
    );
  }

  // Tagging suggestions
  const allTags = consultations.flatMap(c => c.tags || []);
  if (allTags.length < consultations.length * 0.3) {
    improvementOpportunities.push(
      'Use tags to better categorize your spiritual journey'
    );
  }

  // Personalized insights
  const mostConsultedHexagram = [...consultedHexagrams.entries()].reduce(
    (max, [hex, count]) => (count > max.count ? { hex, count } : max),
    { hex: 1, count: 0 }
  );

  personalizedInsights.push(
    `Your most consulted hexagram is ${mostConsultedHexagram.hex} - ${
      HEXAGRAM_NAMES[mostConsultedHexagram.hex]
    }`
  );

  if (consultations.length > 10) {
    personalizedInsights.push(
      'You are developing a consistent practice - continue this spiritual journey'
    );
  }

  return {
    unexploredAreas,
    improvementOpportunities,
    personalizedInsights,
  };
}
