# Testing Real AI Integration

## Overview

Since we have working connections to Supabase and OpenAI, we can test our optimized AI system with real APIs instead of mocks. This provides much more valuable validation.

## Running Real Integration Tests

### Option 1: Manual Script Test

Run the integration test script to validate all optimizations:

```bash
# Test with real APIs (costs ~$0.10-0.20)
pnpm tsx scripts/test-real-integration.ts
```

This will:

- Test simple consultation → GPT-3.5 selection
- Test complex consultation → GPT-4 selection
- Test caching effectiveness
- Validate cultural sensitivity
- Measure actual costs and performance

### Option 2: Jest Tests with Real APIs

```bash
# Enable real API tests (costs ~$0.50-1.00)
RUN_REAL_TESTS=true pnpm test __tests__/integration/real-system.test.ts
```

## What Gets Tested

### 1. Smart Model Selection

- ✅ Simple questions use GPT-3.5 (cheaper)
- ✅ Complex philosophical questions use GPT-4 (better quality)
- ✅ Complexity scoring algorithm works correctly

### 2. Cost Optimization

- ✅ Average cost per consultation <$0.05
- ✅ 60-80% cost reduction vs unoptimized system
- ✅ Token compression (40-60% reduction)

### 3. Caching System

- ✅ Identical consultations use cache (80% cost reduction)
- ✅ Case/punctuation normalization works
- ✅ Different hexagrams/changing lines create different cache keys

### 4. Cultural Sensitivity

- ✅ No fortune-telling language in responses
- ✅ Respectful, wisdom-based language maintained
- ✅ Traditional I Ching authenticity preserved

### 5. Performance

- ✅ Response times <2 seconds
- ✅ Streaming works for real-time UX
- ✅ Concurrent consultations handled efficiently

### 6. Reliability

- ✅ Fallback system works when AI fails
- ✅ Input validation prevents errors
- ✅ Graceful error handling

## Cost Control

The tests are designed with cost controls:

- **Manual Script**: ~$0.10-0.20 total cost
- **Full Jest Suite**: ~$0.50-1.00 total cost
- **Individual Test**: ~$0.01-0.05 per consultation

All tests respect rate limits and include delays between API calls.

## Expected Results

### Cost Performance

```
Average cost per consultation: $0.003-0.015
Total cost reduction: 70-85%
Cache hit rate: 80%+
```

### Quality Metrics

```
Cultural validation: 100% pass rate
Response time: <2 seconds
Uptime: 100% (with fallbacks)
```

### Model Selection

```
Simple questions: GPT-3.5 (~$0.0009/consultation)
Complex questions: GPT-4 (~$0.018/consultation)
Mixed average: <$0.05/consultation
```

## Safety Features

1. **Budget Limits**: Tests will fail if costs exceed $1.00 total
2. **Rate Limiting**: Delays between API calls to respect limits
3. **Validation**: All responses checked for cultural sensitivity
4. **Fallback Testing**: Verifies system works when APIs fail

## Running in CI/CD

To run real tests in CI:

```bash
# Set environment variables
export RUN_REAL_TESTS=true
export OPENAI_API_KEY=your_key
export NEXT_PUBLIC_SUPABASE_URL=your_url

# Run with budget controls
pnpm test __tests__/integration/real-system.test.ts
```

## Monitoring

The tests provide detailed logging:

- Cost per consultation
- Model selection decisions
- Cache hit/miss rates
- Response times
- Cultural validation results

This data helps optimize the system further and catch regressions.
