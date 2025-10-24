# Introduction Phase - "No" Response Handling

## Overview
When users say "No" to the framework consent question at the introduction phase, the AI now intelligently diagnoses their situation and suggests the appropriate framework.

---

## 🎯 Problem Solved

**Before:** When users said "No" at introduction, the AI would:
- Get stuck in a loop asking questions
- Never advance (`user_consent_given` stayed `false`)
- Not suggest alternative frameworks
- Provide poor UX

**After:** The AI now:
- Actively listens and diagnoses the user's situation
- Detects workplace change scenarios → Suggests COMPASS
- Detects personal goals/decisions → Suggests GROW (or continues GROW)
- Provides clear guidance on how to switch frameworks
- Stops after 2-3 exchanges with actionable recommendation

---

## 🔄 User Flow Examples

### Example 1: User Says "No" in GROW, but Has Workplace Change Need

```
Coach (GROW Intro): "Does this framework feel right for what you want to work on today?"
User: "No"

Coach: "No problem! What brought you here today? Maybe I can suggest a different approach."
User: "We're going through a CRM change and I feel stuck"

Coach: "Thank you for sharing. It sounds like you're dealing with a workplace change situation - a CRM transition. The COMPASS framework is specifically designed for navigating workplace change and might be a better fit for you. COMPASS helps you move from feeling uncertain about a change to feeling confident and in control. Would you like to switch to COMPASS instead? (If yes, I'll close this session and you can start a fresh COMPASS session from the dashboard.)"
```

**Result:** User understands they need COMPASS and can start the right framework.

---

### Example 2: User Says "No" in COMPASS, but Has Personal Goal

```
Coach (COMPASS Intro): "Does this framework feel right for what you're facing today?"
User: "No, this is more about a personal goal"

Coach: "Thanks for clarifying! Based on what you've shared, the GROW method would be a better fit for you. GROW is specifically designed for goal-setting, decision-making, and action planning - which sounds like exactly what you need. Would you like to switch to GROW instead? (If yes, I'll guide you to close this session and start a fresh GROW session from the dashboard.)"
```

**Result:** User understands they need GROW and can start the right framework.

---

### Example 3: User Says "No" in GROW, Has Personal Goal, Reconsidered

```
Coach (GROW Intro): "Does this framework feel right for what you want to work on today?"
User: "Not sure"

Coach: "I'd love to help! Could you tell me a bit more about what brought you here today?"
User: "I want to launch my side business but don't know where to start"

Coach: "Thank you for sharing. Based on what you've told me, GROW might actually work well for launching your side business. GROW is designed for setting and achieving specific goals, which is exactly what you need. Would you like to give it a try?"
User: "Okay, sure"

Coach: "Great! Let's begin. What goal or challenge would you like to work on today?"
```

**Result:** User consent is obtained (`user_consent_given = true`), session advances to Goal phase.

---

## 🧠 AI Detection Logic

### GROW Framework Introduction

**When User Says "No":**

1. **Ask clarifying questions** to understand their situation
2. **Listen for workplace change keywords:**
   - "change", "transition", "new system", "reorganization", "restructuring"
   - "adapting to", "company is", "team is moving to", "switching to"
   - "CRM change", "process change", "role change", "leadership change"

3. **If workplace change detected:**
   - Suggest COMPASS framework
   - Explain COMPASS is designed for workplace change
   - Tell them to close session and start fresh COMPASS session
   - Keep `user_consent_given = false` (do not advance)

4. **If personal goal/decision detected:**
   - Re-pitch GROW (explain it fits their need)
   - Ask if they'd like to proceed with GROW
   - If yes → Set `user_consent_given = true`, advance to Goal
   - If no → Gracefully end ("Feel free to close and come back when ready")

5. **Maximum 2-3 exchanges** before providing clear guidance

---

### COMPASS Framework Introduction

**When User Says "No":**

1. **Ask clarifying questions** to understand their situation
2. **Listen for personal goal keywords (not change):**
   - "want to achieve", "goal", "decision", "planning", "improve", "learn"
   - "career direction", "should I", "need to decide", "project", "skills"

3. **If personal goal/decision detected (NOT change):**
   - Suggest GROW framework
   - Explain GROW is designed for goal-setting and decision-making
   - Tell them to close session and start fresh GROW session
   - Keep `user_consent_given = false` (do not advance)

