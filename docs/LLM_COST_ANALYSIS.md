# LLM Cost Analysis for CoachFlux Sessions

## Executive Summary

**Model Used:** Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)

**Pricing (as of 2025):**
- Input tokens: **$3.00 per million tokens** ($0.003 per 1K tokens)
- Output tokens: **$15.00 per million tokens** ($0.015 per 1K tokens)

**Estimated Cost Per Session:** **$0.08 - $0.15** (typical GROW session)

---

## Cost Breakdown by API Call

### 1. Primary Coaching Response (`nextStep` action)

**Per User Message:**

| Component | Tokens (Est.) | Cost |
|-----------|---------------|------|
| **System Prompt** | ~2,500 tokens | $0.0075 |
| **User Prompt** (schema + step guidance + conversation history + user input) | ~1,500-3,000 tokens | $0.0045-$0.009 |
| **Output** (coach reflection + structured data) | ~400 tokens | $0.006 |
| **SUBTOTAL per message** | ~4,400-5,900 tokens | **$0.018-$0.024** |

### 2. Validator Call (`nextStep` action)

**Per User Message:**

| Component | Tokens (Est.) | Cost |
|-----------|---------------|------|
| **System Prompt** | ~100 tokens | $0.0003 |
| **User Prompt** (schema + validation instructions) | ~600-800 tokens | $0.0018-$0.0024 |
| **Output** (validation verdict) | ~50 tokens | $0.00075 |
| **SUBTOTAL per message** | ~750-950 tokens | **$0.003-$0.0035** |

### 3. Review Analysis Generation (`generateReviewAnalysis` action)

**Once per Session (at end):**

| Component | Tokens (Est.) | Cost |
|-----------|---------------|------|
| **Prompt** (full conversation history + all step data) | ~3,000-5,000 tokens | $0.009-$0.015 |
| **Output** (summary, insights, risks, pitfalls) | ~1,200-1,500 tokens | $0.018-$0.0225 |
| **SUBTOTAL per session** | ~4,200-6,500 tokens | **$0.027-$0.0375** |

---

## Total Session Cost Estimates

### Typical GROW Session Flow

**Assumptions:**
- **Goal step:** 3-4 user messages
- **Reality step:** 3-4 user messages  
- **Options step:** 4-5 user messages (includes AI suggestions)
- **Will step:** 3-4 user messages
- **Review step:** 2 user messages + 1 analysis generation

**Total user messages:** ~15-19 messages
**Total API calls:** ~30-38 calls (primary + validator) + 1 analysis

### Cost Calculation

| Scenario | Messages | Primary Calls | Validator Calls | Analysis | Total Cost |
|----------|----------|---------------|-----------------|----------|------------|
| **Minimal Session** | 12 messages | 12 × $0.018 = $0.216 | 12 × $0.003 = $0.036 | 1 × $0.027 = $0.027 | **$0.279** ≈ **$0.28** |
| **Typical Session** | 15 messages | 15 × $0.021 = $0.315 | 15 × $0.003 = $0.045 | 1 × $0.032 = $0.032 | **$0.392** ≈ **$0.39** |
| **Extended Session** | 19 messages | 19 × $0.024 = $0.456 | 19 × $0.0035 = $0.067 | 1 × $0.0375 = $0.038 | **$0.561** ≈ **$0.56** |

### Adjusted Estimate (Conservative)

Based on actual implementation with:
- Conversation history accumulation (increases input tokens over time)
- Agent mode context (captured state tracking)
- Safety checks and escalation logic

**Realistic Cost Range:** **$0.30 - $0.60 per session**
**Average:** **~$0.40 per session**

---

## Cost Optimization Opportunities

### 1. Prompt Caching (Anthropic Feature)

Anthropic offers prompt caching for repeated content:
- **Cache write tokens:** 1.25x base price (5-min cache) or 2x base price (1-hour cache)
- **Cache read tokens:** 0.1x base price (90% savings!)

**Potential savings:** If system prompt is cached across messages:
- System prompt: 2,500 tokens × $0.003 = $0.0075 per message
- With caching: 2,500 tokens × $0.0003 = $0.00075 per message (after first)
- **Savings: ~$0.007 per message** (after first message in session)
- **Session savings: ~$0.10** (for 15-message session)

**Implementation:** Add `cache_control` to system prompt in API calls.

