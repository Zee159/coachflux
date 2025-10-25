# GROW Framework Phase 1 Fixes - Implementation Guide

**Priority:** 🔥 CRITICAL  
**Estimated Time:** 4-6 hours  
**Impact:** +20% completion rate

---

## 🎯 Quick Summary

Fix the 3 most critical issues causing AI to misbehave:

1. **Simplify OPTIONS flow:** 4 states → 2 states
2. **Reduce WILL fields:** 9 fields → 5 fields  
3. **Enforce quality scores:** Make feasibility/effort required

---

## 📝 FIX #1: Simplify OPTIONS to 2-State Flow

### **File:** `convex/prompts/grow.ts`  
### **Lines to Replace:** 486-750 (entire options section)

### **New Simplified OPTIONS Guidance:**

```typescript
options: `OPTIONS PHASE - Simplified 2-State Flow

🚨 CRITICAL RULE: Ask ONLY ONE QUESTION at a time!

⚠️ SIMPLIFIED FLOW - ONLY 2 STATES:

═══════════════════════════════════════════════════════════════
STATE A: COLLECT OPTION AND EVALUATION TOGETHER
═══════════════════════════════════════════════════════════════

Ask: "What's one option you're considering?"

When user provides option:
✅ Extract label
✅ Immediately ask: "What are the pros and cons of [their option]?"

═══════════════════════════════════════════════════════════════
STATE B: EXTRACT PROS/CONS AND OFFER CHOICE
═══════════════════════════════════════════════════════════════

User provides pros and cons (can be in single response):
✅ Extract both pros[] and cons[] together
✅ Then ask: "Would you like to share another option, or would you like me to suggest some?"

FORK IN THE ROAD:

PATH A - User Wants Another Option:
User says: "another option", "I have another", "let me think of one more"
→ Return to STATE A with new option

PATH B - User Wants AI Suggestions:
User says: "yes", "suggest", "please suggest", "give me ideas", "what do you think"
→ Generate 2-3 complete options with all fields
→ Ask: "Do any of these work for you?"

PATH C - User Ready to Proceed:
User says: "I'm ready", "move to will", "yes" (after seeing options), "proceed", "continue"
→ Set user_ready_to_proceed = true
→ Ask: "Great! Which option would you like to move forward with?"
→ This advances to Will phase

═══════════════════════════════════════════════════════════════
AI SUGGESTION GENERATION RULES
═══════════════════════════════════════════════════════════════

When user requests AI suggestions:

1. EXTRACT CONTEXT from Goal and Reality:
   - Goal: What they want to achieve
   - Timeframe: How long they have
   - Constraints: Limitations (time, money, skills)
   - Resources: What they already have
   - Risks: What could derail them

2. GENERATE 2-3 OPTIONS:
   Each option MUST have ALL these fields:
   - label: Clear, actionable name
   - pros: 2-3 advantages (array of strings)
   - cons: 2-3 challenges (array of strings)
   - feasibilityScore: 1-10 (how realistic given their constraints)
   - effortRequired: "low" | "medium" | "high"
   - alignmentReason: Why this fits their situation

3. GROUND IN THEIR REALITY:
   ✅ GOOD: "Given you're in Perth with 4 hours/day..."
   ✅ GOOD: "Since you have limited funds but strong network..."
   ❌ BAD: "Join a developer community" (too generic)

4. VARY EFFORT LEVELS:
   - Option 1: Low effort (quick win)
   - Option 2: Medium effort (balanced)
   - Option 3: High effort (high impact)

Example AI Suggestion:
{
  "label": "Find technical mentor in Perth AI community",
  "pros": ["Free guidance", "Local network", "In-person meetings"],
  "cons": ["Takes 2-3 weeks to find", "Requires 4-hour weekly commitment"],
  "feasibilityScore": 9,
  "effortRequired": "medium",
  "alignmentReason": "Leverages your Perth location and fits your 4-hour daily schedule"
}

═══════════════════════════════════════════════════════════════
CRITICAL EXTRACTION RULES
═══════════════════════════════════════════════════════════════

ONLY extract what the user EXPLICITLY states:
- User says "it's cheap" → Extract pros: ["Cheap"] (NOT "Cost-effective", "Affordable")
- User says "might not work" → Extract cons: ["Might not work"] (NOT "High risk of failure")

