# COMPASS AI Suggestions Implementation

## Overview

This document describes the end-to-end implementation of AI suggestions for the COMPASS framework, modeled after the GROW framework's "fork" pattern.

## Implementation Date

October 23, 2025

## Implementation Summary

### ✅ What Was Implemented

1. **TypeScript Interfaces** (`convex/types.ts`)
   - `ActionSuggestion` - For MAPPING phase actions
   - `EnvironmentSuggestion` - For ANCHORING phase environment design
   - `LeadershipSuggestion` - For SUSTAINING phase leadership strategies
   - `BenefitSuggestion` - For OWNERSHIP phase benefits (use with care)
   - `PracticeSuggestion` - For PRACTICE phase insights
   - `UserSuggestionChoice` - Type for detecting user choice
   - `SuggestionContext` - Context for generating suggestions
   - `detectSuggestionChoice()` - Function to detect if user wants AI help

2. **COMPASS Prompt Updates** (`convex/prompts/compass.ts`)
   - **MAPPING Phase**: Added "THE FORK" pattern with AI suggestion flow
   - **ANCHORING Phase**: Added "THE FORK" pattern with environment design suggestions
   - **SUSTAINING Phase**: Added "THE FORK" pattern with leadership visibility strategies
   - **OWNERSHIP Phase**: Added careful AI suggestion flow (perspectives, not prescriptions)
   - **PRACTICE Phase**: No AI suggestions (user reflection is sufficient)

3. **Core Logic Implementation** (`convex/coach.ts`)
   - `generateCOMPASSuggestions()` - Context-aware suggestion generator
   - Integrated `detectSuggestionChoice()` into main coach action
   - Added suggestion context to Anthropic API system prompt
   - All implementations are type-safe with proper null checks

## The "Fork" Pattern

### How It Works

1. **User provides initial input** (1-2 items for the current phase)
2. **Coach offers THE FORK**:
   ```
   "Would you like to think through more [X] yourself, 
   OR would you like me to suggest some based on your situation?"
   ```
3. **User chooses path**:
   - **PATH A - Self-Generated**: User continues with facilitative coaching
   - **PATH B - AI Suggestions**: AI generates 2-3 contextually relevant suggestions
4. **Critical Validation**: After AI suggestions, always ask:
   - "Do any of these resonate with you?"
   - "Which ones fit your situation?"
   - WAIT for user confirmation before advancing

## Implementation Details by Phase

### 1. MAPPING Phase (Action Planning) - ⭐ HIGHEST PRIORITY

**When to Offer**:
- After user provides 1-2 initial actions

**AI Generates**:
- 2-3 specific actions with timeline and resources
- Based on: change_description, why_it_matters, personal_benefits
- Focus: Stakeholder communication, change champions, feedback mechanisms

**Example Output**:
```json
{
  "actions": [
    {
      "action": "Schedule stakeholder communication plan",
      "timeline": "Week 1-2",
      "resources_needed": "Communication template, stakeholder list"
    },
    {
      "action": "Identify change champions in each team",
      "timeline": "Week 2",
      "resources_needed": "Influence mapping, 1:1 conversations"
    }
  ]
}
```

### 2. ANCHORING Phase (Environment Design) - ⭐ HIGH PRIORITY

**When to Offer**:
- After user identifies 1-2 barriers and changes

**AI Generates**:
- 2-3 environment design strategies
- Based on: actions, what_worked, what_was_hard, change psychology
- Categories: Environmental changes, habit stacking, cues/reminders, accountability

**Example Output**:
```json
{
  "environmental_changes": [
    "Set up visual dashboard in team space",
    "Change default meeting agenda template"
  ],
  "habits_to_build": [
    "Start team meetings with change update",
    "Weekly personal reflection on change progress"
  ],
  "accountability_plan": "Bi-weekly check-ins with change champion peer"
}
```

### 3. SUSTAINING Phase (Leadership Visibility) - ⭐ MEDIUM PRIORITY

**When to Offer**:
- After user shares initial leadership visibility and 1-2 metrics

**AI Generates**:
- 2-3 leadership strategies
- Based on: change_description, actions, what_worked, what_was_hard
- Categories: Visibility actions, metrics, team support, celebrations

**Example Output**:
```json
{
  "metrics_tracking": [
    "Weekly adoption rate by team",
    "Number of change champions engaged",
    "Employee feedback sentiment"
  ],
  "team_support_plan": "Monthly 1:1 check-ins with each team lead + open office hours",
  "celebration_plan": "Bi-weekly wins sharing + quarterly change champion recognition"
}
```

