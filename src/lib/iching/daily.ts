/**
 * Daily Hexagram Generation System
 * Provides deterministic daily hexagrams with timezone awareness
 */

import {
  generateHexagram,
  getHexagramName,
  getHexagramChineseName,
} from './hexagram';
import type { Hexagram, LineValue } from '@/types/iching';

/**
 * Generate daily hexagram based on date seed
 * Same hexagram for all users on the same day (timezone aware)
 */
export function generateDailyHexagram(
  date?: Date,
  timezone?: string
): Hexagram {
  const targetDate = date || new Date();

  // Use timezone-aware date calculation
  const dateString = timezone
    ? targetDate.toLocaleDateString('en-CA', { timeZone: timezone })
    : targetDate.toLocaleDateString('en-CA');

  // Create deterministic seed from date
  const seed = hashDateString(dateString);

  // Generate hexagram with seeded randomness
  const lines = generateSeededLines(seed);
  const hexagramNumber = calculateHexagramNumber(lines);
  const changingLines = generateSeededChangingLines(seed, lines);

  return {
    number: hexagramNumber,
    name: getHexagramName(hexagramNumber),
    chineseName: getHexagramChineseName(hexagramNumber),
    lines,
    changingLines,
  };
}

/**
 * Generate daily guidance data with streak tracking
 */
export interface DailyGuidance {
  hexagram: Hexagram;
  date: string;
  timezone: string;
  wisdom: string;
  focus: string;
  reflection: string;
  streak: number;
}

export function generateDailyGuidance(
  userId: string,
  date?: Date,
  timezone: string = 'UTC',
  userStreak: number = 0
): DailyGuidance {
  const targetDate = date || new Date();
  const hexagram = generateDailyHexagram(targetDate, timezone);

  return {
    hexagram,
    date: targetDate.toISOString().split('T')[0],
    timezone,
    wisdom: generateDailyWisdom(hexagram),
    focus: generateDailyFocus(hexagram),
    reflection: generateDailyReflection(hexagram),
    streak: userStreak,
  };
}

/**
 * Create consistent hash from date string
 */
