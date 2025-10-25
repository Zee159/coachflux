# GROW Framework - Code Changes Comparison

**Quick Reference: Before vs After**

---

## 📍 File Locations Summary

| Issue | File | Lines | Priority |
|-------|------|-------|----------|
| OPTIONS 4-state flow | `convex/prompts/grow.ts` | 486-750 | 🔥 CRITICAL |
| WILL 9 required fields | `convex/coach/grow.ts` | 180-225 | 🔥 CRITICAL |
| WILL prompt guidance | `convex/prompts/grow.ts` | 296-483 | 🔴 HIGH |
| Feasibility validation | `convex/coach/grow.ts` | 111-160 | 🟡 MEDIUM |
| Type definitions | `convex/types.ts` | 40-41 | 🟡 MEDIUM |

---

## 🔍 CHANGE #1: OPTIONS Step Simplification

### **Location:** `convex/prompts/grow.ts` Lines 486-750

### **Problem Areas in Current Code:**

**Line ~486-500: 4-State Flow Definition**
```typescript
// CURRENT (PROBLEMATIC):
⚠️ STATE 1: COLLECT LABEL
⚠️ STATE 2: COLLECT PROS
⚠️ STATE 3: COLLECT CONS
⚠️ STATE 4: OFFER FORK

// 🚨 ISSUE: Too many states for AI to track reliably
```

**Line ~550-600: State Detection Logic**
```typescript
// CURRENT (PROBLEMATIC):
🚨 STATE DETECTION - DETERMINE YOUR CURRENT STATE:
Look at the CAPTURED DATA to determine which state you're in:

STATE 1 (Collect Label): No options yet, OR last option has both pros AND cons
STATE 2 (Collect Pros): Last option has label but pros = [] (empty)
STATE 3 (Collect Cons): Last option has label + pros but cons = [] (empty)
STATE 4 (Offer Fork): Last option has label + pros + cons (all filled)

// 🚨 ISSUE: AI must infer state from conversation history
// → Unreliable after 5+ turns
// → Causes loops and confusion
```

**Line ~650-690: Auto-Generation Rules**
```typescript
// CURRENT (PROBLEMATIC):
🚨 CRITICAL RULE #3: NEVER auto-generate pros/cons that user didn't explicitly provide!
- ❌ NEVER invent cons like "Might require finding right person"

// 🚨 ISSUE: "NEVER" rules are ignored by LLM during generation
// → AI still invents data
// → No structural enforcement
```

### **REPLACE ENTIRE SECTION (Lines 486-750) WITH:**

```typescript
options: `OPTIONS PHASE - Simplified 2-State Flow

🚨 ASK ONLY ONE QUESTION AT A TIME

═══════════════════════════════════════════
STATE A: COLLECT OPTION + EVALUATION
═══════════════════════════════════════════
1. Ask: "What's one option you're considering?"
2. User provides option
3. Immediately ask: "What are the pros and cons?"
4. User provides both together
5. Extract: {label, pros[], cons[]}

═══════════════════════════════════════════
STATE B: OFFER CHOICE
═══════════════════════════════════════════
Ask: "Would you like to share ANOTHER option, or would you like me to SUGGEST some?"

If "another" → Return to STATE A
If "suggest" → Generate 2-3 AI options
If "ready" → Set user_ready_to_proceed = true

EXTRACTION RULE:
- Only extract what user explicitly states
- If only pros given → cons = [], ask for cons
- If only cons given → pros = [], ask for pros
- Never invent information

AI SUGGESTIONS (when requested):
- Generate 2-3 complete options
- Each must have: label, pros[], cons[], feasibilityScore (1-10), effortRequired (low/med/high)
- Ground in their Goal + Reality context

Example:
{
  "label": "Find mentor in Perth",
  "pros": ["Free", "Local network"],
  "cons": ["Takes 2-3 weeks"],
  "feasibilityScore": 9,
  "effortRequired": "medium",
  "alignmentReason": "Leverages Perth location"
}

COMPLETION CRITERIA:
- 2+ options
- 1+ explored (pros + cons filled)
- user_ready_to_proceed = true

coach_reflection: Conversational language only - NO JSON!`
```

