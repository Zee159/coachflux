# CoachFlux Onboarding Flow - Visual Diagrams

## Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER ENTRY POINTS                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐              ┌──────▼──────┐
            │  First-Time    │              │  Returning  │
            │  Anonymous     │              │  Registered │
            └───────┬────────┘              └──────┬──────┘
                    │                              │
                    │                              │
┌───────────────────▼──────────────────┐          │
│  CONVERSATIONAL VOID LANDING PAGE    │          │
│  ┌────────────────────────────────┐  │          │
│  │                                │  │          │
│  │                                │  │          │
│  │        [Blinking cursor]       │  │          │
│  │                                │  │          │
│  │  What's on your mind today?    │  │          │
│  │                                │  │          │
│  │  User types their need...      │  │          │
│  │  AI analyzes intent            │  │          │
│  │                                │  │          │
│  │  Fallback: [Browse frameworks] │  │          │
│  └────────────────────────────────┘  │          │
└───────────────────┬──────────────────┘          │
                    │                              │
                    │                              │
                    │                    ┌─────────▼─────────┐
                    │                    │   USER DASHBOARD  │
                    │                    │                   │
                    │                    │ • Recent sessions │
                    │                    │ • Quick start     │
                    │                    │ • Framework picker│
                    │                    └─────────┬─────────┘
                    │                              │
                    │                              │
┌───────────────────▼──────────────────────────────▼─────────┐
│              FRAMEWORK RECOMMENDATION                       │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ AI-Powered   │  │   Gallery    │  │   Recent     │    │
│  │ (Void Input) │  │  (Browse)    │  │  (Dashboard) │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │            │
│         └─────────────────┴──────────────────┘            │
│                           │                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ✨ Based on what you shared:                       │  │
│  │                                                     │  │
│  │  🎯 GROW Framework                                  │  │
│  │  Perfect for [your specific need]                  │  │
│  │                                                     │  │
│  │  ⏱️ 15-25 minutes • 🔒 Private • No signup needed  │  │
│  │                                                     │  │
│  │  [Start Your Session →]                            │  │
│  │  [View Other Frameworks]                           │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────┼───────────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  START SESSION  │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  COACHING       │
                   │   SESSION       │
                   │  (Framework)    │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  SESSION        │
                   │   REPORT        │
                   └────────┬────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
      ┌───────▼────────┐          ┌──────▼──────┐
      │  ANONYMOUS     │          │  REGISTERED │
      │  USER PATH     │          │  USER PATH  │
      └───────┬────────┘          └──────┬──────┘
              │                          │
      ┌───────▼────────┐                 │
      │  EMAIL REPORT  │                 │
      │  & NEWSLETTER  │                 │
      │  SIGNUP        │                 │
      │                │                 │
      │  [Email input] │                 │
      │  ☑ Newsletter  │                 │
      │  🎁 WELCOME50  │                 │
      └───────┬────────┘                 │
              │                          │
      ┌───────▼────────┐                 │
      │  UPGRADE       │                 │
      │  PROMPT        │                 │
      │                │                 │
      │  "Save your    │                 │
      │   sessions?"   │                 │
      │                │                 │
      │  [Create       │                 │
      │   Account]     │                 │
      └───────┬────────┘                 │
              │                          │
              └──────────┬───────────────┘
                         │
                ┌────────▼────────┐
                │   DASHBOARD     │
                │  (Next Steps)   │
                │                 │
                │ • Session       │
                │   history       │
                │ • Action items  │
                │ • New session   │
                └─────────────────┘
