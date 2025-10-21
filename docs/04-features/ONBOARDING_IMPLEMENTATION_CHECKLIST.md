# Onboarding Implementation Checklist

## Pre-Implementation Setup

### Data Models & Types
- [ ] Create `FrameworkType` enum with all framework IDs
- [ ] Define `FrameworkMetadata` interface
- [ ] Create `UserPreferences` schema in Convex
- [ ] Define `OnboardingState` type
- [ ] Create `IntentData` interface

### Framework Metadata System
- [ ] Create `frameworks.json` or `frameworks.ts` with all metadata
- [ ] Define framework matching rules
- [ ] Create framework recommendation algorithm
- [ ] Add framework availability flags
- [ ] Set up framework categories (general, specialist)

---

## Phase 1: Core Components (Week 1-2)

### Component Structure
```
src/components/onboarding/
├── ConversationalVoidLanding.tsx  ← NEW: Primary entry point
├── RecommendationView.tsx         ← NEW: Shows AI recommendation
├── IntentCapture.tsx              ← FALLBACK: Traditional flow
├── FrameworkRecommendation.tsx
├── FrameworkGallery.tsx
├── FrameworkCard.tsx
├── FrameworkDetails.tsx
├── FrameworkComparison.tsx
└── OnboardingLayout.tsx
```

### ConversationalVoidLanding.tsx (NEW - Priority 1)
- [ ] Create blank canvas layout (80% whitespace)
- [ ] Implement blinking cursor animation
- [ ] Add text input (centered, 24px font)
- [ ] Progressive prompt display (2-3 second delay)
- [ ] Real-time AI intent analysis as user types
- [ ] Contextual hints based on input
- [ ] Fallback "Browse frameworks" link (10 second delay)
- [ ] Handle Enter key to submit
- [ ] Minimum 10 characters validation
- [ ] Transition to RecommendationView
- [ ] Mobile responsive (keyboard handling)
- [ ] Dark mode support
- [ ] Analytics tracking (type rate, completion rate)

### RecommendationView.tsx (NEW - Priority 1)
- [ ] Display user's input (quoted)
- [ ] Show AI-recommended framework
- [ ] Framework description and reason
- [ ] Estimated time, privacy badges
- [ ] "Start Your Session" CTA button
- [ ] Alternative framework options
- [ ] "Start over" link
- [ ] Mobile responsive design
- [ ] Dark mode support
- [ ] Analytics tracking (acceptance rate)

### OnboardingWelcome.tsx (DEPRECATED - Keep for fallback)
- [ ] ~~Create welcome screen layout~~ (Replaced by Conversational Void)
- [ ] Add Quick Start button (Fallback only)
- [ ] Add Explore Frameworks button (Fallback only)
- [ ] Add Skip to Dashboard link
- [ ] Implement first-time user detection
- [ ] Save user preference on selection
- [ ] Add animations (fade in, stagger)
- [ ] Mobile responsive design
- [ ] Dark mode support

### AI Intent Analysis System (NEW - Priority 1)
**File:** `src/lib/landing-ai.ts`
- [ ] Create `analyzeIntent()` function
- [ ] Keyword matching for goal-oriented input
- [ ] Keyword matching for problem-focused input
- [ ] Keyword matching for decision-making input
- [ ] Keyword matching for uncertainty
- [ ] Context detection (career, personal, leadership)
- [ ] Sentiment analysis (positive, negative, neutral)
- [ ] Confidence scoring
- [ ] Framework recommendation logic
- [ ] Response template generation
- [ ] Hint generation based on partial input
- [ ] Unit tests for intent detection

### IntentCapture.tsx (FALLBACK - Lower Priority)
- [ ] Create multi-step form
- [ ] Question 1: Primary focus (7 options)
- [ ] Question 2: Context (6 options)
- [ ] Progress indicator (dots)
- [ ] Back button functionality
- [ ] Continue button with validation
- [ ] Save intent data to state
- [ ] Keyboard navigation support
- [ ] Mobile-optimized layout
- [ ] Smooth transitions between questions

### FrameworkRecommendation.tsx
- [ ] Display recommended framework
- [ ] Show framework card with details
- [ ] Explain why it was recommended
- [ ] Start Session CTA button
- [ ] Back button to intent capture
- [ ] View All Frameworks link
- [ ] Framework preview section
- [ ] Estimated time display
- [ ] Difficulty indicator
- [ ] Success animation

