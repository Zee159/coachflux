# Coach.ts Integration Guide - NEW COMPASS

## Status: Imports Added, Integration Pending

### ✅ Completed in coach.ts

1. **Imports Added (Lines 10-13):**
```typescript
import { performSafetyCheck, getSessionDisclaimer, type SafetyCheck } from "./safety";
import { detectApplicableNudges, generateNudgePrompt, type NudgeType } from "./nudges";
import { compassFramework } from "./frameworks/compass";
```

2. **Feature Flag Added (Line 26):**
```typescript
const USE_NEW_COMPASS = true; // Toggle between 4-stage and legacy 6-stage
```

3. **Required Fields Updated (Lines 73-88):**
```typescript
const NEW_COMPASS_REQUIRED_FIELDS: Record<string, string[]> = {
  clarity: ["change_description"],
  ownership: ["initial_confidence", "current_confidence", "personal_benefit"],
  mapping: ["committed_action", "action_day", "action_time"],
  practice: ["action_commitment_confidence", "final_confidence", "key_takeaway"]
};
```

---

## 🔧 Integration Points Needed

### 1. Safety Checking in Message Processing

**Location:** In the main coach action (likely around line 1000-1200 where user messages are processed)

**Add This Code:**
```typescript
// SAFETY CHECK: Monitor every user message for crisis indicators
const safetyCheck: SafetyCheck = performSafetyCheck(
  userMessage,
  userCountryCode // Optional: pass if available from user profile
);

// If safety issue detected, log and potentially intervene
if (safetyCheck.flagged) {
  console.log(`Safety flag: ${safetyCheck.level}`);
  
  // Store safety flag in session metadata
  await ctx.runMutation(api.mutations.logSafetyFlag, {
    sessionId: session._id,
    level: safetyCheck.level,
    timestamp: Date.now()
  });
}

// If crisis/severe level, stop session immediately
if (safetyCheck.shouldStop) {
  // Return safety response to user
  return {
    response: safetyCheck.response,
    sessionEnded: true,
    reason: 'safety'
  };
}

// If lower-level safety concern (anxiety/agitation), include response
if (safetyCheck.response) {
  // Prepend safety guidance to coach response
  coachResponse = safetyCheck.response + "\n\n" + coachResponse;
}
```

---

### 2. Nudge Detection and Integration

**Location:** After user message is received, before sending to AI

**Add This Code:**
```typescript
// NUDGE DETECTION: Identify applicable coaching nudges
const currentStage = getCurrentStageFromSession(session); // e.g., 'clarity', 'ownership'

if (USE_NEW_COMPASS && currentStage) {
  const applicableNudges: NudgeType[] = detectApplicableNudges(
    userMessage,
    currentStage as 'clarity' | 'ownership' | 'mapping' | 'practice'
  );
  
  if (applicableNudges.length > 0) {
    // Generate nudge guidance for AI
    const nudgePrompt = generateNudgePrompt(
      currentStage as 'clarity' | 'ownership' | 'mapping' | 'practice',
      applicableNudges
    );
    
    // Append to system prompt
    systemPrompt += "\n\n" + nudgePrompt;
    
    // Log nudge suggestions
    console.log(`Suggested nudges for ${currentStage}:`, applicableNudges);
  }
}
```

---

### 3. Framework Selection Logic

**Location:** Where framework is loaded (likely around line 200-300)

**Update This Code:**
```typescript
// OLD CODE:
const framework = getFrameworkLegacy(frameworkId);

// NEW CODE:
let framework;
if (USE_NEW_COMPASS && frameworkId === 'COMPASS') {
  framework = compassFramework; // New 4-stage model
} else {
  framework = getFrameworkLegacy(frameworkId); // Legacy or other frameworks
}

// Update required fields lookup
const requiredFields = USE_NEW_COMPASS && frameworkId === 'COMPASS'
  ? { ...STEP_REQUIRED_FIELDS, ...NEW_COMPASS_REQUIRED_FIELDS }
  : { ...STEP_REQUIRED_FIELDS, ...LEGACY_COMPASS_REQUIRED_FIELDS };
```

---

### 4. Session Start: Display Disclaimer

**Location:** When new session is created

