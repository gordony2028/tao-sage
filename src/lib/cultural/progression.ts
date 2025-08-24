/**
 * Cultural Progression System
 * 5-level framework for tracking user's I Ching knowledge and cultural understanding
 */

export type CulturalLevel =
  | 'Beginner'
  | 'Student'
  | 'Practitioner'
  | 'Scholar'
  | 'Master';

export interface CulturalProgressionLevel {
  level: CulturalLevel;
  order: number;
  name: string;
  description: string;
  requirements: {
    consultations: number;
    hexagramsEncountered: number;
    reflectionsCompleted: number;
    daysActive: number;
    concepts: string[];
  };
  achievements: CulturalAchievement[];
  benefits: string[];
  nextLevelPreview?: string;
}

export interface CulturalAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'knowledge' | 'practice' | 'wisdom' | 'dedication' | 'insight';
  points: number;
  unlockConditions: {
    level?: CulturalLevel;
    consultations?: number;
    streak?: number;
    hexagrams?: number[];
    concepts?: string[];
    timeActive?: number; // days
  };
}

export interface UserCulturalProgress {
  userId: string;
  currentLevel: CulturalLevel;
  levelProgress: number; // 0-100 percentage to next level
  totalPoints: number;
  statistics: {
    consultations: number;
    uniqueHexagrams: number[];
    reflectionsCompleted: number;
    daysActive: number;
    longestStreak: number;
    conceptsMastered: string[];
    achievements: string[]; // Achievement IDs
  };
  recentActivity: {
    lastConsultation: string;
    lastReflection: string;
    lastLevelUp: string | null;
  };
  culturalInsights: {
    favoriteHexagrams: number[];
    learningPath: string[];
    recommendedTopics: string[];
  };
}

/**
 * 5-Level Cultural Progression Framework
 */