**Key Changes:**
- ✅ Reduced from 4 states → 2 states
- ✅ Pros/cons collected together (no confusion)
- ✅ Simpler state logic (no inference needed)
- ✅ Clear choice phrasing ("another" vs "suggest")
- ✅ Explicit readiness check (user_ready_to_proceed)

**Lines Affected:** ~265 lines  
**Complexity:** Medium  
**Time:** 2 hours

---

## 🔍 CHANGE #2: WILL Step Field Reduction

### **Location:** `convex/coach/grow.ts` Lines 180-225

### **Problem Areas in Current Code:**

**Line ~191-196: 9-Field Validation**
```typescript
// CURRENT (PROBLEMATIC):
const hasTitle = typeof action.title === "string" && action.title.length > 0;
const hasOwner = typeof action.owner === "string" && action.owner.length > 0;
const hasDueDate = typeof action.due_days === "number" && action.due_days > 0;
const hasSupport = typeof action.support_needed === "string" && action.support_needed.length > 0;
const hasAccountability = typeof action.accountability_mechanism === "string" && action.accountability_mechanism.length > 0;
// ⚠️ + 4 more optional fields that should be checked

// 🚨 ISSUE: Checking 9 fields causes user fatigue
// → 35% drop-off rate
// → Feels like interrogation
```

### **REPLACE checkWillCompletion Function WITH:**

```typescript
/**
 * Will step completion logic
 * SIMPLIFIED: Only 5 core required fields
 */
private checkWillCompletion(
  payload: ReflectionPayload,
  skipCount: number,
  loopDetected: boolean
): StepCompletionResult {
  const chosenOptions = payload["chosen_options"];
  const actions = payload["actions"];

  if (!Array.isArray(chosenOptions) || chosenOptions.length === 0) {
    return { shouldAdvance: false };
  }

  if (!Array.isArray(actions) || actions.length === 0) {
    return { shouldAdvance: false };
  }

  // ✅ NEW: Check only 5 CORE fields
  const completeActions = actions.filter((a: unknown) => {
    const action = a as { 
      title?: string; 
      owner?: string; 
      due_days?: number;
      support_needed?: string;
      accountability_mechanism?: string;
    };
    
    return (
      typeof action.title === "string" && action.title.length > 0 &&
      typeof action.owner === "string" && action.owner.length > 0 &&
      typeof action.due_days === "number" && action.due_days > 0 &&
      typeof action.support_needed === "string" && action.support_needed.length > 0 &&
      typeof action.accountability_mechanism === "string" && action.accountability_mechanism.length > 0
    );
  });

  // Progressive relaxation (unchanged logic)
  if (loopDetected) {
    const basicActions = actions.filter((a: unknown) => {
      const action = a as { title?: string; owner?: string; due_days?: number };
      return (
        typeof action.title === "string" && action.title.length > 0 &&
        typeof action.owner === "string" && action.owner.length > 0 &&
        typeof action.due_days === "number" && action.due_days > 0
      );
    });
    return { shouldAdvance: basicActions.length >= 1 };
  } else if (skipCount >= 2) {
    const basicActions = actions.filter((a: unknown) => {
      const action = a as { title?: string; owner?: string; due_days?: number };
      return (
        typeof action.title === "string" && action.title.length > 0 &&
        typeof action.owner === "string" && action.owner.length > 0 &&
        typeof action.due_days === "number" && action.due_days > 0
      );
    });
    return { shouldAdvance: basicActions.length >= 1 };
  } else if (skipCount === 1) {
    const basicActions = actions.filter((a: unknown) => {
      const action = a as { title?: string; owner?: string; due_days?: number };
      return (
        typeof action.title === "string" && action.title.length > 0 &&
        typeof action.owner === "string" && action.owner.length > 0 &&
        typeof action.due_days === "number" && action.due_days > 0
      );
    });
    return { shouldAdvance: basicActions.length >= chosenOptions.length };
  } else {
    // DEFAULT: Need 5 core fields per action
    return { 
      shouldAdvance: completeActions.length >= chosenOptions.length
    };
  }
}
```

