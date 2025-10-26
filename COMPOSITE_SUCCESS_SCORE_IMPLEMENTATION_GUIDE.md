# Composite Success Score (CSS): Complete Implementation Guide

**Version:** 1.0  
**Date:** October 26, 2025  
**Author:** Implementation Team  
**Purpose:** End-to-end guide for implementing multi-metric success measurement in COMPASS

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema Changes](#database-schema-changes)
4. [Measurement Points & Data Collection](#measurement-points--data-collection)
5. [CSS Calculator Implementation](#css-calculator-implementation)
6. [Framework Changes](#framework-changes)
7. [Prompt Engineering](#prompt-engineering)
8. [Coach Logic Updates](#coach-logic-updates)
9. [Report Generation](#report-generation)
10. [Testing Strategy](#testing-strategy)
11. [Migration Plan](#migration-plan)

---

## Executive Summary

### What We're Building

A **Composite Success Score (CSS)** system that measures coaching effectiveness across 4 dimensions:
1. **Confidence Transformation** (40% weight)
2. **Action Specificity** (30% weight)
3. **Psychological Shift** (20% weight)
4. **User Satisfaction** (10% weight)

### Why It Matters

- ✅ Works for ALL confidence levels (not just 1-7)
- ✅ Captures qualitative transformation (not just numbers)
- ✅ Provides richer success analytics
- ✅ Enables better coaching interventions

### Key Changes Required

```
├── Database Schema (4 new tables + field updates)
├── Framework Definition (new success metrics)
├── Prompts (measurement point prompts)
├── Coach Logic (CSS calculation + branching)
├── Reports (CSS visualization + insights)
└── Migration (backward compatibility)
```

---

## Architecture Overview

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION START                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  OWNERSHIP STAGE: Measure Initial State                     │
│  - initial_confidence (1-10)                                │
│  - initial_action_clarity (1-10) [NEW]                      │
│  - initial_mindset_state (string) [NEW]                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  MAPPING STAGE: Capture Action Data                         │
│  - committed_action                                         │
│  - action_day, action_time                                  │
│  - obstacle, backup_plan                                    │
│  - support_person                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PRACTICE STAGE: Measure Final State                        │
│  - final_confidence (1-10)                                  │
│  - final_action_clarity (1-10) [NEW]                        │
│  - action_commitment_confidence (1-10)                      │
│  - final_mindset_state (string) [NEW]                       │
│  - user_satisfaction (1-10) [NEW]                           │
│  - session_helpfulness_reason (string) [NEW]                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CSS CALCULATION (server-side)                              │
│  - Confidence Score (40%)                                   │
│  - Action Score (30%)                                       │
│  - Mindset Score (20%)                                      │
│  - Satisfaction Score (10%)                                 │
│  → Composite Success Score (0-100)                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  REPORT GENERATION                                          │
│  - CSS Badge (Excellent/Good/Fair/Marginal/Insufficient)    │
│  - Dimension Breakdown                                      │
│  - Insights & Recommendations                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```typescript
// Session lifecycle
User Input → AI Prompt → Reflection Payload → Database → CSS Calculator → Report
```

---

## Database Schema Changes

### 1. New Table: `composite_success_metrics`

```typescript
// convex/schema.ts

export default defineSchema({
  // ... existing tables
  
  composite_success_metrics: defineTable({
    // References
    session_id: v.id("coaching_sessions"),
    user_id: v.string(),
    framework_id: v.string(), // "COMPASS"
    
    // === Dimension 1: Confidence Transformation (40%) ===
    initial_confidence: v.number(), // 1-10
    final_confidence: v.number(), // 1-10
    confidence_increase: v.number(), // calculated
    confidence_score: v.number(), // 0-100
    
    // For high-confidence users (initial >= 8)
    initial_action_clarity: v.optional(v.number()), // 1-10
    final_action_clarity: v.optional(v.number()), // 1-10
    action_clarity_increase: v.optional(v.number()),
    
    // === Dimension 2: Action Specificity (30%) ===
    has_committed_action: v.boolean(),
    has_action_timing: v.boolean(), // day + time
    has_obstacle_planning: v.boolean(), // obstacle + backup
    has_accountability: v.boolean(), // support_person
    action_score: v.number(), // 0-100
    
    // === Dimension 3: Psychological Shift (20%) ===
    initial_mindset_state: v.string(), // "resistant", "neutral", "open", "engaged"
    final_mindset_state: v.string(),
    had_breakthrough_moment: v.boolean(),
    found_personal_benefit: v.boolean(),
    challenged_limiting_belief: v.boolean(),
    mindset_score: v.number(), // 0-100
    
    // === Dimension 4: User Satisfaction (10%) ===
    user_satisfaction: v.number(), // 1-10
    session_helpfulness_reason: v.optional(v.string()), // Why helpful/not
    satisfaction_score: v.number(), // 0-100
    
    // === Composite Score ===
    composite_success_score: v.number(), // 0-100 (weighted average)
    success_level: v.string(), // "EXCELLENT", "GOOD", "FAIR", "MARGINAL", "INSUFFICIENT"
    
    // Metadata
    calculated_at: v.number(),
    calculation_version: v.string(), // "1.0" for versioning
  })
    .index("by_session", ["session_id"])
    .index("by_user", ["user_id"])
    .index("by_success_level", ["success_level"])
    .index("by_score", ["composite_success_score"]),
});
```

### 2. Update Existing Table: `reflections`

```typescript
// Add new fields to reflections payload

export const reflections = defineTable({
  // ... existing fields
  
  payload: v.object({
    // ... existing payload fields
    
    // NEW FIELDS for CSS
    initial_action_clarity: v.optional(v.number()),
    final_action_clarity: v.optional(v.number()),
    initial_mindset_state: v.optional(v.string()),
    final_mindset_state: v.optional(v.string()),
    user_satisfaction: v.optional(v.number()),
    session_helpfulness_reason: v.optional(v.string()),
    breakthrough_moment: v.optional(v.string()),
    limiting_belief_challenged: v.optional(v.boolean()),
  }),
});
```

### 3. New Table: `session_success_insights`

```typescript
// Store AI-generated insights about session success

export const session_success_insights = defineTable({
  session_id: v.id("coaching_sessions"),
  css_score: v.number(),
  success_level: v.string(),
  
  // Insights by dimension
  confidence_insight: v.string(),
  action_insight: v.string(),
  mindset_insight: v.string(),
  satisfaction_insight: v.string(),
  
  // Overall assessment
  overall_insight: v.string(),
  next_session_recommendation: v.string(),
  
  generated_at: v.number(),
})
  .index("by_session", ["session_id"]);
```

### 4. Update Table: `coaching_sessions`

```typescript
// Add CSS score to session record

export const coaching_sessions = defineTable({
  // ... existing fields
  
  // NEW FIELDS
  composite_success_score: v.optional(v.number()),
  success_level: v.optional(v.string()),
  dimension_scores: v.optional(v.object({
    confidence: v.number(),
    action: v.number(),
    mindset: v.number(),
    satisfaction: v.number(),
  })),
});
```

---

## Measurement Points & Data Collection

### Measurement Point 1: OWNERSHIP Stage Start (Baseline)

**When:** First question in OWNERSHIP stage  
**Purpose:** Establish baseline confidence and clarity

**Prompt Addition:**

```typescript
// convex/prompts/compass.ts - OWNERSHIP stage

ownership: `...existing prompt...

CRITICAL NEW QUESTIONS (Ask FIRST):

Question 1a: "On a scale of 1-10, how confident do you feel about navigating this change?"
  → Extract: initial_confidence (1-10)

Question 1b: "On a scale of 1-10, how clear are you on your next specific steps?"
  → Extract: initial_action_clarity (1-10)

Question 1c: "How would you describe your current mindset about this change?"
  → Options: "resistant/skeptical", "neutral/cautious", "open/curious", "engaged/committed"
  → Extract: initial_mindset_state (string)

⚠️ CRITICAL: Ask these THREE questions BEFORE proceeding with fear exploration.
⚠️ DO NOT skip these measurements - they are baseline data for CSS.

[Rest of OWNERSHIP prompt continues...]
`
```

### Measurement Point 2: MAPPING Stage (Action Quality)

**When:** Throughout MAPPING stage  
**Purpose:** Capture action specificity for CSS dimension 2

**Data Automatically Tracked:**

```typescript
// These are already captured - no prompt changes needed
// Just ensure coach ENFORCES specificity

Action Data Points:
✅ committed_action (required field)
✅ action_day (required field)
✅ action_time (required field)
✅ obstacle (required field)
✅ backup_plan (required field)
✅ support_person (required field)

// CSS will score based on presence/absence of these fields
```

### Measurement Point 3: PRACTICE Stage End (Final State)

**When:** End of PRACTICE stage, before session completion  
**Purpose:** Measure final state and user satisfaction

**Prompt Addition:**

```typescript
// convex/prompts/compass.ts - PRACTICE stage

practice: `...existing prompt...

[After existing questions about action commitment and key takeaway]

CRITICAL NEW QUESTIONS (Ask at END of PRACTICE):

Question 6: "Let's check in: When we started, your confidence was [initial]/10. 
             Where is it now overall?"
  → Extract: final_confidence (1-10)
  → Calculate: confidence_increase = final - initial
  → Celebrate: "That's a +[X] point increase!"

Question 7: "And how clear are you now on your specific next steps? (1-10)"
  → Extract: final_action_clarity (1-10)

Question 8: "Looking back at our conversation, how would you describe your mindset now?"
  → Options: "resistant/skeptical", "neutral/cautious", "open/curious", "engaged/committed"
  → Extract: final_mindset_state (string)

Question 9: "On a scale of 1-10, how helpful was this session for you?"
  → Extract: user_satisfaction (1-10)

Question 10: "What made it [helpful/not helpful]? Just a sentence or two."
  → Extract: session_helpfulness_reason (string)
  → Keep brief - this is qualitative context

⚠️ CRITICAL: Ask ALL FIVE questions before completing session.
⚠️ These measurements are required for Composite Success Score calculation.

[Session completion logic continues...]
`
```

### Measurement Point 4: Throughout Session (Qualitative Markers)

**When:** Opportunistically during OWNERSHIP and MAPPING  
**Purpose:** Capture psychological shift markers

**Prompt Guidance:**

```typescript
// Add to all stage prompts

WATCH FOR & CAPTURE:

Breakthrough Moment:
  - User says: "Oh!", "Wait...", "I never thought of it that way", "That's a good point"
  - Energy shifts (excitement, relief, clarity)
  → Extract: breakthrough_moment (their exact words)

Personal Benefit Found:
  - User identifies what THEY gain (not organization)
  - Shifts from "have to" to "want to"
  → Extract: personal_benefit + Set flag: found_personal_benefit = true

Limiting Belief Challenged:
  - User says: "I'm not good at X" → Then shares past success
  - You use evidence_confrontation nudge
  → Extract: limiting_belief + evidence_against_belief
  → Set flag: challenged_limiting_belief = true
```

---

## CSS Calculator Implementation

### Core Calculator Module

```typescript
// convex/utils/cssCalculator.ts

/**
 * Composite Success Score Calculator
 * Calculates multi-dimensional coaching success metrics
 */

export interface CSSInput {
  // Dimension 1: Confidence
  initial_confidence: number;
  final_confidence: number;
  initial_action_clarity?: number; // For high-confidence users
  final_action_clarity?: number;
  
  // Dimension 2: Action
  committed_action?: string;
  action_day?: string;
  action_time?: string;
  obstacle?: string;
  backup_plan?: string;
  support_person?: string;
  
  // Dimension 3: Mindset
  initial_mindset_state: string;
  final_mindset_state: string;
  breakthrough_moment?: string;
  personal_benefit?: string;
  limiting_belief?: string;
  evidence_against_belief?: string;
  
  // Dimension 4: Satisfaction
  user_satisfaction: number;
}

export interface CSSOutput {
  // Individual dimension scores (0-100)
  confidence_score: number;
  action_score: number;
  mindset_score: number;
  satisfaction_score: number;
  
  // Composite score (0-100)
  composite_success_score: number;
  
  // Success level
  success_level: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'MARGINAL' | 'INSUFFICIENT';
  
  // Dimension-specific insights
  dimension_insights: {
    confidence: string;
    action: string;
    mindset: string;
    satisfaction: string;
  };
}

export class CSSCalculator {
  
  /**
   * Main calculation method
   */
  calculate(input: CSSInput): CSSOutput {
    const confidence_score = this.calculateConfidenceScore(input);
    const action_score = this.calculateActionScore(input);
    const mindset_score = this.calculateMindsetScore(input);
    const satisfaction_score = this.calculateSatisfactionScore(input);
    
    // Weighted composite score
    const composite_success_score = (
      confidence_score * 0.40 +
      action_score * 0.30 +
      mindset_score * 0.20 +
      satisfaction_score * 0.10
    );
    
    const success_level = this.getSuccessLevel(composite_success_score);
    
    const dimension_insights = this.generateInsights(input, {
      confidence_score,
      action_score,
      mindset_score,
      satisfaction_score,
      composite_success_score,
    });
    
    return {
      confidence_score,
      action_score,
      mindset_score,
      satisfaction_score,
      composite_success_score: Math.round(composite_success_score),
      success_level,
      dimension_insights,
    };
  }
  
  /**
   * Dimension 1: Confidence Transformation (40% weight)
   */
  private calculateConfidenceScore(input: CSSInput): number {
    const { initial_confidence, final_confidence, initial_action_clarity, final_action_clarity } = input;
    
    // HIGH-CONFIDENCE BRANCH (initial >= 8)
    if (initial_confidence >= 8) {
      // For confident users, measure action clarity improvement
      if (initial_action_clarity !== undefined && final_action_clarity !== undefined) {
        const clarity_increase = final_action_clarity - initial_action_clarity;
        
        if (clarity_increase >= 3) return 100; // Excellent
        if (clarity_increase >= 2) return 80;  // Good
        if (clarity_increase >= 1) return 60;  // Fair
        if (clarity_increase === 0) return 40; // Marginal
        return 20; // Insufficient
      }
      
      // Fallback: if no clarity data, penalize slightly but don't fail
      return 70; // Assume moderate success for high-confidence users
    }
    
    // LOW-MODERATE CONFIDENCE BRANCH (initial < 8)
    const confidence_increase = final_confidence - initial_confidence;
    
    // Score based on increase magnitude
    if (confidence_increase >= 4) return 100; // Exceptional (+4 or more)
    if (confidence_increase >= 3) return 90;  // Excellent (+3)
    if (confidence_increase >= 2) return 75;  // Good (+2)
    if (confidence_increase >= 1) return 50;  // Fair (+1)
    if (confidence_increase === 0) return 25; // Marginal (no change)
    return 0; // Insufficient (negative)
  }
  
  /**
   * Dimension 2: Action Specificity (30% weight)
   */
  private calculateActionScore(input: CSSInput): number {
    let score = 0;
    
    // Check 1: Has committed action (25 points)
    if (input.committed_action && input.committed_action.length > 10) {
      score += 25;
    }
    
    // Check 2: Has timing (day + time) (25 points)
    const hasDay = input.action_day && input.action_day.length > 0;
    const hasTime = input.action_time && input.action_time.length > 0;
    if (hasDay && hasTime) {
      score += 25;
    }
    
    // Check 3: Has obstacle planning (25 points)
    const hasObstacle = input.obstacle && input.obstacle.length > 0;
    const hasBackup = input.backup_plan && input.backup_plan.length > 0;
    if (hasObstacle && hasBackup) {
      score += 25;
    }
    
    // Check 4: Has accountability (25 points)
    if (input.support_person && input.support_person.length > 0) {
      score += 25;
    }
    
    return score; // 0-100
  }
  
  /**
   * Dimension 3: Psychological Shift (20% weight)
   */
  private calculateMindsetScore(input: CSSInput): number {
    let score = 0;
    
    // Check 1: Mindset state progression (40 points)
    const mindsetValue = {
      'resistant': 1,
      'skeptical': 1,
      'neutral': 2,
      'cautious': 2,
      'open': 3,
      'curious': 3,
      'engaged': 4,
      'committed': 4,
    };
    
    const initialValue = mindsetValue[input.initial_mindset_state.toLowerCase()] || 2;
    const finalValue = mindsetValue[input.final_mindset_state.toLowerCase()] || 2;
    const mindsetShift = finalValue - initialValue;
    
    if (mindsetShift >= 3) score += 40; // Major shift
    else if (mindsetShift >= 2) score += 30; // Good shift
    else if (mindsetShift >= 1) score += 20; // Some shift
    else if (mindsetShift === 0) score += 10; // No shift
    // Negative shift gets 0
    
    // Check 2: Breakthrough moment (30 points)
    if (input.breakthrough_moment && input.breakthrough_moment.length > 10) {
      score += 30;
    }
    
    // Check 3: Personal benefit identified (30 points)
    // Must be personal, not organizational
    if (input.personal_benefit && input.personal_benefit.length > 10) {
      const isPersonal = !input.personal_benefit.toLowerCase().includes('organization') &&
                        !input.personal_benefit.toLowerCase().includes('company');
      if (isPersonal) {
        score += 30;
      }
    }
    
    return Math.min(score, 100); // Cap at 100
  }
  
  /**
   * Dimension 4: User Satisfaction (10% weight)
   */
  private calculateSatisfactionScore(input: CSSInput): number {
    // Simple linear conversion: 1-10 scale → 0-100 scale
    return input.user_satisfaction * 10;
  }
  
  /**
   * Determine overall success level
   */
  private getSuccessLevel(css: number): CSSOutput['success_level'] {
    if (css >= 85) return 'EXCELLENT';
    if (css >= 70) return 'GOOD';
    if (css >= 50) return 'FAIR';
    if (css >= 30) return 'MARGINAL';
    return 'INSUFFICIENT';
  }
  
  /**
   * Generate dimension-specific insights
   */
  private generateInsights(
    input: CSSInput,
    scores: {
      confidence_score: number;
      action_score: number;
      mindset_score: number;
      satisfaction_score: number;
      composite_success_score: number;
    }
  ): CSSOutput['dimension_insights'] {
    const { confidence_score, action_score, mindset_score, satisfaction_score } = scores;
    
    // Confidence insight
    let confidence_insight = '';
    if (input.initial_confidence >= 8) {
      const clarity_increase = (input.final_action_clarity || 0) - (input.initial_action_clarity || 0);
      confidence_insight = `Started with high confidence (${input.initial_confidence}/10). `;
      confidence_insight += `Action clarity improved from ${input.initial_action_clarity}/10 to ${input.final_action_clarity}/10 (+${clarity_increase}).`;
    } else {
      const conf_increase = input.final_confidence - input.initial_confidence;
      confidence_insight = `Confidence shifted from ${input.initial_confidence}/10 to ${input.final_confidence}/10 (+${conf_increase}). `;
      if (conf_increase >= 3) {
        confidence_insight += 'Excellent transformation achieved.';
      } else if (conf_increase >= 2) {
        confidence_insight += 'Good progress made.';
      } else {
        confidence_insight += 'More work needed on confidence building.';
      }
    }
    
    // Action insight
    let action_insight = '';
    if (action_score >= 75) {
      action_insight = 'Strong action plan with timing, obstacles, and accountability.';
    } else if (action_score >= 50) {
      action_insight = 'Good action identified, but could strengthen planning (timing, obstacles, or support).';
    } else if (action_score >= 25) {
      action_insight = 'Action needs more specificity - add day/time, backup plan, and accountability.';
    } else {
      action_insight = 'Action plan is too vague. Return to MAPPING stage to clarify.';
    }
    
    // Mindset insight
    let mindset_insight = '';
    const mindsetShift = `${input.initial_mindset_state} → ${input.final_mindset_state}`;
    if (mindset_score >= 70) {
      mindset_insight = `Significant psychological shift: ${mindsetShift}. `;
      if (input.breakthrough_moment) {
        mindset_insight += 'Had breakthrough moment. ';
      }
      if (input.personal_benefit) {
        mindset_insight += 'Found personal meaning in change.';
      }
    } else if (mindset_score >= 40) {
      mindset_insight = `Some mindset progress: ${mindsetShift}. Consider deeper work on personal benefits or limiting beliefs.`;
    } else {
      mindset_insight = `Limited mindset shift: ${mindsetShift}. Focus next session on OWNERSHIP stage.`;
    }
    
    // Satisfaction insight
    let satisfaction_insight = '';
    if (satisfaction_score >= 80) {
      satisfaction_insight = `Highly satisfied (${input.user_satisfaction}/10). `;
      if (input.session_helpfulness_reason) {
        satisfaction_insight += `"${input.session_helpfulness_reason}"`;
      }
    } else if (satisfaction_score >= 50) {
      satisfaction_insight = `Moderately satisfied (${input.user_satisfaction}/10). `;
      if (input.session_helpfulness_reason) {
        satisfaction_insight += `Feedback: "${input.session_helpfulness_reason}"`;
      }
    } else {
      satisfaction_insight = `Low satisfaction (${input.user_satisfaction}/10). `;
      satisfaction_insight += 'Session may not have addressed user's core concerns.';
    }
    
    return {
      confidence: confidence_insight,
      action: action_insight,
      mindset: mindset_insight,
      satisfaction: satisfaction_insight,
    };
  }
}

// Singleton instance
export const cssCalculator = new CSSCalculator();

// Helper function for use in mutations
export function calculateCSS(input: CSSInput): CSSOutput {
  return cssCalculator.calculate(input);
}
```

### Usage in Mutation

```typescript
// convex/sessions/completeSession.ts

import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { calculateCSS, type CSSInput } from "../utils/cssCalculator";

export const completeSessionWithCSS = mutation({
  args: {
    sessionId: v.id("coaching_sessions"),
  },
  handler: async (ctx, args) => {
    // 1. Get all reflections for session
    const reflections = await ctx.db
      .query("reflections")
      .withIndex("by_session", (q) => q.eq("coaching_session_id", args.sessionId))
      .collect();
    
    // 2. Extract data for CSS calculation
    const ownershipReflection = reflections.find(r => r.step === 'ownership');
    const mappingReflection = reflections.find(r => r.step === 'mapping');
    const practiceReflection = reflections.find(r => r.step === 'practice');
    
    const cssInput: CSSInput = {
      // Confidence
      initial_confidence: ownershipReflection?.payload?.initial_confidence ?? 5,
      final_confidence: practiceReflection?.payload?.final_confidence ?? 5,
      initial_action_clarity: ownershipReflection?.payload?.initial_action_clarity,
      final_action_clarity: practiceReflection?.payload?.final_action_clarity,
      
      // Action
      committed_action: mappingReflection?.payload?.committed_action,
      action_day: mappingReflection?.payload?.action_day,
      action_time: mappingReflection?.payload?.action_time,
      obstacle: mappingReflection?.payload?.obstacle,
      backup_plan: mappingReflection?.payload?.backup_plan,
      support_person: mappingReflection?.payload?.support_person,
      
      // Mindset
      initial_mindset_state: ownershipReflection?.payload?.initial_mindset_state ?? 'neutral',
      final_mindset_state: practiceReflection?.payload?.final_mindset_state ?? 'neutral',
      breakthrough_moment: ownershipReflection?.payload?.breakthrough_moment,
      personal_benefit: ownershipReflection?.payload?.personal_benefit,
      limiting_belief: ownershipReflection?.payload?.limiting_belief,
      evidence_against_belief: ownershipReflection?.payload?.evidence_against_belief,
      
      // Satisfaction
      user_satisfaction: practiceReflection?.payload?.user_satisfaction ?? 5,
    };
    
    // 3. Calculate CSS
    const cssResult = calculateCSS(cssInput);
    
    // 4. Store in database
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    
    await ctx.db.insert("composite_success_metrics", {
      session_id: args.sessionId,
      user_id: session.user_id,
      framework_id: "COMPASS",
      
      // Dimension 1
      initial_confidence: cssInput.initial_confidence,
      final_confidence: cssInput.final_confidence,
      confidence_increase: cssInput.final_confidence - cssInput.initial_confidence,
      confidence_score: cssResult.confidence_score,
      initial_action_clarity: cssInput.initial_action_clarity,
      final_action_clarity: cssInput.final_action_clarity,
      action_clarity_increase: 
        (cssInput.final_action_clarity && cssInput.initial_action_clarity)
          ? cssInput.final_action_clarity - cssInput.initial_action_clarity
          : undefined,
      
      // Dimension 2
      has_committed_action: !!cssInput.committed_action,
      has_action_timing: !!(cssInput.action_day && cssInput.action_time),
      has_obstacle_planning: !!(cssInput.obstacle && cssInput.backup_plan),
      has_accountability: !!cssInput.support_person,
      action_score: cssResult.action_score,
      
      // Dimension 3
      initial_mindset_state: cssInput.initial_mindset_state,
      final_mindset_state: cssInput.final_mindset_state,
      had_breakthrough_moment: !!cssInput.breakthrough_moment,
      found_personal_benefit: !!cssInput.personal_benefit,
      challenged_limiting_belief: !!(cssInput.limiting_belief && cssInput.evidence_against_belief),
      mindset_score: cssResult.mindset_score,
      
      // Dimension 4
      user_satisfaction: cssInput.user_satisfaction,
      session_helpfulness_reason: practiceReflection?.payload?.session_helpfulness_reason,
      satisfaction_score: cssResult.satisfaction_score,
      
      // Composite
      composite_success_score: cssResult.composite_success_score,
      success_level: cssResult.success_level,
      
      // Metadata
      calculated_at: Date.now(),
      calculation_version: "1.0",
    });
    
    // 5. Update session record
    await ctx.db.patch(args.sessionId, {
      composite_success_score: cssResult.composite_success_score,
      success_level: cssResult.success_level,
      dimension_scores: {
        confidence: cssResult.confidence_score,
        action: cssResult.action_score,
        mindset: cssResult.mindset_score,
        satisfaction: cssResult.satisfaction_score,
      },
      status: 'completed',
    });
    
    // 6. Generate and store insights
    await ctx.db.insert("session_success_insights", {
      session_id: args.sessionId,
      css_score: cssResult.composite_success_score,
      success_level: cssResult.success_level,
      
      confidence_insight: cssResult.dimension_insights.confidence,
      action_insight: cssResult.dimension_insights.action,
      mindset_insight: cssResult.dimension_insights.mindset,
      satisfaction_insight: cssResult.dimension_insights.satisfaction,
      
      overall_insight: generateOverallInsight(cssResult),
      next_session_recommendation: generateNextSessionRec(cssResult, cssInput),
      
      generated_at: Date.now(),
    });
    
    return {
      success: true,
      css_score: cssResult.composite_success_score,
      success_level: cssResult.success_level,
    };
  },
});

// Helper: Generate overall insight
function generateOverallInsight(cssResult: CSSOutput): string {
  const { composite_success_score, success_level } = cssResult;
  
  if (success_level === 'EXCELLENT') {
    return `Outstanding session (CSS: ${composite_success_score}). User achieved significant transformation across multiple dimensions. This is a coaching success story.`;
  } else if (success_level === 'GOOD') {
    return `Effective session (CSS: ${composite_success_score}). User made clear progress and left with actionable plan. Good coaching outcome.`;
  } else if (success_level === 'FAIR') {
    return `Moderate session (CSS: ${composite_success_score}). User made some progress but has room for improvement. Consider follow-up session.`;
  } else if (success_level === 'MARGINAL') {
    return `Limited session (CSS: ${composite_success_score}). User showed minimal progress. Recommend identifying barriers and trying different coaching approach.`;
  } else {
    return `Insufficient session (CSS: ${composite_success_score}). Session did not achieve meaningful progress. Strong recommendation for follow-up with adjusted approach.`;
  }
}

// Helper: Generate next session recommendation
function generateNextSessionRec(cssResult: CSSOutput, input: CSSInput): string {
  const { confidence_score, action_score, mindset_score, satisfaction_score } = cssResult;
  
  // Find lowest-scoring dimension
  const scores = [
    { dim: 'confidence', score: confidence_score },
    { dim: 'action', score: action_score },
    { dim: 'mindset', score: mindset_score },
    { dim: 'satisfaction', score: satisfaction_score },
  ].sort((a, b) => a.score - b.score);
  
  const lowestDim = scores[0];
  
  if (lowestDim.score < 50) {
    if (lowestDim.dim === 'confidence') {
      return 'FOCUS: Deep dive on OWNERSHIP stage. Explore fears, find personal benefits, activate past successes.';
    } else if (lowestDim.dim === 'action') {
      return 'FOCUS: Work on MAPPING stage. Create more specific action plan with timing, obstacles, and accountability.';
    } else if (lowestDim.dim === 'mindset') {
      return 'FOCUS: Psychological work in OWNERSHIP. Challenge limiting beliefs, find breakthrough moments.';
    } else {
      return 'FOCUS: Session format may not be working. Discuss with user what would be more helpful.';
    }
  } else if (cssResult.composite_success_score >= 70) {
    return 'CONTINUE: Progress is good. Focus on action execution and return for PRACTICE stage review.';
  } else {
    return 'ADJUST: Some progress made. Return to lowest-scoring dimension for deeper work.';
  }
}
```

---

## Framework Changes

### Update Framework Definition

```typescript
// convex/frameworks/compass.ts

export const compassFramework: FrameworkDefinition = {
  id: 'COMPASS',
  name: 'COMPASS Change Navigation',
  // ... existing fields
  
  // NEW: Success measurement configuration
  success_measurement: {
    enabled: true,
    method: 'composite_score', // vs. 'simple_confidence'
    dimensions: [
      {
        name: 'confidence',
        weight: 0.40,
        measurement_points: ['ownership_start', 'practice_end'],
      },
      {
        name: 'action',
        weight: 0.30,
        measurement_points: ['mapping_complete'],
      },
      {
        name: 'mindset',
        weight: 0.20,
        measurement_points: ['ownership_start', 'practice_end', 'throughout'],
      },
      {
        name: 'satisfaction',
        weight: 0.10,
        measurement_points: ['practice_end'],
      },
    ],
    thresholds: {
      excellent: 85,
      good: 70,
      fair: 50,
      marginal: 30,
    },
  },
  
  // NEW: Completion rules now use CSS
  completion_rules: [
    {
      required_fields: [
        'initial_confidence',
        'final_confidence',
        'initial_mindset_state',
        'final_mindset_state',
        'user_satisfaction',
        'committed_action',
      ],
      validation: (data: Record<string, unknown>): boolean => {
        // Must have baseline and final measurements
        const hasConfidenceData = 
          'initial_confidence' in data && 
          'final_confidence' in data;
        
        const hasMindsetData =
          'initial_mindset_state' in data &&
          'final_mindset_state' in data;
        
        const hasSatisfaction = 'user_satisfaction' in data;
        
        const hasAction = 'committed_action' in data;
        
        return hasConfidenceData && hasMindsetData && hasSatisfaction && hasAction;
      },
      error_message: 'Complete session requires: baseline/final confidence, mindset states, satisfaction rating, and committed action',
    },
  ],
  
  steps: [
    // Update OWNERSHIP step
    {
      name: 'ownership',
      order: 2,
      duration_minutes: 8,
      objective: 'Transform resistance → acceptance → commitment',
      
      required_fields_schema: {
        type: 'object',
        properties: {
          // EXISTING FIELDS
          initial_confidence: { type: 'integer', minimum: 1, maximum: 10 },
          current_confidence: { type: 'integer', minimum: 1, maximum: 10 },
          personal_benefit: { type: 'string', maxLength: 200 },
          
          // NEW FIELDS FOR CSS
          initial_action_clarity: { 
            type: 'integer', 
            minimum: 1, 
            maximum: 10,
            description: 'How clear user is on next steps (for high-confidence branch)'
          },
          initial_mindset_state: {
            type: 'string',
            enum: ['resistant', 'skeptical', 'neutral', 'cautious', 'open', 'curious', 'engaged', 'committed'],
            description: 'User mindset at start of session'
          },
          breakthrough_moment: {
            type: 'string',
            maxLength: 300,
            description: 'Exact user words when they had "aha" moment'
          },
          
          // ... other existing fields
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: ['initial_confidence', 'initial_mindset_state', 'personal_benefit', 'coach_reflection'],
        additionalProperties: false
      },
      
      // ... rest of ownership config
    },
    
    // Update PRACTICE step
    {
      name: 'practice',
      order: 4,
      duration_minutes: 3,
      objective: 'Lock in commitment and measure transformation',
      
      required_fields_schema: {
        type: 'object',
        properties: {
          // EXISTING FIELDS
          action_commitment_confidence: { type: 'integer', minimum: 1, maximum: 10 },
          final_confidence: { type: 'integer', minimum: 1, maximum: 10 },
          key_takeaway: { type: 'string', maxLength: 200 },
          
          // NEW FIELDS FOR CSS
          final_action_clarity: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
            description: 'How clear user is on next steps at end'
          },
          final_mindset_state: {
            type: 'string',
            enum: ['resistant', 'skeptical', 'neutral', 'cautious', 'open', 'curious', 'engaged', 'committed'],
            description: 'User mindset at end of session'
          },
          user_satisfaction: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
            description: 'How helpful was this session?'
          },
          session_helpfulness_reason: {
            type: 'string',
            maxLength: 300,
            description: 'What made session helpful or not helpful'
          },
          
          // ... other existing fields
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: [
          'action_commitment_confidence',
          'final_confidence',
          'final_mindset_state',
          'user_satisfaction',
          'key_takeaway',
          'coach_reflection'
        ],
        additionalProperties: false
      },
      
      // ... rest of practice config
    },
  ],
};
```

---

## Prompt Engineering

### Updated OWNERSHIP Prompt

```typescript
// convex/prompts/compass.ts

export const COMPASS_STEP_GUIDANCE: Record<string, string> = {
  
  ownership: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OWNERSHIP STAGE (8 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Transform resistance → acceptance → commitment
Build confidence from 3/10 to 6+/10 by finding personal meaning and activating past successes.

THIS IS THE TRANSFORMATION STAGE - Expect +3 to +4 point confidence increase

⚠️ CRITICAL: This stage now collects BASELINE MEASUREMENTS for Composite Success Score (CSS).
⚠️ Ask ALL baseline questions FIRST before proceeding with transformation work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BASELINE MEASUREMENTS (Ask FIRST - Required for CSS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────┐
│ BASELINE QUESTION 1: Initial Confidence            │
│ PRIMARY METRIC - Do not skip                       │
└────────────────────────────────────────────────────┘

Ask: "On a scale of 1-10, how confident do you feel about navigating this change successfully?"

PURPOSE:
→ Establish confidence baseline for CSS Dimension 1
→ This is THE primary transformation metric
→ Everything builds from this number

EXTRACTION:
→ Extract: initial_confidence (1-10)
→ ⚠️ WAIT for explicit number
→ DO NOT guess, auto-fill, or assume

┌────────────────────────────────────────────────────┐
│ BASELINE QUESTION 2: Initial Action Clarity        │
│ For high-confidence users - Conditional            │
└────────────────────────────────────────────────────┘

IF initial_confidence >= 8:
  Ask: "That's strong confidence! How clear are you on your specific next steps? (1-10)"
  
  PURPOSE:
  → High-confidence users need action clarity, not confidence building
  → CSS will measure clarity improvement instead of confidence improvement
  
  EXTRACTION:
  → Extract: initial_action_clarity (1-10)
  → This becomes the primary metric for high-confidence users

ELSE:
  → SKIP this question (not needed for low-moderate confidence users)

┌────────────────────────────────────────────────────┐
│ BASELINE QUESTION 3: Initial Mindset State         │
│ CSS Dimension 3 - Always ask                       │
└────────────────────────────────────────────────────┘

Ask: "How would you describe your current mindset about this change?"

PROVIDE OPTIONS (don't make them come up with words):
→ "Resistant or skeptical - you're pushing back against it"
→ "Neutral or cautious - you're taking a wait-and-see approach"
→ "Open or curious - you're interested but have questions"
→ "Engaged or committed - you're ready to make this work"

EXTRACTION:
→ Extract: initial_mindset_state (one of: resistant, skeptical, neutral, cautious, open, curious, engaged, committed)
→ This measures psychological starting point for CSS

⚠️ CRITICAL: Ask ALL THREE baseline questions before proceeding with transformation work.
⚠️ These measurements are REQUIRED for Composite Success Score calculation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ BRANCHING LOGIC BASED ON INITIAL CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─ IF initial_confidence >= 8 (HIGH CONFIDENCE):
│  
│  DIAGNOSIS: User is already confident. They need ACTION CLARITY, not confidence building.
│  
│  SKIP:
│  ✗ Question 2 (Explore Fears)
│  ✗ Question 3 (Resistance Cost)
│  ✗ Question 5 (Past Success Mining)
│  ✗ Question 6 (Challenge Limiting Beliefs)
│  
│  FOCUS ON:
│  ✓ Question 4 (Personal Benefit) - Quick check
│  ✓ Move directly to MAPPING stage
│  ✓ Get them into action planning ASAP
│  
│  SUCCESS METRIC:
│  → Improve action_clarity from X → 9-10
│  → Get specific committed action with day/time
│  
│  Coach: "You're confident - excellent! Let's turn that confidence into a concrete plan. 
│          [Move to MAPPING stage]"
└─

┌─ IF initial_confidence 4-7 (MODERATE - MOST COMMON):
│  
│  DIAGNOSIS: Standard confidence building needed.
│  
│  PROCEED WITH: All transformation questions (Q2-Q7)
│  TARGET: Move to 6-7/10 by end of stage
│  
│  This is the standard OWNERSHIP flow.
└─

┌─ IF initial_confidence <= 3 (LOW - HIGH CONCERN):
│  
│  DIAGNOSIS: Very low confidence. Extra care needed.
│  
│  PROCEED WITH: All transformation questions (Q2-Q7)
│  ⚠️ Extra empathy required
│  ⚠️ Slow down - don't rush them
│  ⚠️ Use catastrophe_reality_check and past_success_mining nudges
│  TARGET: Move to 5-6/10 by end of stage
└─

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 TRANSFORMATION QUESTIONS (For confidence < 8 only)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... existing OWNERSHIP questions Q2-Q6 ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 BREAKTHROUGH MOMENT DETECTION (Throughout stage)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WATCH FOR BREAKTHROUGH SIGNALS:
- User says: "Oh!", "Wait...", "I never thought of it that way", "Huh, that's interesting"
- Energy shifts from heavy/resistant to lighter/curious
- Tone changes from defensive to open
- User makes connections themselves

WHEN DETECTED:
→ Extract: breakthrough_moment (their EXACT words)
→ Example: "Wait, this could actually help my career - I never saw it that way"
→ Amplify: "That's a significant realization. How does that shift things for you?"
→ This is a CSS Dimension 3 marker - very valuable data

DO NOT:
✗ Force breakthroughs
✗ Put words in their mouth
✗ Claim breakthrough if user doesn't feel it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STAGE COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before advancing to MAPPING stage, verify ALL mandatory fields:

MANDATORY (Must Have):
✅ initial_confidence - Numeric baseline (1-10) - CRITICAL
✅ initial_mindset_state - String (resistant/neutral/open/engaged) - CRITICAL
✅ personal_benefit - Must be PERSONAL, not organizational - CRITICAL

CONDITIONAL:
✅ initial_action_clarity - Required if initial_confidence >= 8

OPTIONAL (Nice to Have):
○ breakthrough_moment - User's exact words if detected
○ limiting_belief + evidence_against_belief - If challenged
○ past_success - If explored

TARGET OUTCOMES:
✅ Baseline measurements captured for CSS
✅ User has personal stake in change (not just compliance)
✅ User ready to identify action

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

  // ... other stages
};
```

### Updated PRACTICE Prompt

```typescript
practice: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PRACTICE STAGE (3 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJECTIVE: Lock in action commitment, measure transformation, capture satisfaction

⚠️ CRITICAL: This stage collects FINAL MEASUREMENTS for Composite Success Score (CSS).
⚠️ Ask ALL final measurements at the END of this stage.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ PROGRESSIVE QUESTIONING FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... existing PRACTICE questions Q1-Q3 ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FINAL MEASUREMENTS (Ask at END - Required for CSS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT: Ask these FIVE questions AFTER key takeaway, BEFORE completing session.

┌────────────────────────────────────────────────────┐
│ FINAL QUESTION 1: Final Confidence                 │
│ CSS Dimension 1 - Critical                         │
└────────────────────────────────────────────────────┘

Ask: "Let's check in: When we started, your confidence was [initial]/10. Where is it now overall?"

PURPOSE:
→ Measure total confidence transformation (CSS Dimension 1)
→ Compare to initial_confidence to calculate increase
→ Celebrate the shift explicitly

EXTRACTION:
→ Extract: final_confidence (1-10)
→ Calculate: confidence_increase = final - initial
→ ⚠️ CELEBRATE: "That's a +[X] point increase! [enthusiastic acknowledgment]"

Example celebration phrases:
- "+3 or more: "That's a significant transformation!"
- "+2: "That's solid progress!"
- "+1: "You're moving in the right direction!"
- "0 or negative: "Let's explore what would help your confidence increase."

┌────────────────────────────────────────────────────┐
│ FINAL QUESTION 2: Final Action Clarity             │
│ CSS Dimension 1 - For all users                    │
└────────────────────────────────────────────────────┘

Ask: "And how clear are you now on your specific next steps? (1-10)"

PURPOSE:
→ Measure action clarity improvement (especially for high-confidence users)
→ CSS Dimension 1 alternative metric
→ Validates that MAPPING stage was effective

EXTRACTION:
→ Extract: final_action_clarity (1-10)
→ IF initial_confidence >= 8: This is PRIMARY metric (not confidence)
→ ELSE: This is SECONDARY metric (confidence is primary)

Interpretation:
- 8-10: "You have crystal clarity on next steps"
- 6-7: "You have good clarity - let's sharpen one more detail if needed"
- <6: "Let's spend another moment making your action even more specific"

┌────────────────────────────────────────────────────┐
│ FINAL QUESTION 3: Final Mindset State              │
│ CSS Dimension 3 - Critical                         │
└────────────────────────────────────────────────────┘

Ask: "Looking back at our conversation, how would you describe your mindset now?"

PROVIDE SAME OPTIONS AS INITIAL:
→ "Resistant or skeptical"
→ "Neutral or cautious"
→ "Open or curious"
→ "Engaged or committed"

PURPOSE:
→ Measure psychological shift (CSS Dimension 3)
→ Compare to initial_mindset_state
→ Validate emotional transformation occurred

EXTRACTION:
→ Extract: final_mindset_state (resistant/skeptical/neutral/cautious/open/curious/engaged/committed)

Celebrate shift:
- "You shifted from [initial] to [final] - that's a meaningful psychological change."

┌────────────────────────────────────────────────────┐
│ FINAL QUESTION 4: User Satisfaction                │
│ CSS Dimension 4 - Critical                         │
└────────────────────────────────────────────────────┘

Ask: "On a scale of 1-10, how helpful was this session for you?"

PURPOSE:
→ Measure user experience (CSS Dimension 4)
→ Gauge coaching effectiveness from user perspective
→ Identify if session format worked for them

EXTRACTION:
→ Extract: user_satisfaction (1-10)
→ ⚠️ DO NOT be defensive if score is low
→ Curiosity, not defensiveness

Response guidelines:
- 8-10: "Glad it was helpful!"
- 6-7: "I appreciate the feedback. What would have made it a 9 or 10?"
- <6: "I hear that. Tell me more - what wasn't working for you?"

┌────────────────────────────────────────────────────┐
│ FINAL QUESTION 5: Satisfaction Reason              │
│ CSS Dimension 4 - Qualitative context              │
└────────────────────────────────────────────────────┘

Ask: "What made it [helpful/not helpful]? Just a sentence or two."

PURPOSE:
→ Get qualitative context for satisfaction score
→ Understand what worked/didn't work
→ Inform future coaching improvements

EXTRACTION:
→ Extract: session_helpfulness_reason (string, max 300 chars)
→ Keep brief - this is context, not essay

Examples:
- "You helped me see this as an opportunity instead of a threat."
- "I now have a concrete plan instead of just worrying."
- "It was too rushed - I needed more time to think."
- "The questions were helpful but I'm still scared."

⚠️ CRITICAL: Ask ALL FIVE final measurement questions.
⚠️ These are REQUIRED for Composite Success Score calculation.
⚠️ DO NOT skip these - they are as important as the coaching itself.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STAGE COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before completing session, verify ALL mandatory fields:

MANDATORY (Must Have):
✅ action_commitment_confidence - How confident about action (1-10)
✅ final_confidence - Overall confidence now (1-10)
✅ final_action_clarity - Clarity on next steps (1-10) - NEW
✅ final_mindset_state - Mindset state now (string) - NEW
✅ user_satisfaction - How helpful was session (1-10) - NEW
✅ session_helpfulness_reason - Why helpful/not helpful (string) - NEW
✅ key_takeaway - Their insight in their words

OPTIONAL:
○ success_proof - What they'll prove by doing action
○ what_shifted - What changed during session

TARGET OUTCOMES:
✅ All CSS measurements captured
✅ Action commitment documented
✅ Transformation recognized and celebrated
✅ User feedback collected

IF ANY MANDATORY FIELD MISSING:
→ ⚠️ DO NOT complete session
→ Go back and extract missing field
→ CSS calculation requires complete data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SESSION COMPLETION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After collecting all measurements:

1. Acknowledge user: "Thank you for those answers - really helpful for me to understand your experience."

2. Final summary: "So to recap:
   - Your confidence went from [X] to [Y] (+[Z])
   - You have a clear action: [action] on [day] at [time]
   - Your mindset shifted from [initial] to [final]
   - You're committed at [action_commitment]/10"

3. End positively: "You've got this. Go take that action and let's see what happens!"

⚠️ Session will now be marked complete and CSS will be calculated automatically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
```

---

## Coach Logic Updates

### Update Coach Completion Check

```typescript
// convex/coach/compass.ts

export class COMPASSCoach implements FrameworkCoach {
  
  /**
   * Check if PRACTICE step is complete (updated for CSS)
   */
  private checkPracticeCompletion(payload: ReflectionPayload): StepCompletionResult {
    // Check all required CSS measurement fields
    const hasActionCommitment = 
      typeof payload["action_commitment_confidence"] === "number" &&
      payload["action_commitment_confidence"] >= 1 &&
      payload["action_commitment_confidence"] <= 10;
    
    const hasFinalConfidence = 
      typeof payload["final_confidence"] === "number" &&
      payload["final_confidence"] >= 1 &&
      payload["final_confidence"] <= 10;
    
    // NEW: CSS required fields
    const hasFinalActionClarity =
      typeof payload["final_action_clarity"] === "number" &&
      payload["final_action_clarity"] >= 1 &&
      payload["final_action_clarity"] <= 10;
    
    const hasFinalMindset =
      typeof payload["final_mindset_state"] === "string" &&
      payload["final_mindset_state"].length > 0;
    
    const hasSatisfaction =
      typeof payload["user_satisfaction"] === "number" &&
      payload["user_satisfaction"] >= 1 &&
      payload["user_satisfaction"] <= 10;
    
    const hasKeyTakeaway = 
      typeof payload["key_takeaway"] === "string" &&
      payload["key_takeaway"].length > 0;
    
    // All 6 fields required
    const allFieldsPresent = 
      hasActionCommitment &&
      hasFinalConfidence &&
      hasFinalActionClarity &&
      hasFinalMindset &&
      hasSatisfaction &&
      hasKeyTakeaway;
    
    return { 
      shouldAdvance: allFieldsPresent,
      missing_fields: !allFieldsPresent ? [
        !hasActionCommitment ? 'action_commitment_confidence' : null,
        !hasFinalConfidence ? 'final_confidence' : null,
        !hasFinalActionClarity ? 'final_action_clarity' : null,
        !hasFinalMindset ? 'final_mindset_state' : null,
        !hasSatisfaction ? 'user_satisfaction' : null,
        !hasKeyTakeaway ? 'key_takeaway' : null,
      ].filter(Boolean) : []
    };
  }
  
  /**
   * Check if OWNERSHIP step is complete (updated for CSS)
   */
  private checkOwnershipCompletion(payload: ReflectionPayload): StepCompletionResult {
    const hasInitialConfidence = 
      typeof payload["initial_confidence"] === "number" &&
      payload["initial_confidence"] >= 1 &&
      payload["initial_confidence"] <= 10;
    
    // NEW: CSS required field
    const hasInitialMindset =
      typeof payload["initial_mindset_state"] === "string" &&
      payload["initial_mindset_state"].length > 0;
    
    const hasPersonalBenefit = 
      typeof payload["personal_benefit"] === "string" &&
      payload["personal_benefit"].length > 0;
    
    // For high-confidence users, initial_action_clarity is required
    const initial_conf = payload["initial_confidence"] as number;
    if (initial_conf >= 8) {
      const hasInitialActionClarity =
        typeof payload["initial_action_clarity"] === "number" &&
        payload["initial_action_clarity"] >= 1 &&
        payload["initial_action_clarity"] <= 10;
      
      return {
        shouldAdvance: hasInitialConfidence && hasInitialMindset && hasPersonalBenefit && hasInitialActionClarity,
        missing_fields: [
          !hasInitialConfidence ? 'initial_confidence' : null,
          !hasInitialMindset ? 'initial_mindset_state' : null,
          !hasPersonalBenefit ? 'personal_benefit' : null,
          !hasInitialActionClarity ? 'initial_action_clarity' : null,
        ].filter(Boolean)
      };
    }
    
    // Standard completion (confidence < 8)
    return {
      shouldAdvance: hasInitialConfidence && hasInitialMindset && hasPersonalBenefit,
      missing_fields: [
        !hasInitialConfidence ? 'initial_confidence' : null,
        !hasInitialMindset ? 'initial_mindset_state' : null,
        !hasPersonalBenefit ? 'personal_benefit' : null,
      ].filter(Boolean)
    };
  }
}
```

---

## Report Generation

### Update Report to Include CSS

```typescript
// convex/reports/compass.ts

export function generateCompassReport(data: SessionReportData): FormattedReport {
  const sections: ReportSection[] = [];
  
  // === NEW: CSS Summary Section (First section) ===
  const cssMetrics = await getCSSMetrics(data.sessionId);
  if (cssMetrics) {
    sections.push({
      heading: '🎯 SESSION SUCCESS SCORE',
      content: formatCSSSection(cssMetrics),
      type: 'css_summary',
      data: cssMetrics
    });
  }
  
  // === NEW: Dimension Breakdown Section ===
  if (cssMetrics) {
    sections.push({
      heading: '📊 SUCCESS DIMENSIONS',
      content: formatDimensionBreakdown(cssMetrics),
      type: 'css_dimensions',
      data: cssMetrics
    });
  }
  
  // ... existing sections (transformation, context, etc.)
  
  // === NEW: Next Steps Based on CSS ===
  if (cssMetrics) {
    const insights = await getCSSInsights(data.sessionId);
    if (insights) {
      sections.push({
        heading: '🎯 NEXT STEPS',
        content: `${insights.overall_insight}\n\n${insights.next_session_recommendation}`,
        type: 'next_steps'
      });
    }
  }
  
  return {
    title: 'COMPASS Change Readiness Report',
    summary: cssMetrics 
      ? `Success Score: ${cssMetrics.composite_success_score}/100 (${cssMetrics.success_level})`
      : 'Session Complete',
    sections
  };
}

/**
 * Format CSS summary section
 */
function formatCSSSection(css: CSSMetrics): string {
  const badge = getSuccessBadge(css.success_level);
  
  return `
${badge} ${css.success_level}
Overall Score: ${css.composite_success_score}/100

Your coaching session was ${css.success_level.toLowerCase()} across 4 key dimensions:
- Confidence transformation
- Action specificity
- Psychological shift  
- User satisfaction

${getSuccessLevelDescription(css.success_level)}
  `.trim();
}

/**
 * Format dimension breakdown
 */
function formatDimensionBreakdown(css: CSSMetrics): string {
  return `
1️⃣ CONFIDENCE TRANSFORMATION (40% weight)
   Score: ${css.confidence_score}/100
   ${css.dimension_insights.confidence}

2️⃣ ACTION SPECIFICITY (30% weight)
   Score: ${css.action_score}/100
   ${css.dimension_insights.action}

3️⃣ PSYCHOLOGICAL SHIFT (20% weight)
   Score: ${css.mindset_score}/100
   ${css.dimension_insights.mindset}

4️⃣ USER SATISFACTION (10% weight)
   Score: ${css.satisfaction_score}/100
   ${css.dimension_insights.satisfaction}
  `.trim();
}

/**
 * Get success badge emoji
 */
function getSuccessBadge(level: string): string {
  switch (level) {
    case 'EXCELLENT': return '🌟';
    case 'GOOD': return '✅';
    case 'FAIR': return '🔵';
    case 'MARGINAL': return '🟡';
    case 'INSUFFICIENT': return '🔴';
    default: return '⚪';
  }
}

/**
 * Get success level description
 */
function getSuccessLevelDescription(level: string): string {
  switch (level) {
    case 'EXCELLENT':
      return '🌟 Outstanding! You achieved significant transformation across multiple dimensions. This is a coaching success story.';
    case 'GOOD':
      return '✅ Effective session. You made clear progress and left with an actionable plan. Good outcome.';
    case 'FAIR':
      return '🔵 Moderate progress. You made some headway but have room for improvement. Consider a follow-up session to deepen your work.';
    case 'MARGINAL':
      return '🟡 Limited progress. The session showed minimal advancement. We recommend identifying what barriers remain and trying a different coaching approach.';
    case 'INSUFFICIENT':
      return '🔴 This session did not achieve meaningful progress. We strongly recommend a follow-up session with an adjusted approach to better address your needs.';
    default:
      return '';
  }
}

/**
 * Fetch CSS metrics from database
 */
async function getCSSMetrics(sessionId: string): Promise<CSSMetrics | null> {
  const metrics = await ctx.db
    .query("composite_success_metrics")
    .withIndex("by_session", (q) => q.eq("session_id", sessionId))
    .first();
  
  return metrics ? {
    composite_success_score: metrics.composite_success_score,
    success_level: metrics.success_level,
    confidence_score: metrics.confidence_score,
    action_score: metrics.action_score,
    mindset_score: metrics.mindset_score,
    satisfaction_score: metrics.satisfaction_score,
    dimension_insights: {
      confidence: '', // Will be populated from insights table
      action: '',
      mindset: '',
      satisfaction: '',
    }
  } : null;
}

/**
 * Fetch CSS insights from database
 */
async function getCSSInsights(sessionId: string) {
  return await ctx.db
    .query("session_success_insights")
    .withIndex("by_session", (q) => q.eq("session_id", sessionId))
    .first();
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// tests/cssCalculator.test.ts

import { describe, it, expect } from 'vitest';
import { CSSCalculator } from '../convex/utils/cssCalculator';

describe('CSSCalculator', () => {
  const calculator = new CSSCalculator();
  
  describe('Classic Transformation (Low-Moderate Confidence)', () => {
    it('should score EXCELLENT for +4 confidence increase with strong action', () => {
      const result = calculator.calculate({
        initial_confidence: 3,
        final_confidence: 7,
        committed_action: 'Complete Module 1 training',
        action_day: 'Thursday',
        action_time: '2-4pm',
        obstacle: 'Might get stuck on technical setup',
        backup_plan: 'Ask Jamie for help',
        support_person: 'Jamie',
        initial_mindset_state: 'resistant',
        final_mindset_state: 'engaged',
        breakthrough_moment: 'Wait, this could actually help my career',
        personal_benefit: 'Build valuable technical skills',
        user_satisfaction: 9,
      });
      
      expect(result.confidence_score).toBe(100); // +4 increase
      expect(result.action_score).toBe(100); // All fields present
      expect(result.mindset_score).toBeGreaterThan(70); // Good shift + breakthrough
      expect(result.satisfaction_score).toBe(90); // 9/10
      expect(result.composite_success_score).toBeGreaterThan(85);
      expect(result.success_level).toBe('EXCELLENT');
    });
    
    it('should score GOOD for +2 confidence increase', () => {
      const result = calculator.calculate({
        initial_confidence: 5,
        final_confidence: 7,
        committed_action: 'Review documentation',
        action_day: 'Monday',
        action_time: '10am',
        initial_mindset_state: 'neutral',
        final_mindset_state: 'open',
        user_satisfaction: 7,
      });
      
      expect(result.confidence_score).toBe(75); // +2 increase
      expect(result.composite_success_score).toBeGreaterThanOrEqual(50);
      expect(result.composite_success_score).toBeLessThan(85);
      expect(result.success_level).toMatch(/GOOD|FAIR/);
    });
  });
  
  describe('High-Confidence Users', () => {
    it('should use action_clarity for users starting at 9/10', () => {
      const result = calculator.calculate({
        initial_confidence: 9,
        final_confidence: 9, // No change
        initial_action_clarity: 4,
        final_action_clarity: 9, // +5 improvement
        committed_action: 'Implement first phase of rollout',
        action_day: 'Tuesday',
        action_time: '9am-12pm',
        obstacle: 'Team resistance',
        backup_plan: 'Hold 1-on-1s with resistors',
        support_person: 'Tom (IT Director)',
        initial_mindset_state: 'engaged',
        final_mindset_state: 'committed',
        personal_benefit: 'Showcase my leadership capabilities',
        user_satisfaction: 8,
      });
      
      expect(result.confidence_score).toBe(100); // High action clarity improvement
      expect(result.action_score).toBe(100); // Complete action plan
      expect(result.composite_success_score).toBeGreaterThan(85);
      expect(result.success_level).toBe('EXCELLENT');
    });
  });
  
  describe('Edge Cases', () => {
    it('should score MARGINAL for no progress', () => {
      const result = calculator.calculate({
        initial_confidence: 4,
        final_confidence: 4, // No change
        initial_mindset_state: 'neutral',
        final_mindset_state: 'neutral', // No change
        user_satisfaction: 5, // Low
      });
      
      expect(result.confidence_score).toBeLessThanOrEqual(25);
      expect(result.composite_success_score).toBeLessThan(50);
      expect(result.success_level).toMatch(/MARGINAL|INSUFFICIENT/);
    });
    
    it('should penalize missing action details', () => {
      const result = calculator.calculate({
        initial_confidence: 3,
        final_confidence: 7, // +4 (excellent)
        committed_action: 'Do something', // Vague
        // Missing day, time, obstacle, backup, support
        initial_mindset_state: 'resistant',
        final_mindset_state: 'open',
        user_satisfaction: 8,
      });
      
      expect(result.action_score).toBeLessThan(50); // Poor action specificity
      // Overall should still be FAIR due to good confidence increase
      expect(result.success_level).toMatch(/FAIR|GOOD/);
    });
  });
});
```

### Integration Tests

```typescript
// tests/cssIntegration.test.ts

import { describe, it, expect } from 'vitest';
import { ConvexTestingHelper } from 'convex-test';

describe('CSS Integration Tests', () => {
  it('should calculate and store CSS for complete COMPASS session', async () => {
    const t = new ConvexTestingHelper(schema);
    
    // 1. Create session
    const sessionId = await t.mutation(api.sessions.create, {
      user_id: 'test-user',
      framework_id: 'COMPASS',
    });
    
    // 2. Add OWNERSHIP reflection
    await t.mutation(api.reflections.add, {
      coaching_session_id: sessionId,
      step: 'ownership',
      payload: {
        initial_confidence: 3,
        initial_action_clarity: undefined,
        initial_mindset_state: 'resistant',
        personal_benefit: 'Build career-advancing skills',
        breakthrough_moment: 'This is actually an opportunity',
        coach_reflection: 'User shifted from resistance to opportunity mindset',
      },
    });
    
    // 3. Add MAPPING reflection
    await t.mutation(api.reflections.add, {
      coaching_session_id: sessionId,
      step: 'mapping',
      payload: {
        committed_action: 'Complete Module 1 training',
        action_day: 'Thursday',
        action_time: '2-4pm',
        obstacle: 'Might get stuck',
        backup_plan: 'Ask Jamie',
        support_person: 'Jamie',
        coach_reflection: 'Specific action plan with contingencies',
      },
    });
    
    // 4. Add PRACTICE reflection (with final measurements)
    await t.mutation(api.reflections.add, {
      coaching_session_id: sessionId,
      step: 'practice',
      payload: {
        action_commitment_confidence: 9,
        final_confidence: 7,
        final_action_clarity: 9,
        final_mindset_state: 'engaged',
        user_satisfaction: 9,
        session_helpfulness_reason: 'I have a clear plan now and feel less scared',
        key_takeaway: 'I can do this one step at a time',
        coach_reflection: 'User transformed from 3 to 7 confidence',
      },
    });
    
    // 5. Complete session (triggers CSS calculation)
    const result = await t.mutation(api.sessions.completeSessionWithCSS, {
      sessionId,
    });
    
    // 6. Verify CSS was calculated
    expect(result.success).toBe(true);
    expect(result.css_score).toBeGreaterThan(80); // Should be EXCELLENT
    expect(result.success_level).toBe('EXCELLENT');
    
    // 7. Verify database records created
    const cssRecord = await t.query(api.metrics.getCSSBySession, { sessionId });
    expect(cssRecord).toBeDefined();
    expect(cssRecord.composite_success_score).toBeGreaterThan(80);
    expect(cssRecord.confidence_score).toBe(100); // +4 increase
    expect(cssRecord.action_score).toBe(100); // All fields present
    expect(cssRecord.mindset_score).toBeGreaterThan(60); // Good shift
    expect(cssRecord.satisfaction_score).toBe(90); // 9/10
    
    // 8. Verify insights generated
    const insights = await t.query(api.metrics.getCSSInsights, { sessionId });
    expect(insights).toBeDefined();
    expect(insights.overall_insight).toContain('Outstanding');
    expect(insights.next_session_recommendation).toContain('CONTINUE');
  });
});
```

---

## Migration Plan

### Phase 1: Database Migration (Week 1)

```typescript
// migrations/001_add_css_tables.ts

import { internalMutation } from "./_generated/server";

export const addCSSTables = internalMutation({
  handler: async (ctx) => {
    // 1. Add new tables (handled by schema.ts push)
    console.log("New tables will be created on schema push");
    
    // 2. Backfill existing sessions with null CSS values
    const sessions = await ctx.db.query("coaching_sessions").collect();
    
    for (const session of sessions) {
      if (!session.composite_success_score) {
        await ctx.db.patch(session._id, {
          composite_success_score: null,
          success_level: null,
          dimension_scores: null,
        });
      }
    }
    
    console.log(`Backfilled ${sessions.length} sessions`);
    
    return { success: true, sessions_updated: sessions.length };
  },
});
```

### Phase 2: Code Deployment (Week 1)

```bash
# Deploy order:
1. Push schema changes
   npx convex deploy --schema-only

2. Run migration
   npx convex run migrations:addCSSTables

3. Deploy code
   npx convex deploy

4. Test in staging
   npm run test:integration

5. Deploy to production
   git push origin main
```

### Phase 3: Monitoring (Week 2)

```typescript
// Create monitoring dashboard query

export const getCSSStats = query({
  handler: async (ctx) => {
    const metrics = await ctx.db.query("composite_success_metrics").collect();
    
    const stats = {
      total_sessions: metrics.length,
      success_levels: {
        excellent: metrics.filter(m => m.success_level === 'EXCELLENT').length,
        good: metrics.filter(m => m.success_level === 'GOOD').length,
        fair: metrics.filter(m => m.success_level === 'FAIR').length,
        marginal: metrics.filter(m => m.success_level === 'MARGINAL').length,
        insufficient: metrics.filter(m => m.success_level === 'INSUFFICIENT').length,
      },
      avg_css: metrics.reduce((sum, m) => sum + m.composite_success_score, 0) / metrics.length,
      avg_dimensions: {
        confidence: metrics.reduce((sum, m) => sum + m.confidence_score, 0) / metrics.length,
        action: metrics.reduce((sum, m) => sum + m.action_score, 0) / metrics.length,
        mindset: metrics.reduce((sum, m) => sum + m.mindset_score, 0) / metrics.length,
        satisfaction: metrics.reduce((sum, m) => sum + m.satisfaction_score, 0) / metrics.length,
      },
    };
    
    return stats;
  },
});
```

### Phase 4: A/B Testing (Week 3-4)

```typescript
// Enable gradual rollout

export const shouldUseCSSForSession = (userId: string): boolean => {
  // Use hash to deterministically assign users to test group
  const hash = simpleHash(userId);
  const rolloutPercent = 50; // Start with 50% of users
  
  return (hash % 100) < rolloutPercent;
};

// In session creation:
const useCCS = shouldUseCSSForSession(userId);

await ctx.db.insert("coaching_sessions", {
  // ... other fields
  use_css_measurement: useCCS,
  ab_test_group: useCCS ? 'css' : 'control',
});
```

---

## Success Metrics & KPIs

### Track These Metrics Post-Launch:

```typescript
// Week 1-2: Technical Metrics
- CSS calculation success rate (target: >99%)
- Average calculation time (target: <100ms)
- Data completeness rate (target: >95% have all required fields)
- Error rate (target: <1%)

// Week 3-4: User Metrics  
- User satisfaction score (CSS Dimension 4) - compare to baseline
- Action completion rates (track 1 week, 1 month post-session)
- Return session booking rate
- User complaints/issues

// Month 2: Business Metrics
- Average CSS score across all sessions (target: >70)
- Distribution of success levels (target: 60%+ in GOOD/EXCELLENT)
- Correlation: CSS score vs. action completion
- Correlation: CSS score vs. return booking rate
```

---

## Rollback Plan

If CSS causes issues:

```typescript
// Emergency rollback procedure

1. Feature flag disable
   - Set rolloutPercent = 0 in shouldUseCSSForSession
   - All new sessions use old system

2. Keep CSS data
   - Don't delete CSS tables
   - Continue collecting data for analysis
   - Just don't show CSS in UI

3. Fix issues
   - Debug problems
   - Deploy fixes
   - Test thoroughly

4. Re-enable gradually
   - rolloutPercent = 10 → 25 → 50 → 100
```

---

## Appendix A: Full Code Checklist

### Files to Create:
```
✅ convex/utils/cssCalculator.ts (CSS calculation logic)
✅ convex/sessions/completeSessionWithCSS.ts (mutation)
✅ tests/cssCalculator.test.ts (unit tests)
✅ tests/cssIntegration.test.ts (integration tests)
✅ migrations/001_add_css_tables.ts (database migration)
```

### Files to Modify:
```
✅ convex/schema.ts (add 3 new tables, update 2 existing)
✅ convex/prompts/compass.ts (add measurement questions)
✅ convex/coach/compass.ts (update completion logic)
✅ convex/frameworks/compass.ts (add success_measurement config)
✅ convex/reports/compass.ts (add CSS sections)
```

### Estimated Development Time:
```
Database Schema: 4 hours
CSS Calculator: 8 hours
Prompt Updates: 6 hours
Coach Logic: 6 hours
Report Generation: 6 hours
Testing: 8 hours
Migration: 4 hours
Documentation: 4 hours
-------------------
Total: 46 hours (~1-2 weeks for 1 developer)
```

---

## Appendix B: Quick Reference

### CSS Measurement Cheat Sheet

| Stage | Measurement | When | Extract As |
|-------|------------|------|------------|
| OWNERSHIP Start | Initial Confidence | First question | `initial_confidence` (1-10) |
| OWNERSHIP Start | Initial Action Clarity | If confidence ≥8 | `initial_action_clarity` (1-10) |
| OWNERSHIP Start | Initial Mindset | Always | `initial_mindset_state` (string) |
| MAPPING Complete | Action Details | Throughout | `committed_action`, `action_day`, `action_time`, `obstacle`, `backup_plan`, `support_person` |
| PRACTICE End | Final Confidence | After key takeaway | `final_confidence` (1-10) |
| PRACTICE End | Final Action Clarity | Always | `final_action_clarity` (1-10) |
| PRACTICE End | Final Mindset | Always | `final_mindset_state` (string) |
| PRACTICE End | User Satisfaction | Always | `user_satisfaction` (1-10) |
| PRACTICE End | Satisfaction Reason | Always | `session_helpfulness_reason` (string) |

### Success Level Thresholds

| CSS Score | Level | Description | Color |
|-----------|-------|-------------|-------|
| 85-100 | EXCELLENT | Major breakthrough | 🌟 |
| 70-84 | GOOD | Clear progress | ✅ |
| 50-69 | FAIR | Some progress | 🔵 |
| 30-49 | MARGINAL | Minimal progress | 🟡 |
| 0-29 | INSUFFICIENT | Needs follow-up | 🔴 |

---

**END OF IMPLEMENTATION GUIDE**

**Questions? Contact Implementation Team**
**Last Updated:** October 26, 2025