```

---

## Quick Start Path (Detailed)

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: WELCOME                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Welcome to CoachFlux! 👋                             │  │
│  │                                                       │  │
│  │  Your AI coaching companion                           │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  🚀 Quick Start (Recommended)                   │ │  │
│  │  │  We'll help you find the right approach         │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  [ Skip to Dashboard ]                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: INTENT - PRIMARY FOCUS                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  What would you like to work on?                     │  │
│  │                                                       │  │
│  │  ○ A specific goal I want to achieve                 │  │
│  │  ○ Understanding my current situation                │  │
│  │  ○ Making a decision between options                 │  │
│  │  ○ Navigating a complex challenge                    │  │
│  │  ○ Building a skill or habit                         │  │
│  │  ○ Managing stakeholders or relationships            │  │
│  │  ○ I'm not sure yet                                  │  │
│  │                                                       │  │
│  │  [● ○ ○]  Progress                   [ Continue → ]  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: INTENT - CONTEXT (Optional)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  This is related to:                                  │  │
│  │                                                       │  │
│  │  ○ Personal life & relationships                      │  │
│  │  ○ Career & professional growth                       │  │
│  │  ○ Leadership & team management                       │  │
│  │  ○ Business & strategy                                │  │
│  │  ○ Health & wellbeing                                 │  │
│  │  ○ Learning & development                             │  │
│  │                                                       │  │
│  │  [● ● ○]  Progress    [ ← Back ]    [ Continue → ]   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: RECOMMENDATION                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ✨ Based on your needs, we recommend:               │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  🎯 GROW Framework                              │ │  │
│  │  │                                                 │ │  │
│  │  │  Perfect for setting and achieving specific    │ │  │
│  │  │  goals through structured reflection.          │ │  │
│  │  │                                                 │ │  │
│  │  │  You'll explore:                                │ │  │
│  │  │  • Your Goal                                    │ │  │
│  │  │  • Current Reality                              │ │  │
│  │  │  • Available Options                            │ │  │
│  │  │  • Action Plan (Will)                           │ │  │
│  │  │                                                 │ │  │
│  │  │  ⏱️ Typical session: 15-25 minutes              │ │  │
│  │  │  📊 Difficulty: Beginner-friendly               │ │  │
│  │  │                                                 │ │  │
│  │  │  [ Start GROW Session → ]                       │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  Not quite right?                                     │  │
│  │  [ ← Back ]  [ View All Frameworks ]                 │  │
│  │                                                       │  │
│  │  [● ● ●]  Complete                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    [ START SESSION ]
```

---

## Explore Frameworks Path (Detailed)

```
┌─────────────────────────────────────────────────────────────┐
│  FRAMEWORK GALLERY                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Choose Your Coaching Framework                       │  │
│  │                                                       │  │
│  │  🔍 Search frameworks...                              │  │
│  │  [ All ] [ Beginner ] [ Advanced ] [ Specialist ]     │  │
│  │                                                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ 🎯 GROW    │  │ 🧭 COMPASS │  │ ✨ CLEAR   │     │  │
│  │  │            │  │            │  │            │     │  │
│  │  │ Goal-      │  │ Multi-     │  │ Structured │     │  │
│  │  │ focused    │  │ perspective│  │ clarity    │     │  │
│  │  │ action     │  │ decision   │  │ building   │     │  │
│  │  │ planning   │  │ making     │  │            │     │  │
│  │  │            │  │            │  │            │     │  │
│  │  │ 🟢 Popular │  │ 🔵 Advanced│  │ 🟡 Focused │     │  │
│  │  │ ⏱️ 15-25m  │  │ ⏱️ 25-35m  │  │ ⏱️ 20-30m  │     │  │
│  │  │            │  │            │  │            │     │  │
│  │  │ [Details]  │  │ [Details]  │  │ [Details]  │     │  │
│  │  │ [Start →]  │  │ [Start →]  │  │ [Start →]  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ 🔲 Power-  │  │ 🛡️ Psych   │  │ + More     │     │  │
│  │  │ Interest   │  │ Safety     │  │ Coming     │     │  │
│  │  │            │  │            │  │ Soon       │     │  │
│  │  │ Stakeholder│  │ Team       │  │            │     │  │
│  │  │ mapping    │  │ culture    │  │            │     │  │
│  │  │            │  │            │  │            │     │  │
│  │  │ 🟣 Special │  │ 🟣 Special │  │            │     │  │
│  │  │ ⏱️ 15-20m  │  │ ⏱️ 20-30m  │  │            │     │  │
│  │  │            │  │            │  │            │     │  │
│  │  │ [Details]  │  │ [Details]  │  │            │     │  │
│  │  │ [Start →]  │  │ [Start →]  │  │            │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │                                                       │  │
│  │  [ Compare Frameworks ] [ Need Help Choosing? ]      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ (Click Details)
┌─────────────────────────────────────────────────────────────┐
│  FRAMEWORK DETAILS MODAL                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🎯 GROW Framework                                    │  │
│  │  ─────────────────────────────────────────────────    │  │
│  │                                                       │  │
│  │  **What it's for:**                                   │  │
│  │  Setting and achieving specific goals through        │  │
│  │  structured reflection and action planning.          │  │
│  │                                                       │  │
│  │  **Best for:**                                        │  │
│  │  • Career goals                                       │  │
│  │  • Personal development                               │  │
│  │  • Skill building                                     │  │
│  │  • Performance improvement                            │  │
│  │                                                       │  │
│  │  **The Process:**                                     │  │
│  │  1. Goal - Define what you want to achieve           │  │
│  │  2. Reality - Assess your current situation          │  │
│  │  3. Options - Explore possible paths forward         │  │
│  │  4. Will - Commit to specific actions                │  │
│  │  5. Review - Reflect on insights                     │  │
│  │                                                       │  │
│  │  ⏱️ Time: 15-25 minutes                               │  │
│  │  📊 Difficulty: Beginner-friendly                     │  │
│  │  🎯 Focus: Action-oriented                            │  │
│  │  ⭐ Used by 10,234 users                              │  │
│  │                                                       │  │
│  │  [ Start GROW Session → ]                             │  │
│  │  [ ← Back to Gallery ]                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    [ START SESSION ]
```

