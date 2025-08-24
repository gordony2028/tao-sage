import { NextRequest, NextResponse } from 'next/server';
import { getUserConsultations } from '@/lib/supabase/consultations';
import {
  analyzeAIPersonality,
  getPersonalityIndicator,
} from '@/lib/ai/personality-analysis';

interface ExportFilters {
  startDate?: string;
  endDate?: string;
  hexagramFilter?: number[];
  includeInterpretations?: boolean;
  includeNotes?: boolean;
  includeAnalytics?: boolean;
  includePersonalityData?: boolean;
  includeCulturalInsights?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, filters }: { userId: string; filters: ExportFilters } =
      body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all consultations for the user
    const { data: allConsultations } = await getUserConsultations(userId, {
      limit: 1000, // Get all consultations
      status: 'active',
    });

    // Apply filters
    let filteredConsultations = [...allConsultations];

    if (filters.startDate) {
      filteredConsultations = filteredConsultations.filter(
        c => new Date(c.created_at) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filteredConsultations = filteredConsultations.filter(
        c => new Date(c.created_at) <= new Date(filters.endDate!)
      );
    }

    if (filters.hexagramFilter && filters.hexagramFilter.length > 0) {
      filteredConsultations = filteredConsultations.filter(c =>
        filters.hexagramFilter!.includes(c.hexagram_number)
      );
    }

    // Generate comprehensive export data
    const exportData = await generateExportData(filteredConsultations, filters);

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Failed to generate export data:', error);
    return NextResponse.json(
      { error: 'Failed to generate export data' },
      { status: 500 }
    );
  }
}

async function generateExportData(
  consultations: any[],
  filters: ExportFilters
) {
  const exportData: any = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalRecords: consultations.length,
      filters: filters,
      version: '2.0',
      culturalContext: {
        tradition: 'I Ching (易經) - Chinese Book of Changes',
        philosophy: 'Ancient Chinese divination and philosophy',
        approach: 'Modern AI-enhanced interpretation with cultural respect',
      },
    },
    consultations: [],
    analytics: null,
    personalityAnalysis: null,
    culturalInsights: null,
  };

  // Process consultations
  for (const consultation of consultations) {
    const processedConsultation: any = {
      id: consultation.id,
      timestamp: consultation.created_at,
      question: consultation.question,
      hexagram: {
        number: consultation.hexagram_number,
        name: consultation.hexagram_name,
        chineseName: getChineseHexagramName(consultation.hexagram_number),
        lines: consultation.lines,
        changingLines: consultation.changing_lines,
        structure: {
          upperTrigram: getTrigramInfo(consultation.lines.slice(3, 6)),
          lowerTrigram: getTrigramInfo(consultation.lines.slice(0, 3)),
        },
      },
      metadata: {
        consultationMethod: consultation.consultation_method,
        status: consultation.status,
        tags: consultation.tags,
        createdAt: consultation.created_at,
        updatedAt: consultation.updated_at,
      },
    };

    // Add interpretation if requested
    if (filters.includeInterpretations) {
      processedConsultation.interpretation = {
        ...consultation.interpretation,
        sections: {
          primary: consultation.interpretation.interpretation,
          ancientWisdom: consultation.interpretation.ancientWisdom || null,
          guidance: consultation.interpretation.guidance || null,
          practicalAdvice: consultation.interpretation.practicalAdvice || null,
          spiritualInsight:
            consultation.interpretation.spiritualInsight || null,
          timing: consultation.interpretation.timing || null,
          culturalContext: consultation.interpretation.culturalContext || null,
        },
      };
    }

    // Add personality analysis if requested
    if (filters.includePersonalityData) {
      const personalityProfile = analyzeAIPersonality(
        consultation.interpretation
      );
      const personalityIndicator = getPersonalityIndicator(personalityProfile);

      processedConsultation.aiPersonality = {
        archetype: {
          type: personalityIndicator.archetype,
          description: personalityIndicator.description,
          character: personalityIndicator.character,
          traits: personalityIndicator.traits,
        },
        communicationStyle: {
          tone: personalityProfile.style.tone,
          formality: personalityProfile.style.formality,
          depth: personalityProfile.style.depth,
          culturalEmbedding: personalityProfile.style.culturalEmbedding,
        },
        thematicFocus: {
          primary: personalityProfile.themes.primary,
          secondary: personalityProfile.themes.secondary,
          emphasis: personalityProfile.themes.emphasis,
        },
        traditionEmphasis: personalityProfile.tradition,
        emotionalResonance: personalityProfile.resonance,
        languagePatterns: {
          metaphorUsage: personalityProfile.language.metaphorUsage,
          structuralElements: personalityProfile.language.structuralElements,
          keyPhrases: personalityProfile.language.keyPhrases,
        },
      };
    }

    // Add notes if requested
    if (filters.includeNotes && consultation.notes) {
      processedConsultation.personalReflection = {
        content: consultation.notes,
        length: consultation.notes.length,
        wordCount: consultation.notes.split(/\s+/).length,
        culturalReferences: extractCulturalReferences(consultation.notes),
        reflectionCategories: categorizeReflection(consultation.notes),
      };
    }

    exportData.consultations.push(processedConsultation);
  }

  // Generate analytics if requested
  if (filters.includeAnalytics) {
    exportData.analytics = await generateComprehensiveAnalytics(consultations);
  }

  // Generate cultural insights if requested
  if (filters.includeCulturalInsights) {
    exportData.culturalInsights = generateCulturalInsights(consultations);
  }

  return exportData;
}

