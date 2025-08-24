/**
 * AI Personality Analysis System
 *
 * Analyzes AI-generated interpretations to extract personality traits,
 * communication style, and thematic patterns. This provides users with
 * insights into how the AI approached their specific consultation.
 */

export interface AIPersonalityProfile {
  /** Overall communication style */
  style: {
    tone:
      | 'contemplative'
      | 'assertive'
      | 'nurturing'
      | 'analytical'
      | 'mystical';
    formality: 'formal' | 'conversational' | 'poetic';
    depth: 'surface' | 'moderate' | 'profound';
    culturalEmbedding: 'traditional' | 'modern' | 'balanced';
  };

  /** Thematic focus areas */
  themes: {
    primary: string;
    secondary?: string;
    emphasis: (
      | 'action'
      | 'reflection'
      | 'relationships'
      | 'growth'
      | 'balance'
    )[];
  };

  /** Wisdom tradition emphasis */
  tradition: {
    confucian: number; // 0-1 scale
    taoist: number;
    buddhist: number;
    modern: number;
  };

  /** Language patterns */
  language: {
    metaphorUsage: 'minimal' | 'moderate' | 'rich';
    structuralElements: ('questions' | 'lists' | 'stories' | 'direct_advice')[];
    keyPhrases: string[];
  };

  /** Emotional resonance */
  resonance: {
    empathy: number; // 0-1 scale
    hope: number;
    challenge: number;
    wisdom: number;
  };
}

export interface AIPersonalityIndicator {
  /** Main personality archetype */
  archetype: 'sage' | 'guide' | 'mentor' | 'mystic' | 'philosopher' | 'friend';

  /** Visual indicator color */
  color: string;

  /** Brief description */
  description: string;

  /** Chinese character representation */
  character: string;

  /** Personality traits (3-5 key traits) */
  traits: string[];
}

/**
 * Analyzes AI interpretation to extract personality traits
 */
export function analyzeAIPersonality(interpretation: {
  interpretation: string;
  ancientWisdom?: string;
  guidance?: string;
  practicalAdvice?: string;
  spiritualInsight?: string;
  timing?: string;
  culturalContext?: string;
}): AIPersonalityProfile {
  const allText = [
    interpretation.interpretation,
    interpretation.ancientWisdom,
    interpretation.guidance,
    interpretation.practicalAdvice,
    interpretation.spiritualInsight,
    interpretation.timing,
    interpretation.culturalContext,
  ]
    .filter(Boolean)
    .join(' ');

  // Analyze communication tone
  const tone = analyzeTone(allText);

  // Analyze formality level
  const formality = analyzeFormality(allText);

  // Analyze depth of insight
  const depth = analyzeDepth(allText);

  // Analyze cultural embedding
  const culturalEmbedding = analyzeCulturalEmbedding(allText);

  // Extract themes
  const themes = extractThemes(allText);

  // Analyze tradition emphasis
  const tradition = analyzeTraditionEmphasis(allText);

  // Analyze language patterns
  const language = analyzeLanguagePatterns(allText);

  // Calculate emotional resonance
  const resonance = calculateEmotionalResonance(allText);

  return {
    style: {
      tone,
      formality,
      depth,
      culturalEmbedding,
    },
    themes,
    tradition,
    language,
    resonance,
  };
}

/**
 * Converts personality profile to visual indicator
 */
export function getPersonalityIndicator(
  profile: AIPersonalityProfile
): AIPersonalityIndicator {
  // Determine archetype based on style and themes
  const archetype = determineArchetype(profile);

  // Assign colors and characters based on archetype
  const indicators: Record<
    string,
    {
      color: string;
      character: string;
      description: string;
      baseTraits: string[];
    }
  > = {
    sage: {
      color: 'from-earth-brown to-mountain-stone',
      character: '智',
      description: 'Ancient wisdom keeper',
      baseTraits: ['profound', 'traditional', 'contemplative'],
    },
    guide: {
      color: 'from-flowing-water to-sky-blue',
      character: '導',
      description: 'Compassionate guide',
      baseTraits: ['nurturing', 'supportive', 'practical'],
    },
    mentor: {
      color: 'from-bamboo-green to-jade-green',
      character: '師',
      description: 'Patient teacher',
      baseTraits: ['educational', 'structured', 'encouraging'],
    },
    mystic: {
      color: 'from-sunset-gold to-warm-amber',
      character: '玄',
      description: 'Mystical interpreter',
      baseTraits: ['spiritual', 'metaphorical', 'deep'],
    },
    philosopher: {
      color: 'from-gentle-silver to-cloud-white',
      character: '思',
      description: 'Thoughtful philosopher',
      baseTraits: ['analytical', 'balanced', 'questioning'],
    },
    friend: {
      color: 'from-lotus-pink to-cherry-blossom',
      character: '友',
      description: 'Warm companion',
      baseTraits: ['personal', 'encouraging', 'relatable'],
    },
  };

  const indicator = indicators[archetype] || indicators['sage'];

  // Generate specific traits based on the personality profile
  const traits = generateSpecificTraits(profile, indicator.baseTraits);

  return {
    archetype: archetype as AIPersonalityIndicator['archetype'],
    color: indicator.color,
    description: indicator.description,
    character: indicator.character,
    traits,
  };
}