### 4. OWNERSHIP Phase (Personal Benefits) - ⚠️ USE WITH CARE

**When to Offer**:
- ONLY if user struggles ("I don't know", "I can't think of any")

**AI Generates**:
- 2-3 benefit PERSPECTIVES (not prescriptions)
- Framed as questions: "Some leaders have found... Do any resonate?"
- Categories: Career, skills, relationships, values, personal growth

**CRITICAL**: Must be offered as perspectives for validation, NOT prescriptions

**Example Output**:
```json
{
  "personal_benefits": [],  // DO NOT auto-populate
  "coach_reflection": "Some leaders have found: career development through visible change leadership, building new skills in influence and communication, or strengthening relationships through shared challenge. Do any of these feel true for you?"
}
```

## Key Guardrails

### ✅ ALWAYS

- Ask permission before offering AI suggestions
- Generate 2-3 suggestions max (not overwhelming)
- Base suggestions on earlier COMPASS phase data
- Validate after suggesting ("Do any resonate?")
- Wait for user confirmation before advancing
- Maintain conversational tone in coach_reflection

### ❌ NEVER

- Auto-generate without asking
- Advance without user validation
- Prescribe "you should do X"
- Impose benefits/feelings user doesn't have
- Use AI suggestions in PRACTICE phase (user reflection sufficient)
- Generate more than 3 suggestions at once

## Technical Implementation

### Type Safety

All implementations use proper TypeScript types:
- No `any` types used
- Explicit null/undefined checks
- Proper interface definitions
- Type guards for safety

### ESLint Compliance

✅ All linting errors resolved:
- Unused parameters prefixed with `_` or removed
- Explicit null checks for nullable values
- Proper braces for if statements
- No unsafe type assertions

### Context Extraction

The `generateCOMPASSuggestions()` function extracts context from:
1. **Clarity phase**: change_description, why_it_matters
2. **Ownership phase**: personal_benefits
3. **Mapping phase**: actions
4. **Practice phase**: what_worked, what_was_hard

This context informs all AI suggestions to ensure they're relevant to the user's specific situation.

### Detection Logic

The `detectSuggestionChoice()` function detects user intent:

**AI Suggestion Phrases**:
- "suggest", "suggestions", "help me", "what do you think"
- "give me", "show me", "provide", "offer", "recommend"
- "yes please", "yeah", "sure", "ok"

**Self-Generation Phrases**:
- "i have", "i will", "let me", "i want to"
- "i'm considering", "another option", "myself"
- "no thanks", "on my own"

## Usage Flow Example

### MAPPING Phase Flow

1. **User**: "I need to communicate the change to my team"
2. **Coach**: Captures action, asks about timeline
3. **User**: Provides timeline
4. **Coach**: "Would you like to think through more actions yourself, OR would you like me to suggest some based on your change situation?"
5. **User**: "Yes, please suggest"
6. **AI**: Generates 2-3 contextual actions with timelines and resources
7. **Coach**: "Do any of these fit your situation? Which ones make sense for your context?"
8. **User**: Confirms/modifies suggestions
9. **Continue** to next question or next phase

## Benefits of This Implementation

1. **User Agency**: Users always choose whether they want AI help
2. **Context-Aware**: Suggestions based on their specific situation
3. **Validation Required**: No suggestions applied without user confirmation
4. **Type-Safe**: All TypeScript, no runtime type errors
5. **Modular**: Easy to extend to other frameworks (GROW already has this)
6. **Consistent**: Same pattern across all COMPASS phases

## Testing Recommendations

1. Test each phase's AI suggestion flow
2. Verify context extraction from earlier phases
3. Test detection logic with various user phrases
4. Ensure validation questions always appear
5. Verify suggestions are contextually relevant
6. Test graceful degradation if context is missing

## Future Enhancements

- Add confidence scoring to suggestions
- Track which suggestions users find most helpful
- A/B test different suggestion prompts
- Add more sophisticated context analysis
- Extend pattern to other frameworks (CLEAR, etc.)

## Conclusion

This implementation brings COMPASS to feature parity with GROW's AI suggestion capabilities while maintaining the core coaching philosophy: **user agency first, AI assistance when requested**.

All code is type-safe, ESLint-compliant, and follows the project's strict TypeScript standards.


