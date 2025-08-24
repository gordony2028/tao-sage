/**
 * Cultural Sensitivity Validation Framework
 * Ensures respectful and accurate representation of Chinese wisdom traditions
 */

export interface CulturalValidationResult {
  isValid: boolean;
  score: number; // 0-1 scale
  warnings: string[];
  recommendations: string[];
}

export interface CulturalContent {
  text: string;
  context: 'hexagram' | 'philosophy' | 'interpretation' | 'educational';
  chineseTerms?: string[];
  culturalConcepts?: string[];
}

/**
 * Core cultural sensitivity validation rules
 */
export class CulturalValidator {
  private static readonly RESPECTFUL_LANGUAGE_PATTERNS = [
    'ancient wisdom',
    'traditional teaching',
    'Chinese philosophy',
    'cultural heritage',
    'sacred tradition',
    'time-honored practice'
  ];

  private static readonly PROBLEMATIC_PATTERNS = [
    'fortune telling',
    'magic',
    'supernatural',
    'mystical powers',
    'predict the future',
    'crystal ball',
    'fortune cookie',
    'oriental',
    'exotic',
    'mysterious east'
  ];

  private static readonly TRADITIONAL_CHINESE_TERMS = {
    'dao': '道',
    'tao': '道',
    'qi': '氣',
    'chi': '氣',
    'yin': '陰',
    'yang': '陽',
    'wu wei': '無為',
    'wuwei': '無為',
    'i ching': '易經',
    'yijing': '易經',
    'hexagram': '卦',
    'trigram': '三爻'
  };

  /**
   * Validates cultural content for sensitivity and accuracy
   */
  static validateContent(content: CulturalContent): CulturalValidationResult {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check for problematic language
    const problematicFound = this.PROBLEMATIC_PATTERNS.filter(pattern => 
      content.text.toLowerCase().includes(pattern.toLowerCase())
    );

    if (problematicFound.length > 0) {
      score -= 0.3;
      warnings.push(`Potentially problematic terms found: ${problematicFound.join(', ')}`);
      recommendations.push('Consider using more respectful language that honors the traditional context');
    }

    // Check for respectful language
    const respectfulFound = this.RESPECTFUL_LANGUAGE_PATTERNS.filter(pattern => 
      content.text.toLowerCase().includes(pattern.toLowerCase())
    );

    if (respectfulFound.length === 0) {
      score -= 0.2;
      recommendations.push('Consider adding language that acknowledges the cultural and historical context');
    }

    // Validate Chinese term usage
    const chineseTermValidation = this.validateChineseTerms(content.text);
    score -= chineseTermValidation.penalty;
    warnings.push(...chineseTermValidation.warnings);
    recommendations.push(...chineseTermValidation.recommendations);

    // Context-specific validation
    const contextValidation = this.validateByContext(content);
    score -= contextValidation.penalty;
    warnings.push(...contextValidation.warnings);
    recommendations.push(...contextValidation.recommendations);

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      isValid: score >= 0.7,
      score,
      warnings,
      recommendations
    };
  }

  /**
   * Validates proper use of Chinese terms
   */
  private static validateChineseTerms(text: string): {
    penalty: number;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let penalty = 0;

    // Check for common misspellings or incorrect usage
    if (text.toLowerCase().includes('tao') && !text.includes('道')) {
      recommendations.push('Consider including Chinese characters (道) when using "Tao" to honor the original language');
    }

    if (text.toLowerCase().includes('i ching') && !text.includes('易經')) {
      recommendations.push('Consider including Chinese characters (易經) when using "I Ching" to honor the original language');
    }

    // Check for overly simplified explanations
    if (text.toLowerCase().includes('yin yang') && text.length < 100) {
      warnings.push('Yin-Yang is a complex philosophical concept that may need more detailed explanation');
      penalty += 0.1;
    }

    return { penalty, warnings, recommendations };
  }

  /**
   * Context-specific validation rules
   */
  private static validateByContext(content: CulturalContent): {
    penalty: number;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let penalty = 0;

    switch (content.context) {
      case 'hexagram':
        if (!content.text.includes('traditional') && !content.text.includes('classical')) {
          recommendations.push('Consider referencing traditional or classical interpretations');
          penalty += 0.1;
        }
        break;

      case 'philosophy':
        if (content.text.toLowerCase().includes('believe') || content.text.toLowerCase().includes('religion')) {
          warnings.push('Taoist philosophy is often presented as belief system - consider framing as philosophical approach');
          penalty += 0.1;
        }
        break;

      case 'interpretation':
        if (content.text.toLowerCase().includes('will happen') || content.text.toLowerCase().includes('predict')) {
          warnings.push('Avoid predictive language - I Ching provides guidance, not fortune telling');
          penalty += 0.2;
        }
        break;

      case 'educational':
        if (!content.text.toLowerCase().includes('history') && !content.text.toLowerCase().includes('cultural')) {
          recommendations.push('Consider adding historical or cultural context for educational content');
          penalty += 0.1;
        }
        break;
    }

    return { penalty, warnings, recommendations };
  }

  /**
   * Quick validation for common content types
   */
  static validateHexagramInterpretation(interpretation: string): CulturalValidationResult {
    return this.validateContent({
      text: interpretation,
      context: 'interpretation'
    });
  }

  static validatePhilosophyContent(content: string): CulturalValidationResult {
    return this.validateContent({
      text: content,
      context: 'philosophy'
    });
  }

  static validateEducationalContent(content: string): CulturalValidationResult {
    return this.validateContent({
      text: content,
      context: 'educational'
    });
  }
}

