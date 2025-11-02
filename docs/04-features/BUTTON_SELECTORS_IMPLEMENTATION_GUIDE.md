# Button Selectors Implementation Guide for COMPASS

## Overview
This document analyzes the GROW framework's button selector implementations and provides a blueprint for implementing similar UI patterns in COMPASS for questions with definitive answers.

---

## 1. Existing GROW Button Implementations

### 1.1 YesNoSelector Component
**Purpose:** Binary choice questions (consent, confirmation)

**Key Features:**
- ✅ Two-button layout (Yes/No)
- ✅ Green primary button (Yes) + Gray secondary button (No)
- ✅ Icons: Check (✓) and X
- ✅ Loading state support
- ✅ Customizable labels
- ✅ Helper text with emoji
- ✅ Accessibility (aria-labels)

**Props Interface:**
```typescript
interface YesNoSelectorProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
  isLoading?: boolean;
}
```

**Usage Pattern in SessionView:**
```typescript
{reflection.step === 'introduction' && isLastReflection && !isSessionComplete && (() => {
  const payload = reflection.payload as Record<string, unknown>;
  const userConsentGiven = payload['user_consent_given'];
  
  if (userConsentGiven === true) {
    return null; // Hide after consent given
  }
  
  return (
    <div className="mt-4">
      <YesNoSelector
        question="Ready to begin?"
        yesLabel="Yes, let's begin"
        noLabel="No, close session"
        onYes={() => {
          void nextStepAction({
            orgId: session.orgId,
            userId: session.userId,
            sessionId: session._id,
            stepName: 'introduction',
            userTurn: 'yes',
          });
        }}
        onNo={() => {
          navigate('/dashboard');
        }}
      />
    </div>
  );
})()}
```

**Key Learnings:**
1. ✅ **Conditional Rendering:** Check payload field to hide buttons after response
2. ✅ **IIFE Pattern:** Use `(() => { ... })()` for complex conditional logic
3. ✅ **Type Safety:** Cast payload to `Record<string, unknown>` and check field existence
4. ✅ **State Management:** Buttons trigger `nextStepAction` with user response

---

### 1.2 OptionsSelector Component
**Purpose:** Multi-select from AI-generated options (GROW Options step)

**Key Features:**
- ✅ Card-based UI with checkboxes
- ✅ Min/max selection constraints (1-3 options)
- ✅ Recommended badge (⭐)
- ✅ Pros/Cons display
- ✅ Selection counter
- ✅ Disabled state when max reached
- ✅ Submit button with validation
- ✅ Keyboard navigation support

**Props Interface:**
```typescript
interface Option {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
  pros?: string[];
  cons?: string[];
}

interface OptionsSelectorProps {
  options: Option[];
  onSubmit: (selectedIds: string[]) => void;
  minSelections?: number;
  maxSelections?: number;
  coachMessage?: string;
}
```

**Usage Pattern:**
```typescript
{reflection.step === 'options' && isLastReflection && !isSessionComplete && (() => {
  const payload = reflection.payload as Record<string, unknown>;
  const options = payload['options'];
  
  if (!Array.isArray(options) || options.length === 0) {
    return null; // Hide if no options
  }
  
  return (
    <div className="mt-4">
      <OptionsSelector
        options={options.map((opt: Record<string, unknown>) => ({
          id: String(opt['id'] ?? ''),
          label: String(opt['label'] ?? ''),
          description: String(opt['description'] ?? ''),
          pros: Array.isArray(opt['pros']) ? opt['pros'].map(String) : [],
          cons: Array.isArray(opt['cons']) ? opt['cons'].map(String) : [],
          recommended: Boolean(opt['recommended'])
        }))}
        onSubmit={(selectedIds) => {
          void nextStepAction({
            orgId: session.orgId,
            userId: session.userId,
            sessionId: session._id,
            stepName: 'options',
            userTurn: JSON.stringify({ selected_option_ids: selectedIds }),
          });
        }}
      />
    </div>
  );
})()}
```