**Key Changes:**
- ✅ Reduced from 9 fields → 5 core fields
- ✅ Optional fields (firstStep, specificOutcome, reviewDate, potentialBarriers) removed from validation
- ✅ Progressive relaxation still works
- ✅ Cleaner code, easier to maintain

**Lines Affected:** ~45 lines  
**Complexity:** Low  
**Time:** 30 minutes

---

### **Location:** `convex/prompts/grow.ts` Lines 296-483

### **Problem Areas in Current Code:**

**Line ~370-390: 9 Required Fields Listed**
```typescript
// CURRENT (PROBLEMATIC):
REQUIRED FIELDS (must have for every action):
- title: Clear action description
- owner: Who's responsible
- due_days: Timeline in days
- support_needed: What help or resources they need ✅
- accountability_mechanism: How they'll track progress ✅
- firstStep: The very first action ⚠️
- specificOutcome: What "done" looks like ⚠️
- reviewDate: Mid-point check-in ⚠️
- potentialBarriers: What might get in the way ⚠️

// 🚨 ISSUE: 9 required fields = 9 questions per action
// → For 3 actions = 27 questions total
// → Users abandon halfway through
```

### **REPLACE Action Requirements Section WITH:**

```typescript
Action Requirements (SIMPLIFIED TO 5 CORE FIELDS):

REQUIRED FIELDS (must ask for every action):
1. title: What specific action will you take?
2. owner: Who's responsible? (default to "me")
3. due_days: When will you complete this?
4. accountability_mechanism: How will you track progress?
5. support_needed: What help or resources do you need? (can be "None")

OPTIONAL FIELDS (only gather if user volunteers):
- firstStep: The very first 5-minute action (if they mention it)
- specificOutcome: What "done" looks like (if they describe it)
- reviewDate: Mid-point check-in date (if they want one)
- potentialBarriers: What might get in the way (if they express concerns)

⚠️ CRITICAL: Ask for optional fields ONLY IF user naturally brings them up.
DO NOT force optional fields - keep the flow conversational and lightweight.

Example Question Flow (5 questions per action):
1. "What specific action will you take for [option]?" → title
2. "When will you complete this?" → due_days
3. "Who's responsible for this?" → owner (usually "me")
4. "How will you track progress on this?" → accountability_mechanism
5. "What support or resources do you need?" → support_needed

If user volunteers additional info:
- "I'll start by..." → Extract firstStep
- "I'll know I'm done when..." → Extract specificOutcome
- "I'll check in after X days..." → Extract reviewDate
- "Might not work if..." → Extract potentialBarriers
```

**Key Changes:**
- ✅ Clear separation: 5 required vs 4 optional
- ✅ Explicit instruction: "DO NOT force optional fields"
- ✅ Example flow shows only 5 questions
- ✅ Guidance on when to extract optional fields

**Lines Affected:** ~50 lines  
**Complexity:** Low  
**Time:** 30 minutes

---

## 🔍 CHANGE #3: Feasibility Score Enforcement

### **Location:** `convex/types.ts` Lines 40-41

### **Current Code:**
```typescript
// CURRENT:
export interface GrowOption {
  label: string;
  pros: string[];
  cons: string[];
  feasibilityScore?: number;  // ❌ Optional → AI skips it
  effortRequired?: 'low' | 'medium' | 'high';  // ❌ Optional → AI skips it
  alignmentReason?: string;
}
```

### **ADD Validation Helper:**
```typescript
// ✅ IMPROVED:
export interface GrowOption {
  label: string;
  pros: string[];
  cons: string[];
  
  // Required for AI-generated options, undefined for user options
  feasibilityScore?: number;  // 1-10: How realistic given constraints
  effortRequired?: 'low' | 'medium' | 'high';  // Effort level
  alignmentReason?: string;  // Why this fits (recommended)
}

// ✅ NEW: Helper to check if option is AI-generated
export function isAIGeneratedOption(option: GrowOption): boolean {
  return option.feasibilityScore !== undefined || option.effortRequired !== undefined;
}
```

**Key Changes:**
- ✅ Keep fields optional (for user-provided options)
- ✅ Add validation helper function
- ✅ Better TypeScript typing

