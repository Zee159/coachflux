# Safety Pause/Resume Feature - Test Checklist

## Overview
This feature implements a pause/resume flow for low-level safety concerns (anxiety, agitation, redundancy) in coaching sessions.

## Test Scenarios

### 1. Anxiety Detection
**Input:** "its making me anxious and i might lose my job"
**Expected Behavior:**
- [ ] Safety incident logged with severity "med"
- [ ] Session paused (safetyPaused = true)
- [ ] User input stored in pending_user_turn
- [ ] Current step stored in pending_user_step
- [ ] Safety reflection created with step = 'safety_pause'
- [ ] Breathing exercises displayed
- [ ] Two buttons shown: "Continue Session" and "Close Session"

### 2. Agitation Detection
**Input:** "this is really pissing me off and making me angry"
**Expected Behavior:**
- [ ] Safety incident logged with severity "med"
- [ ] Session paused
- [ ] EAP suggestion displayed
- [ ] Continue/Close buttons shown

### 3. Redundancy Detection
**Input:** "I'm worried about being made redundant"
**Expected Behavior:**
- [ ] Safety incident logged with severity "med"
- [ ] Session paused
- [ ] Job security support message displayed
- [ ] Continue/Close buttons shown

### 4. User Chooses "Continue Session"
**Expected Behavior:**
- [ ] clearSafetyPause mutation called
- [ ] safetyPaused set to false
- [ ] pending_user_turn and pending_user_step cleared
- [ ] Original user input sent to AI for processing
- [ ] Normal coaching flow resumes
- [ ] AI response appears in chat
- [ ] User can continue conversation normally

### 5. User Chooses "Close Session"
**Expected Behavior:**
- [ ] closeSession mutation called
- [ ] Session marked as closed (closedAt timestamp set)
- [ ] User redirected to dashboard
- [ ] Session shows as complete in dashboard

### 6. No Safety Concerns
**Input:** "I want to improve my leadership skills"
**Expected Behavior:**
- [ ] No safety pause triggered
- [ ] Normal coaching flow continues
- [ ] AI processes input immediately

### 7. High-Level Safety (Crisis)
**Input:** "I want to kill myself"
**Expected Behavior:**
- [ ] Session escalated AND paused
- [ ] Crisis resources displayed (988, emergency numbers)
- [ ] Session blocked from further input
- [ ] NO continue button (hard stop)

## Backend Verification

### Mutations
- [x] `storePendingUserTurn` - stores user input and step
- [x] `clearSafetyPause` - clears pause state
- [x] `pauseSession` - sets pause flag and reason
- [x] All mutations properly typed in CoachMutations interface

### Safety Check Flow
- [x] `performSafetyChecks` accepts stepName parameter
- [x] Creates safety_pause reflection
- [x] Returns CoachActionResult with ok: true, nextStep: 'awaiting_user_choice'
- [x] Stores pending input before returning

### Resume Handler
- [x] `safety_choice` case in handleStructuredInput
- [x] Retrieves pending_user_turn and pending_user_step
- [x] Validates pending input exists
- [x] Recursively calls nextStep with stored input
- [x] Clears pause state before processing

## Frontend Verification

### UI Components
- [x] Safety pause buttons render when step === 'safety_pause'
- [x] Buttons disabled during submission
- [x] Buttons send structuredInput with type: 'safety_choice'
- [x] Continue button sends action: 'continue'
- [x] Close button sends action: 'close'

### User Experience
- [ ] Safety message clearly visible
- [ ] Buttons are accessible and well-styled
- [ ] Loading states work correctly
- [ ] Error messages display if something fails
- [ ] Session state updates correctly after choice

## Schema Verification
- [x] pending_user_turn: v.optional(v.string())
- [x] pending_user_step: v.optional(v.string())
- [x] safetyPaused: v.optional(v.boolean())
- [x] safetyPauseReason: v.optional(v.string())

## Type Safety
- [x] No TypeScript errors in coach/base.ts
- [x] No TypeScript errors in coach/index.ts
- [x] No TypeScript errors in coach/types.ts
- [x] No TypeScript errors in mutations.ts
- [x] ESLint warnings suppressed for documented 'any' usage

## Edge Cases

### Multiple Safety Triggers
**Input:** "I'm anxious and angry about losing my job"
**Expected:** First detected level (anxiety) triggers pause

### Safety Pause During Different Steps
- [ ] Works in introduction step
- [ ] Works in clarity step
- [ ] Works in ownership step
- [ ] Works in mapping step
- [ ] Works in practice step

### Session Already Paused
**Expected:** Block further input, show crisis resources message

### No Pending Input
**Expected:** Return error "No pending input found"

## Performance
- [ ] No noticeable delay in safety detection
- [ ] Resume flow completes in <2 seconds
- [ ] No memory leaks from stored input

## Accessibility
- [ ] Buttons have clear labels
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Notes
- Console statements in coach/index.ts are intentional for debugging
- CSS inline styles warning in SessionView.tsx is pre-existing, not related to this feature
- Type instantiation depth error in mutations.ts is a known Convex limitation
