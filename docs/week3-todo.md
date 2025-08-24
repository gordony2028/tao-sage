# Week 3: Smart AI Integration with Cost Optimization

## Overview

**Goal**: Integrate OpenAI with streaming, caching, and smart cost management  
**Duration**: 5 days  
**Budget Target**: <$0.05 per consultation average  
**Performance Target**: 2-3x faster perceived response time

---

## Monday-Tuesday: Smart OpenAI Integration

### Core Tasks

- [ ] Set up OpenAI API client with Vercel AI SDK
- [ ] Implement smart prompt templates (40-60% token reduction)
- [ ] Add model selection strategy (GPT-3.5 vs GPT-4 based on complexity)
- [ ] Design intelligent response caching system

### Technical Requirements

- Use `@ai-sdk/openai` package for streaming
- Implement prompt compression techniques
- Create complexity scoring algorithm for model selection
- Set up Redis or in-memory cache for responses

---

## Wednesday-Thursday: Streaming & Optimization

### Core Tasks

- [ ] Implement Server-Sent Events for streaming responses
- [ ] Add cache-first strategy (80% cost reduction for common patterns)
- [ ] Create fallback system with traditional interpretations
- [ ] Build cultural sensitivity validation pipeline

### Implementation Details

- Stream responses using Vercel AI SDK's streaming API
- Cache common hexagram patterns and interpretations
- Fallback to traditional meanings if AI fails
- Validate all AI responses for cultural appropriateness

---

## Friday: Cost Control & Performance

### Core Tasks

- [ ] Implement cost monitoring and alerts
- [ ] Optimize streaming performance for 2-3x faster perceived response
- [ ] Test quality across model selection scenarios
- [ ] Validate cost targets: <$0.05 per consultation average

### Metrics to Track

- Token usage per consultation
- Cache hit rate (target: >80%)
- Response time (target: <2 seconds)
- Quality score (target: >4.2/5)

---

## Success Criteria ✅

### Performance

- [ ] AI streams personalized interpretations with optimized performance
- [ ] Response time <2 seconds including streaming
- [ ] Smooth streaming without stuttering

### Cost Optimization

- [ ] Smart caching reduces costs by 80% for repeat patterns
- [ ] Average cost per consultation <$0.05
- [ ] 60-80% total cost reduction achieved

### Reliability

- [ ] Fallback system ensures 100% uptime
- [ ] Graceful degradation when AI unavailable
- [ ] No data loss during failures

### Quality

- [ ] Response quality maintained across all optimization strategies
- [ ] Cultural sensitivity validated for all responses
- [ ] User satisfaction >4.2/5 rating

---

## Technical Implementation Guide

### 1. OpenAI Client Setup

```typescript
// lib/openai/client.ts
import { OpenAI } from '@ai-sdk/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model selection based on complexity
export function selectModel(complexity: number) {
  return complexity > 0.7 ? 'gpt-4' : 'gpt-3.5-turbo';
}
```

### 2. Smart Prompt Template

```typescript
// lib/openai/prompts.ts
export function generatePrompt(hexagram: Hexagram, question: string): string {
  // Compressed prompt format for token efficiency
  return `
    H:${hexagram.number}
    Q:${question.slice(0, 100)}
    L:${hexagram.changingLines.join(',')}
    Style:balanced,respectful,practical
    Max:150words
  `;
}
```

### 3. Caching Strategy

```typescript
// lib/cache/consultation-cache.ts
export class ConsultationCache {
  private cache = new Map<string, CachedResponse>();

  getCacheKey(hexagram: number, question: string): string {
    // Normalize question for better cache hits
    const normalized = question.toLowerCase().trim();
    return `${hexagram}-${hash(normalized)}`;
  }

  async get(key: string): Promise<CachedResponse | null> {
    // Check cache with TTL
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached;
    }
    return null;
  }
}
```

### 4. Streaming Implementation

```typescript
// app/api/consultation/stream/route.ts
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { hexagram, question } = await req.json();

  // Check cache first
  const cached = await cache.get(hexagram, question);
  if (cached) {
    return new Response(cached.interpretation);
  }

  // Stream new response
  const result = await streamText({
    model: selectModel(complexity),
    prompt: generatePrompt(hexagram, question),
    temperature: 0.7,
    maxTokens: 200,
  });

  return result.toTextStreamResponse();
}
```

---

## Daily Checklist

### Monday

- [ ] Morning: Set up OpenAI client and Vercel AI SDK
- [ ] Afternoon: Implement prompt templates
- [ ] Evening: Test basic API integration

### Tuesday

- [ ] Morning: Add model selection logic
- [ ] Afternoon: Design caching system
- [ ] Evening: Integration testing

### Wednesday

- [ ] Morning: Implement streaming endpoints
- [ ] Afternoon: Add cache-first strategy
- [ ] Evening: Test cache performance

### Thursday

- [ ] Morning: Create fallback system
- [ ] Afternoon: Build cultural validation
- [ ] Evening: End-to-end testing

### Friday

- [ ] Morning: Implement cost monitoring
- [ ] Afternoon: Performance optimization
- [ ] Evening: Validate all success criteria

---

## Risk Mitigation

### If Behind Schedule

1. Prioritize streaming and basic caching
2. Defer advanced optimization to Week 4
3. Use GPT-3.5 only initially
4. Implement monitoring in Week 4

### If Over Budget

1. Increase cache TTL
2. Use GPT-3.5 exclusively
3. Implement request throttling
4. Add user rate limiting

### If Quality Issues

1. Adjust prompt templates
2. Increase cultural validation
3. Add manual review queue
4. Gather user feedback actively

---

## Resources

### Documentation

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Redis Caching Patterns](https://redis.io/docs/patterns/)

### Code Examples

- [Streaming with Next.js](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming)
- [AI SDK Examples](https://github.com/vercel/ai/tree/main/examples)

### Testing Tools

- [OpenAI Playground](https://platform.openai.com/playground)
- [Cost Calculator](https://openai.com/pricing)

---

## Notes

- Focus on cost optimization without sacrificing quality
- Prioritize cultural sensitivity in all AI responses
- Keep fallback systems simple but reliable
- Document all optimization decisions for future reference
- Test with real user scenarios, not just technical tests

---

**Remember**: The goal is to create a sustainable, cost-effective AI integration that can scale with the business while maintaining the cultural authenticity and spiritual depth that makes Sage unique.
