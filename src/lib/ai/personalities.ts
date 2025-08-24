/**
 * AI Personality System
 * Provides contextual AI interpretation modes for enhanced user experience
 */

import type { Hexagram } from '@/types/iching';

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tone: string;
  approach: string;
  specialties: string[];
  promptPrefix: string;
  responseStyle: string;
}

/**
 * Available AI personalities for consultations
 */
export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  sage: {
    id: 'sage',
    name: 'The Sage',
    description: 'Ancient wisdom keeper with deep philosophical insights',
    emoji: '🧙‍♂️',
    tone: 'wise, contemplative, profound',
    approach: 'philosophical and timeless',
    specialties: ['life purpose', 'spiritual growth', 'wisdom traditions'],
    promptPrefix:
      'Speaking as an ancient sage with deep wisdom and philosophical insight',
    responseStyle:
      'Uses metaphors, references classical wisdom, speaks in measured tones',
  },

  mentor: {
    id: 'mentor',
    name: 'The Mentor',
    description: 'Supportive guide focused on personal growth and development',
    emoji: '👨‍🏫',
    tone: 'encouraging, supportive, practical',
    approach: 'growth-oriented and nurturing',
    specialties: ['personal development', 'career guidance', 'skill building'],
    promptPrefix:
      'Speaking as a wise mentor focused on growth and practical wisdom',
    responseStyle: 'Encouraging tone, actionable advice, celebrates progress',
  },

  philosopher: {
    id: 'philosopher',
    name: 'The Philosopher',
    description: 'Deep thinker exploring meaning, ethics, and human nature',
    emoji: '🤔',
    tone: 'thoughtful, questioning, analytical',
    approach: 'exploratory and contemplative',
    specialties: [
      'meaning of life',
      'ethical dilemmas',
      'existential questions',
    ],
    promptPrefix:
      'Speaking as a thoughtful philosopher exploring deep questions',
    responseStyle:
      'Poses questions, explores multiple perspectives, challenges assumptions',
  },

  guide: {
    id: 'guide',
    name: 'The Guide',
    description:
      'Practical navigator helping with immediate decisions and clarity',
    emoji: '🧭',
    tone: 'clear, direct, solution-focused',
    approach: 'practical and action-oriented',
    specialties: ['decision making', 'problem solving', 'immediate guidance'],
    promptPrefix:
      'Speaking as a practical guide focused on clear direction and solutions',
    responseStyle:
      'Direct communication, step-by-step guidance, focuses on next actions',
  },

  mystic: {
    id: 'mystic',
    name: 'The Mystic',
    description:
      'Intuitive interpreter of hidden meanings and spiritual insights',
    emoji: '🌟',
    tone: 'mystical, intuitive, ethereal',
    approach: 'spiritual and transcendent',
    specialties: [
      'spiritual insights',
      'hidden meanings',
      'intuitive guidance',
    ],
    promptPrefix:
      'Speaking as a mystical interpreter of spiritual wisdom and hidden truths',
    responseStyle:
      'Poetic language, spiritual metaphors, focuses on inner wisdom',
  },
};

/**
 * Select appropriate AI personality based on context
 */
export function selectAIPersonality(
  hexagram: Hexagram,
  question: string,
  userHistory?: {
    consultationCount: number;
    favoritePersonalities: string[];
    currentLifePhase: string;
  }
): AIPersonality {
  const questionLower = question.toLowerCase();

  // Question-based personality selection
  if (
    questionLower.includes('meaning') ||
    questionLower.includes('purpose') ||
    questionLower.includes('why')
  ) {
    return AI_PERSONALITIES.philosopher;
  }

  if (
    questionLower.includes('should') ||
    questionLower.includes('decision') ||
    questionLower.includes('what to do')
  ) {
    return AI_PERSONALITIES.guide;
  }

  if (
    questionLower.includes('spiritual') ||
    questionLower.includes('soul') ||
    questionLower.includes('divine')
  ) {
    return AI_PERSONALITIES.mystic;
  }

  if (
    questionLower.includes('growth') ||
    questionLower.includes('develop') ||
    questionLower.includes('learn')
  ) {
    return AI_PERSONALITIES.mentor;
  }

  // Hexagram-based personality selection
  const spiritualHexagrams = [1, 2, 11, 12, 20, 25, 41, 42, 61, 62];
  const practicalHexagrams = [3, 4, 5, 6, 7, 8, 9, 10, 15, 16];
  const philosophicalHexagrams = [13, 14, 17, 18, 19, 22, 23, 24];

  if (spiritualHexagrams.includes(hexagram.number)) {
    return AI_PERSONALITIES.mystic;
  }

  if (practicalHexagrams.includes(hexagram.number)) {
    return AI_PERSONALITIES.guide;
  }

  if (philosophicalHexagrams.includes(hexagram.number)) {
    return AI_PERSONALITIES.philosopher;
  }

  // User history-based selection
  if (userHistory) {
    if (
      userHistory.consultationCount > 10 &&
      userHistory.favoritePersonalities.length > 0
    ) {
      const favoriteId = userHistory.favoritePersonalities[0];
      if (AI_PERSONALITIES[favoriteId]) {
        return AI_PERSONALITIES[favoriteId];
      }
    }

    if (userHistory.consultationCount < 3) {
      return AI_PERSONALITIES.mentor; // Supportive for beginners
    }
  }

  // Default to sage for balanced wisdom
  return AI_PERSONALITIES.sage;
}