// Helper functions for analysis

function analyzeTone(text: string): AIPersonalityProfile['style']['tone'] {
  const lowerText = text.toLowerCase();

  // Count tone indicators
  const contemplativeWords = [
    'reflect',
    'consider',
    'ponder',
    'meditation',
    'quiet',
  ];
  const assertiveWords = [
    'must',
    'should',
    'need',
    'important',
    'crucial',
    'act',
  ];
  const nurturingWords = ['gentle', 'care', 'support', 'nourish', 'compassion'];
  const analyticalWords = [
    'analyze',
    'examine',
    'structure',
    'system',
    'logic',
  ];
  const mysticalWords = [
    'mystery',
    'divine',
    'cosmic',
    'spiritual',
    'transcend',
  ];

  const scores = {
    contemplative: countWords(lowerText, contemplativeWords),
    assertive: countWords(lowerText, assertiveWords),
    nurturing: countWords(lowerText, nurturingWords),
    analytical: countWords(lowerText, analyticalWords),
    mystical: countWords(lowerText, mysticalWords),
  };

  return Object.entries(scores).reduce((a, b) =>
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores]
      ? a
      : b
  )[0] as AIPersonalityProfile['style']['tone'];
}

function analyzeFormality(
  text: string
): AIPersonalityProfile['style']['formality'] {
  const contractions = (text.match(/'[a-z]/g) || []).length;
  const formalWords = countWords(text.toLowerCase(), [
    'therefore',
    'furthermore',
    'moreover',
    'thus',
  ]);
  const poeticWords = countWords(text.toLowerCase(), [
    'flows',
    'dance',
    'river',
    'mountain',
    'wind',
  ]);

  if (poeticWords > 2) return 'poetic';
  if (contractions > 3 || text.includes("you'll") || text.includes("let's"))
    return 'conversational';
  return 'formal';
}

function analyzeDepth(text: string): AIPersonalityProfile['style']['depth'] {
  const length = text.length;
  const complexWords = countWords(text.toLowerCase(), [
    'profound',
    'intricate',
    'multifaceted',
    'interconnected',
    'fundamental',
  ]);
  const philosophicalWords = countWords(text.toLowerCase(), [
    'essence',
    'nature',
    'existence',
    'consciousness',
    'reality',
  ]);

  const depthScore =
    complexWords * 2 + philosophicalWords + (length > 800 ? 1 : 0);

  if (depthScore > 5) return 'profound';
  if (depthScore > 2) return 'moderate';
  return 'surface';
}

function analyzeCulturalEmbedding(
  text: string
): AIPersonalityProfile['style']['culturalEmbedding'] {
  const traditionalWords = countWords(text.toLowerCase(), [
    'ancient',
    'traditional',
    'confucius',
    'tao',
    'yin',
    'yang',
    'qi',
  ]);
  const modernWords = countWords(text.toLowerCase(), [
    'today',
    'modern',
    'contemporary',
    'current',
    'now',
    'present',
  ]);

  if (traditionalWords > modernWords * 1.5) return 'traditional';
  if (modernWords > traditionalWords * 1.5) return 'modern';
  return 'balanced';
}

function extractThemes(text: string): AIPersonalityProfile['themes'] {
  const themeWords = {
    action: ['action', 'move', 'act', 'do', 'proceed', 'advance'],
    reflection: ['reflect', 'contemplate', 'meditate', 'consider', 'pause'],
    relationships: ['relationship', 'connect', 'together', 'harmony', 'family'],
    growth: ['grow', 'develop', 'progress', 'evolve', 'learn', 'improve'],
    balance: ['balance', 'harmony', 'equilibrium', 'middle', 'center'],
  };

  const scores = Object.entries(themeWords)
    .map(([theme, words]) => ({
      theme,
      score: countWords(text.toLowerCase(), words),
    }))
    .sort((a, b) => b.score - a.score);

  const validEmphasis = scores
    .filter(s => s.score > 0)
    .slice(0, 3)
    .map(s => s.theme)
    .filter(
      (
        theme
      ): theme is
        | 'action'
        | 'reflection'
        | 'relationships'
        | 'growth'
        | 'balance' =>
        ['action', 'reflection', 'relationships', 'growth', 'balance'].includes(
          theme
        )
    );

  const result: AIPersonalityProfile['themes'] = {
    primary: scores[0]?.theme || 'balance',
    emphasis: validEmphasis,
  };

  if (scores[1]?.score && scores[1].score > 0) {
    result.secondary = scores[1].theme;
  }

  return result;
}

function analyzeTraditionEmphasis(
  text: string
): AIPersonalityProfile['tradition'] {
  const confucianWords = [
    'virtue',
    'righteousness',
    'propriety',
    'wisdom',
    'benevolence',
  ];
  const taoistWords = [
    'tao',
    'wu wei',
    'natural',
    'flow',
    'simplicity',
    'spontaneous',
  ];
  const buddhistWords = [
    'mindfulness',
    'compassion',
    'suffering',
    'attachment',
    'impermanence',
  ];
  const modernWords = [
    'psychology',
    'therapy',
    'goal',
    'success',
    'efficiency',
  ];

  const lowerText = text.toLowerCase();
  const total = text.split(' ').length;

  return {
    confucian: Math.min(
      1,
      (countWords(lowerText, confucianWords) / total) * 50
    ),
    taoist: Math.min(1, (countWords(lowerText, taoistWords) / total) * 50),
    buddhist: Math.min(1, (countWords(lowerText, buddhistWords) / total) * 50),
    modern: Math.min(1, (countWords(lowerText, modernWords) / total) * 50),
  };
}

function analyzeLanguagePatterns(
  text: string
): AIPersonalityProfile['language'] {
  const questionCount = (text.match(/\?/g) || []).length;
  const listCount = (text.match(/[•\-\*]|\d+\./g) || []).length;
  const metaphorWords = [
    'like',
    'as',
    'flows',
    'river',
    'mountain',
    'wind',
    'ocean',
  ];
  const directWords = [
    'you should',
    'you must',
    'it is important',
    'remember to',
  ];

  const metaphorUsage =
    countWords(text.toLowerCase(), metaphorWords) > 3
      ? 'rich'
      : countWords(text.toLowerCase(), metaphorWords) > 1
        ? 'moderate'
        : 'minimal';

  const structuralElements: AIPersonalityProfile['language']['structuralElements'] =
    [];
  if (questionCount > 2) structuralElements.push('questions');
  if (listCount > 0) structuralElements.push('lists');
  if (countWords(text.toLowerCase(), metaphorWords) > 2)
    structuralElements.push('stories');
  if (countWords(text.toLowerCase(), directWords) > 1)
    structuralElements.push('direct_advice');

  // Extract key phrases (first few words of sentences that start with important words)
  const keyPhrases = extractKeyPhrases(text);

  return {
    metaphorUsage,
    structuralElements,
    keyPhrases,
  };
}

function calculateEmotionalResonance(
  text: string
): AIPersonalityProfile['resonance'] {
  const empathyWords = ['understand', 'feel', 'compassion', 'care', 'support'];
  const hopeWords = ['hope', 'optimism', 'positive', 'bright', 'opportunity'];
  const challengeWords = [
    'challenge',
    'difficult',
    'struggle',
    'overcome',
    'strength',
  ];
  const wisdomWords = [
    'wisdom',
    'knowledge',
    'insight',
    'understanding',
    'truth',
  ];

  const lowerText = text.toLowerCase();
  const total = text.split(' ').length;

  return {
    empathy: Math.min(1, (countWords(lowerText, empathyWords) / total) * 100),
    hope: Math.min(1, (countWords(lowerText, hopeWords) / total) * 100),
    challenge: Math.min(
      1,
      (countWords(lowerText, challengeWords) / total) * 100
    ),
    wisdom: Math.min(1, (countWords(lowerText, wisdomWords) / total) * 100),
  };
}

function determineArchetype(profile: AIPersonalityProfile): string {
  // Logic to determine archetype based on combined factors
  if (
    profile.style.tone === 'mystical' &&
    profile.language.metaphorUsage === 'rich'
  )
    return 'mystic';
  if (profile.style.tone === 'nurturing' && profile.resonance.empathy > 0.5)
    return 'guide';
  if (profile.style.tone === 'analytical' && profile.style.depth === 'profound')
    return 'philosopher';
  if (
    profile.style.culturalEmbedding === 'traditional' &&
    profile.tradition.confucian > 0.3
  )
    return 'sage';
  if (
    profile.themes.emphasis.includes('growth' as const) &&
    profile.resonance.hope > 0.4
  )
    return 'mentor';
  return 'friend';
}

function generateSpecificTraits(
  profile: AIPersonalityProfile,
  baseTraits: string[]
): string[] {
  const traits = [...baseTraits];

  // Add specific traits based on analysis
  if (profile.language.metaphorUsage === 'rich') traits.push('poetic');
  if (profile.resonance.empathy > 0.5) traits.push('empathetic');
  if (profile.style.depth === 'profound') traits.push('insightful');
  if (profile.tradition.taoist > 0.3) traits.push('natural');
  if (profile.themes.emphasis.includes('action' as const))
    traits.push('action-oriented');

  return traits.slice(0, 5); // Limit to 5 traits
}

function countWords(text: string, words: string[]): number {
  return words.reduce((count, word) => {
    return count + (text.match(new RegExp(`\\b${word}\\b`, 'gi')) || []).length;
  }, 0);
}

function extractKeyPhrases(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const importantStarters = [
    'remember',
    'consider',
    'embrace',
    'trust',
    'focus',
    'allow',
  ];

  const keyPhrases: string[] = [];

  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    const firstWord = trimmed.split(' ')[0]?.toLowerCase();

    if (firstWord && importantStarters.includes(firstWord)) {
      const phrase = trimmed.split(' ').slice(0, 6).join(' ');
      if (phrase.length > 10) keyPhrases.push(phrase);
    }
  });

  return keyPhrases.slice(0, 3); // Limit to top 3 key phrases
}
