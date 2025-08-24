/**
 * I Ching Hexagram Generation Engine
 *
 * Implements authentic I Ching divination following traditional
 * coin-casting methods and hexagram calculation algorithms.
 */

import type { GeneratedHexagram, LineValue } from '@/types/iching';

/**
 * Traditional names for all 64 hexagrams
 * Based on the Wilhelm-Baynes translation with Chinese characters
 */
const HEXAGRAM_NAMES: Record<number, { chinese: string; english: string }> = {
  1: { chinese: '乾', english: 'The Creative' },
  2: { chinese: '坤', english: 'The Receptive' },
  3: { chinese: '屯', english: 'Difficulty at the Beginning' },
  4: { chinese: '蒙', english: 'Youthful Folly' },
  5: { chinese: '需', english: 'Waiting (Nourishment)' },
  6: { chinese: '訟', english: 'Conflict' },
  7: { chinese: '師', english: 'The Army' },
  8: { chinese: '比', english: 'Holding Together (Union)' },
  9: { chinese: '小畜', english: 'The Taming Power of the Small' },
  10: { chinese: '履', english: 'Treading (Conduct)' },
  11: { chinese: '泰', english: 'Peace' },
  12: { chinese: '否', english: 'Standstill (Stagnation)' },
  13: { chinese: '同人', english: 'Fellowship with Men' },
  14: { chinese: '大有', english: 'Possession in Great Measure' },
  15: { chinese: '謙', english: 'Modesty' },
  16: { chinese: '豫', english: 'Enthusiasm' },
  17: { chinese: '隨', english: 'Following' },
  18: { chinese: '蠱', english: 'Work on What Has Been Spoiled (Decay)' },
  19: { chinese: '臨', english: 'Approach' },
  20: { chinese: '觀', english: 'Contemplation (View)' },
  21: { chinese: '噬嗑', english: 'Biting Through' },
  22: { chinese: '賁', english: 'Grace' },
  23: { chinese: '剝', english: 'Splitting Apart' },
  24: { chinese: '復', english: 'Return (The Turning Point)' },
  25: { chinese: '無妄', english: 'Innocence (The Unexpected)' },
  26: { chinese: '大畜', english: 'The Taming Power of the Great' },
  27: {
    chinese: '頤',
    english: 'The Corners of the Mouth (Providing Nourishment)',
  },
  28: { chinese: '大過', english: 'Preponderance of the Great' },
  29: { chinese: '坎', english: 'The Abysmal (Water)' },
  30: { chinese: '離', english: 'The Clinging (Fire)' },
  31: { chinese: '咸', english: 'Influence (Wooing)' },
  32: { chinese: '恆', english: 'Duration' },
  33: { chinese: '遯', english: 'Retreat' },
  34: { chinese: '大壯', english: 'The Power of the Great' },
  35: { chinese: '晉', english: 'Progress' },
  36: { chinese: '明夷', english: 'Darkening of the Light' },
  37: { chinese: '家人', english: 'The Family (The Clan)' },
  38: { chinese: '睽', english: 'Opposition' },
  39: { chinese: '蹇', english: 'Obstruction' },
  40: { chinese: '解', english: 'Deliverance' },
  41: { chinese: '損', english: 'Decrease' },
  42: { chinese: '益', english: 'Increase' },
  43: { chinese: '夬', english: 'Break-through (Resoluteness)' },
  44: { chinese: '姤', english: 'Coming to Meet' },
  45: { chinese: '萃', english: 'Gathering Together (Massing)' },
  46: { chinese: '升', english: 'Pushing Upward' },
  47: { chinese: '困', english: 'Oppression (Exhaustion)' },
  48: { chinese: '井', english: 'The Well' },
  49: { chinese: '革', english: 'Revolution (Molting)' },
  50: { chinese: '鼎', english: 'The Cauldron' },
  51: { chinese: '震', english: 'The Arousing (Shock, Thunder)' },
  52: { chinese: '艮', english: 'Keeping Still (Mountain)' },
  53: { chinese: '漸', english: 'Development (Gradual Progress)' },
  54: { chinese: '歸妹', english: 'The Marrying Maiden' },
  55: { chinese: '豐', english: 'Abundance (Fullness)' },
  56: { chinese: '旅', english: 'The Wanderer' },
  57: { chinese: '巽', english: 'The Gentle (The Penetrating, Wind)' },
  58: { chinese: '兌', english: 'The Joyous (Lake)' },
  59: { chinese: '渙', english: 'Dispersion (Dissolution)' },
  60: { chinese: '節', english: 'Limitation' },
  61: { chinese: '中孚', english: 'Inner Truth' },
  62: { chinese: '小過', english: 'Preponderance of the Small' },
  63: { chinese: '既濟', english: 'After Completion' },
  64: { chinese: '未濟', english: 'Before Completion' },
};

/**
 * Simulates traditional three-coin casting method
 * Each coin toss determines the line value:
 * - 3 heads = 9 (old yang, changing)
 * - 2 heads, 1 tail = 7 (young yang, stable)
 * - 1 head, 2 tails = 8 (young yin, stable)
 * - 3 tails = 6 (old yin, changing)
 */
function castCoinsForLine(): LineValue {
  // Simulate casting three coins (0 = tail, 1 = head)
  const coin1 = Math.random() < 0.5 ? 0 : 1;
  const coin2 = Math.random() < 0.5 ? 0 : 1;
  const coin3 = Math.random() < 0.5 ? 0 : 1;

  const heads = coin1 + coin2 + coin3;

  switch (heads) {
    case 3:
      return 9; // old yang (changing)
    case 2:
      return 7; // young yang (stable)
    case 1:
      return 8; // young yin (stable)
    case 0:
      return 6; // old yin (changing)
    default:
      return 7; // fallback
  }
}