**Lines Affected:** ~10 lines  
**Complexity:** Low  
**Time:** 10 minutes

---

### **Location:** `convex/coach/grow.ts` Lines 111-160

### **Problem in Current Code:**

**Line ~140-145: No Validation of Quality Fields**
```typescript
// CURRENT (PROBLEMATIC):
const exploredOptions = options.filter((opt: unknown) => {
  const option = opt as { label?: string; pros?: unknown[]; cons?: unknown[] };
  return Array.isArray(option.pros) && option.pros.length > 0 &&
         Array.isArray(option.cons) && option.cons.length > 0;
});

// 🚨 ISSUE: Doesn't check feasibilityScore or effortRequired
// → AI can generate options without these fields
// → Users get incomplete information
```

### **REPLACE Validation Section WITH:**

```typescript
// ✅ NEW: Validate that options have required fields
const validOptions = options.filter((opt: unknown) => {
  const option = opt as { 
    label?: string; 
    pros?: unknown[]; 
    cons?: unknown[];
    feasibilityScore?: number;
    effortRequired?: string;
  };
  
  const hasBasicFields = (
    typeof option.label === "string" && option.label.length > 0 &&
    Array.isArray(option.pros) && option.pros.length > 0 &&
    Array.isArray(option.cons) && option.cons.length > 0
  );
  
  // If option has feasibilityScore/effortRequired, it's AI-generated → validate it
  const isAIGenerated = option.feasibilityScore !== undefined || option.effortRequired !== undefined;
  
  if (isAIGenerated) {
    // AI options MUST have both feasibilityScore AND effortRequired
    const hasValidFeasibility = (
      typeof option.feasibilityScore === "number" &&
      option.feasibilityScore >= 1 &&
      option.feasibilityScore <= 10
    );
    const hasValidEffort = (
      option.effortRequired === 'low' ||
      option.effortRequired === 'medium' ||
      option.effortRequired === 'high'
    );
    return hasBasicFields && hasValidFeasibility && hasValidEffort;
  }
  
  // User options don't need feasibilityScore/effortRequired
  return hasBasicFields;
});

// Count explored options (has both pros and cons)
const exploredOptions = validOptions.filter((opt: unknown) => {
  const option = opt as { pros?: unknown[]; cons?: unknown[] };
  return (
    Array.isArray(option.pros) && option.pros.length > 0 &&
    Array.isArray(option.cons) && option.cons.length > 0
  );
});

// ... rest of function, but use validOptions and exploredOptions
return { 
  shouldAdvance: validOptions.length >= 2 && 
                 exploredOptions.length >= 1 && 
                 userReady === true
};
```

**Key Changes:**
- ✅ Validates AI options have feasibilityScore (1-10)
- ✅ Validates AI options have effortRequired (low/med/high)
- ✅ Allows user options without these fields
- ✅ Clear distinction between AI and user options

**Lines Affected:** ~40 lines  
**Complexity:** Medium  
**Time:** 30 minutes

---

## 📊 Summary of All Changes

| File | Section | Lines Changed | Time Estimate |
|------|---------|---------------|---------------|
| `convex/prompts/grow.ts` | OPTIONS guidance | ~265 lines | 2 hours |
| `convex/prompts/grow.ts` | WILL guidance | ~50 lines | 30 minutes |
| `convex/coach/grow.ts` | checkWillCompletion | ~45 lines | 30 minutes |
| `convex/coach/grow.ts` | checkOptionsCompletion | ~40 lines | 30 minutes |
| `convex/types.ts` | GrowOption + helper | ~10 lines | 10 minutes |
| **TOTAL** | **3 files** | **~410 lines** | **4 hours** |

---

## ✅ Testing Checklist

After making changes:

### **Test 1: OPTIONS 2-State Flow**
```bash
# Start GROW session
# When you reach OPTIONS step:

Expected Flow:
AI: "What's one option you're considering?"
User: "Hire a developer"
AI: Extract {label: "Hire developer"}
AI: "What are the pros and cons of hiring a developer?"
User: "Fast but expensive"
AI: Extract {label: "...", pros: ["Fast"], cons: ["Expensive"]}
AI: "Would you like to share another option, or would you like me to suggest some?"

✅ PASS: Collected option in 2 questions (not 4)
✅ PASS: No loops asking separately for pros/cons
✅ PASS: Both extracted together
```

