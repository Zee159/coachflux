# CoachFlux Onboarding Flow - Modular Framework Plan

## Overview
When CoachFlux modularizes to support multiple coaching frameworks (GROW, CLEAR, COMPASS, etc.), the onboarding process needs to guide users to the right framework for their specific needs while maintaining simplicity and clarity.

---

## 🎯 Onboarding Goals

1. **Quick Start**: Get users into a session within 2-3 clicks
2. **Framework Discovery**: Help users understand which framework suits their needs
3. **Progressive Disclosure**: Don't overwhelm with all options upfront
4. **Flexibility**: Allow both guided and direct framework selection
5. **Education**: Brief users on what each framework does without jargon

---

## 📋 Proposed Onboarding Flow

### **Option A: Conversational Void (Primary - Anonymous Users)**

```
Conversational Void Landing Page
    ↓
User types their need (AI analyzes)
    ↓
Framework Recommendation
    ↓
Start Session
    ↓
Session Report
    ↓
Email Report & Newsletter Signup
    ↓
Upgrade Prompt
    ↓
Create Account → Dashboard
```

### **Option B: Dashboard Entry (Returning Registered Users)**

```
Dashboard
    ↓
Quick Start (Last Framework) OR Choose Framework
    ↓
Start Session
    ↓
Session Report
    ↓
Dashboard (with history & action items)
```

### **Option C: Browse Frameworks (Fallback)**

```
Conversational Void Landing Page
    ↓
User clicks "Browse Frameworks" (fallback)
    ↓
Framework Gallery/Grid
    ↓
Framework Details (on hover/click)
    ↓
Start Session
```

**Note:** The Conversational Void is the revolutionary primary entry point that replaces traditional welcome screens. See `LANDING_PAGE_CONVERSATIONAL_VOID.md` for full details.

---

## 🎨 Detailed Flow Design

### **Step 1: Conversational Void Landing Page**
**Primary entry point for anonymous users**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│              [Blinking cursor]                  │
│                                                 │
│         What's on your mind today?              │
│                                                 │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**User Experience:**
- Pure blank canvas (80% whitespace)
- Blinking cursor invites typing
- Prompt appears after 2-3 seconds
- AI analyzes input in real-time
- Contextual hints as user types
- Fallback: "Browse frameworks" link appears after 10 seconds

**Key Features:**
- Zero friction - no decisions to make
- Immediate engagement
- Pattern interrupt (unexpected)
- Creates psychological ownership
- See `LANDING_PAGE_CONVERSATIONAL_VOID.md` for full implementation

---

### **Step 2A: Quick Start - Intent Capture**

**Question 1: What's your focus today?**

```
┌─────────────────────────────────────────────────┐
│  What would you like to work on?               │
│                                                 │
│  ○ A specific goal I want to achieve           │
│  ○ Understanding my current situation           │
│  ○ Making a decision between options            │
│  ○ Navigating a complex challenge               │
│  ○ Building a skill or habit                    │
│  ○ Managing stakeholders or relationships       │
│  ○ I'm not sure yet                             │
│                                                 │
│              [ Continue → ]                     │
└─────────────────────────────────────────────────┘
```

**Question 2: What's the context?** (Optional refinement)

```
┌─────────────────────────────────────────────────┐
│  This is related to:                            │
│                                                 │
│  ○ Personal life & relationships                │
│  ○ Career & professional growth                 │
│  ○ Leadership & team management                 │
│  ○ Business & strategy                          │
│  ○ Health & wellbeing                           │
│  ○ Learning & development                       │
│                                                 │
│              [ Continue → ]                     │
└─────────────────────────────────────────────────┘
```

**Matching Logic:**