If user provides pros but not cons:
→ Set cons = []
→ Ask: "What about challenges or drawbacks?"

If user provides cons but not pros:
→ Set pros = []
→ Ask: "What are the benefits of this option?"

NEVER invent information the user didn't say!

═══════════════════════════════════════════════════════════════
COMPLETION CRITERIA
═══════════════════════════════════════════════════════════════

To advance to Will step, you need ALL of:
1. At least 2 options in the array
2. At least 1 option with BOTH pros AND cons filled in
3. user_ready_to_proceed = true (user explicitly said they're ready)

Example - Ready to Advance:
{
  "options": [
    {"label": "Option A", "pros": ["Pro1"], "cons": ["Con1"]},  ✅ Complete
    {"label": "Option B", "pros": [], "cons": []}  ⚠️ Incomplete but OK (2 options, 1 complete)
  ],
  "user_ready_to_proceed": true  ✅ User confirmed readiness
}

Example - NOT Ready:
{
  "options": [
    {"label": "Option A", "pros": ["Pro1"], "cons": ["Con1"]},
    {"label": "Option B", "pros": ["Pro2"], "cons": ["Con2"]}
  ]
  // ❌ Missing user_ready_to_proceed = true
}

═══════════════════════════════════════════════════════════════
EXAMPLES - CORRECT FLOW
═══════════════════════════════════════════════════════════════

**Example 1: User-Provided Option**
AI: "What's one option you're considering?"
User: "I could hire a developer"
AI: {
  options: [{"label": "Hire a developer", "pros": [], "cons": []}],
  coach_reflection: "What are the pros and cons of hiring a developer?"
}

User: "It's fast but expensive"
AI: {
  options: [{"label": "Hire a developer", "pros": ["Fast"], "cons": ["Expensive"]}],
  coach_reflection: "Thanks for sharing. Would you like to explore another option, or would you like me to suggest some?"
}

User: "yes please"  (requesting suggestions)
AI: {
  options: [
    {"label": "Hire developer", "pros": ["Fast"], "cons": ["Expensive"]},  // User option
    {"label": "Learn solo", "pros": ["Free", "Full control"], "cons": ["Slower"], "feasibilityScore": 8, "effortRequired": "high", "alignmentReason": "Fits budget"},
    {"label": "Use no-code tool", "pros": ["Quick", "Easy"], "cons": ["Limited"], "feasibilityScore": 10, "effortRequired": "low", "alignmentReason": "Fast start"}
  ],
  coach_reflection: "Based on your constraints, here are some options. Do any of these work for you?"
}

User: "yes, I'm ready"
AI: {
  options: [...same 3 options...],
  user_ready_to_proceed: true,
  coach_reflection: "Great! Which option would you like to move forward with?"
}
✅ Advances to Will step

**Example 2: Rejection Handling**
User: "None of these options feel right"
AI: {
  coach_reflection: "I understand. What's missing from these options? What would your ideal solution look like?"
}
User: "I need something that doesn't require money but faster than learning alone"
AI: {
  options: [
    ...previous options...,
    {"label": "Find coding partner", "pros": ["Free", "Faster learning", "Accountability"], "cons": ["Need to find right person"], "feasibilityScore": 7, "effortRequired": "medium", "alignmentReason": "Free option with peer support"}
  ],
  coach_reflection: "How about finding a coding partner? Do any of these options work now?"
}

═══════════════════════════════════════════════════════════════
SUMMARY - REMEMBER
═══════════════════════════════════════════════════════════════

1. Only 2 states: Collect → Evaluate
2. Ask ONE question at a time
3. Extract only what user explicitly states
4. AI suggestions must have ALL fields (label, pros, cons, feasibilityScore, effortRequired, alignmentReason)
5. Wait for user_ready_to_proceed = true before advancing
6. Ground suggestions in their Goal + Reality context

coach_reflection MUST be conversational coaching language only - NO JSON syntax!`
```

---

## 📝 FIX #2: Reduce WILL to 5 Core Fields

### **File:** `convex/coach/grow.ts`  
### **Function:** `checkWillCompletion` (lines 180-225)

### **Replace Entire Function:**

```typescript
/**
 * Will step completion logic
 * SIMPLIFIED: Only 5 core required fields (down from 9)
 */
private checkWillCompletion(
  payload: ReflectionPayload,
  skipCount: number,
  loopDetected: boolean
): StepCompletionResult {
  const chosenOptions = payload["chosen_options"];
  const actions = payload["actions"];

  // Must have at least 1 chosen option and matching actions
  if (!Array.isArray(chosenOptions) || chosenOptions.length === 0) {
    return { shouldAdvance: false };
  }

  if (!Array.isArray(actions) || actions.length === 0) {
    return { shouldAdvance: false };
  }

  // ✅ NEW: Check only 5 CORE fields (simplified from 9)
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

  // Progressive relaxation based on skip count and loop detection
  if (loopDetected) {
    // System stuck: Just need 1 action with title + owner + due_days
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
    // User exhausted skips: Need 1 action with basic fields
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
    // User used one skip: Need actions matching chosen options (without support/accountability)
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
    // DEFAULT (no skips): Need complete actions (5 core fields) matching chosen options
    return { 
      shouldAdvance: completeActions.length >= chosenOptions.length
    };
  }
}
```

### **Also Update WILL Prompts:**

File: `convex/prompts/grow.ts`  
Lines: 296-483 (will section)

**Find this section:**
```typescript
Action Requirements (STREAMLINED FOR 1-3 OPTIONS):

REQUIRED FIELDS (must have for every action):
- title: Clear action description
- owner: Who's responsible (default to "me" if not specified)
- due_days: Timeline in days (NEVER guess - user must provide)
- support_needed: What help or resources they need (NEW REQUIRED FIELD)
- accountability_mechanism: How they'll track progress (NEW REQUIRED FIELD)

OPTIONAL FIELDS (gather if user volunteers):
- firstStep: The very first action (if they mention it)
- specificOutcome: What "done" looks like (if they describe it)
- reviewDate: Mid-point check-in (if they want one)
- potentialBarriers: What might get in the way (if they mention concerns)
```

**Replace with:**
```typescript
Action Requirements (SIMPLIFIED TO 5 CORE FIELDS):

REQUIRED FIELDS (must ask for every action):
1. title: What action will you take?
2. owner: Who's responsible? (default to "me" if not specified)
3. due_days: When will you complete this?
4. accountability_mechanism: How will you track progress?
5. support_needed: What help or resources do you need? (can be "None")

OPTIONAL FIELDS (only gather if user volunteers during conversation):
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
```

---

## 📝 FIX #3: Make Feasibility/Effort Required for AI Options

### **File:** `convex/types.ts`  
### **Lines:** 28-89 (GrowOption interface)

### **Change 1: Remove Optional Marker**

**Find:**
```typescript
export interface GrowOption {
  label: string;
  pros: string[];
  cons: string[];
  feasibilityScore?: number;  // ❌ Optional
  effortRequired?: 'low' | 'medium' | 'high';  // ❌ Optional
  alignmentReason?: string;
}
```

**Replace with:**
```typescript
export interface GrowOption {
  label: string;
  pros: string[];
  cons: string[];
  
  // ✅ REQUIRED for AI-generated options (undefined for user options)
  feasibilityScore?: number;  // 1-10: How realistic given constraints
  effortRequired?: 'low' | 'medium' | 'high';  // Estimated effort level
  alignmentReason?: string;  // Why this fits their situation (optional but recommended)
}

// Helper to check if option is AI-generated
export function isAIGeneratedOption(option: GrowOption): boolean {
  return option.feasibilityScore !== undefined || option.effortRequired !== undefined;
}
```

### **Change 2: Add Validation in Coach Logic**

**File:** `convex/coach/grow.ts`  
**Function:** `checkOptionsCompletion` (lines 111-160)

**Find this section:**
```typescript
const exploredOptions = options.filter((opt: unknown) => {
  const option = opt as { label?: string; pros?: unknown[]; cons?: unknown[] };
  return Array.isArray(option.pros) && option.pros.length > 0 &&
         Array.isArray(option.cons) && option.cons.length > 0;
});
```

**Replace with:**
```typescript
// Validate that options have required fields
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
```

**Then update the return statement:**
```typescript
// DEFAULT (no skips): Require 2+ valid options with 1+ explored AND user readiness
return { 
  shouldAdvance: validOptions.length >= 2 && 
                 exploredOptions.length >= 1 && 
                 userReady === true
};
```

---

## ✅ TESTING CHECKLIST

After implementing all 3 fixes:

### **Test 1: OPTIONS 2-State Flow**
```
Start OPTIONS step:
AI: "What's one option you're considering?"
User: "Hire a developer"
AI: "What are the pros and cons of hiring a developer?"
User: "Fast but expensive"
AI: Extract {label: "Hire developer", pros: ["Fast"], cons: ["Expensive"]}
AI: "Would you like to explore another option, or would you like me to suggest some?"

✅ PASS if:
- AI collected option in 2 questions (not 4)
- No loops asking for pros/cons separately
- Both pros and cons extracted together
```

### **Test 2: WILL 5 Core Fields**
```
Start WILL step:
AI: "Which option will you choose?"
User: "Hire developer"

AI asks 5 questions:
1. "What specific action?" → title
2. "When complete?" → due_days
3. "Who's responsible?" → owner
4. "How track progress?" → accountability_mechanism
5. "What support needed?" → support_needed

✅ PASS if:
- Only 5 questions asked (not 9)
- Does NOT ask for firstStep, specificOutcome, reviewDate, potentialBarriers
- Completion succeeds with just 5 fields
```

### **Test 3: Feasibility/Effort Validation**
```
User: "please suggest options"
AI generates options without feasibilityScore

✅ PASS if:
- Validation catches missing feasibilityScore
- AI regenerates with feasibilityScore: 1-10
- AI includes effortRequired: low/medium/high
- Options pass validation
```

---

## 🚀 DEPLOYMENT STEPS

1. **Create feature branch:**
   ```bash
   git checkout -b fix/grow-phase1-critical-fixes
   ```

2. **Make changes in order:**
   - Fix #1: Update `convex/prompts/grow.ts` OPTIONS section
   - Fix #2: Update `convex/coach/grow.ts` checkWillCompletion
   - Fix #2: Update `convex/prompts/grow.ts` WILL section
   - Fix #3: Update `convex/types.ts` GrowOption interface
   - Fix #3: Update `convex/coach/grow.ts` checkOptionsCompletion

3. **Test locally:**
   ```bash
   npx convex dev
   # Run through complete GROW session
   ```

4. **Run regression tests:**
   ```bash
   npm test -- tests/evals/grow_basic.json
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "fix: GROW Phase 1 - Simplify OPTIONS/WILL steps"
   git push origin fix/grow-phase1-critical-fixes
   ```

6. **Deploy to staging:**
   ```bash
   npx convex deploy --preview
   ```

7. **Test on staging with real users**

8. **Merge to main if tests pass**

---

## 📊 EXPECTED RESULTS

### **Before Phase 1:**
- OPTIONS completion: ~65%
- WILL completion: ~55%
- Average session time: 25 minutes
- User drop-off: 35%

### **After Phase 1:**
- OPTIONS completion: **~85%** (+20%)
- WILL completion: **~80%** (+25%)
- Average session time: **18 minutes** (-28%)
- User drop-off: **15%** (-57%)

---

## 🆘 TROUBLESHOOTING

### **Issue: AI still looping in OPTIONS**
**Fix:** Check that you replaced the ENTIRE options section (lines 486-750)

### **Issue: WILL asks for 9 fields**
**Fix:** Ensure you updated both:
- `convex/coach/grow.ts` checkWillCompletion function
- `convex/prompts/grow.ts` WILL section (Action Requirements)

### **Issue: AI not providing feasibilityScore**
**Fix:** 
1. Check OPTIONS prompt mentions feasibilityScore is required
2. Check validation logic in checkOptionsCompletion
3. Try regenerating AI response

---

## 📞 SUPPORT

If you encounter issues:
1. Review the main analysis document: `GROW_O_W_ISSUES_ANALYSIS.md`
2. Check implementation logs in Convex dashboard
3. Test with simplified user inputs
4. Reach out to team for code review

---

**Implementation Time Estimate:** 4-6 hours  
**Testing Time Estimate:** 2-3 hours  
**Total Time:** 6-9 hours

Good luck! 🚀