function hashDateString(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate hexagram lines using seeded randomness
 */
function generateSeededLines(
  seed: number
): [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue] {
  const lines: LineValue[] = [];
  let currentSeed = seed;

  for (let i = 0; i < 6; i++) {
    // Linear congruential generator for deterministic randomness
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
    const random = currentSeed / 0x7fffffff;

    // Traditional I Ching probability: 1/4 for each line type
    if (random < 0.125) {
      lines.push(6); // Old Yin (changing)
    } else if (random < 0.375) {
      lines.push(7); // Young Yang
    } else if (random < 0.625) {
      lines.push(8); // Young Yin
    } else if (random < 0.75) {
      lines.push(9); // Old Yang (changing)
    } else if (random < 0.875) {
      lines.push(8); // Young Yin (more common)
    } else {
      lines.push(7); // Young Yang (more common)
    }
  }

  return lines as [
    LineValue,
    LineValue,
    LineValue,
    LineValue,
    LineValue,
    LineValue,
  ];
}

/**
 * Calculate hexagram number from lines
 */
function calculateHexagramNumber(lines: LineValue[]): number {
  // Convert lines to binary for King Wen sequence
  let upperTrigram = 0;
  let lowerTrigram = 0;

  // Calculate trigrams (Yang = 1, Yin = 0)
  for (let i = 0; i < 3; i++) {
    if (lines[i] === 7 || lines[i] === 9) {
      // Yang lines
      upperTrigram |= 1 << (2 - i);
    }
    if (lines[i + 3] === 7 || lines[i + 3] === 9) {
      // Yang lines
      lowerTrigram |= 1 << (2 - i);
    }
  }

  // King Wen sequence lookup table
  const kingWenTable = [
    [2, 23, 8, 20, 16, 35, 45, 12], // Upper trigram 0 (☷)
    [24, 27, 3, 42, 51, 21, 17, 25], // Upper trigram 1 (☳)
    [6, 4, 40, 59, 64, 47, 58, 48], // Upper trigram 2 (☵)
    [33, 31, 56, 62, 53, 39, 52, 15], // Upper trigram 3 (☶)
    [44, 46, 32, 50, 57, 9, 5, 14], // Upper trigram 4 (☴)
    [13, 36, 63, 55, 37, 22, 30, 49], // Upper trigram 5 (☲)
    [10, 19, 54, 60, 61, 41, 43, 28], // Upper trigram 6 (☱)
    [34, 11, 26, 18, 1, 38, 7, 29], // Upper trigram 7 (☰)
  ];

  return kingWenTable[upperTrigram][lowerTrigram];
}

/**
 * Generate changing lines using seeded randomness
 */
function generateSeededChangingLines(
  seed: number,
  lines: LineValue[]
): number[] {
  const changingLines: number[] = [];

  // Add changing lines based on line values (6 and 9 are changing)
  lines.forEach((line, index) => {
    if (line === 6 || line === 9) {
      changingLines.push(index + 1); // I Ching lines are numbered 1-6
    }
  });

  return changingLines;
}

/**
 * Generate daily wisdom text based on hexagram
 */
function generateDailyWisdom(hexagram: Hexagram): string {
  const wisdomTemplates = {
    1: 'Today calls for creative leadership and taking initiative in your endeavors.',
    2: 'Embrace receptivity and allow situations to unfold naturally with patience.',
    3: 'New beginnings often come with initial challenges - persist with determination.',
    4: "Approach today with beginner's mind, open to learning and guidance.",
    5: 'Practice patience and wait for the right moment to take action.',
    // Add more hexagram-specific wisdom templates...
  };

  return (
    wisdomTemplates[hexagram.number as keyof typeof wisdomTemplates] ||
    'Today offers opportunities for growth and deeper understanding.'
  );
}

/**
 * Generate daily focus theme based on hexagram
 */
function generateDailyFocus(hexagram: Hexagram): string {
  const focusThemes = {
    1: 'Leadership & Initiative',
    2: 'Patience & Receptivity',
    3: 'Perseverance & New Beginnings',
    4: 'Learning & Humility',
    5: 'Timing & Preparation',
    // Add more hexagram-specific focus themes...
  };

  return (
    focusThemes[hexagram.number as keyof typeof focusThemes] ||
    'Balance & Harmony'
  );
}

/**
 * Generate daily reflection prompt based on hexagram
 */
function generateDailyReflection(hexagram: Hexagram): string {
  const reflectionPrompts = {
    1: 'How can I lead by example and inspire others today?',
    2: 'What am I trying to force that would be better received naturally?',
    3: 'What new project or relationship needs my patient nurturing?',
    4: 'What can I learn from someone wiser or more experienced today?',
    5: 'What am I rushing that would benefit from more careful timing?',
    // Add more hexagram-specific reflection prompts...
  };

  return (
    reflectionPrompts[hexagram.number as keyof typeof reflectionPrompts] ||
    'How can I bring more balance and wisdom to my actions today?'
  );
}

/**
 * Check if user has accessed daily guidance today
 */
export function hasAccessedDailyGuidance(
  lastAccessed: string | null,
  timezone: string = 'UTC'
): boolean {
  if (!lastAccessed) return false;

  const today = new Date().toLocaleDateString('en-CA', { timeZone: timezone });
  const lastAccessedDate = new Date(lastAccessed).toLocaleDateString('en-CA', {
    timeZone: timezone,
  });

  return today === lastAccessedDate;
}

/**
 * Calculate user's daily guidance streak
 */
export function calculateDailyStreak(
  accessHistory: string[],
  timezone: string = 'UTC'
): number {
  if (accessHistory.length === 0) return 0;

  const today = new Date();
  const todayString = today.toLocaleDateString('en-CA', { timeZone: timezone });

  let streak = 0;
  let checkDate = new Date(today);

  // Count consecutive days backward from today
  while (true) {
    const checkDateString = checkDate.toLocaleDateString('en-CA', {
      timeZone: timezone,
    });

    if (accessHistory.includes(checkDateString)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }

    // Prevent infinite loop
    if (streak > 365) break;
  }

  return streak;
}