| User Intent | Recommended Framework | Reason |
|-------------|----------------------|---------|
| Specific goal | **GROW** | Goal-oriented, action-focused |
| Current situation | **GROW** or **CLEAR** | Reality assessment |
| Decision-making | **COMPASS** | Multiple perspectives |
| Complex challenge | **CLEAR** | Structured problem-solving |
| Skill building | **GROW** | Incremental progress |
| Stakeholders | **Power-Interest Grid** | Relationship mapping |
| Not sure | **GROW** (default) | Most versatile |

---

### **Step 3: Framework Recommendation**

```
┌─────────────────────────────────────────────────┐
│  Based on your needs, we recommend:             │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  🎯 GROW Framework                        │ │
│  │                                           │ │
│  │  Perfect for setting and achieving        │ │
│  │  specific goals through structured        │ │
│  │  reflection.                              │ │
│  │                                           │ │
│  │  You'll explore:                          │ │
│  │  • Your Goal                              │ │
│  │  • Current Reality                        │ │
│  │  • Available Options                      │ │
│  │  • Action Plan (Will)                     │ │
│  │                                           │ │
│  │  ⏱️ Typical session: 15-25 minutes        │ │
│  │                                           │ │
│  │     [ Start GROW Session → ]              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Not quite right?                               │
│  [ ← Back ] [ View All Frameworks ]             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### **Step 2B: Framework Gallery (Explore Path)**

```
┌─────────────────────────────────────────────────────────────┐
│  Choose Your Coaching Framework                             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 🎯 GROW      │  │ 🧭 COMPASS   │  │ ✨ CLEAR     │     │
│  │              │  │              │  │              │     │
│  │ Goal-focused │  │ Multi-       │  │ Structured   │     │
│  │ action       │  │ perspective  │  │ clarity      │     │
│  │ planning     │  │ decision     │  │ building     │     │
│  │              │  │ making       │  │              │     │
│  │ 🟢 Popular   │  │ 🔵 Advanced  │  │ 🟡 Focused   │     │
│  │              │  │              │  │              │     │
│  │ [Start →]    │  │ [Start →]    │  │ [Start →]    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 🔲 Power-    │  │ 🛡️ Psych     │  │ + More       │     │
│  │ Interest     │  │ Safety       │  │ Coming       │     │
│  │              │  │              │  │              │     │
│  │ Stakeholder  │  │ Team culture │  │ Soon         │     │
│  │ mapping      │  │ & trust      │  │              │     │
│  │              │  │              │  │              │     │
│  │ 🟣 Specialist│  │ 🟣 Specialist│  │              │     │
│  │              │  │              │  │              │     │
│  │ [Start →]    │  │ [Start →]    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  [ ← Back to Quick Start ]                                 │
└─────────────────────────────────────────────────────────────┘
```

**On Hover/Click - Expanded Card:**

```
┌─────────────────────────────────────────────────┐
│  🎯 GROW Framework                              │
│  ─────────────────────────────────────────────  │
│                                                 │
│  **What it's for:**                             │
│  Setting and achieving specific goals through   │
│  structured reflection and action planning.     │
│                                                 │
│  **Best for:**                                  │
│  • Career goals                                 │
│  • Personal development                         │
│  • Skill building                               │
│  • Performance improvement                      │
│                                                 │
│  **The Process:**                               │
│  1. Goal - Define what you want to achieve      │
│  2. Reality - Assess your current situation     │
│  3. Options - Explore possible paths forward    │
│  4. Will - Commit to specific actions           │
│  5. Review - Reflect on insights                │
│                                                 │
│  ⏱️ Time: 15-25 minutes                         │
│  📊 Difficulty: Beginner-friendly               │
│  🎯 Focus: Action-oriented                      │
│                                                 │
│  [ Start GROW Session → ]                       │
│  [ Learn More ]                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎓 Framework Comparison Matrix

**For "Learn More" or Help Section:**