---

## Returning User Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD - RETURNING USER                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Welcome back, Alex! 👋                               │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  🚀 Start New Session                           │ │  │
│  │  │                                                 │ │  │
│  │  │  Recently used: GROW Framework                  │ │  │
│  │  │  [ Continue with GROW → ]                       │ │  │
│  │  │  [ Choose Different Framework ]                 │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  📊 Recent Sessions                                   │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ Oct 19 • GROW • Career transition       [View]  │ │  │
│  │  │ Oct 15 • COMPASS • Team decision        [View]  │ │  │
│  │  │ Oct 12 • GROW • Skill development       [View]  │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  🎯 Suggested for you                                 │  │
│  │  Based on your recent sessions:                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ Try CLEAR Framework                             │ │  │
│  │  │ Great for gaining clarity on complex situations │ │  │
│  │  │ [ Learn More ] [ Start Session → ]              │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  📈 Your Progress                                     │  │
│  │  • 12 sessions completed                              │  │
│  │  • 3 frameworks explored                              │  │
│  │  • 45 action items created                            │  │
│  │                                                       │  │
│  │  [ View All Frameworks ] [ Settings ]                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Decision Tree: Framework Recommendation Logic

```
User Intent: "What would you like to work on?"
│
├─ "A specific goal I want to achieve"
│  └─ Context?
│     ├─ Personal/Career → GROW (Primary)
│     ├─ Leadership → GROW or CLEAR
│     └─ Business → GROW or COMPASS
│
├─ "Understanding my current situation"
│  └─ Context?
│     ├─ Personal → GROW (Reality focus)
│     ├─ Career → CLEAR (Clarity)
│     └─ Leadership → CLEAR or Psych Safety
│
├─ "Making a decision between options"
│  └─ Context?
│     ├─ Personal → GROW (Options step)
│     ├─ Career → COMPASS (Multiple perspectives)
│     └─ Business → COMPASS (Strategic)
│
├─ "Navigating a complex challenge"
│  └─ Context?
│     ├─ Personal → CLEAR (Structured)
│     ├─ Leadership → COMPASS or CLEAR
│     └─ Stakeholders → Power-Interest Grid
│
├─ "Building a skill or habit"
│  └─ GROW (Action-oriented)
│
├─ "Managing stakeholders or relationships"
│  └─ Context?
│     ├─ Leadership → Power-Interest Grid
│     ├─ Team → Psychological Safety
│     └─ Personal → GROW
│
└─ "I'm not sure yet"
   └─ GROW (Most versatile, beginner-friendly)
```

