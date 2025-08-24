/**
 * I Ching Type Definitions
 *
 * Core types for the I Ching consultation system, representing
 * traditional Chinese divination concepts in modern TypeScript.
 */

/**
 * Represents the four possible line types in I Ching
 * - 6: Old Yin (changing to Yang)
 * - 7: Young Yang (stable)
 * - 8: Young Yin (stable)
 * - 9: Old Yang (changing to Yin)
 */
export type LineValue = 6 | 7 | 8 | 9;

/**
 * A complete I Ching hexagram with all associated data
 */
export interface Hexagram {
  /** Hexagram number (1-64) */
  number: number;
  /** Traditional name of the hexagram */
  name: string;
  /** Array of 6 line values, from bottom to top */
  lines: [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue];
  /** Positions (1-6) of changing lines, if any */
  changingLines: number[];
}

/**
 * Generated hexagram from consultation (without name lookup)
 */
export interface GeneratedHexagram {
  /** Hexagram number (1-64) */
  number: number;
  /** Array of 6 line values, from bottom to top */
  lines: [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue];
  /** Positions (1-6) of changing lines, if any */
  changingLines: number[];
}

/**
 * Traditional trigram (3-line symbol)
 */
export interface Trigram {
  /** Binary representation of trigram (bottom to top) */
  binary: [0 | 1, 0 | 1, 0 | 1];
  /** Traditional name */
  name: string;
  /** Element association */
  element: string;
  /** Natural phenomenon */
  symbol: string;
}

/**
 * Consultation context for AI interpretation
 */
export interface ConsultationContext {
  /** User's question */
  question: string;
  /** Generated hexagram */
  hexagram: Hexagram;
  /** Timestamp of consultation */
  timestamp: Date;
  /** Method used for generation */
  method: 'digital_coins' | 'manual_entry';
}

/**
 * AI-generated interpretation structure
 * Enhanced for rich, meaningful content
 */
export interface AIInterpretation {
  /** Core meaning and insight into the situation */
  interpretation: string;
  /** Ancient wisdom and traditional teachings */
  ancientWisdom?: string;
  /** Practical guidance for current situation */
  guidance?: string;
  /** Specific actionable advice */
  practicalAdvice?: string;
  /** Deeper spiritual insights and growth opportunities */
  spiritualInsight?: string;
  /** Timing and flow guidance */
  timing?: string;
  /** Cultural and historical context */
  culturalContext?: string;
}

/**
 * Complete consultation record
 */
export interface Consultation {
  /** Unique consultation ID */
  id: string;
  /** User ID who performed consultation */
  userId: string;
  /** User's question */
  question: string;
  /** Generated hexagram data */
  hexagram: Hexagram;
  /** AI-generated interpretation */
  interpretation: AIInterpretation;
  /** Consultation metadata */
  metadata: {
    method: 'digital_coins' | 'manual_entry';
    ipAddress?: string;
    userAgent?: string;
  };
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Status for organization */
  status: 'active' | 'archived';
  /** User-defined tags */
  tags: string[];
  /** User notes */
  notes?: string;
}