**Add This Code:**
```typescript
// At session start, return disclaimer for user acknowledgment
if (isNewSession) {
  const disclaimer = getSessionDisclaimer(userCountryCode);
  
  return {
    sessionId: newSession._id,
    disclaimer: disclaimer,
    requiresAcknowledgment: true,
    message: "Please review the disclaimer and type 'CONTINUE' to begin coaching, or 'CRISIS' for immediate support resources."
  };
}

// Handle user response to disclaimer
if (userMessage.toUpperCase().trim() === 'CRISIS') {
  const safetyCheck = performSafetyCheck('crisis', userCountryCode);
  return {
    response: safetyCheck.response,
    sessionEnded: true,
    reason: 'user_requested_crisis_support'
  };
}

if (userMessage.toUpperCase().trim() === 'CONTINUE') {
  // Mark disclaimer as acknowledged, start session
  await ctx.runMutation(api.mutations.acknowledgeDisclaimer, {
    sessionId: session._id
  });
  
  return {
    response: "Great! Let's start your COMPASS session. What specific change are you dealing with right now?"
  };
}
```

---

### 5. Confidence Tracking Throughout Session

**Location:** In the reflection storage logic

**Add This Code:**
```typescript
// Track confidence at key points
if (USE_NEW_COMPASS && frameworkId === 'COMPASS') {
  const confidenceTracking = {
    initial_confidence: 0,
    post_ownership_confidence: 0,
    final_confidence: 0,
    confidence_change: 0,
    confidence_percent_increase: 0
  };
  
  // After OWNERSHIP stage
  if (currentStage === 'ownership' && reflection.initial_confidence) {
    confidenceTracking.initial_confidence = reflection.initial_confidence;
    confidenceTracking.post_ownership_confidence = reflection.current_confidence || 0;
  }
  
  // After PRACTICE stage
  if (currentStage === 'practice' && reflection.final_confidence) {
    confidenceTracking.final_confidence = reflection.final_confidence;
    confidenceTracking.confidence_change = 
      confidenceTracking.final_confidence - confidenceTracking.initial_confidence;
    
    if (confidenceTracking.initial_confidence > 0) {
      confidenceTracking.confidence_percent_increase = Math.round(
        (confidenceTracking.confidence_change / confidenceTracking.initial_confidence) * 100
      );
    }
  }
  
  // Store in session metadata
  await ctx.runMutation(api.mutations.updateConfidenceTracking, {
    sessionId: session._id,
    confidenceTracking
  });
}
```

---

### 6. Stage Progression Logic

**Location:** Where stage transitions happen

**Update This Code:**
```typescript
// NEW COMPASS has only 4 stages
const NEW_COMPASS_STAGES = ['clarity', 'ownership', 'mapping', 'practice'];
const LEGACY_COMPASS_STAGES = ['clarity', 'ownership', 'mapping', 'practice', 'anchoring', 'sustaining'];

function getNextStage(currentStage: string, frameworkId: string): string | null {
  if (USE_NEW_COMPASS && frameworkId === 'COMPASS') {
    const currentIndex = NEW_COMPASS_STAGES.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === NEW_COMPASS_STAGES.length - 1) {
      return null; // Session complete
    }
    return NEW_COMPASS_STAGES[currentIndex + 1];
  } else {
    // Legacy logic
    const currentIndex = LEGACY_COMPASS_STAGES.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === LEGACY_COMPASS_STAGES.length - 1) {
      return null;
    }
    return LEGACY_COMPASS_STAGES[currentIndex + 1];
  }
}
```

---

### 7. Report Generation

**Location:** When session completes

**Add This Code:**
```typescript
// At session completion, generate appropriate report
if (USE_NEW_COMPASS && frameworkId === 'COMPASS') {
  // Use new 11-section report generator (to be implemented)
  // const report = generateCompassReport(sessionData);
  
  // For now, include key metrics in existing report
  const sessionSummary = {
    framework: 'COMPASS (New 4-Stage)',
    confidence_change: confidenceTracking.confidence_change,
    confidence_percent: confidenceTracking.confidence_percent_increase,
    initial: confidenceTracking.initial_confidence,
    final: confidenceTracking.final_confidence,
    committed_action: mappingReflection?.committed_action,
    action_day: mappingReflection?.action_day,
    action_time: mappingReflection?.action_time,
    key_takeaway: practiceReflection?.key_takeaway
  };
  
  return {
    sessionComplete: true,
    summary: sessionSummary,
    nextSteps: 'Review your action plan and complete your committed action.'
  };
}
```