export const CULTURAL_LEVELS: CulturalProgressionLevel[] = [
  {
    level: 'Beginner',
    order: 1,
    name: '初学者 (Chūxuézhě) - The Novice',
    description:
      'Beginning your journey with the I Ching, learning fundamental concepts and basic hexagram structures.',
    requirements: {
      consultations: 0,
      hexagramsEncountered: 0,
      reflectionsCompleted: 0,
      daysActive: 0,
      concepts: [],
    },
    achievements: [
      {
        id: 'first_consultation',
        name: 'First Steps',
        description: 'Complete your first I Ching consultation',
        icon: '👶',
        category: 'practice',
        points: 10,
        unlockConditions: { consultations: 1 },
      },
      {
        id: 'first_reflection',
        name: 'Thoughtful Beginning',
        description: 'Complete your first reflection',
        icon: '💭',
        category: 'wisdom',
        points: 15,
        unlockConditions: { consultations: 1 },
      },
    ],
    benefits: [
      'Access to basic hexagram interpretations',
      'Daily guidance with simple explanations',
      'Introduction to fundamental I Ching concepts',
    ],
    nextLevelPreview: 'Learn about yin-yang principles and trigram meanings',
  },

  {
    level: 'Student',
    order: 2,
    name: '学生 (Xuéshēng) - The Student',
    description:
      'Developing understanding of yin-yang principles, trigrams, and the philosophical foundations of the I Ching.',
    requirements: {
      consultations: 5,
      hexagramsEncountered: 8,
      reflectionsCompleted: 3,
      daysActive: 7,
      concepts: ['yin-yang', 'trigrams', 'change'],
    },
    achievements: [
      {
        id: 'week_commitment',
        name: 'Seven Days of Wisdom',
        description: 'Stay active for 7 consecutive days',
        icon: '📅',
        category: 'dedication',
        points: 25,
        unlockConditions: { timeActive: 7 },
      },
      {
        id: 'trigram_knowledge',
        name: 'Eight Foundations',
        description: 'Encounter all eight trigrams in consultations',
        icon: '☰',
        category: 'knowledge',
        points: 30,
        unlockConditions: { hexagrams: [1, 2, 8, 23, 20, 16, 35, 45] }, // Representative of all trigrams
      },
    ],
    benefits: [
      'Enhanced AI personality matching',
      'Detailed trigram explanations',
      'Cultural context for hexagram meanings',
      'Access to meditation timer with I Ching themes',
    ],
    nextLevelPreview: 'Master changing lines and hexagram relationships',
  },

  {
    level: 'Practitioner',
    order: 3,
    name: '修行者 (Xiūxíngzhě) - The Practitioner',
    description:
      'Actively applying I Ching wisdom in daily life, understanding changing lines and hexagram relationships.',
    requirements: {
      consultations: 20,
      hexagramsEncountered: 25,
      reflectionsCompleted: 15,
      daysActive: 30,
      concepts: ['yin-yang', 'trigrams', 'change', 'wu-wei', 'timing'],
    },
    achievements: [
      {
        id: 'month_dedication',
        name: 'Moon Cycle Devotion',
        description: 'Maintain practice for 30 days',
        icon: '🌙',
        category: 'dedication',
        points: 50,
        unlockConditions: { timeActive: 30 },
      },
      {
        id: 'changing_master',
        name: 'Master of Change',
        description: 'Experience consultations with changing lines 10 times',
        icon: '🔄',
        category: 'insight',
        points: 40,
        unlockConditions: { consultations: 10 }, // Will need special tracking for changing lines
      },
      {
        id: 'reflection_depth',
        name: 'Deep Contemplation',
        description: 'Complete 15 thoughtful reflections',
        icon: '🧘',
        category: 'wisdom',
        points: 35,
        unlockConditions: { consultations: 15 },
      },
    ],
    benefits: [
      'Advanced changing line interpretations',
      'Hexagram relationship insights',
      'Personalized learning recommendations',
      'Access to advanced meditation practices',
      'Cultural pronunciation guides',
    ],
    nextLevelPreview: 'Explore philosophical depths and seasonal wisdom',
  },

  {
    level: 'Scholar',
    order: 4,
    name: '学者 (Xuézhě) - The Scholar',
    description:
      'Deep understanding of I Ching philosophy, seasonal wisdom, and cultural historical context.',
    requirements: {
      consultations: 50,
      hexagramsEncountered: 45,
      reflectionsCompleted: 35,
      daysActive: 90,
      concepts: [
        'yin-yang',
        'trigrams',
        'change',
        'wu-wei',
        'timing',
        'five-elements',
        'seasonal-wisdom',
      ],
    },
    achievements: [
      {
        id: 'seasonal_wisdom',
        name: 'Four Seasons Sage',
        description: 'Complete consultations across all four seasons',
        icon: '🍃',
        category: 'knowledge',
        points: 75,
        unlockConditions: { timeActive: 90 },
      },
      {
        id: 'hexagram_encyclopedia',
        name: 'Living Encyclopedia',
        description: 'Encounter 45 different hexagrams',
        icon: '📚',
        category: 'knowledge',
        points: 80,
        unlockConditions: { consultations: 45 },
      },
      {
        id: 'wisdom_keeper',
        name: 'Keeper of Wisdom',
        description: 'Complete 35 deep reflections',
        icon: '💎',
        category: 'wisdom',
        points: 60,
        unlockConditions: { consultations: 35 },
      },
    ],
    benefits: [
      'Historical context for hexagrams',
      'Seasonal and elemental correlations',
      'Advanced philosophical discussions',
      'Cultural artifact access',
      'Recommended scholarly readings',
      'Priority access to new features',
    ],
    nextLevelPreview:
      'Achieve mastery through intuitive wisdom and teaching others',
  },

  {
    level: 'Master',
    order: 5,
    name: '大师 (Dàshī) - The Master',
    description:
      'Intuitive mastery of I Ching wisdom, capable of guiding others and seeing deeper patterns in life.',
    requirements: {
      consultations: 100,
      hexagramsEncountered: 60,
      reflectionsCompleted: 75,
      daysActive: 180,
      concepts: [
        'yin-yang',
        'trigrams',
        'change',
        'wu-wei',
        'timing',
        'five-elements',
        'seasonal-wisdom',
        'emptiness',
        'dao',
      ],
    },
    achievements: [
      {
        id: 'hundred_consultations',
        name: 'Hundred Wisdoms',
        description: 'Complete 100 consultations with deep understanding',
        icon: '💯',
        category: 'practice',
        points: 100,
        unlockConditions: { consultations: 100 },
      },
      {
        id: 'intuitive_master',
        name: 'Intuitive Master',
        description: 'Demonstrate mastery across all cultural concepts',
        icon: '🎯',
        category: 'insight',
        points: 150,
        unlockConditions: { level: 'Master' },
      },
      {
        id: 'dao_understanding',
        name: 'Understanding the Dao',
        description: 'Achieve deep philosophical understanding',
        icon: '☯️',
        category: 'wisdom',
        points: 200,
        unlockConditions: { consultations: 75 },
      },
    ],
    benefits: [
      'Complete access to all cultural content',
      'Advanced pattern recognition insights',
      'Personalized wisdom synthesis',
      'Community teaching opportunities',
      'Beta access to advanced features',
      'Cultural ambassador status',
    ],
  },
];

/**
 * Core Cultural Concepts for Learning Path
 */