### FrameworkGallery.tsx
- [ ] Grid layout of framework cards
- [ ] Filter by category (All, Beginner, Advanced, Specialist)
- [ ] Search functionality (optional for MVP)
- [ ] Sort options (optional)
- [ ] Hover states for cards
- [ ] Click to expand details
- [ ] Start Session from gallery
- [ ] Compare Frameworks link
- [ ] Mobile: Stack cards vertically
- [ ] Loading states

### FrameworkCard.tsx
- [ ] Framework icon/emoji
- [ ] Framework name
- [ ] Short tagline
- [ ] Category badge (Popular, Advanced, Specialist)
- [ ] Time estimate
- [ ] Difficulty indicator
- [ ] Details button
- [ ] Start button
- [ ] Hover effects
- [ ] Accessible labels

### FrameworkDetails.tsx (Modal/Expanded View)
- [ ] Full framework description
- [ ] "What it's for" section
- [ ] "Best for" list
- [ ] "The Process" step-by-step
- [ ] Time, difficulty, focus indicators
- [ ] Usage statistics (optional)
- [ ] Start Session CTA
- [ ] Back to Gallery button
- [ ] Close modal functionality
- [ ] Mobile-friendly layout

### FrameworkComparison.tsx (Optional for MVP)
- [ ] Side-by-side comparison table
- [ ] Select frameworks to compare
- [ ] Feature comparison rows
- [ ] Start Session from comparison
- [ ] Mobile: Swipeable cards
- [ ] Export comparison (future)

---

## Phase 2: Routing & Navigation (Week 2)

### Route Setup
- [ ] Add `/onboarding` route
- [ ] Add `/onboarding/welcome` route
- [ ] Add `/onboarding/intent` route
- [ ] Add `/onboarding/recommendation` route
- [ ] Add `/frameworks` route (gallery)
- [ ] Add `/frameworks/:frameworkId` route (details)
- [ ] Redirect logic for first-time users
- [ ] Preserve query params through flow

### Navigation Logic
- [ ] Detect first-time user (no sessions)
- [ ] Redirect to onboarding on first visit
- [ ] Skip onboarding for returning users
- [ ] Allow manual access to onboarding
- [ ] Breadcrumb navigation
- [ ] Browser back button handling
- [ ] Deep linking support

---

## Phase 3: State Management (Week 2-3)

### Onboarding State
- [ ] Create onboarding context/store
- [ ] Track current step
- [ ] Store intent data
- [ ] Store selected framework
- [ ] Track completion status
- [ ] Persist state to localStorage
- [ ] Clear state on completion

### User Preferences (Convex)
- [ ] Create `userPreferences` table
- [ ] Mutation: `setOnboardingComplete`
- [ ] Mutation: `setPreferredFramework`
- [ ] Mutation: `updateIntentData`
- [ ] Query: `getUserPreferences`
- [ ] Track framework usage history
- [ ] Store skip preferences

---

## Phase 4: Framework Selection Integration (Week 3)

### Update Session Creation
- [ ] Add framework parameter to `createSession` mutation
- [ ] Update `DemoSetup.tsx` to accept framework
- [ ] Pass framework from onboarding to session
- [ ] Validate framework availability
- [ ] Handle invalid framework gracefully

### Update Dashboard
- [ ] Add "Start New Session" with framework selector
- [ ] Show recently used framework
- [ ] Quick start with last framework
- [ ] Browse all frameworks button
- [ ] Framework history display
- [ ] Smart recommendations section

### Framework Metadata Loading
- [ ] Create framework metadata query
- [ ] Load all available frameworks
- [ ] Filter by availability
- [ ] Cache framework data
- [ ] Handle loading states
- [ ] Error handling for missing frameworks

---

## Phase 5: AI Recommendation System (Week 3-4)

### Conversational Void AI Analysis
**File:** `src/lib/landing-ai.ts`

```typescript
// Intent analysis from user's typed input
interface UserIntent {
  type: 'goal' | 'problem' | 'decision' | 'question' | 'unclear';
  context: 'career' | 'personal' | 'leadership' | 'general';
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

function analyzeInput(text: string): UserIntent {
  // Keyword-based analysis for MVP
  // Can upgrade to AI/ML later
}

function recommendFramework(intent: UserIntent): FrameworkRecommendation {
  // Match intent to framework
  // Return recommendation with reason
}
```