function getChineseHexagramName(hexagramNumber: number): string {
  const chineseNames: { [key: number]: string } = {
    1: '乾 (qián)',
    2: '坤 (kūn)',
    3: '屯 (zhūn)',
    4: '蒙 (méng)',
    5: '需 (xū)',
    6: '訟 (sòng)',
    7: '師 (shī)',
    8: '比 (bǐ)',
    9: '小畜 (xiǎo xù)',
    10: '履 (lǚ)',
    11: '泰 (tài)',
    12: '否 (pǐ)',
    13: '同人 (tóng rén)',
    14: '大有 (dà yǒu)',
    15: '謙 (qiān)',
    16: '豫 (yù)',
    17: '隨 (suí)',
    18: '蠱 (gǔ)',
    19: '臨 (lín)',
    20: '觀 (guān)',
    21: '噬嗑 (shì kē)',
    22: '賁 (bì)',
    23: '剝 (bō)',
    24: '復 (fù)',
    25: '無妄 (wú wàng)',
    26: '大畜 (dà xù)',
    27: '頤 (yí)',
    28: '大過 (dà guò)',
    29: '坎 (kǎn)',
    30: '離 (lí)',
    31: '咸 (xián)',
    32: '恆 (héng)',
    33: '遯 (dùn)',
    34: '大壯 (dà zhuàng)',
    35: '晉 (jìn)',
    36: '明夷 (míng yí)',
    37: '家人 (jiā rén)',
    38: '睽 (kuí)',
    39: '蹇 (jiǎn)',
    40: '解 (xiè)',
    41: '損 (sǔn)',
    42: '益 (yì)',
    43: '夬 (guài)',
    44: '姤 (gòu)',
    45: '萃 (cuì)',
    46: '升 (shēng)',
    47: '困 (kùn)',
    48: '井 (jǐng)',
    49: '革 (gé)',
    50: '鼎 (dǐng)',
    51: '震 (zhèn)',
    52: '艮 (gèn)',
    53: '漸 (jiàn)',
    54: '歸妹 (guī mèi)',
    55: '豐 (fēng)',
    56: '旅 (lǚ)',
    57: '巽 (xùn)',
    58: '兌 (duì)',
    59: '渙 (huàn)',
    60: '節 (jié)',
    61: '中孚 (zhōng fú)',
    62: '小過 (xiǎo guò)',
    63: '既濟 (jì jì)',
    64: '未濟 (wèi jì)',
  };

  return chineseNames[hexagramNumber] || `第${hexagramNumber}卦`;
}