export const CULTURAL_CONCEPTS = {
  'yin-yang': {
    name: 'Yin-Yang 阴阳',
    description:
      'The fundamental principle of complementary opposites in Chinese philosophy',
    difficulty: 1,
    prerequisites: [],
    learningMaterials: [
      'Understanding the balance of opposing forces',
      'How yin and yang manifest in daily life',
      'The dynamic nature of complementary opposites',
    ],
  },
  trigrams: {
    name: 'Eight Trigrams 八卦',
    description: 'The eight fundamental symbols representing natural forces',
    difficulty: 2,
    prerequisites: ['yin-yang'],
    learningMaterials: [
      'Heaven ☰, Earth ☷, Thunder ☳, Water ☵',
      'Mountain ☶, Fire ☲, Wind ☴, Lake ☱',
      'Natural correspondences and meanings',
    ],
  },
  change: {
    name: 'Principle of Change 变',
    description:
      'The fundamental principle that all things are in constant flux',
    difficulty: 1,
    prerequisites: [],
    learningMaterials: [
      'Nothing remains static in nature',
      'Change as the only constant',
      'Adapting to natural rhythms',
    ],
  },
  'wu-wei': {
    name: 'Wu Wei 无为',
    description: 'Effortless action in harmony with natural flow',
    difficulty: 3,
    prerequisites: ['yin-yang', 'change'],
    learningMaterials: [
      'Acting without forcing',
      'Finding the natural way forward',
      'Timing and spontaneous action',
    ],
  },
  timing: {
    name: 'Proper Timing 时机',
    description: 'Understanding the right moment for action or stillness',
    difficulty: 3,
    prerequisites: ['change', 'wu-wei'],
    learningMaterials: [
      'Recognizing opportune moments',
      'Patience and strategic waiting',
      'Natural cycles and rhythms',
    ],
  },
  'five-elements': {
    name: 'Five Elements 五行',
    description:
      'Wood, Fire, Earth, Metal, Water - the five fundamental energies',
    difficulty: 4,
    prerequisites: ['trigrams', 'change'],
    learningMaterials: [
      'Elemental cycles and relationships',
      'Seasonal correspondences',
      'Personal elemental constitution',
    ],
  },
  'seasonal-wisdom': {
    name: 'Seasonal Wisdom 四时',
    description: 'Understanding the natural wisdom of seasonal cycles',
    difficulty: 4,
    prerequisites: ['five-elements', 'timing'],
    learningMaterials: [
      'Spring growth, Summer abundance',
      'Autumn harvest, Winter reflection',
      'Aligning personal cycles with nature',
    ],
  },
  emptiness: {
    name: 'Emptiness 空',
    description: 'The fertile void from which all possibilities emerge',
    difficulty: 5,
    prerequisites: ['wu-wei', 'seasonal-wisdom'],
    learningMaterials: [
      'The power of receptive emptiness',
      'Creating space for new possibilities',
      'Beyond attachment and aversion',
    ],
  },
  dao: {
    name: 'The Dao 道',
    description: 'The ineffable Way that underlies all existence',
    difficulty: 5,
    prerequisites: ['emptiness', 'timing'],
    learningMaterials: [
      'The unnameable source',
      'Living in harmony with the Way',
      'Unity of all opposites',
    ],
  },
};

/**
 * Calculate user's cultural progression level
 */
export function calculateCulturalLevel(
  stats: UserCulturalProgress['statistics']
): {
  currentLevel: CulturalLevel;
  progress: number;
  nextLevel: CulturalLevel | null;
  requirementsForNext: any;
} {
  for (let i = CULTURAL_LEVELS.length - 1; i >= 0; i--) {
    const level = CULTURAL_LEVELS[i];
    const reqs = level.requirements;

    const meetsRequirements =
      stats.consultations >= reqs.consultations &&
      stats.uniqueHexagrams.length >= reqs.hexagramsEncountered &&
      stats.reflectionsCompleted >= reqs.reflectionsCompleted &&
      stats.daysActive >= reqs.daysActive &&
      reqs.concepts.every(concept => stats.conceptsMastered.includes(concept));

    if (meetsRequirements) {
      const nextLevel = CULTURAL_LEVELS[i + 1];
      let progress = 100;

      if (nextLevel) {
        // Calculate progress toward next level
        const nextReqs = nextLevel.requirements;
        const progressFactors = [
          stats.consultations / nextReqs.consultations,
          stats.uniqueHexagrams.length / nextReqs.hexagramsEncountered,
          stats.reflectionsCompleted / nextReqs.reflectionsCompleted,
          stats.daysActive / nextReqs.daysActive,
          stats.conceptsMastered.length / nextReqs.concepts.length,
        ];

        progress = Math.min(
          100,
          Math.round(
            (progressFactors.reduce(
              (acc, factor) => acc + Math.min(1, factor),
              0
            ) /
              progressFactors.length) *
              100
          )
        );
      }

      return {
        currentLevel: level.level,
        progress,
        nextLevel: nextLevel?.level || null,
        requirementsForNext: nextLevel?.requirements || null,
      };
    }
  }

  // Default to Beginner
  const beginnerLevel = CULTURAL_LEVELS[0];
  const studentLevel = CULTURAL_LEVELS[1];

  const progressFactors = [
    stats.consultations / studentLevel.requirements.consultations,
    stats.uniqueHexagrams.length /
      studentLevel.requirements.hexagramsEncountered,
    stats.reflectionsCompleted / studentLevel.requirements.reflectionsCompleted,
    stats.daysActive / studentLevel.requirements.daysActive,
  ];

  const progress = Math.min(
    100,
    Math.round(
      (progressFactors.reduce((acc, factor) => acc + Math.min(1, factor), 0) /
        progressFactors.length) *
        100
    )
  );

  return {
    currentLevel: 'Beginner',
    progress,
    nextLevel: 'Student',
    requirementsForNext: studentLevel.requirements,
  };
}