/**
 * Generate personality-specific prompt enhancement
 */
export function enhancePromptWithPersonality(
  basePrompt: string,
  personality: AIPersonality,
  hexagram: Hexagram
): string {
  const personalityContext = `
${personality.promptPrefix}, you should respond with a ${
    personality.tone
  } tone using a ${personality.approach} approach.

Your specialties include: ${personality.specialties.join(', ')}.
Response style: ${personality.responseStyle}

For this consultation about Hexagram ${hexagram.number} (${
    hexagram.name
  }), draw upon your expertise in ${
    personality.specialties[0]
  } while maintaining your characteristic ${personality.tone} perspective.
`;

  return personalityContext + '\n\n' + basePrompt;
}

/**
 * Track user's personality preferences
 */
export interface PersonalityPreference {
  personalityId: string;
  rating: number; // 1-5 stars
  frequency: number; // how often selected
  lastUsed: string;
}

export function updatePersonalityPreference(
  userPreferences: PersonalityPreference[],
  personalityId: string,
  rating?: number
): PersonalityPreference[] {
  const existing = userPreferences.find(p => p.personalityId === personalityId);

  if (existing) {
    existing.frequency += 1;
    existing.lastUsed = new Date().toISOString();
    if (rating) {
      // Update rating with weighted average
      existing.rating =
        (existing.rating * (existing.frequency - 1) + rating) /
        existing.frequency;
    }
  } else {
    userPreferences.push({
      personalityId,
      rating: rating || 4.0,
      frequency: 1,
      lastUsed: new Date().toISOString(),
    });
  }

  // Sort by frequency and rating
  return userPreferences.sort((a, b) => {
    const scoreA = a.frequency * a.rating;
    const scoreB = b.frequency * b.rating;
    return scoreB - scoreA;
  });
}

/**
 * Get personality insights for dashboard
 */
export function getPersonalityInsights(preferences: PersonalityPreference[]): {
  mostUsed: string | null;
  highestRated: string | null;
  personalityDistribution: Record<string, number>;
  recommendations: string[];
} {
  if (preferences.length === 0) {
    return {
      mostUsed: null,
      highestRated: null,
      personalityDistribution: {},
      recommendations: [
        'Try different AI personalities to find your preferred guidance style!',
      ],
    };
  }

  const mostUsed = preferences[0]?.personalityId || null;
  const highestRated =
    preferences.sort((a, b) => b.rating - a.rating)[0]?.personalityId || null;

  const distribution = preferences.reduce(
    (acc, pref) => {
      acc[pref.personalityId] = pref.frequency;
      return acc;
    },
    {} as Record<string, number>
  );

  const recommendations = generatePersonalityRecommendations(preferences);

  return {
    mostUsed,
    highestRated,
    personalityDistribution: distribution,
    recommendations,
  };
}

/**
 * Generate personality recommendations based on usage patterns
 */
function generatePersonalityRecommendations(
  preferences: PersonalityPreference[]
): string[] {
  const recommendations: string[] = [];
  const usedPersonalities = new Set(preferences.map(p => p.personalityId));
  const allPersonalities = Object.keys(AI_PERSONALITIES);

  // Recommend unused personalities
  const unusedPersonalities = allPersonalities.filter(
    id => !usedPersonalities.has(id)
  );
  if (unusedPersonalities.length > 0) {
    const randomUnused =
      unusedPersonalities[
        Math.floor(Math.random() * unusedPersonalities.length)
      ];
    const personality = AI_PERSONALITIES[randomUnused];
    recommendations.push(
      `Try ${personality.name} for ${personality.specialties[0]} insights!`
    );
  }

  // Recommend based on ratings
  const lowRated = preferences.filter(p => p.rating < 3.5);
  if (lowRated.length > 0 && preferences.length > 2) {
    recommendations.push(
      'Consider focusing on your higher-rated personalities for better guidance.'
    );
  }

  // Recommend variety
  if (
    preferences.length > 0 &&
    preferences[0].frequency > preferences.length * 3
  ) {
    recommendations.push(
      'Try mixing different personalities for diverse perspectives on your questions.'
    );
  }

  return recommendations;
}
