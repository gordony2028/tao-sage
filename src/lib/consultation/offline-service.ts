/**
 * Offline Consultation Service
 * 
 * Provides I Ching consultation capabilities when offline by:
 * 1. Generating hexagrams locally (no network required)
 * 2. Storing consultations in localStorage/IndexedDB
 * 3. Providing traditional interpretations without AI
 * 4. Syncing with server when connection is restored
 */

import { generateHexagram, getHexagramName } from '@/lib/iching/hexagram';
import type { Consultation, Hexagram, AIInterpretation } from '@/types/iching';

const OFFLINE_CONSULTATIONS_KEY = 'sage-offline-consultations';
const SYNC_QUEUE_KEY = 'sage-sync-queue';

export interface OfflineConsultationInput {
  question: string;
  userId: string;
  timestamp?: string;
}

export interface OfflineConsultationResult {
  consultation: Consultation;
  hexagram: Hexagram;
  isOffline: true;
  note: string;
}

/**
 * Create a consultation that works completely offline
 */
export async function createOfflineConsultation(
  input: OfflineConsultationInput
): Promise<OfflineConsultationResult> {
  const { question, userId, timestamp = new Date().toISOString() } = input;

  // Validate input
  if (!question || question.trim().length === 0) {
    throw new Error('Question cannot be empty');
  }

  // Generate hexagram (works offline)
  const generatedHexagram = generateHexagram();
  const hexagramName = getHexagramName(generatedHexagram.number);

  const hexagram: Hexagram = {
    number: generatedHexagram.number,
    name: hexagramName,
    lines: generatedHexagram.lines,
    changingLines: generatedHexagram.changingLines,
  };

  // Generate traditional interpretation (no AI needed)
  const interpretation = generateTraditionalInterpretation(hexagram, question);

  const now = new Date();
  
  // Create consultation record
  const consultation: Consultation = {
    id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    question,
    hexagram,
    interpretation: {
      interpretation: interpretation.interpretation,
      guidance: interpretation.guidance,
      practicalAdvice: interpretation.practicalAdvice,
      culturalContext: interpretation.culturalContext,
    },
    metadata: {
      method: 'digital_coins',
    },
    createdAt: now,
    updatedAt: now,
    status: 'active',
    tags: [],
  };

  // Store offline consultation
  await storeOfflineConsultation(consultation);

  // Add to sync queue for later upload
  await addToSyncQueue(consultation);

  return {
    consultation,
    hexagram,
    isOffline: true,
    note: 'This consultation was created offline using traditional I Ching wisdom.',
  };
}

/**
 * Get all offline consultations
 */
export function getOfflineConsultations(): Consultation[] {
  try {
    const stored = localStorage.getItem(OFFLINE_CONSULTATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading offline consultations:', error);
    return [];
  }
}

/**
 * Store consultation locally for offline access
 */
async function storeOfflineConsultation(consultation: Consultation): Promise<void> {
  try {
    const existing = getOfflineConsultations();
    existing.unshift(consultation); // Add to beginning

    // Keep only last 50 offline consultations to manage storage
    const limited = existing.slice(0, 50);
    
    localStorage.setItem(OFFLINE_CONSULTATIONS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error storing offline consultation:', error);
    throw new Error('Unable to store consultation offline');
  }
}

/**
 * Add consultation to sync queue for upload when online
 */
async function addToSyncQueue(consultation: Consultation): Promise<void> {
  try {
    const queue = getSyncQueue();
    queue.push({
      consultation,
      timestamp: new Date().toISOString(),
      attempts: 0,
    });
    
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.warn('Error adding to sync queue:', error);
  }
}

/**
 * Get sync queue
 */
function getSyncQueue(): Array<{
  consultation: Consultation;
  timestamp: string;
  attempts: number;
}> {
  try {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading sync queue:', error);
    return [];
  }
}

/**
 * Sync offline consultations when connection is restored
 */
export async function syncOfflineConsultations(): Promise<void> {
  if (!navigator.onLine) {
    return; // Still offline
  }

  const queue = getSyncQueue();
  if (queue.length === 0) {
    return; // Nothing to sync
  }

  const successful: string[] = [];

  for (const item of queue) {
    try {
      // Attempt to sync with server
      const response = await fetch('/api/consultation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: item.consultation.question,
          userId: item.consultation.userId,
          hexagram: item.consultation.hexagram,
          metadata: {
            ...item.consultation.metadata,
            syncedAt: new Date().toISOString(),
            originalOfflineId: item.consultation.id,
          },
        }),
      });

      if (response.ok) {
        successful.push(item.consultation.id);
      } else {
        // Increment attempt counter
        item.attempts += 1;
      }
    } catch (error) {
      console.warn('Error syncing consultation:', error);
      item.attempts += 1;
    }
  }

  // Remove successfully synced items
  const remaining = queue.filter(item => !successful.includes(item.consultation.id));
  
  // Remove items that have failed too many times (>5 attempts)
  const filtered = remaining.filter(item => item.attempts < 5);
  
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
}