---

## 🧪 Testing Strategy

### Phase 1: Safety System Testing

1. **Test Anxiety Level:**
```typescript
// User message: "I'm so anxious about this change"
// Expected: Breathing exercises offered, session continues
```

2. **Test Crisis Level:**
```typescript
// User message: "I don't want to live anymore"
// Expected: Crisis resources shown, session STOPS immediately
```

3. **Test Redundancy Concerns:**
```typescript
// User message: "I think I'm going to lose my job"
// Expected: Reality check question, HR/EAP referral
```

### Phase 2: Nudge System Testing

1. **Test Control Clarification:**
```typescript
// User: "I can't control anything about this"
// Expected: AI uses control_clarification nudge
// Response should include: "You CAN control your response/learning..."
```

2. **Test Past Success Mining:**
```typescript
// User: "I'm not confident I can learn this"
// Expected: AI uses past_success_mining nudge
// Response should ask: "Tell me about a time you learned something similar..."
```

3. **Test Reduce Scope:**
```typescript
// User: "I need to learn the entire system by next week"
// Expected: AI uses reduce_scope nudge
// Response should ask: "What's the 10-minute version you could try first?"
```

### Phase 3: Confidence Tracking Testing

1. **Test Initial Measurement:**
```typescript
// In Ownership stage, AI asks: "On 1-10, how confident are you?"
// User: "Maybe a 3"
// Expected: initial_confidence = 3 stored
```

2. **Test Confidence Increase:**
```typescript
// After ownership work
// AI: "Where's your confidence now?"
// User: "I'd say a 7"
// Expected: current_confidence = 7, change = +4
```

3. **Test Final Confidence:**
```typescript
// In Practice stage
// AI: "Your confidence was 3/10, where is it now?"
// User: "8/10"
// Expected: final_confidence = 8, change = +5, percent = 167%
```

### Phase 4: Full Session Flow Testing

**Expected 20-Minute Session:**

```
STAGE 1: CLARITY (5 min)
User: "My company is moving to a new CRM system"
AI: "What parts can you control?"
User: "I can control how I learn it"
[SAFETY CHECK: Pass]
[NUDGES: control_clarification if needed]
OUTPUT: change_description ✓, sphere_of_control ✓

STAGE 2: OWNERSHIP (8 min)
AI: "On 1-10, how confident are you about navigating this?"
User: "3/10 - I'm not tech-savvy"
[RECORD: initial_confidence = 3]
[NUDGES: evidence_confrontation triggers]
AI: "Tell me about other tech you've learned?"
User: "Well, I did master Teams last year..."
AI: "Where's your confidence now?"
User: "Maybe 6/10"
[RECORD: current_confidence = 6, +3 increase ✓]
OUTPUT: initial_confidence ✓, current_confidence ✓, personal_benefit ✓

STAGE 3: MAPPING (4 min)
AI: "What's ONE small action you could take this week?"
User: "I could try the CRM training module"
[NUDGES: concretize_action triggers]
AI: "Which day? What time?"
User: "Thursday 2-4pm"
OUTPUT: committed_action ✓, action_day ✓, action_time ✓

STAGE 4: PRACTICE (3 min)
AI: "On 1-10, how confident are you that you'll do this?"
User: "8/10"
AI: "Your confidence went from 3/10 to 6/10. What shifted?"
User: "I remembered I've learned systems before. I can do this again."
[RECORD: final_confidence = 6, key_takeaway ✓]
OUTPUT: action_commitment_confidence ✓, final_confidence ✓, key_takeaway ✓

SESSION COMPLETE ✓
Confidence: 3/10 → 6/10 (+3, 100% increase)
Action: CRM training Thursday 2-4pm
Commitment: 8/10
```

---

## 📊 Success Metrics to Monitor

### Primary KPI: Confidence Transformation
```typescript
// After each Ownership stage completion
const confidenceIncrease = currentConfidence - initialConfidence;
const percentIncrease = Math.round((confidenceIncrease / initialConfidence) * 100);

// Log to analytics
console.log(`Confidence: ${initialConfidence} → ${currentConfidence} (+${confidenceIncrease}, ${percentIncrease}%)`);

// Target: 70%+ of sessions achieve +4 or more
if (confidenceIncrease >= 4) {
  console.log('✅ TARGET MET: +4 confidence increase');
}
```