/**
 * Converts hexagram lines to traditional binary representation
 * for hexagram number calculation
 */
function linesToBinary(lines: LineValue[]): string {
  return lines
    .map(line => {
      // Convert to yin (0) or yang (1) for calculation
      // 6 (old yin) and 8 (young yin) = 0
      // 7 (young yang) and 9 (old yang) = 1
      return line === 7 || line === 9 ? '1' : '0';
    })
    .reverse() // Traditional order: top to bottom
    .join('');
}

/**
 * Calculate hexagram number from binary representation
 * Uses traditional lookup table mapping
 */
function binaryToHexagramNumber(binary: string): number {
  // Traditional hexagram lookup table
  // Maps 6-bit binary to hexagram numbers
  const binaryLookup: Record<string, number> = {
    '111111': 1,
    '000000': 2,
    '100010': 3,
    '010001': 4,
    '111010': 5,
    '010111': 6,
    '010000': 7,
    '000010': 8,
    '111011': 9,
    '110111': 10,
    '111000': 11,
    '000111': 12,
    '101111': 13,
    '111101': 14,
    '001000': 15,
    '000100': 16,
    '100110': 17,
    '011001': 18,
    '110000': 19,
    '000011': 20,
    '100101': 21,
    '101001': 22,
    '000001': 23,
    '100000': 24,
    '100111': 25,
    '111001': 26,
    '100001': 27,
    '011110': 28,
    '010010': 29,
    '101101': 30,
    '001110': 31,
    '011100': 32,
    '001111': 33,
    '111100': 34,
    '000101': 35,
    '101000': 36,
    '101011': 37,
    '110101': 38,
    '001010': 39,
    '010100': 40,
    '110001': 41,
    '100011': 42,
    '111110': 43,
    '011111': 44,
    '000110': 45,
    '011000': 46,
    '010110': 47,
    '011010': 48,
    '101110': 49,
    '011101': 50,
    '100100': 51,
    '001001': 52,
    '001011': 53,
    '110100': 54,
    '101100': 55,
    '001101': 56,
    '011011': 57,
    '110110': 58,
    '010011': 59,
    '110010': 60,
    '110011': 61,
    '001100': 62,
    '101010': 63,
    '010101': 64,
  };

  return binaryLookup[binary] || 1; // Default to hexagram 1 if not found
}

/**
 * Generates a complete I Ching hexagram using traditional coin-casting method
 *
 * @returns GeneratedHexagram with number, lines, and changing lines
 */
export function generateHexagram(): GeneratedHexagram {
  // Cast coins for each of the 6 lines (bottom to top)
  const lines: [
    LineValue,
    LineValue,
    LineValue,
    LineValue,
    LineValue,
    LineValue,
  ] = [
    castCoinsForLine(),
    castCoinsForLine(),
    castCoinsForLine(),
    castCoinsForLine(),
    castCoinsForLine(),
    castCoinsForLine(),
  ];

  // Calculate hexagram number from binary representation
  const binary = linesToBinary(lines);
  const number = binaryToHexagramNumber(binary);

  // Calculate changing lines
  const changingLines = calculateChangingLines(lines);

  return {
    number,
    lines,
    changingLines,
  };
}

/**
 * Gets the traditional name for a hexagram number
 *
 * @param number Hexagram number (1-64)
 * @returns Traditional hexagram name
 * @throws Error if number is invalid
 */
export function getHexagramName(number: number): string {
  if (number < 1 || number > 64 || !Number.isInteger(number)) {
    throw new Error(
      `Invalid hexagram number: ${number}. Must be integer between 1 and 64.`
    );
  }

  const hexagram = HEXAGRAM_NAMES[number];
  if (!hexagram) {
    throw new Error(`No name found for hexagram ${number}`);
  }
  return hexagram.english;
}

export function getHexagramChineseName(number: number): string {
  if (number < 1 || number > 64 || !Number.isInteger(number)) {
    throw new Error(
      `Invalid hexagram number: ${number}. Must be integer between 1 and 64.`
    );
  }

  const hexagram = HEXAGRAM_NAMES[number];
  if (!hexagram) {
    throw new Error(`No name found for hexagram ${number}`);
  }
  return hexagram.chinese;
}

export function getHexagramFullName(number: number): {
  chinese: string;
  english: string;
} {
  if (number < 1 || number > 64 || !Number.isInteger(number)) {
    throw new Error(
      `Invalid hexagram number: ${number}. Must be integer between 1 and 64.`
    );
  }

  const hexagram = HEXAGRAM_NAMES[number];
  if (!hexagram) {
    throw new Error(`No name found for hexagram ${number}`);
  }
  return hexagram;
}

/**
 * Calculates which lines are changing (old yin/old yang)
 *
 * @param lines Array of 6 line values
 * @returns Array of 1-indexed positions of changing lines
 */
export function calculateChangingLines(lines: LineValue[]): number[] {
  const changingPositions: number[] = [];

  lines.forEach((line, index) => {
    // Old yin (6) and old yang (9) are changing lines
    if (line === 6 || line === 9) {
      changingPositions.push(index + 1); // 1-indexed position
    }
  });

  return changingPositions;
}