/**
 * Get available achievements for user
 */
export function getAvailableAchievements(
  userProgress: UserCulturalProgress
): CulturalAchievement[] {
  const allAchievements = CULTURAL_LEVELS.flatMap(level => level.achievements);
  const unlockedAchievements = userProgress.statistics.achievements;

  return allAchievements.filter(achievement => {
    if (unlockedAchievements.includes(achievement.id)) return false;

    const conditions = achievement.unlockConditions;
    const stats = userProgress.statistics;

    // Check if conditions are met
    if (
      conditions.consultations &&
      stats.consultations < conditions.consultations
    )
      return false;
    if (conditions.streak && stats.longestStreak < conditions.streak)
      return false;
    if (conditions.timeActive && stats.daysActive < conditions.timeActive)
      return false;
    if (conditions.level) {
      const currentLevelOrder =
        CULTURAL_LEVELS.find(l => l.level === userProgress.currentLevel)
          ?.order || 1;
      const requiredLevelOrder =
        CULTURAL_LEVELS.find(l => l.level === conditions.level)?.order || 1;
      if (currentLevelOrder < requiredLevelOrder) return false;
    }
    if (
      conditions.hexagrams &&
      !conditions.hexagrams.some(h => stats.uniqueHexagrams.includes(h))
    )
      return false;
    if (
      conditions.concepts &&
      !conditions.concepts.every(c => stats.conceptsMastered.includes(c))
    )
      return false;

    return true;
  });
}

/**
 * Generate personalized learning recommendations
 */
export function generateLearningRecommendations(
  userProgress: UserCulturalProgress
): string[] {
  const recommendations: string[] = [];
  const stats = userProgress.statistics;
  const currentLevelData = CULTURAL_LEVELS.find(
    l => l.level === userProgress.currentLevel
  );
  const nextLevelData = CULTURAL_LEVELS.find(
    l => l.order === (currentLevelData?.order || 1) + 1
  );

  // Recommend based on current level requirements
  if (nextLevelData) {
    const nextReqs = nextLevelData.requirements;

    if (stats.consultations < nextReqs.consultations) {
      recommendations.push(
        `Continue your practice - you need ${
          nextReqs.consultations - stats.consultations
        } more consultations to advance`
      );
    }

    if (stats.uniqueHexagrams.length < nextReqs.hexagramsEncountered) {
      recommendations.push(
        `Explore new perspectives - encounter ${
          nextReqs.hexagramsEncountered - stats.uniqueHexagrams.length
        } more hexagrams`
      );
    }

    if (stats.reflectionsCompleted < nextReqs.reflectionsCompleted) {
      recommendations.push(
        `Deepen your understanding through ${
          nextReqs.reflectionsCompleted - stats.reflectionsCompleted
        } more reflections`
      );
    }

    // Recommend missing concepts
    const missingConcepts = nextReqs.concepts.filter(
      concept => !stats.conceptsMastered.includes(concept)
    );
    if (missingConcepts.length > 0) {
      recommendations.push(
        `Study these concepts: ${missingConcepts
          .map(c => CULTURAL_CONCEPTS[c]?.name || c)
          .join(', ')}`
      );
    }
  }

  // Recommend based on learning patterns
  if (stats.uniqueHexagrams.length < 8) {
    recommendations.push(
      'Explore the Eight Trigrams by encountering their representative hexagrams'
    );
  }

  if (stats.longestStreak < 7) {
    recommendations.push(
      'Build consistency with daily practice to develop a 7-day streak'
    );
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}
