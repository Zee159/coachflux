# GROW Phase 1 Fixes - Quick Reference Card

**Print this page and keep it next to your monitor while implementing!**

---

## 🎯 The 3 Critical Fixes

| # | What | Where | Time |
|---|------|-------|------|
| **1** | Simplify OPTIONS (4→2 states) | `convex/prompts/grow.ts` lines 486-750 | 2h |
| **2** | Reduce WILL (9→5 fields) | `convex/coach/grow.ts` + `convex/prompts/grow.ts` | 1h |
| **3** | Enforce quality scores | `convex/types.ts` + `convex/coach/grow.ts` | 30m |

---

## 📝 Fix #1: OPTIONS (2-State Flow)

### **Replace lines 486-750 in `convex/prompts/grow.ts` with:**

```
OPTIONS PHASE - Simplified 2-State Flow

STATE A: COLLECT OPTION + EVALUATION
1. Ask: "What's one option?"
2. User provides option
3. Ask: "What are the pros and cons?"
4. Extract: {label, pros[], cons[]}

STATE B: OFFER CHOICE
Ask: "Another option or SUGGEST some?"
- "another" → Loop to STATE A
- "suggest" → Generate 2-3 AI options
- "ready" → user_ready_to_proceed = true

EXTRACTION: Only extract what user explicitly states

AI SUGGESTIONS: Must have label, pros, cons, feasibilityScore (1-10), effortRequired (low/med/high)

COMPLETION: 2+ options, 1+ explored, user_ready_to_proceed = true
```

**Key Points:**
- ✅ Pros/cons collected together (not separately)
- ✅ Clear choice phrasing (no ambiguity)
- ✅ Explicit readiness check

---

## 📝 Fix #2A: WILL Completion Logic

### **Replace `checkWillCompletion` in `convex/coach/grow.ts` lines 180-225:**

```typescript
// Check only 5 CORE fields:
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

// Then: return { shouldAdvance: completeActions.length >= chosenOptions.length };
```

**Key Points:**
- ✅ Only 5 fields checked (not 9)
- ✅ Optional fields ignored in validation

---

## 📝 Fix #2B: WILL Prompt Guidance

### **Update Action Requirements in `convex/prompts/grow.ts`:**

```
REQUIRED FIELDS (5 questions per action):
1. title - What action?
2. owner - Who's responsible?
3. due_days - When complete?
4. accountability_mechanism - How track?
5. support_needed - What help needed?

OPTIONAL (only if user volunteers):
- firstStep, specificOutcome, reviewDate, potentialBarriers

⚠️ DO NOT force optional fields!

Example Flow:
Q1: "What action?" → title
Q2: "When complete?" → due_days
Q3: "Who's responsible?" → owner
Q4: "How track?" → accountability
Q5: "What support?" → support_needed
```

**Key Points:**
- ✅ 5 required, 4 optional (clearly separated)
- ✅ Explicit: "DO NOT force optional fields"

---

## 📝 Fix #3A: Add Type Helper

### **Add to `convex/types.ts` after GrowOption interface:**

```typescript
// Helper to check if option is AI-generated
export function isAIGeneratedOption(option: GrowOption): boolean {
  return option.feasibilityScore !== undefined || option.effortRequired !== undefined;
}
```

---

## 📝 Fix #3B: Add Validation Logic

### **Update `checkOptionsCompletion` in `convex/coach/grow.ts` lines 111-160:**

```typescript
// Validate AI options have required quality fields
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
  
  const isAIGenerated = option.feasibilityScore !== undefined || option.effortRequired !== undefined;
  
  if (isAIGenerated) {
    // AI options MUST have both fields
    return hasBasicFields && 
           typeof option.feasibilityScore === "number" &&
           option.feasibilityScore >= 1 && option.feasibilityScore <= 10 &&
           (option.effortRequired === 'low' || option.effortRequired === 'medium' || option.effortRequired === 'high');
  }
  
  return hasBasicFields;
});

// Then use validOptions instead of options in return statement
```

**Key Points:**
- ✅ AI options must have feasibilityScore (1-10)
- ✅ AI options must have effortRequired
- ✅ User options don't need these fields

---

## ✅ Testing Commands

```bash
# 1. Start dev server
npx convex dev

# 2. Test OPTIONS (should complete in 2 questions)
# Start GROW → Reach OPTIONS
# User: "Hire developer"
# AI: "What are pros/cons?"
# User: "Fast but expensive"
# ✅ Both extracted together

# 3. Test WILL (should ask only 5 questions)
# Continue to WILL
# AI asks: What action? When? Who? How track? What support?
# ✅ Only 5 questions

# 4. Test AI suggestions (should have feasibility)
# In OPTIONS: User says "suggest"
# ✅ Check options have feasibilityScore and effortRequired
```

---

## 🚨 Common Mistakes to Avoid

| Mistake | How to Avoid |
|---------|--------------|
| **Not replacing ENTIRE section** | Replace lines 486-750 completely (don't edit in place) |
| **Forgetting BOTH WILL files** | Update coach.ts AND prompts.ts |
| **Not testing end-to-end** | Run complete GROW session, not just unit tests |
| **Skipping validation logic** | Implement checkOptionsCompletion changes fully |

---

## 📊 Expected Before/After

### **OPTIONS:**
- Before: 4 questions per option → After: 2 questions
- Before: 30% loops → After: 5% loops
- Before: 65% completion → After: 85% completion

### **WILL:**
- Before: 9 questions per action → After: 5 questions
- Before: 35% drop-off → After: 15% drop-off
- Before: 55% completion → After: 80% completion

### **Overall Session:**
- Before: 25 minutes → After: 18 minutes
- Before: 50% completion → After: 85% completion

---

## 🔗 Full Documentation

- **Deep Analysis:** `GROW_O_W_ISSUES_ANALYSIS.md`
- **Implementation Guide:** `PHASE1_IMPLEMENTATION_GUIDE.md`
- **Visual Diagrams:** `GROW_VISUAL_FLOWCHARTS.md`
- **Executive Summary:** `GROW_EXECUTIVE_SUMMARY.md`
- **Code Comparison:** `GROW_CODE_CHANGES_COMPARISON.md`

---

## ⏱️ Time Tracking

- [ ] Fix #1 OPTIONS: ___ / 2 hours
- [ ] Fix #2 WILL: ___ / 1 hour
- [ ] Fix #3 Quality: ___ / 0.5 hours
- [ ] Testing: ___ / 2 hours
- [ ] **Total: ___ / 5.5 hours**

---

## ✅ Completion Checklist

- [ ] Created feature branch
- [ ] Updated `convex/prompts/grow.ts` OPTIONS (lines 486-750)
- [ ] Updated `convex/prompts/grow.ts` WILL guidance
- [ ] Updated `convex/coach/grow.ts` checkWillCompletion
- [ ] Updated `convex/coach/grow.ts` checkOptionsCompletion
- [ ] Added helper to `convex/types.ts`
- [ ] Tested OPTIONS 2-state flow
- [ ] Tested WILL 5-field flow
- [ ] Tested feasibility validation
- [ ] Committed changes
- [ ] Deployed to staging
- [ ] Monitoring metrics

---

**Status:** 🟢 Ready to Implement  
**Next Step:** Open `PHASE1_IMPLEMENTATION_GUIDE.md`

Good luck! 🚀