function getTrigramInfo(lines: number[]): any {
  const trigramMap = {
    '777': {
      name: 'Heaven',
      chinese: '乾 (Qián)',
      element: 'Metal',
      attribute: 'Creative',
    },
    '888': {
      name: 'Earth',
      chinese: '坤 (Kūn)',
      element: 'Earth',
      attribute: 'Receptive',
    },
    '788': {
      name: 'Thunder',
      chinese: '震 (Zhèn)',
      element: 'Wood',
      attribute: 'Arousing',
    },
    '887': {
      name: 'Mountain',
      chinese: '艮 (Gèn)',
      element: 'Earth',
      attribute: 'Keeping Still',
    },
    '878': {
      name: 'Water',
      chinese: '坎 (Kǎn)',
      element: 'Water',
      attribute: 'Abysmal',
    },
    '787': {
      name: 'Wind',
      chinese: '巽 (Xùn)',
      element: 'Wood',
      attribute: 'Gentle',
    },
    '877': {
      name: 'Fire',
      chinese: '離 (Lí)',
      element: 'Fire',
      attribute: 'Clinging',
    },
    '778': {
      name: 'Lake',
      chinese: '兌 (Duì)',
      element: 'Metal',
      attribute: 'Joyous',
    },
  };

  const key = lines.map(line => (line % 2 === 1 ? '7' : '8')).join('');
  return (
    trigramMap[key as keyof typeof trigramMap] || {
      name: 'Unknown',
      chinese: '未知',
      element: 'Unknown',
      attribute: 'Unknown',
    }
  );
}

function extractCulturalReferences(notes: string): string[] {
  const culturalTerms = [
    'yin',
    'yang',
    'qi',
    'tao',
    'dao',
    'wu wei',
    'balance',
    'harmony',
    'virtue',
    'righteousness',
    'benevolence',
    'wisdom',
    'mindfulness',
    'meditation',
    'compassion',
    'impermanence',
    'flow',
    'natural',
    'season',
    'element',
    'fire',
    'water',
    'earth',
    'metal',
    'wood',
    'ancestor',
    'tradition',
    'heritage',
    'generation',
    'confucius',
    'laozi',
    'buddha',
    'zen',
    'chan',
    'temple',
    'sage',
    'master',
  ];

  const lowerNotes = notes.toLowerCase();
  return culturalTerms.filter(term => lowerNotes.includes(term));
}

function categorizeReflection(notes: string): string[] {
  const categories = [];
  const lowerNotes = notes.toLowerCase();

  if (
    lowerNotes.includes('decision') ||
    lowerNotes.includes('choice') ||
    lowerNotes.includes('should')
  ) {
    categories.push('Decision Making');
  }
  if (
    lowerNotes.includes('relationship') ||
    lowerNotes.includes('family') ||
    lowerNotes.includes('friend')
  ) {
    categories.push('Relationships');
  }
  if (
    lowerNotes.includes('work') ||
    lowerNotes.includes('career') ||
    lowerNotes.includes('job')
  ) {
    categories.push('Career');
  }
  if (
    lowerNotes.includes('health') ||
    lowerNotes.includes('wellness') ||
    lowerNotes.includes('body')
  ) {
    categories.push('Health & Wellness');
  }
  if (
    lowerNotes.includes('spiritual') ||
    lowerNotes.includes('soul') ||
    lowerNotes.includes('divine')
  ) {
    categories.push('Spiritual');
  }
  if (
    lowerNotes.includes('learn') ||
    lowerNotes.includes('grow') ||
    lowerNotes.includes('develop')
  ) {
    categories.push('Personal Growth');
  }
  if (
    lowerNotes.includes('grateful') ||
    lowerNotes.includes('thank') ||
    lowerNotes.includes('appreciate')
  ) {
    categories.push('Gratitude');
  }

  return categories.length > 0 ? categories : ['General Reflection'];
}