/**
 * Cultural authenticity guidelines for content creation
 */
export const CULTURAL_GUIDELINES = {
  DO: [
    'Use traditional Chinese characters alongside romanization',
    'Provide historical and cultural context',
    'Acknowledge the sacred nature of these teachings',
    'Reference classical sources and translations',
    'Use respectful, honorific language',
    'Distinguish between traditional wisdom and modern interpretation',
    'Include pronunciation guides for Chinese terms',
    'Emphasize personal reflection over prediction'
  ],
  
  DONT: [
    'Use terms like "fortune telling" or "magic"',
    'Make specific predictions about future events',
    'Oversimplify complex philosophical concepts',
    'Use outdated terms like "oriental" or "exotic"',
    'Present interpretations as absolute truth',
    'Ignore the cultural and historical context',
    'Use I Ching terminology incorrectly',
    'Commercialize or trivialize the wisdom'
  ],

  TERMINOLOGY: {
    PREFERRED: [
      'ancient wisdom tradition',
      'Chinese philosophy',
      'traditional teaching',
      'cultural heritage',
      'contemplative practice',
      'guidance system',
      'wisdom literature'
    ],
    AVOID: [
      'fortune telling',
      'divination magic',
      'mystical powers',
      'oriental wisdom',
      'exotic knowledge',
      'supernatural guidance'
    ]
  }
};

/**
 * Validates content against cultural guidelines
 */
export function validateAgainstGuidelines(content: string): {
  followsGuidelines: boolean;
  violations: string[];
  suggestions: string[];
} {
  const violations: string[] = [];
  const suggestions: string[] = [];

  // Check for terms to avoid
  CULTURAL_GUIDELINES.TERMINOLOGY.AVOID.forEach(term => {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      violations.push(`Found discouraged term: "${term}"`);
      suggestions.push(`Consider replacing "${term}" with more respectful terminology`);
    }
  });

  // Check for preferred terminology usage
  const hasPreferredTerms = CULTURAL_GUIDELINES.TERMINOLOGY.PREFERRED.some(term =>
    content.toLowerCase().includes(term.toLowerCase())
  );

  if (!hasPreferredTerms && content.length > 100) {
    suggestions.push('Consider incorporating respectful terminology from our preferred list');
  }

  return {
    followsGuidelines: violations.length === 0,
    violations,
    suggestions
  };
}