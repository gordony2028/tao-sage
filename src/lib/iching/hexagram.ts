/**
 * I Ching Hexagram Generation Engine
 *
 * Implements authentic I Ching divination following traditional
 * coin-casting methods and hexagram calculation algorithms.
 */

import type { GeneratedHexagram, LineValue } from '@/types/iching';

/**
 * Traditional names for all 64 hexagrams
 * Based on the Wilhelm-Baynes translation
 */
const HEXAGRAM_NAMES: Record<number, string> = {
  1: 'The Creative',
  2: 'The Receptive',
  3: 'Difficulty at the Beginning',
  4: 'Youthful Folly',
  5: 'Waiting (Nourishment)',
  6: 'Conflict',
  7: 'The Army',
  8: 'Holding Together (Union)',
  9: 'The Taming Power of the Small',
  10: 'Treading (Conduct)',
  11: 'Peace',
  12: 'Standstill (Stagnation)',
  13: 'Fellowship with Men',
  14: 'Possession in Great Measure',
  15: 'Modesty',
  16: 'Enthusiasm',
  17: 'Following',
  18: 'Work on What Has Been Spoiled (Decay)',
  19: 'Approach',
  20: 'Contemplation (View)',
  21: 'Biting Through',
  22: 'Grace',
  23: 'Splitting Apart',
  24: 'Return (The Turning Point)',
  25: 'Innocence (The Unexpected)',
  26: 'The Taming Power of the Great',
  27: 'The Corners of the Mouth (Providing Nourishment)',
  28: 'Preponderance of the Great',
  29: 'The Abysmal (Water)',
  30: 'The Clinging (Fire)',
  31: 'Influence (Wooing)',
  32: 'Duration',
  33: 'Retreat',
  34: 'The Power of the Great',
  35: 'Progress',
  36: 'Darkening of the Light',
  37: 'The Family (The Clan)',
  38: 'Opposition',
  39: 'Obstruction',
  40: 'Deliverance',
  41: 'Decrease',
  42: 'Increase',
  43: 'Break-through (Resoluteness)',
  44: 'Coming to Meet',
  45: 'Gathering Together (Massing)',
  46: 'Pushing Upward',
  47: 'Oppression (Exhaustion)',
  48: 'The Well',
  49: 'Revolution (Molting)',
  50: 'The Cauldron',
  51: 'The Arousing (Shock, Thunder)',
  52: 'Keeping Still (Mountain)',
  53: 'Development (Gradual Progress)',
  54: 'The Marrying Maiden',
  55: 'Abundance (Fullness)',
  56: 'The Wanderer',
  57: 'The Gentle (The Penetrating, Wind)',
  58: 'The Joyous (Lake)',
  59: 'Dispersion (Dissolution)',
  60: 'Limitation',
  61: 'Inner Truth',
  62: 'Preponderance of the Small',
  63: 'After Completion',
  64: 'Before Completion',
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

  const name = HEXAGRAM_NAMES[number];
  if (!name) {
    throw new Error(`No name found for hexagram ${number}`);
  }
  return name;
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