4. **If workplace change detected (they said No but situation IS change):**
   - Re-pitch COMPASS (explain it fits their need)
   - Clarify their situation is indeed a workplace change
   - Ask if they'd like to proceed with COMPASS
   - If yes → Set `user_consent_given = true`, advance to Clarity
   - If no → Gracefully end

5. **If personal/life change (not workplace):**
   - Acknowledge COMPASS is for workplace change
   - Offer choice: continue with COMPASS or try GROW
   - User decides

6. **Maximum 2-3 exchanges** before providing clear guidance

---

## 🛠️ Technical Implementation

### Files Modified

1. **`convex/prompts/grow.ts`** (lines 103-132)
   - Enhanced "NO" response handling
   - Added workplace change detection logic
   - Added COMPASS suggestion flow
   - Added maximum exchange limit

2. **`convex/prompts/compass.ts`** (lines 119-143)
   - Enhanced "NO" response handling
   - Added personal goal detection logic
   - Added GROW suggestion flow
   - Added maximum exchange limit

3. **`convex/coach/grow.ts`**
   - Introduction completion logic (checks `user_consent_given = true`)
   - No changes needed - already correct

4. **`convex/coach/compass.ts`**
   - Introduction completion logic (similar to GROW)
   - No changes needed - already correct

---

## ✅ Critical Rules

### For Both Frameworks:

1. **DO NOT** keep asking the same consent question over and over
2. **DO NOT** start coaching without explicit consent (`user_consent_given = true`)
3. **DO** actively listen and diagnose their situation
4. **DO** suggest the appropriate framework based on their needs
5. **DO** explain they need to start a new session (can't switch mid-session)
6. **Maximum 2-3 exchanges** to diagnose → then provide clear guidance
7. **Keep `user_consent_given = false`** when suggesting alternative framework

---

## 🧪 Testing Scenarios

### Test 1: GROW → User has workplace change
- [ ] User says "No" at GROW intro
- [ ] User mentions "CRM change" or similar workplace change
- [ ] AI suggests COMPASS
- [ ] AI explains how to switch frameworks
- [ ] Session does NOT advance to Goal phase

### Test 2: COMPASS → User has personal goal
- [ ] User says "No" at COMPASS intro
- [ ] User mentions "want to achieve goal" or personal objective
- [ ] AI suggests GROW
- [ ] AI explains how to switch frameworks
- [ ] Session does NOT advance to Clarity phase

### Test 3: GROW → User reconsidered (personal goal)
- [ ] User says "Not sure" at GROW intro
- [ ] User describes personal goal
- [ ] AI re-pitches GROW
- [ ] User says "Yes"
- [ ] `user_consent_given = true`
- [ ] Session advances to Goal phase

### Test 4: Maximum exchange limit
- [ ] User says "No" 3 times without clear direction
- [ ] AI provides final recommendation after 2-3 exchanges
- [ ] AI doesn't continue indefinitely

---

## 📊 Expected Outcomes

1. **Better Framework Matching:** Users end up in the right framework for their needs
2. **No Infinite Loops:** Clear exit path when user says "No"
3. **Improved UX:** Users understand why a framework is/isn't right for them
4. **Clear Guidance:** Users know exactly what to do next (close session, start new one)
5. **Reduced Frustration:** No more getting stuck at introduction phase

---

## 🚀 Deployment Checklist

- [x] Update GROW introduction prompt with enhanced "No" handling
- [x] Update COMPASS introduction prompt with enhanced "No" handling
- [x] Test GROW → COMPASS suggestion flow
- [x] Test COMPASS → GROW suggestion flow
- [x] Test reconsidering within same framework
- [ ] Deploy to dev environment
- [ ] Test with real users
- [ ] Monitor for edge cases
- [ ] Document any new patterns discovered

---

## 📝 Notes

- **We cannot switch frameworks mid-session** - Technical limitation. User must close session and start a new one.
- **The AI uses prompt engineering** to detect situations - No code changes needed in coach logic.
- **`user_consent_given` boolean** is the gate - Session only advances when `true`.
- **Maximum 2-3 exchanges** prevents infinite loops and poor UX.

---

## 🔗 Related Documentation

- `docs/FRAMEWORK_INTRODUCTION_PHASE.md` - Overall introduction phase implementation
- `docs/02-frameworks/GROW_FRAMEWORK.md` - GROW framework details
- `docs/02-frameworks/COMPASS_FRAMEWORK.md` - COMPASS framework details
- `convex/prompts/grow.ts` - GROW prompt guidance (lines 46-170)
- `convex/prompts/compass.ts` - COMPASS prompt guidance (lines 56-190)

