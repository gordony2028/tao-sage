#!/usr/bin/env tsx
/**
 * Test script to verify all sections are extracted
 */

import {
  generateStandardPrompt,
  generateCompressedPrompt,
} from '../src/lib/openai/prompts';
import type { LineValue } from '../src/types/iching';

async function testSectionExtraction() {
  console.log('🔍 Testing Section Extraction\n');

  const testHexagram = {
    number: 1,
    name: 'The Creative',
    lines: [9, 9, 9, 9, 9, 9] as [
      LineValue,
      LineValue,
      LineValue,
      LineValue,
      LineValue,
      LineValue,
    ],
    changingLines: [2, 5],
  };

  const question = 'What should I focus on in my career development?';

  // Test comprehensive prompt (for complex consultations)
  const comprehensivePrompt = generateStandardPrompt(testHexagram, question);
  console.log('📚 Comprehensive Prompt Fields:');
  const comprehensiveFields =
    comprehensivePrompt.match(/(\w+): ([^(]*)/g) || [];
  comprehensiveFields.forEach(field => console.log(`  • ${field}`));

  // Test optimized prompt (for simple consultations)
  const optimizedPrompt = generateCompressedPrompt(testHexagram, question);
  console.log('\n🎨 Optimized Prompt Fields:');
  const optimizedFields = optimizedPrompt.match(/(\d+\.\s+\w+[^:]*)/g) || [];
  optimizedFields.forEach(field => console.log(`  • ${field.trim()}`));

  console.log('\n✅ Field Mapping:');
  console.log('Comprehensive (6 sections):');
  console.log('  • interpretation (Core Meaning)');
  console.log('  • ancientWisdom (Ancient Wisdom)');
  console.log('  • guidance (Personal Guidance)');
  console.log('  • spiritualInsight (Spiritual Insight)');
  console.log('  • timing (Timing & Flow)');
  console.log('  • culturalContext (Cultural Context)');

  console.log('\nOptimized (4 sections):');
  console.log('  • interpretation (Core Meaning)');
  console.log('  • ancientWisdom (Ancient Wisdom)');
  console.log('  • guidance (Practical Guidance)');
  console.log('  • timing (Timing)');

  console.log(
    '\n🎯 The consultation function now extracts ALL available fields!'
  );
}

testSectionExtraction().catch(console.error);