async function generateComprehensiveAnalytics(consultations: any[]) {
  // This would integrate with the analytics API route
  const response = await fetch(
    `/api/export/analytics?user_id=${consultations[0]?.user_id}`,
    {
      method: 'GET',
    }
  );

  if (response.ok) {
    return await response.json();
  }

  // Fallback basic analytics
  return {
    totalConsultations: consultations.length,
    dateRange:
      consultations.length > 0
        ? `${consultations[consultations.length - 1].created_at} to ${
            consultations[0].created_at
          }`
        : 'No consultations',
    uniqueHexagrams: new Set(consultations.map(c => c.hexagram_number)).size,
    completionRate: Math.round(
      (new Set(consultations.map(c => c.hexagram_number)).size / 64) * 100
    ),
  };
}

function generateCulturalInsights(consultations: any[]) {
  const consultationsWithNotes = consultations.filter(
    c => c.notes && c.notes.trim()
  );

  // Analyze cultural depth
  const culturalTermsUsed = new Set();
  const philosophicalTraditions = {
    confucian: 0,
    taoist: 0,
    buddhist: 0,
  };

  consultationsWithNotes.forEach(c => {
    const notes = c.notes.toLowerCase();

    // Track cultural terms
    [
      'yin',
      'yang',
      'qi',
      'tao',
      'virtue',
      'harmony',
      'balance',
      'wisdom',
    ].forEach(term => {
      if (notes.includes(term)) {
        culturalTermsUsed.add(term);
      }
    });

    // Track philosophical traditions
    if (
      notes.includes('virtue') ||
      notes.includes('righteousness') ||
      notes.includes('benevolence')
    ) {
      philosophicalTraditions.confucian++;
    }
    if (
      notes.includes('tao') ||
      notes.includes('wu wei') ||
      notes.includes('natural') ||
      notes.includes('flow')
    ) {
      philosophicalTraditions.taoist++;
    }
    if (
      notes.includes('mindful') ||
      notes.includes('compassion') ||
      notes.includes('impermanence')
    ) {
      philosophicalTraditions.buddhist++;
    }
  });

  return {
    culturalEngagement: {
      termsUsed: Array.from(culturalTermsUsed),
      depthScore: Math.min(100, (culturalTermsUsed.size / 20) * 100), // Out of 20 key terms
      philosophicalAlignment: philosophicalTraditions,
    },
    traditionalElements: {
      hexagramCompleteness: Math.round(
        (new Set(consultations.map(c => c.hexagram_number)).size / 64) * 100
      ),
      seasonalAwareness: consultationsWithNotes.filter(c =>
        ['spring', 'summer', 'autumn', 'winter', 'season'].some(term =>
          c.notes.toLowerCase().includes(term)
        )
      ).length,
      elementalReferences: ['fire', 'water', 'earth', 'metal', 'wood'].map(
        element => ({
          element,
          mentions: consultationsWithNotes.filter(c =>
            c.notes.toLowerCase().includes(element)
          ).length,
        })
      ),
    },
    wisdomPatterns: {
      contemplativeReflections: consultationsWithNotes.filter(c =>
        ['reflect', 'contemplate', 'ponder', 'consider'].some(term =>
          c.notes.toLowerCase().includes(term)
        )
      ).length,
      actionOrientedInsights: consultationsWithNotes.filter(c =>
        ['action', 'act', 'do', 'implement', 'practice'].some(term =>
          c.notes.toLowerCase().includes(term)
        )
      ).length,
      balanceReferences: consultationsWithNotes.filter(c =>
        c.notes.toLowerCase().includes('balance')
      ).length,
    },
    recommendations: [
      'Continue exploring the rich cultural context of the I Ching',
      'Consider studying the philosophical backgrounds: Confucianism, Taoism, Buddhism',
      'Reflect on seasonal and elemental correspondences in your consultations',
      'Practice integrating ancient wisdom with modern life decisions',
    ],
  };
}