**Key Learnings:**
1. ✅ **Array Validation:** Check if field is array and has items before rendering
2. ✅ **Type Coercion:** Map payload data to component interface with type safety
3. ✅ **JSON Serialization:** Send complex data as JSON string in `userTurn`
4. ✅ **Null Safety:** Use `??` operator for fallback values

---

### 1.3 ActionValidator Component
**Purpose:** Accept/Modify/Skip AI-suggested actions (GROW Will step)

**Key Features:**
- ✅ Three-button layout (Accept/Modify/Skip)
- ✅ Inline editing mode
- ✅ Save/Cancel buttons when editing
- ✅ Structured data display (action, timeline, owner, accountability, support)
- ✅ Timeline formatting (days → weeks → months)
- ✅ Form validation

**Props Interface:**
```typescript
interface SuggestedAction {
  action: string;
  due_days: number;
  owner: string;
  accountability_mechanism: string;
  support_needed: string;
}

interface ActionValidatorProps {
  optionLabel: string;
  suggestedAction: SuggestedAction;
  onAccept: () => void;
  onModify: (modifiedAction: SuggestedAction) => void;
  onSkip: () => void;
  isLoading?: boolean;
}
```

**Key Learnings:**
1. ✅ **Edit State:** Use local state for editing mode
2. ✅ **Dual Mode UI:** Show different buttons based on `isEditing` state
3. ✅ **Data Transformation:** Format display values (e.g., days → "2 weeks")
4. ✅ **Validation:** Disable buttons based on form completeness

---

## 2. COMPASS Questions Requiring Button Selectors

### 2.1 Introduction Step

#### Q1: Initial Confidence (1-10 Scale)
**Current:** Text input  
**Proposed:** Number scale buttons (1-10)

**Component:** `ConfidenceScaleSelector`

**Design:**
- 10 pill buttons in 2 rows (1-5, 6-10)
- Color gradient: Red (1-3) → Yellow (4-6) → Green (7-10)
- Selected state with checkmark
- Helper text: "1 = Not confident at all, 10 = Very confident"

**Schema Field:** `initial_confidence` (integer, 1-10)

---

#### Q2: Initial Action Clarity (1-10 Scale) - CONDITIONAL
**Condition:** Only if `initial_confidence >= 8`  
**Current:** Text input  
**Proposed:** Number scale buttons (1-10)

**Component:** Reuse `ConfidenceScaleSelector` with different labels

**Design:**
- Same 10-button layout
- Different color scheme: Gray (1-3) → Blue (4-6) → Purple (7-10)
- Helper text: "1 = Very unclear, 10 = Crystal clear"

**Schema Field:** `initial_action_clarity` (integer, 1-10)

---

#### Q3: Initial Mindset State (4 Options)
**Current:** Text input  
**Proposed:** Four-button selector

**Component:** `MindsetSelector`

**Design:**
- 4 large pill buttons in 2x2 grid
- Options:
  - 😤 Resistant/Skeptical (Red)
  - 😐 Neutral/Cautious (Gray)
  - 🤔 Open/Curious (Blue)
  - 🚀 Engaged/Committed (Green)
- Selected state with border + checkmark
- Helper text: "How do you feel about this change right now?"

**Schema Field:** `initial_mindset_state` (string: "resistant" | "neutral" | "open" | "engaged")

---

### 2.2 Clarity Step

#### Q2: Understanding Check (1-5 Scale) - OPTIONAL
**Current:** Text input  
**Proposed:** 5-star rating selector

**Component:** `UnderstandingScaleSelector`

**Design:**
- 5 star buttons (⭐)
- Fill stars on hover/select
- Labels: 1 = "Very confused", 5 = "Crystal clear"
- Can skip if understanding is evident

**Schema Field:** `clarity_score` (integer, 1-5)

---

### 2.3 Ownership Step

#### Q1: Current Confidence Check (1-10 Scale)
**Current:** Text input  
**Proposed:** Reuse `ConfidenceScaleSelector`

**Schema Field:** `current_confidence` (integer, 1-10)

---

#### Q7: Final Confidence Check (1-10 Scale)
**Current:** Text input  
**Proposed:** Reuse `ConfidenceScaleSelector`

**Schema Field:** `final_confidence` (integer, 1-10)

---

### 2.4 Mapping Step