- [ ] Implement keyword-based intent detection
- [ ] Create response templates for each intent type
- [ ] Map intents to frameworks (goal → GROW, decision → COMPASS, etc.)
- [ ] Generate personalized recommendation text
- [ ] Handle edge cases (unclear input, multiple matches)
- [ ] Default to GROW for uncertain cases
- [ ] Add confidence scoring
- [ ] Return alternative framework suggestions
- [ ] Log all recommendations for analysis
- [ ] A/B test recommendation accuracy

### Traditional Intent Capture (Fallback)
- [ ] Map primary focus to frameworks
- [ ] Map context to frameworks
- [ ] Combine intent + context for recommendation
- [ ] Handle edge cases (no clear match)
- [ ] Generate explanation text

---

## Phase 6: Smart Features (Week 4-5)

### Framework History
- [ ] Track framework usage per user
- [ ] Count sessions per framework
- [ ] Track last used timestamp
- [ ] Calculate framework diversity
- [ ] Display usage statistics

### Smart Recommendations
- [ ] Suggest complementary frameworks
- [ ] "Users like you also tried..."
- [ ] Based on session history
- [ ] Based on completion patterns
- [ ] Personalized suggestions

### Quick Actions
- [ ] "Continue with [Last Framework]" button
- [ ] One-click session start
- [ ] Remember user preferences
- [ ] Skip onboarding option
- [ ] Reset onboarding option

---

## Phase 7: Polish & UX (Week 5-6)

### Animations & Transitions
- [ ] Page transitions (fade, slide)
- [ ] Card hover effects
- [ ] Button interactions
- [ ] Progress animations
- [ ] Success celebrations
- [ ] Loading skeletons
- [ ] Smooth scrolling

### Micro-interactions
- [ ] Button press feedback
- [ ] Selection highlights
- [ ] Tooltip appearances
- [ ] Modal open/close
- [ ] Drawer slides
- [ ] Confetti on completion (optional)

### Copy & Messaging
- [ ] Write all UI copy
- [ ] Tone: warm, encouraging
- [ ] Clear, jargon-free language
- [ ] Error messages
- [ ] Success messages
- [ ] Help text
- [ ] Tooltips

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Focus management
- [ ] Color contrast (WCAG AA)
- [ ] Touch target sizes (44x44px)
- [ ] Skip links
- [ ] ARIA attributes

---

## Phase 8: Mobile Optimization (Week 6)

### Responsive Design
- [ ] Mobile-first approach
- [ ] Breakpoints: sm (640px), md (768px), lg (1024px)
- [ ] Stack layouts on mobile
- [ ] Touch-friendly buttons
- [ ] Swipe gestures (optional)
- [ ] Bottom sheet modals on mobile
- [ ] Sticky headers/footers

### Mobile-Specific Features
- [ ] Simplified navigation
- [ ] Reduced text on small screens
- [ ] Larger tap targets
- [ ] Optimized images
- [ ] Fast loading
- [ ] Offline support (future)

---

## Phase 9: Testing (Week 6-7)

### Unit Tests
- [ ] Test recommendation algorithm
- [ ] Test intent matching logic
- [ ] Test framework metadata loading
- [ ] Test user preference mutations
- [ ] Test state management

### Integration Tests
- [ ] Test onboarding flow end-to-end
- [ ] Test framework selection → session creation
- [ ] Test returning user experience
- [ ] Test navigation between steps
- [ ] Test error handling

### User Testing
- [ ] Test with 5-10 real users
- [ ] First-time user flow
- [ ] Returning user flow
- [ ] Framework discovery
- [ ] Mobile experience
- [ ] Accessibility testing

### A/B Testing (Optional)
- [ ] Quick Start vs. Explore default
- [ ] Recommendation acceptance rate
- [ ] Intent question variations
- [ ] Framework card designs
- [ ] CTA button copy

---

## Phase 10: Analytics & Monitoring (Week 7)

### Event Tracking
- [ ] Track onboarding starts
- [ ] Track onboarding completions
- [ ] Track drop-off points
- [ ] Track framework selections
- [ ] Track recommendation acceptance
- [ ] Track time to first session
- [ ] Track framework switching

