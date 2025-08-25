#!/usr/bin/env tsx
/**
 * Script to test real API integration with cost controls
 * Run with: pnpm tsx scripts/test-real-integration.ts
 */

import { generateConsultationInterpretation } from '../src/lib/openai/consultation';
import {
  selectModel,
  calculateComplexity,
  costTracker,
} from '../src/lib/openai/client';
import { getCacheKey, validateResponse } from '../src/lib/openai/prompts';
import type { LineValue } from '../src/types/iching';

async function testRealIntegration() {
  console.log('🚀 Testing real AI integration with cost optimization...\n');

  // Reset cost tracker
  costTracker.reset();

  const testConsultations = [
    {
      name: 'Simple Question (should use GPT-3.5)',
      consultation: {
        question: 'What should I focus on today?',
        hexagram: {
          number: 1,
          name: 'The Creative',
          chineseName: '乾',
          lines: [9, 9, 9, 9, 9, 9] as [
            LineValue,
            LineValue,
            LineValue,
            LineValue,
            LineValue,
            LineValue,
          ],
          changingLines: [],
        },
      },
    },
    {
      name: 'Complex Question (should use GPT-4)',
      consultation: {
        question:
          'What is the deeper spiritual meaning behind my current challenges and how can I transform them into growth?',
        hexagram: {
          number: 50,
          name: 'The Caldron',
          chineseName: '鼎',
          lines: [9, 8, 7, 6, 8, 9] as [
            LineValue,
            LineValue,
            LineValue,
            LineValue,
            LineValue,
            LineValue,
          ],
          changingLines: [1, 3, 4, 6],
        },
      },
    },
    {
      name: 'Cached Question (should reuse first result)',
      consultation: {
        question: 'What should I focus on today?', // Same as first
        hexagram: {
          number: 1,
          name: 'The Creative',
          chineseName: '乾',
          lines: [9, 9, 9, 9, 9, 9] as [
            LineValue,
            LineValue,
            LineValue,
            LineValue,
            LineValue,
            LineValue,
          ],
          changingLines: [],
        },
      },
    },
  ];

  for (const test of testConsultations) {
    console.log(`\n📝 ${test.name}`);
    console.log(`Question: "${test.consultation.question}"`);

    // Analyze complexity and model selection
    const complexity = calculateComplexity(
      test.consultation.question,
      test.consultation.hexagram.changingLines
    );
    const selectedModel = selectModel(complexity);
    const cacheKey = getCacheKey(
      test.consultation.hexagram,
      test.consultation.question
    );

    console.log(
      `Complexity: ${complexity.toFixed(2)}, Model: ${selectedModel}`
    );
    console.log(`Cache Key: ${cacheKey.substring(0, 20)}...`);

    try {
      const startTime = Date.now();
      const result = await generateConsultationInterpretation(
        test.consultation
      );
      const endTime = Date.now();

      // Validate response
      const isValid = validateResponse(result);
      const responseTime = endTime - startTime;

      console.log(`✅ Response received in ${responseTime}ms`);
      console.log(`✅ Cultural validation: ${isValid ? 'PASSED' : 'FAILED'}`);
      console.log(
        `📖 Interpretation: ${result.interpretation.substring(0, 100)}...`
      );

      // Cost tracking
      const avgCost = costTracker.getAverageCost();
      const totalCost = costTracker.getTotalCost();
      console.log(`💰 Average cost so far: $${avgCost.toFixed(4)}`);
      console.log(`💰 Total cost so far: $${totalCost.toFixed(4)}`);
    } catch (error) {
      console.error(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Final summary
  console.log('\n📊 Final Summary:');
  const finalAvgCost = costTracker.getAverageCost();
  const finalTotalCost = costTracker.getTotalCost();

  console.log(`💰 Average cost per consultation: $${finalAvgCost.toFixed(4)}`);
  console.log(`💰 Total cost for all tests: $${finalTotalCost.toFixed(4)}`);
  console.log(
    `🎯 Target met (<$0.05): ${finalAvgCost < 0.05 ? '✅ YES' : '❌ NO'}`
  );
  console.log(
    `🏦 Budget used (<$0.50): ${finalTotalCost < 0.5 ? '✅ YES' : '❌ NO'}`
  );

  // Estimate cost reduction
  const unoptimizedCost = testConsultations.length * 0.018; // All GPT-4 without optimization
  const reduction =
    finalTotalCost > 0 ? (1 - finalTotalCost / unoptimizedCost) * 100 : 0;
  console.log(`📉 Estimated cost reduction: ${reduction.toFixed(1)}%`);

  console.log('\n🎉 Real integration test completed!');
}

// Run the test
if (require.main === module) {
  testRealIntegration().catch(console.error);
}

export { testRealIntegration };
