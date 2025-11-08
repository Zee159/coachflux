# AI-Assisted Gap Identification Feature

## Overview
Enhanced Career Coach GAP_ANALYSIS step with AI-suggested gaps, similar to GROW's options selector pattern.

## Problem Solved
1. **Inflexible Priority Count**: Previously asked for "3 most critical gaps" even if user only identified 2
2. **Limited Gap Discovery**: Users might miss important gaps they haven't considered

## Solution
**Two-Phase Gap Identification:**
1. User identifies their own gaps (skill_gaps, experience_gaps)
2. AI offers to suggest additional gaps based on the career transition
3. User selects which AI suggestions resonate (optional)
4. Combined gaps used for development priorities (flexible 1-5, not forced 3)

---

## Implementation Details

### 1. Schema Changes (`convex/frameworks/career.ts`)

**New Fields:**
```typescript
ai_wants_suggestions: { type: "boolean" }
ai_suggested_gaps: {
  type: "array",
  items: {
    id: string,
    type: "skill" | "experience",
    gap: string (3-100 chars),
    rationale: string (10-200 chars),
    priority: "high" | "medium" | "low"
  },
  maxItems: 5
}
selected_gap_ids: {
  type: "array",
  items: { type: "string" },
  maxItems: 5
}
development_priorities: {
  maxItems: 5  // Changed from 3
}
```

### 2. Question Flow (`convex/prompts/career.ts`)

**Updated GAP_ANALYSIS Flow:**
1. "What skills does target role require that you lack?" → skill_gaps
2. "What experience are you missing?" → experience_gaps
3. "Would you like me to suggest additional gaps?" → ai_wants_suggestions
4. **[IF YES]** AI generates ai_suggested_gaps (3-5 specific gaps)
5. **[IF YES]** User selects via GapSelector → selected_gap_ids
6. "What skills transfer from current role?" → transferable_skills
7. "Which gaps are most critical?" → development_priorities (from skill_gaps + selected AI gaps)
8. "How manageable 1-10?" → gap_analysis_score

**AI Gap Generation Rules:**
- Analyze: current_role → target_role transition
- Generate 3-5 SPECIFIC gaps (not generic)
- Base on ACTUAL role transition
- Example: "manager BIA" → "CFO Director of Finance"
  - Gap: "Financial modeling and forecasting"
  - Rationale: "CFO roles require building financial models; BIA focuses on analysis"
  - Priority: "high"
- NEVER suggest generic gaps like "leadership"

### 3. Frontend Component (`src/components/GapSelector.tsx`)

**Features:**
- Purple-themed cards (distinct from blue options selector)
- Type badges (Skill/Experience) with icons
- Priority indicators (High/Medium/Low) with colors
- Rationale display for each gap
- Optional selection (can skip all)
- "Skip All" or "Continue with X selected" button

**Visual Design:**
- 🔴 High Priority (red badge)
- 🟡 Medium Priority (yellow badge)
- 🟢 Low Priority (green badge)
- 📈 Skill icon (TrendingUp)
- 💼 Experience icon (Briefcase)

### 4. Backend Handler (`convex/coach/index.ts`)

**New Structured Input: `gap_selection`**
```typescript
case 'gap_selection': {
  const { selected_gap_ids } = data;
  
  // Create reflection with selected IDs
  await createReflection({
    step: 'GAP_ANALYSIS',
    userInput: userTurn,
    payload: {
      selected_gap_ids,
      coach_reflection: selected_gap_ids.length > 0
        ? `Great! I've noted those ${selected_gap_ids.length} gaps. Now let's identify your transferable skills.`
        : "No problem! Let's move on to identifying your transferable skills."
    }
  });
}
```

### 5. Completion Logic (Already Flexible)

**No changes needed** - `checkGapAnalysisCompletion` already requires:
- `development_priorities.length >= 1` (not exactly 3)
- Works with 1-5 priorities

---

## User Experience Flow

### Scenario 1: User Accepts AI Suggestions
1. User: "I lack Python and machine learning skills"
2. AI: "Would you like me to suggest additional gaps?"
3. User: Clicks "Yes"
4. AI generates 5 gaps:
   - "Deep learning frameworks (TensorFlow/PyTorch)" - High Priority
   - "Cloud ML deployment (AWS SageMaker)" - Medium Priority
   - "MLOps and model monitoring" - Medium Priority
   - "Large-scale data processing (Spark)" - Low Priority
   - "Research paper implementation" - Low Priority
5. **GapSelector appears** with 5 cards
6. User selects 2 that resonate
7. Combined gaps: 2 user + 2 AI = 4 total gaps
8. AI: "Which gaps are most critical?" (flexible, not forced to 3)

### Scenario 2: User Declines AI Suggestions
1. User: "I lack Python and machine learning skills"
2. AI: "Would you like me to suggest additional gaps?"
3. User: "No"
4. AI: "What skills transfer from your current role?"
5. Continues with user's 2 gaps only

### Scenario 3: User Skips All AI Suggestions
1. AI generates 5 gaps
2. GapSelector appears
3. User clicks "Skip All"
4. AI: "No problem! Let's move on to transferable skills."
5. Continues with user's original gaps only

---

## Testing Checklist

### Backend
- [ ] AI generates 3-5 specific gaps when user says "yes"
- [ ] Gaps have proper structure (id, type, gap, rationale, priority)
- [ ] Gaps are role-specific (not generic)
- [ ] `selected_gap_ids` persists correctly
- [ ] Completion works with 1-5 development_priorities

### Frontend
- [ ] GapSelector appears when `ai_suggested_gaps` exists
- [ ] Cards display type, priority, rationale correctly
- [ ] Selection/deselection works
- [ ] "Skip All" button works
- [ ] "Continue with X selected" button works
- [ ] Component hidden when `selected_gap_ids` already set
- [ ] Component hidden when `awaitingConfirmation` is true

### Integration
- [ ] Gap selection triggers `gap_selection` structured input
- [ ] Backend creates reflection with `selected_gap_ids`
- [ ] AI continues to transferable_skills question
- [ ] Combined gaps (user + AI) used in development_priorities
- [ ] Report displays both user and AI-selected gaps

---

## Files Modified

1. **convex/frameworks/career.ts** - Schema updated
2. **convex/prompts/career.ts** - GAP_ANALYSIS guidance updated
3. **src/components/GapSelector.tsx** - New component created
4. **src/components/SessionView.tsx** - GapSelector integrated
5. **convex/coach/index.ts** - gap_selection handler added

---

## Future Enhancements

1. **Gap Merging Logic**: Detect if user-identified gap overlaps with AI suggestion
2. **Gap Refinement**: Allow user to edit AI-suggested gap descriptions
3. **Priority Adjustment**: Let user change AI-assigned priorities
4. **Gap Categories**: Group gaps by type (technical, soft skills, domain knowledge)
5. **Learning Resources**: Suggest resources for each selected gap

---

## Notes

- ARIA lint warning in GapSelector.tsx is a false positive (Edge Tools linter issue)
- Pattern matches GROW's OptionsSelector for consistency
- Purple theme distinguishes from blue options selector
- Flexible priority count (1-5) prevents forcing artificial constraints