---

## Mobile Onboarding Flow

```
┌──────────────────┐
│   MOBILE VIEW    │
│                  │
│  ┌────────────┐  │
│  │  Welcome!  │  │
│  │     👋     │  │
│  │            │  │
│  │  CoachFlux │  │
│  │            │  │
│  │ ┌────────┐ │  │
│  │ │🚀 Quick│ │  │
│  │ │ Start  │ │  │
│  │ └────────┘ │  │
│  │            │  │
│  │ ┌────────┐ │  │
│  │ │🧭Explore│ │  │
│  │ └────────┘ │  │
│  │            │  │
│  │  [Skip]    │  │
│  └────────────┘  │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  INTENT CAPTURE  │
│                  │
│  ┌────────────┐  │
│  │What's your │  │
│  │  focus?    │  │
│  │            │  │
│  │ ○ Goal     │  │
│  │ ○ Situation│  │
│  │ ○ Decision │  │
│  │ ○ Challenge│  │
│  │ ○ Skill    │  │
│  │ ○ Relations│  │
│  │            │  │
│  │ [● ○ ○]    │  │
│  │            │  │
│  │ [Continue] │  │
│  └────────────┘  │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  RECOMMENDATION  │
│                  │
│  ┌────────────┐  │
│  │We suggest: │  │
│  │            │  │
│  │ 🎯 GROW    │  │
│  │            │  │
│  │ Goal-      │  │
│  │ focused    │  │
│  │ coaching   │  │
│  │            │  │
│  │ ⏱️ 15-25m  │  │
│  │ ⭐ Beginner│  │
│  │            │  │
│  │ [Start →]  │  │
│  │            │  │
│  │ [View All] │  │
│  └────────────┘  │
└──────────────────┘
```

---

## Framework Comparison View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPARE FRAMEWORKS                                                         │
│                                                                             │
│  Feature          │  GROW      │  CLEAR     │  COMPASS   │  Power-Interest │
│  ────────────────────────────────────────────────────────────────────────  │
│  Best For         │  Goals     │  Clarity   │  Decisions │  Stakeholders   │
│  Time             │  15-25 min │  20-30 min │  25-35 min │  15-20 min      │
│  Difficulty       │  ⭐         │  ⭐⭐       │  ⭐⭐⭐     │  ⭐⭐            │
│  Focus            │  Action    │  Structure │  Perspective│  Mapping       │
│  Steps            │  5         │  5         │  6         │  4              │
│  Output           │  Plan      │  Clarity   │  Framework │  Map            │
│  Popularity       │  🟢 High   │  🟡 Medium │  🔵 Medium │  🟣 Specialist  │
│                                                                             │
│  [ Select GROW ] [ Select CLEAR ] [ Select COMPASS ] [ Select P-I Grid ]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Animation & Transition Notes

### **Welcome Screen**
- Fade in from center
- Stagger button appearance (Quick Start → Explore → Skip)
- Subtle pulse on "Quick Start" (recommended)

### **Intent Capture**
- Slide in from right
- Progress dots animate on selection
- Smooth transition between questions

### **Framework Recommendation**
- Card slides up from bottom
- Sparkle animation on "Based on your needs"
- Framework card has subtle glow

### **Framework Gallery**
- Grid fades in with stagger effect
- Cards lift on hover (desktop)
- Cards expand smoothly on tap (mobile)

### **Session Start**
- Smooth transition to session view
- Progress bar animates from 0%
- First message fades in

---

## Accessibility Considerations

### **Keyboard Navigation**
- Tab through all interactive elements
- Enter/Space to select
- Escape to go back
- Arrow keys for radio buttons

### **Screen Readers**
- Clear ARIA labels on all buttons
- Announce progress through flow
- Describe framework cards fully
- Announce recommendations

### **Visual**
- High contrast mode support
- Large touch targets (44x44px minimum)
- Clear focus indicators
- Readable font sizes (16px minimum)

### **Cognitive**
- Simple language
- One question at a time
- Clear progress indicators
- Easy way to go back
- No time pressure