### Safety Metrics
```typescript
// Track safety triggers
const safetyMetrics = {
  total_sessions: 0,
  anxiety_flagged: 0,
  agitation_flagged: 0,
  redundancy_flagged: 0,
  severe_flagged: 0,
  crisis_flagged: 0,
  sessions_stopped: 0
};

// Target: <5% of sessions trigger safety concerns
const safetyTriggerRate = (safet yMetrics.crisis_flagged + safetyMetrics.severe_flagged) / safetyMetrics.total_sessions;
console.log(`Safety trigger rate: ${(safetyTriggerRate * 100).toFixed(2)}%`);
```

### Nudge Effectiveness
```typescript
// Track which nudges correlate with confidence gains
const nudgeImpact = {
  past_success_mining: { uses: 0, avg_confidence_gain: 0 },
  evidence_confrontation: { uses: 0, avg_confidence_gain: 0 },
  control_clarification: { uses: 0, avg_confidence_gain: 0 }
  // ... all 18 nudges
};

// After session, correlate nudges used with confidence increase
// Log to determine most effective interventions
```

---

## 🚨 Error Handling

### Safety System Errors
```typescript
try {
  const safetyCheck = performSafetyCheck(userMessage, countryCode);
  // ... handle safety check
} catch (error) {
  console.error('Safety check failed:', error);
  // Fail safe: assume no safety issues but log error
  // Continue session but alert monitoring
}
```

### Nudge System Errors
```typescript
try {
  const nudges = detectApplicableNudges(message, stage);
  const prompt = generateNudgePrompt(stage, nudges);
  // ... use prompt
} catch (error) {
  console.error('Nudge detection failed:', error);
  // Fail gracefully: continue without nudge guidance
}
```

### Confidence Tracking Errors
```typescript
try {
  const initialConf = parseInt(userMessage);
  if (isNaN(initialConf) || initialConf < 1 || initialConf > 10) {
    return "Please provide a number between 1 and 10 for your confidence level.";
  }
  confidenceTracking.initial_confidence = initialConf;
} catch (error) {
  console.error('Confidence parsing failed:', error);
  // Ask user to clarify
}
```

---

## 🔄 Rollback Plan

If issues arise, set feature flags:

```typescript
// In coach.ts line 26:
const USE_NEW_COMPASS = false; // Revert to legacy 6-stage model

// Sessions will use:
// - Legacy COMPASS framework (6 stages)
// - No safety monitoring (except existing validation)
// - No nudge system
// - Original report format
```

This allows instant rollback without code changes - just toggle the flag.

---

## 📝 Integration Checklist

- [x] Add imports to coach.ts
- [x] Add USE_NEW_COMPASS feature flag
- [x] Update required fields for new 4-stage model
- [ ] Add safety checking in message processing
- [ ] Add nudge detection and integration
- [ ] Update framework selection logic
- [ ] Add session disclaimer display
- [ ] Implement confidence tracking
- [ ] Update stage progression for 4 stages
- [ ] Test safety system with crisis scenarios
- [ ] Test nudge triggering and application
- [ ] Test confidence tracking accuracy
- [ ] Test complete 20-minute session flow
- [ ] Monitor metrics (confidence increase, safety triggers, nudge effectiveness)
- [ ] Update frontend to display new session flow
- [ ] Deploy with feature flag OFF initially
- [ ] Gradually enable for testing cohort
- [ ] Monitor production metrics
- [ ] Full rollout when metrics validate success

---

## 🎯 Next Immediate Steps

1. **Add Safety Check** - Highest priority for user safety
2. **Add Nudge Detection** - Improves coaching quality
3. **Test with Mock Sessions** - Validate logic before production
4. **Frontend Updates** - Display confidence meter, safety alerts
5. **Monitoring Dashboard** - Track key metrics in real-time

---

**Integration Status:** 30% Complete
**Estimated Time to Full Integration:** 4-6 hours
**Risk Level:** Medium (feature flag allows safe rollback)
**Testing Required:** High (safety-critical features)

