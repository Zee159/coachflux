# Feedback Widget Implementation

## Overview
A floating feedback widget that appears on the bottom-right of the SessionView, allowing users to provide structured feedback about their CoachFlux experience.

## Features

### 🎯 Design
- **Floating Button**: Bottom-right corner with chat bubble icon
- **Modal Popup**: Clean, modern modal with gradient header
- **Multi-Step Form**: 4 steps with progress indicator
- **Responsive**: Works on mobile and desktop
- **Dark Mode**: Full dark mode support

### 📊 Feedback Questions (< 2 minutes to complete)

#### Step 1: Overall Experience
- **Overall Rating**: 1-5 emoji scale (😞 to 😄)
- Quick emotional response to the experience

#### Step 2: UX & Ease of Use
- **UX Rating**: 1-5 numeric scale
- **Ease of Use**: Multiple choice
  - Very Easy ✅
  - Easy 👍
  - Confusing 🤔
  - Difficult ❌

#### Step 3: GROW Coaching Method
- **GROW Method Rating**: 1-5 numeric scale
- **Helpfulness**: Multiple choice
  - Very Helpful ⭐
  - Somewhat Helpful 👌
  - Not Very Helpful 😐
  - Not Helpful 👎

#### Step 4: Pricing & Improvements
- **Willingness to Pay**: Multiple choice
  - Yes, one-time payment
  - Yes, subscription
  - Yes, both options
  - Maybe, depends on price
  - No, prefer free version
- **Improvements**: Optional text area (500 chars max)

## Database Schema

### Updated `feedback` Table
```typescript
feedback: defineTable({
  orgId: v.optional(v.id("orgs")),
  userId: v.optional(v.id("users")),
  sessionId: v.optional(v.id("sessions")),  // ✨ NEW: Links to session
  overallRating: v.optional(v.number()),     // 1-5
  uxRating: v.optional(v.number()),          // 1-5
  growMethodRating: v.optional(v.number()),  // 1-5
  easeOfUse: v.optional(v.string()),         // Multiple choice
  helpfulness: v.optional(v.string()),       // Multiple choice
  willingToPay: v.optional(v.string()),      // Multiple choice
  improvements: v.optional(v.string()),      // Free text
  createdAt: v.number(),
})
```

## Files Modified

### 1. **Schema** (`convex/schema.ts`)
- Updated `feedback` table with new fields
- Added `sessionId` index for linking feedback to sessions

### 2. **Mutations** (`convex/mutations.ts`)
- Updated `createFeedback` mutation to accept new fields
- Removed old fields (name, email, rating, page, message)

### 3. **New Component** (`src/components/FeedbackWidget.tsx`)
- Floating button component
- Multi-step modal form
- Form validation and state management
- Success animation

### 4. **SessionView** (`src/components/SessionView.tsx`)
- Imported and added `<FeedbackWidget sessionId={session._id} />`
- Widget appears on all session pages

### 5. **Styles** (`src/index.css`)
- Added `animate-fade-in` keyframe animation

## User Experience Flow

1. **User sees floating feedback button** (bottom-right corner)
2. **Clicks button** → Modal opens with Step 1
3. **Completes 4 steps** with progress bar showing advancement
4. **Submits feedback** → Success message appears
5. **Modal auto-closes** after 2 seconds
6. **Feedback persisted** to database with sessionId link

## Technical Details

### Validation
- Step 1: Requires `overallRating`
- Step 2: Requires `uxRating` AND `easeOfUse`
- Step 3: Requires `growMethodRating` AND `helpfulness`
- Step 4: No required fields (all optional)

### Navigation
- **Next button**: Disabled until step requirements met
- **Back button**: Available from Step 2 onwards
- **Close button**: Resets form after 300ms delay

### Data Persistence
- Links to current `sessionId` for analytics
- Links to `orgId` and `userId` from localStorage
- All fields optional except those marked required per step

## Analytics Potential

With this data, you can analyze:
- **Overall satisfaction** trends
- **UX pain points** (ease of use patterns)
- **GROW method effectiveness** (helpfulness ratings)
- **Pricing willingness** (monetization insights)
- **Session-specific feedback** (which sessions get better ratings)
- **Improvement suggestions** (qualitative insights)

## Future Enhancements

- [ ] Add feedback button to Dashboard
- [ ] Admin dashboard to view all feedback
- [ ] Email notifications for new feedback
- [ ] A/B testing different question sets
- [ ] Sentiment analysis on improvement text
- [ ] Feedback trends over time visualization

---

**Completion Time**: < 2 minutes per user  
**Fields**: 7 data points (4 required, 3 optional)  
**Mobile-Friendly**: ✅  
**Dark Mode**: ✅  
**Session-Linked**: ✅