### **Test 2: WILL 5-Field Flow**
```bash
# Continue to WILL step

Expected Flow:
AI: "Which option will you choose?"
User: "Hire developer"
AI: Extract chosen_options: ["Hire developer"]

AI: "What specific action will you take?"
User: "Post job on LinkedIn"
AI: Extract title

AI: "When will you complete this?"
User: "By Friday"
AI: Extract due_days: 7

AI: "Who's responsible?"
User: "Me"
AI: Extract owner

AI: "How will you track progress?"
User: "Calendar reminder"
AI: Extract accountability_mechanism

AI: "What support do you need?"
User: "Budget approval"
AI: Extract support_needed

✅ PASS: Asked only 5 questions (not 9)
✅ PASS: Did NOT ask for firstStep, specificOutcome, reviewDate, potentialBarriers
✅ PASS: Validation succeeded with 5 fields
```

### **Test 3: Feasibility Validation**
```bash
# Test AI suggestions

User: "please suggest options"
AI generates options

Check in database:
✅ PASS: Each AI option has feasibilityScore (1-10)
✅ PASS: Each AI option has effortRequired (low/medium/high)
✅ PASS: feasibilityScore reflects user's constraints
❌ FAIL: If missing, validation should catch and regenerate
```

---

## 🚀 Quick Start Command Sequence

```bash
# 1. Create feature branch
git checkout -b fix/grow-phase1-critical-fixes

# 2. Open files in your editor
code convex/prompts/grow.ts
code convex/coach/grow.ts
code convex/types.ts

# 3. Make changes (follow guide above)

# 4. Test locally
npx convex dev

# 5. Run regression tests
npm test -- tests/evals/grow_basic.json

# 6. Commit
git add .
git commit -m "fix: GROW Phase 1 - Simplify OPTIONS/WILL steps

- Reduced OPTIONS from 4 states to 2 states
- Reduced WILL from 9 required fields to 5 core fields
- Added validation for feasibilityScore and effortRequired
- Expected: +30% completion rate improvement"

# 7. Deploy to staging
npx convex deploy --preview

# 8. Monitor metrics
# Check: OPTIONS completion, WILL completion, session time, drop-off rate
```

---

## 🆘 Troubleshooting Guide

### **Issue: OPTIONS Still Looping**

**Symptom:** AI asks for pros and cons separately, even after collecting both

**Fix:**
1. Check lines 486-750 in `convex/prompts/grow.ts` were fully replaced
2. Verify no other sections contradict the 2-state flow
3. Clear any cached prompts: `npx convex deploy --force`
4. Test with very simple user inputs: "Hire someone" → "Fast but expensive"

---

### **Issue: WILL Still Asks 9 Questions**

**Symptom:** AI asks for firstStep, specificOutcome, etc. even though not required

**Fix:**
1. Check BOTH files were updated:
   - `convex/coach/grow.ts` checkWillCompletion function
   - `convex/prompts/grow.ts` WILL guidance section
2. Verify validation only checks 5 core fields
3. Ensure prompt says "DO NOT force optional fields"
4. Test with user who doesn't volunteer extra info

---

### **Issue: Feasibility Score Missing**

**Symptom:** AI generates options without feasibilityScore

**Fix:**
1. Check OPTIONS prompt (line ~245-268) mentions feasibilityScore is required
2. Verify checkOptionsCompletion has validation logic
3. Ensure example in prompt includes feasibilityScore
4. Test by requesting AI suggestions: "please suggest options"

---

## 📞 Need Help?

If you get stuck:

1. Review the full analysis: `GROW_O_W_ISSUES_ANALYSIS.md`
2. Check visual diagrams: `GROW_VISUAL_FLOWCHARTS.md`
3. Re-read this comparison document
4. Check Convex logs for validation errors
5. Test with simplified inputs
6. Ask team for code review

---

**Status:** ✅ Ready to Implement  
**Estimated Time:** 4-6 hours  
**Expected Impact:** +30% completion rate

Good luck with the implementation! 🚀