#### Q5: Action Commitment Confidence (1-10 Scale)
**Current:** Text input  
**Proposed:** Reuse `ConfidenceScaleSelector`

**Schema Field:** `commitment_confidence` (integer, 1-10)

---

### 2.5 Practice Step

#### Q2: Final Confidence (1-10 Scale)
**Current:** Text input  
**Proposed:** Reuse `ConfidenceScaleSelector`

**Schema Field:** `final_confidence` (integer, 1-10)

---

#### Q3: Final Action Clarity (1-10 Scale)
**Current:** Text input  
**Proposed:** Reuse `ConfidenceScaleSelector` with clarity labels

**Schema Field:** `final_action_clarity` (integer, 1-10)

---

#### Q4: Final Mindset State (4 Options)
**Current:** Text input  
**Proposed:** Reuse `MindsetSelector`

**Schema Field:** `final_mindset_state` (string: "resistant" | "neutral" | "open" | "engaged")

---

#### Q5: Session Helpfulness (1-10 Scale)
**Current:** Text input  
**Proposed:** 10-button satisfaction scale

**Component:** `SatisfactionScaleSelector`

**Design:**
- 10 emoji buttons: 😞 (1) → 😐 (5) → 😊 (10)
- Color gradient: Red → Yellow → Green
- Helper text: "How helpful was this session?"

**Schema Field:** `user_satisfaction` (integer, 1-10)

---

## 3. Component Architecture

### 3.1 New Components to Create

#### `ConfidenceScaleSelector.tsx`
**Purpose:** Reusable 1-10 scale for confidence questions

**Props:**
```typescript
interface ConfidenceScaleSelectorProps {
  question: string;
  value?: number;
  onSelect: (value: number) => void;
  colorScheme?: 'confidence' | 'clarity' | 'satisfaction';
  minLabel?: string;
  maxLabel?: string;
  isLoading?: boolean;
}
```

**Features:**
- 10 pill buttons (1-10)
- Color gradients based on scheme
- Selected state with checkmark
- Keyboard navigation (arrow keys)
- Auto-submit on selection

---

#### `MindsetSelector.tsx`
**Purpose:** 4-option mindset state selector

**Props:**
```typescript
interface MindsetSelectorProps {
  question: string;
  value?: 'resistant' | 'neutral' | 'open' | 'engaged';
  onSelect: (value: string) => void;
  isLoading?: boolean;
}
```

**Features:**
- 4 large emoji buttons
- 2x2 grid layout
- Color-coded by mindset
- Selected state with border + checkmark
- Auto-submit on selection

---

#### `UnderstandingScaleSelector.tsx`
**Purpose:** 1-5 star rating for understanding

**Props:**
```typescript
interface UnderstandingScaleSelectorProps {
  question: string;
  value?: number;
  onSelect: (value: number) => void;
  isLoading?: boolean;
}
```

**Features:**
- 5 star buttons
- Fill on hover/select
- Labels for 1 and 5
- Auto-submit on selection

---

### 3.2 SessionView Integration Pattern

**Standard Pattern for All Button Selectors:**

```typescript
{reflection.step === 'introduction' && isLastReflection && !isSessionComplete && (() => {
  const payload = reflection.payload as Record<string, unknown>;
  
  // Check if field already captured
  const fieldValue = payload['field_name'];
  if (fieldValue !== undefined && fieldValue !== null) {
    return null; // Hide buttons after response
  }
  
  // Check if AI is asking for this specific field
  const coachReflection = String(payload['coach_reflection'] ?? '');
  const isAskingForField = coachReflection.includes('keyword or pattern');
  
  if (!isAskingForField) {
    return null; // Only show when AI asks
  }
  
  return (
    <div className="mt-4">
      <ComponentSelector
        question="Question text"
        onSelect={(value) => {
          void nextStepAction({
            orgId: session.orgId,
            userId: session.userId,
            sessionId: session._id,
            stepName: reflection.step,
            userTurn: String(value), // or JSON.stringify for complex data
          });
        }}
      />
    </div>
  );
})()}
```

---

## 4. Implementation Checklist