| Framework | Best For | Time | Complexity | Output |
|-----------|----------|------|------------|--------|
| **GROW** | Goal achievement, personal development | 15-25 min | ⭐ Beginner | Action plan |
| **CLEAR** | Problem clarity, structured thinking | 20-30 min | ⭐⭐ Intermediate | Clear understanding |
| **COMPASS** | Complex decisions, multiple perspectives | 25-35 min | ⭐⭐⭐ Advanced | Decision framework |
| **Power-Interest Grid** | Stakeholder management, influence mapping | 15-20 min | ⭐⭐ Intermediate | Stakeholder map |
| **Psychological Safety** | Team culture, trust building | 20-30 min | ⭐⭐ Intermediate | Culture assessment |

---

## 🔄 Returning User Experience

### **Dashboard View (Post-Onboarding)**

```
┌─────────────────────────────────────────────────┐
│  Welcome back, [Name]! 👋                       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  🚀 Start New Session                   │   │
│  │                                         │   │
│  │  Recently used: GROW Framework          │   │
│  │  [ Continue with GROW ]                 │   │
│  │  [ Choose Different Framework ]         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📊 Recent Sessions                             │
│  ┌─────────────────────────────────────────┐   │
│  │ Oct 19 • GROW • Career transition       │   │
│  │ Oct 15 • COMPASS • Team decision        │   │
│  │ Oct 12 • GROW • Skill development       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🎯 Suggested for you                           │
│  Based on your recent sessions:                 │
│  [ Try CLEAR Framework → ]                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Smart Features:**
- Remember last used framework
- Quick restart with same framework
- Suggest complementary frameworks
- Show session history
- Track progress over time

---

## 💾 Data Model Changes

### **User Preferences Schema**

```typescript
interface UserPreferences {
  userId: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: number;
  preferredFramework?: FrameworkType;
  frameworkHistory: {
    framework: FrameworkType;
    usageCount: number;
    lastUsed: number;
  }[];
  intents?: {
    primaryFocus: string[];
    contexts: string[];
  };
  skipQuickStart: boolean; // User preference to skip intent questions
}
```

### **Framework Metadata Schema**

```typescript
interface FrameworkMetadata {
  id: FrameworkType;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  bestFor: string[];
  steps: {
    name: string;
    description: string;
  }[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'general' | 'specialist';
  tags: string[];
  isAvailable: boolean;
  comingSoon?: boolean;
}
```

---

## 🎨 UI Components Needed

### **New Components**

1. **`OnboardingWelcome.tsx`**
   - Welcome screen with Quick Start vs. Explore
   - First-time user detection
   - Preference saving

2. **`IntentCapture.tsx`**
   - Multi-step question flow
   - Intent matching logic
   - Progress indicator

3. **`FrameworkRecommendation.tsx`**
   - Recommended framework display
   - Framework preview
   - Alternative options

4. **`FrameworkGallery.tsx`**
   - Grid/card layout of all frameworks
   - Hover states with details
   - Filter/search functionality

5. **`FrameworkCard.tsx`**
   - Individual framework display
   - Expandable details
   - Start session CTA

6. **`FrameworkComparison.tsx`**
   - Side-by-side comparison
   - Feature matrix
   - Help users decide

### **Updated Components**

1. **`Dashboard.tsx`**
   - Add framework selection before session creation
   - Show framework history
   - Smart recommendations

2. **`DemoSetup.tsx`**
   - Remove hardcoded GROW framework
   - Add framework parameter
   - Support multiple frameworks

---

## 🔀 User Flow Variations

### **Variation 1: Expert User**
```
Dashboard → Framework Gallery → Direct Selection → Session
```

### **Variation 2: Returning User (Same Framework)**
```
Dashboard → "Continue with GROW" → Session
```

### **Variation 3: Returning User (Different Framework)**
```
Dashboard → "Choose Different" → Gallery → Selection → Session
```

### **Variation 4: First-Time User (Guided)**
```
Welcome → Quick Start → Intent → Recommendation → Session
```

### **Variation 5: First-Time User (Explorer)**
```
Welcome → Explore → Gallery → Selection → Session
```

---

## 📊 Metrics to Track

### **Onboarding Metrics**
- Completion rate of onboarding flow
- Quick Start vs. Explore selection ratio
- Time to first session
- Framework recommendation acceptance rate
- Drop-off points in flow

### **Framework Usage Metrics**
- Framework popularity (usage count)
- Framework switching patterns
- Session completion rate by framework
- User satisfaction by framework
- Time spent per framework

### **User Behavior Metrics**
- Repeat framework usage
- Framework diversity per user
- Intent → Framework match accuracy
- Return user framework preferences

---

## 🚀 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
- [ ] Create framework metadata system
- [ ] Build user preferences schema
- [ ] Implement framework selection in session creation
- [ ] Update Dashboard with framework chooser

### **Phase 2: Onboarding Flow (Week 3-4)**
- [ ] Build OnboardingWelcome component
- [ ] Implement IntentCapture flow
- [ ] Create FrameworkRecommendation logic
- [ ] Build FrameworkGallery component
- [ ] Add first-time user detection

### **Phase 3: Smart Features (Week 5-6)**
- [ ] Implement framework history tracking
- [ ] Add smart recommendations
- [ ] Build comparison matrix
- [ ] Create framework switching flow
- [ ] Add analytics tracking

### **Phase 4: Polish & Testing (Week 7-8)**
- [ ] User testing with real users
- [ ] A/B test Quick Start vs. Explore
- [ ] Optimize recommendation algorithm
- [ ] Add animations and transitions
- [ ] Mobile optimization
- [ ] Documentation

---

## 🎯 Success Criteria

### **User Experience**
- ✅ First session started within 3 minutes
- ✅ 80%+ onboarding completion rate
- ✅ 70%+ framework recommendation acceptance
- ✅ Clear understanding of framework differences
- ✅ Easy framework switching

### **Technical**
- ✅ Framework metadata easily extensible
- ✅ User preferences persist across sessions
- ✅ Recommendation logic is data-driven
- ✅ Mobile-optimized flow
- ✅ Accessible (WCAG 2.1 AA)

### **Business**
- ✅ Increased session starts
- ✅ Higher framework diversity usage
- ✅ Improved user retention
- ✅ Positive user feedback
- ✅ Reduced support queries about framework selection

---

## 💡 Future Enhancements

### **V2 Features**
1. **AI-Powered Recommendations**: Use session history and outcomes to improve suggestions
2. **Framework Blending**: Combine elements from multiple frameworks
3. **Custom Frameworks**: Allow users to create their own coaching flows
4. **Guided Tours**: Interactive tutorials for each framework
5. **Framework Insights**: Show users their patterns and growth
6. **Social Proof**: "Users like you often choose..."
7. **Quick Previews**: 2-minute framework demos
8. **Framework Playlists**: Curated sequences for specific goals

### **Advanced Features**
- **Adaptive Onboarding**: Personalize based on user behavior
- **Voice-First Onboarding**: Voice-guided framework selection
- **Framework Quizzes**: Interactive way to find best fit
- **Progress Tracking**: Show growth across frameworks
- **Community Insights**: Aggregate anonymized success patterns

---

## 📝 Copy & Messaging Guidelines

### **Tone**
- Warm and encouraging
- Clear and jargon-free
- Action-oriented
- Supportive, not prescriptive

### **Key Messages**
- "We'll help you find the right approach"
- "No wrong choices - you can always switch"
- "Start simple, explore when ready"
- "Your coaching, your way"

### **Avoid**
- Overwhelming with too many options upfront
- Technical coaching terminology
- Judgment about framework choices
- Forcing a specific path

---

## 🔗 Related Documents
- `FRAMEWORK_MODULISATION_STRATEGY.md` - Technical implementation
- `FRAMEWORK_IMPLEMENTATION_GUIDE.md` - Framework details
- `COACHFLUX_MVP_GUIDE.md` - Current MVP state
- `MOBILE_OPTIMIZATION.md` - Mobile UX considerations