### Metrics Dashboard
- [ ] Onboarding completion rate
- [ ] Most popular frameworks
- [ ] Intent → Framework match accuracy
- [ ] User satisfaction scores
- [ ] Session completion by framework
- [ ] Framework diversity per user

---

## Phase 11: Documentation (Week 7-8)

### User Documentation
- [ ] Framework guides (one per framework)
- [ ] FAQ section
- [ ] Video tutorials (optional)
- [ ] Help center articles
- [ ] Onboarding tips

### Developer Documentation
- [ ] Component API docs
- [ ] State management guide
- [ ] Framework metadata schema
- [ ] Recommendation algorithm docs
- [ ] Testing guide
- [ ] Deployment guide

---

## Phase 12: Deployment (Week 8)

### Pre-Deployment
- [ ] Code review
- [ ] Performance testing
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Browser compatibility testing
- [ ] Mobile device testing

### Deployment Steps
- [ ] Deploy to staging
- [ ] Smoke testing
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Collect user feedback

### Post-Deployment
- [ ] Monitor analytics
- [ ] Gather user feedback
- [ ] Iterate on issues
- [ ] Plan improvements
- [ ] Document learnings

---

## Future Enhancements (Post-MVP)

### V2 Features
- [ ] AI-powered recommendations (ML-based)
- [ ] Framework blending
- [ ] Custom frameworks
- [ ] Guided framework tours
- [ ] Framework insights dashboard
- [ ] Social proof ("X users chose this")
- [ ] Quick preview videos
- [ ] Framework playlists

### Advanced Features
- [ ] Adaptive onboarding (personalized)
- [ ] Voice-guided onboarding
- [ ] Interactive framework quizzes
- [ ] Progress tracking across frameworks
- [ ] Community insights
- [ ] Gamification elements
- [ ] Achievement badges

---

## Success Criteria

### User Experience
- ✅ 80%+ onboarding completion rate
- ✅ 70%+ recommendation acceptance rate
- ✅ < 3 minutes to first session
- ✅ 4.5+ star user satisfaction rating
- ✅ < 5% support queries about framework selection

### Technical
- ✅ < 2s page load time
- ✅ 95+ Lighthouse accessibility score
- ✅ Zero critical bugs
- ✅ Mobile-optimized (responsive)
- ✅ Cross-browser compatible

### Business
- ✅ Increased session starts
- ✅ Higher framework diversity
- ✅ Improved user retention
- ✅ Positive user feedback
- ✅ Reduced onboarding friction

---

## Risk Mitigation

### Potential Risks
1. **Complexity Overload**: Too many options overwhelm users
   - Mitigation: Start with Quick Start as default
   
2. **Poor Recommendations**: Algorithm doesn't match well
   - Mitigation: Allow easy framework switching
   
3. **Long Onboarding**: Users drop off before starting
   - Mitigation: Keep to 2-3 clicks maximum
   
4. **Mobile Issues**: Poor mobile experience
   - Mitigation: Mobile-first design approach
   
5. **Framework Confusion**: Users don't understand differences
   - Mitigation: Clear, simple explanations

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1. Core Components | 2 weeks | All UI components built |
| 2. Routing | 1 week | Navigation working |
| 3. State Management | 1 week | State persisted |
| 4. Integration | 1 week | Session creation updated |
| 5. Recommendation | 1 week | Algorithm implemented |
| 6. Smart Features | 1 week | History & recommendations |
| 7. Polish | 1 week | Animations & UX |
| 8. Mobile | 1 week | Mobile-optimized |
| 9. Testing | 1 week | All tests passing |
| 10. Analytics | 1 week | Tracking implemented |
| 11. Documentation | 1 week | Docs complete |
| 12. Deployment | 1 week | Live in production |

**Total: ~12 weeks (3 months)**

---

## Quick Start (Minimum Viable Onboarding)

If you need to ship faster, here's the absolute minimum:

### Week 1-2: MVP
- [ ] Simple framework selector on dashboard
- [ ] Framework cards with basic info
- [ ] Direct session creation with framework
- [ ] Skip full onboarding flow

### Week 3-4: Enhanced
- [ ] Add welcome screen for first-time users
- [ ] Add framework gallery
- [ ] Add framework details modal
- [ ] Basic recommendation (default to GROW)

This gets you 80% of the value with 20% of the effort!