### Phase 1: Core Components (Priority 1)
- [ ] Create `ConfidenceScaleSelector.tsx` (reusable for 6 questions)
- [ ] Create `MindsetSelector.tsx` (reusable for 2 questions)
- [ ] Create `UnderstandingScaleSelector.tsx` (1 question)

### Phase 2: SessionView Integration (Priority 2)
- [ ] Introduction Step:
  - [ ] Initial Confidence (Q1)
  - [ ] Initial Action Clarity (Q2 - conditional)
  - [ ] Initial Mindset State (Q3)
- [ ] Clarity Step:
  - [ ] Understanding Check (Q2 - optional)
- [ ] Ownership Step:
  - [ ] Current Confidence (Q1)
  - [ ] Final Confidence (Q7)
- [ ] Mapping Step:
  - [ ] Action Commitment Confidence (Q5)
- [ ] Practice Step:
  - [ ] Final Confidence (Q2)
  - [ ] Final Action Clarity (Q3)
  - [ ] Final Mindset State (Q4)
  - [ ] Session Helpfulness (Q5)

### Phase 3: Testing & Refinement (Priority 3)
- [ ] Test all button selectors in local dev
- [ ] Verify payload extraction
- [ ] Test conditional rendering (hide after response)
- [ ] Test high-confidence branching (Q2 conditional)
- [ ] Mobile responsiveness
- [ ] Dark mode support
- [ ] Accessibility (keyboard navigation, screen readers)

---

## 5. Key Design Principles

### 5.1 Conditional Rendering Rules
1. **Hide after response:** Check if field exists in payload before rendering
2. **Show only when asked:** Parse `coach_reflection` to detect when AI is asking
3. **Use IIFE pattern:** Wrap complex logic in `(() => { ... })()`
4. **Type safety:** Always cast payload to `Record<string, unknown>`

### 5.2 User Experience
1. **Auto-submit:** Submit immediately on selection (no separate submit button)
2. **Visual feedback:** Clear selected state with checkmark
3. **Loading states:** Disable buttons during API calls
4. **Helper text:** Always include guidance below buttons
5. **Accessibility:** Keyboard navigation + ARIA labels

### 5.3 Code Quality
1. **Reusability:** Create generic components with props
2. **Type safety:** Full TypeScript interfaces
3. **Consistency:** Match existing GROW button styles
4. **Performance:** Use React.memo for button components
5. **Maintainability:** Document props and usage patterns

---

## 6. Benefits Over Text Input

### User Experience
- ✅ **Faster:** Click instead of type
- ✅ **Clearer:** Visual scale vs. abstract number
- ✅ **Mobile-friendly:** Large touch targets
- ✅ **Error-free:** No invalid inputs (e.g., "eleven" or "0")
- ✅ **Engaging:** Interactive UI feels more conversational

### Data Quality
- ✅ **Standardized:** All responses in same format
- ✅ **Complete:** No partial/ambiguous answers
- ✅ **Validated:** Schema constraints enforced at UI level
- ✅ **Consistent:** Same scale interpretation across users

### Development
- ✅ **Less AI parsing:** No need to extract numbers from text
- ✅ **Fewer errors:** No "I'd say about 7 or 8" ambiguity
- ✅ **Better analytics:** Clean numeric data for CSS calculations
- ✅ **Faster sessions:** Reduced back-and-forth for clarification

---

## 7. Next Steps

1. **Review this document** with team
2. **Create components** in order: ConfidenceScaleSelector → MindsetSelector → UnderstandingScaleSelector
3. **Integrate one step at a time** (start with Introduction)
4. **Test thoroughly** before moving to next step
5. **Deploy incrementally** to catch issues early

---

## 8. Open Questions

1. Should we allow users to change their selection before submitting? (Current: auto-submit)
2. Should we show a confirmation animation after selection? (e.g., checkmark bounce)
3. Should we display the selected value in the chat history? (e.g., "USER: 7/10")
4. Should we add tooltips on hover for each button? (e.g., "7 = Moderately confident")

---

**Status:** Ready for implementation  
**Estimated Effort:** 8-12 hours (2-3 hours per component + 4-6 hours integration)  
**Risk Level:** Low (proven pattern from GROW)