### 2. Reduce Conversation History

Currently includes full conversation history in every call. Options:
- Summarize older messages (keep last 5-7 full, summarize rest)
- Only include current step history + key data from previous steps
- **Potential savings:** 30-40% reduction in input tokens = **~$0.05-$0.08 per session**

### 3. Optimize Validator

Current validator uses full schema. Options:
- Use lighter validation (regex patterns instead of LLM)
- Only validate on first message per step
- Batch validation (validate multiple messages together)
- **Potential savings:** 50% reduction in validator calls = **~$0.02-$0.03 per session**

### 4. Batch Processing

Anthropic offers batch API with 50% cost savings:
- Not suitable for real-time coaching
- Could be used for review analysis generation (non-blocking)
- **Potential savings:** ~$0.015 per session (on analysis only)

---

## Business Model Implications

### Free Tier (Anonymous Users)

**Assumptions:**
- 1 session per user (no repeat usage)
- Average session cost: **$0.40**

**Monthly Costs:**

| Monthly Active Users | Sessions | LLM Cost |
|---------------------|----------|----------|
| 1,000 MAU | 1,000 | $400 |
| 5,000 MAU | 5,000 | $2,000 |
| 10,000 MAU | 10,000 | $4,000 |

### Paid Tier (£9.99/month = ~$12.50/month)

**Assumptions:**
- Average 4 sessions per month per paid user
- Average session cost: **$0.40**

**Cost per paid user:** 4 × $0.40 = **$1.60/month**
**Gross margin:** $12.50 - $1.60 = **$10.90/month** (87% margin)

### Year 1 Target Scenario

From business model memory:
- **10,000 MAU** (mostly free tier)
- **500 paid subscribers**

**Monthly LLM Costs:**
- Free tier: 10,000 × 1 session × $0.40 = $4,000
- Paid tier: 500 × 4 sessions × $0.40 = $800
- **Total: $4,800/month** = **$57,600/year**

**Revenue:**
- Paid tier: 500 × £9.99 × 12 = £59,940 ≈ **$75,000/year**

**LLM Cost as % of Revenue:** 57,600 / 75,000 = **77%**

⚠️ **WARNING:** This is extremely high! Typical SaaS aims for <30% COGS.

---

## Cost Reduction Strategies

### Priority 1: Implement Prompt Caching (IMMEDIATE)

**Impact:** ~25% cost reduction
**New session cost:** $0.30 (from $0.40)
**Annual savings:** $14,400 (from $57,600 to $43,200)
**Implementation effort:** Low (add cache_control to API calls)

### Priority 2: Optimize Conversation History (MEDIUM TERM)

**Impact:** ~30% cost reduction (on top of caching)
**New session cost:** $0.21 (from $0.30)
**Annual savings:** Additional $12,960 (from $43,200 to $30,240)
**Implementation effort:** Medium (requires refactoring prompt construction)

### Priority 3: Tiered Free Usage (BUSINESS MODEL)

**Current:** Unlimited free sessions (1 per user, but no enforcement)
**Proposed:** 
- Free tier: 1 session per 24 hours (enforced)
- After 3 sessions: Prompt upgrade to paid
- Email capture required after 1st session

**Impact:** Reduces free tier abuse, increases conversion
**Estimated free tier reduction:** 30% (from 10,000 to 7,000 sessions/month)
**Monthly savings:** $1,200

### Priority 4: Switch to Haiku for Simple Steps (FUTURE)

Claude 3.5 Haiku pricing: $0.80 input / $4.00 output per million tokens
- Use Haiku for simple acknowledgments and clarifications
- Use Sonnet for complex reasoning (options generation, analysis)
- **Potential savings:** 20-30% on applicable calls

---

## Competitive Benchmarking

### Alternative Models

| Model | Input ($/1M) | Output ($/1M) | Notes |
|-------|--------------|---------------|-------|
| **Claude 3.7 Sonnet** | $3.00 | $15.00 | Current choice - best reasoning |
| Claude 3.5 Haiku | $0.80 | $4.00 | 4x cheaper, less capable |
| GPT-4o | $2.50 | $10.00 | 20% cheaper, comparable quality |
| GPT-4o mini | $0.15 | $0.60 | 20x cheaper, lower quality |
| Gemini 1.5 Pro | $1.25 | $5.00 | 60% cheaper, good quality |