/**
 * Check if device is currently offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Generate traditional interpretation without AI
 */
function generateTraditionalInterpretation(hexagram: Hexagram, question: string) {
  const traditional = getTraditionalMeaning(hexagram.number);
  
  return {
    interpretation: `Hexagram ${hexagram.number} - ${hexagram.name}\n\n${traditional}\n\n${getChangingLinesGuidance(hexagram.changingLines)}`,
    guidance: 'The ancient wisdom suggests reflection and patience. Consider how this guidance applies to your current situation.',
    practicalAdvice: getBasicAdvice(hexagram.number),
    culturalContext: `This hexagram represents one of the 64 fundamental situations described in the I Ching, the ancient Chinese Book of Changes.`,
    note: 'This interpretation uses traditional I Ching wisdom. Full AI-powered insights will be available when you reconnect to the internet.',
  };
}

/**
 * Get basic traditional meaning for a hexagram number
 */
function getTraditionalMeaning(hexagramNumber: number): string {
  // Simplified traditional meanings for offline use
  const meanings: Record<number, string> = {
    1: 'The Creative represents primal power, strength, and the force of heaven. It embodies leadership, creativity, and dynamic energy.',
    2: 'The Receptive represents yielding, devotion, and the power of earth. It embodies receptivity, nurturing, and supportive strength.',
    3: 'Difficulty at the Beginning suggests initial challenges that require patience and perseverance to overcome.',
    4: 'Youthful Folly represents inexperience and the need for learning. Wisdom comes through patience and proper guidance.',
    5: 'Waiting represents the power of patient anticipation. Success comes to those who wait for the right moment.',
    6: 'Conflict suggests disagreement and the need for careful resolution. Seek understanding rather than victory.',
    7: 'The Army represents discipline, organization, and collective action under wise leadership.',
    8: 'Holding Together emphasizes unity, cooperation, and the strength found in harmonious relationships.',
    // Add more as needed...
  };

  return meanings[hexagramNumber] || 'This hexagram represents a fundamental life situation described in the I Ching. Reflect on its meaning in relation to your question.';
}

/**
 * Get guidance for changing lines
 */
function getChangingLinesGuidance(changingLines: number[]): string {
  if (changingLines.length === 0) {
    return 'This hexagram has no changing lines, suggesting a stable situation.';
  }
  
  if (changingLines.length === 1) {
    return `Line ${changingLines[0]} is changing, indicating transformation in this specific aspect of the situation.`;
  }
  
  return `Lines ${changingLines.join(', ')} are changing, suggesting multiple areas of transformation and evolution.`;
}

/**
 * Get basic practical advice based on hexagram number
 */
function getBasicAdvice(hexagramNumber: number): string {
  const adviceMap: Record<number, string> = {
    1: 'Take initiative and lead with confidence, but remain humble.',
    2: 'Be receptive to others and provide steady support where needed.',
    3: 'Persist through initial difficulties; they will pass with patience.',
    4: 'Seek wisdom from experienced guides and remain open to learning.',
    5: 'Wait for the right timing rather than forcing immediate action.',
    6: 'Address conflicts with understanding and seek common ground.',
    7: 'Organize your efforts and work systematically toward your goals.',
    8: 'Strengthen your relationships and work collaboratively with others.',
    // Add more as needed...
  };

  return adviceMap[hexagramNumber] || 'Reflect deeply on this guidance and consider how it applies to your current circumstances.';
}

/**
 * Clear all offline data (use with caution)
 */
export function clearOfflineData(): void {
  localStorage.removeItem(OFFLINE_CONSULTATIONS_KEY);
  localStorage.removeItem(SYNC_QUEUE_KEY);
}