### Recommendation

**Phase 1 (Current):** Stick with Claude 3.7 Sonnet
- Best reasoning for coaching
- Implement prompt caching immediately

**Phase 2 (3-6 months):** Hybrid approach
- Claude 3.7 Sonnet for complex reasoning (options, analysis)
- Claude 3.5 Haiku for simple responses (acknowledgments, clarifications)
- **Target cost:** $0.20-$0.25 per session

**Phase 3 (12+ months):** Evaluate alternatives
- Test GPT-4o or Gemini 1.5 Pro if quality is comparable
- Consider fine-tuned smaller models for specific steps
- **Target cost:** $0.10-$0.15 per session

---

## Monitoring & Tracking

### Key Metrics to Track

1. **Average tokens per message** (input + output)
2. **Average messages per session** (by step)
3. **Average cost per session** (total)
4. **Cost per step** (identify expensive steps)
5. **Monthly LLM spend** (total)
6. **LLM cost as % of revenue** (target: <30%)

### Recommended Logging

Add to `coach.ts`:
```typescript
// Log token usage after each API call
console.log({
  sessionId: args.sessionId,
  step: step.name,
  inputTokens: primary.usage.input_tokens,
  outputTokens: primary.usage.output_tokens,
  cost: (primary.usage.input_tokens * 0.000003) + (primary.usage.output_tokens * 0.000015)
});
```

Store in Convex table for analytics:
```typescript
await ctx.runMutation(api.mutations.logTokenUsage, {
  sessionId: args.sessionId,
  step: step.name,
  inputTokens: primary.usage.input_tokens,
  outputTokens: primary.usage.output_tokens,
  cost: calculatedCost
});
```

---

## Summary & Recommendations

### Current State
- **Cost per session:** $0.30-$0.60 (avg $0.40)
- **Year 1 LLM costs:** ~$57,600
- **LLM cost as % of revenue:** 77% (too high!)

### Immediate Actions (Next 2 Weeks)
1. ✅ **Implement prompt caching** → 25% cost reduction
2. ✅ **Add token usage logging** → visibility into actual costs
3. ✅ **Set up cost alerts** → monitor monthly spend

### Medium-Term Actions (1-3 Months)
4. ✅ **Optimize conversation history** → 30% additional reduction
5. ✅ **Enforce free tier limits** → reduce abuse
6. ✅ **Test hybrid model approach** → Haiku for simple responses

### Long-Term Actions (6-12 Months)
7. ✅ **Evaluate alternative models** → GPT-4o, Gemini 1.5 Pro
8. ✅ **Consider fine-tuning** → custom models for specific steps
9. ✅ **Implement batch processing** → for non-real-time analysis

### Target Metrics
- **Session cost:** $0.15-$0.20 (from $0.40)
- **LLM cost as % of revenue:** <30% (from 77%)
- **Annual LLM costs:** <$20,000 (from $57,600)

---

## Appendix: Token Estimation Methodology

### System Prompt Breakdown
- Base coaching principles: ~1,200 tokens
- Framework-specific guidance: ~800 tokens
- Safety protocols: ~300 tokens
- JSON formatting instructions: ~200 tokens
- **Total:** ~2,500 tokens

### User Prompt Breakdown
- Schema definition: ~300-500 tokens
- Step guidance: ~400-600 tokens
- Conversation history: ~500-1,500 tokens (grows over session)
- User input: ~100-300 tokens
- Agent mode context: ~200-400 tokens
- **Total:** ~1,500-3,000 tokens

### Output Breakdown
- coach_reflection: ~100-200 tokens
- Structured data fields: ~200-300 tokens
- JSON formatting: ~100 tokens
- **Total:** ~400-600 tokens

### Validator Breakdown
- System prompt: ~100 tokens
- Schema + validation rules: ~400-600 tokens
- Candidate JSON: ~200-300 tokens
- Output verdict: ~50 tokens
- **Total:** ~750-1,050 tokens

### Analysis Generation Breakdown
- Full conversation history: ~2,000-3,000 tokens
- All step data: ~1,000-2,000 tokens
- Analysis prompt: ~500 tokens
- Output (summary, insights, risks): ~1,200-1,500 tokens
- **Total:** ~4,700-7,000 tokens

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Author:** CoachFlux Team
