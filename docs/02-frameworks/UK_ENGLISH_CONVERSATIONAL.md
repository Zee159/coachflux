# UK English & Conversational Style Implementation

## ✅ Changes Applied

Your CoachFlux MVP now uses **UK English spelling** throughout and delivers coaching in a **warm, conversational style**.

---

## 🇬🇧 UK English Spelling

### What Changed

**System-wide spelling updates:**
- ❌ American: "organization", "behavior", "judgment", "realize"
- ✅ British: "organisation", "behaviour", "judgement", "realise"

**Files Updated:**
1. **`convex/prompts.ts`** - All prompts use UK English
2. **`convex/coach.ts`** - Schema descriptions updated (e.g., "Summarise" not "Summarize", "judgement" not "judgment")

### Explicit Instructions Added

Added to system prompts:
```
- Use UK English spelling throughout (e.g., realise, organisation, behaviour, summarise)
```

This ensures Claude Sonnet 4 consistently uses British spelling in all responses.

---

## 💬 Conversational Style

### New Field: `coach_reflection`

Added a **coach_reflection** field to every GROW step that provides warm, conversational coaching responses.

### Schema Changes

**All steps now include:**
```typescript
coach_reflection: { 
  type: "string", 
  minLength: 20, 
  maxLength: 300 
}
```

This field is **required** for all steps:
- ✅ Goal
- ✅ Reality
- ✅ Options
- ✅ Will
- ✅ Review

### Conversational Style Guidelines

Added to system prompts:
```
CONVERSATIONAL STYLE:
- Respond in a warm, supportive, and conversational tone
- Use natural, flowing language as if speaking with them
- Include reflective questions that invite deeper thinking
- Acknowledge their input with empathy and encouragement
- Be authentic and human, not robotic or formulaic
```

---

## 🎯 Coach Reflection Guidance (Per Step)

### Goal Step
**Tone:** Encouraging and curious
**Example:** "That's a meaningful goal. What would achieving this mean for you and your team?"

**Instructions:**
- Acknowledges what they've shared with genuine interest
- Reflects back their goal in an encouraging way
- Asks a thoughtful question to deepen their thinking

---

### Reality Step
**Tone:** Validating and exploratory
**Example:** "I hear you. That sounds challenging. What do you think is holding you back most right now?"

**Instructions:**
- Acknowledges the situation without judgement
- Validates the challenge they're facing
- Invites them to explore one aspect more deeply

---

### Options Step
**Tone:** Celebratory and empowering
**Example:** "Great thinking! You've got some solid options here. Which one feels most aligned with what you want to achieve?"

**Instructions:**
- Celebrates the options they've identified
- Highlights the breadth of possibilities
- Invites them to trust their judgement

---

### Will Step
**Tone:** Affirming and supportive
**Example:** "I can see you're committed to this. These actions feel achievable. What support do you need to make this happen?"

**Instructions:**
- Affirms their decision and commitment
- Acknowledges the specific actions they're taking
- Expresses confidence in their ability to follow through

---

### Review Step
**Tone:** Celebrating and confident
**Example:** "You've done great work here today. You're clear on your goals and ready to take action. I'm confident you'll make this happen!"

**Instructions:**
- Celebrates the journey they've taken
- Highlights their growth in clarity and commitment
- Expresses genuine confidence in their next steps

---

## 🎨 UI Changes

### Coach Reflection Display

The **coach_reflection** is now displayed prominently at the top of each reflection with special styling:

**Visual Design:**
- 💬 Speech bubble emoji for conversational feel
- **White background** with **indigo left border**
- **Italic text** for natural, flowing feel
- **Displayed first** before structured data
- **Larger font** for emphasis

**Example Display:**
```
┌────────────────────────────────────────────┐
│ 💬 That's a meaningful goal. What would    │
│    achieving this mean for you and your    │
│    team?                                   │
└────────────────────────────────────────────┘

GOAL
Finish building and realise CoachFlux for pilot

WHY NOW
To validate the MVP with early users

SUCCESS CRITERIA
• Complete all core features
• Test with 5 pilot users
• Gather feedback for iteration
```

---

## 📊 Before vs After

### Before (Raw JSON, American English)
```
GOAL
{
  "goal": "Explore what specific topic or outcome you want to focus on...",
  "why_now": "initial exploration to clarify direction and purpose for our coaching session",
  "success_criteria": [
    "identify a clear focus area for discussion",
    "Define what success looks like for this conversation"
  ],
  "timeframe": "this week"
}
```

### After (Conversational, UK English)
```
💬 That's a meaningful goal - completing your MVP. What would success look like 
   for you and your early users?

GOAL
Finish building and realise CoachFlux for pilot

WHY NOW
To validate with early users and gather feedback

SUCCESS CRITERIA
• Complete all core features
• Test with 5 pilot users
• Iterate based on feedback

HORIZON WEEKS
8
```

---

## 🔄 How It Works

### 1. User Input
User types their reflection (e.g., "I want to launch the MVP by end of month")

### 2. Claude Processing
Claude receives:
- **Coaching philosophy** (evidence-based, non-judgmental)
- **Step-specific guidance** (Goal phase: clarify and focus)
- **Conversational style instructions** (warm, supportive, human)
- **UK English requirement** (explicit spelling rules)
- **Coach reflection template** (what to include)

### 3. Response Generation
Claude generates:
- **Structured data** using user's exact words
- **Coach reflection** in conversational tone with UK spelling
- **Valid JSON** matching the schema

### 4. Display
UI shows:
1. **Coach reflection** first (prominent, conversational)
2. **Structured fields** below (clean, organised)

---

## ✨ Benefits

### For Users
- **More human experience** - feels like talking to a real coach
- **Deeper engagement** - reflective questions invite thinking
- **Clearer guidance** - conversational tone is easier to understand
- **Familiar language** - UK spelling matches their context

### For Organisations
- **Higher completion rates** - conversational style feels less formal
- **Better insights** - users open up more with warm tone
- **Cultural fit** - UK English for UK/Commonwealth users
- **Professional brand** - warm but professional tone

---

## 🧪 Test It

### Try These Inputs

**Goal Step:**
```
I want to improve team collaboration and reduce silos
```

**Expected Coach Reflection:**
```
💬 That's an important goal. What would better collaboration look like in practice 
   for your team?
```

---

**Reality Step:**
```
Teams work in separate bubbles, limited communication, duplicated work
```

**Expected Coach Reflection:**
```
💬 I can see how that's frustrating. What do you think is the main barrier to 
   communication right now?
```

---

**Options Step:**
```
1. Weekly cross-team meetings
2. Shared project tracker
3. Rotate team members quarterly
```

**Expected Coach Reflection:**
```
💬 You've identified some great options! Which of these feels most achievable 
   in the short term?
```

---

## 📝 Technical Details

### Files Modified

1. **`convex/prompts.ts`** (95 lines changed)
   - Added conversational style guidelines
   - Added coach reflection instructions per step
   - Updated to UK English spelling

2. **`convex/coach.ts`** (26 lines changed)
   - Added `coach_reflection` field to all 5 step schemas
   - Made it required for validation
   - Updated "Summarize" → "Summarise"

3. **`src/components/SessionView.tsx`** (35 lines changed)
   - Enhanced `formatReflectionDisplay()` function
   - Coach reflection displayed first with special styling
   - Better handling of nested objects and arrays

---

## 🎯 Key Principles

### Conversational ≠ Unprofessional
- Still evidence-based coaching methodology
- Still structured GROW framework
- Still validated for safety and schema
- **BUT** delivered in warm, human tone

### UK English Throughout
- All system prompts
- All schema descriptions
- All generated responses
- Consistent experience

### User's Words First
- Coach reflection supplements, doesn't replace
- Structured data still uses their exact words
- Conversational tone validates and explores
- Balance between structure and warmth

---

## 🚀 Result

Your CoachFlux MVP now delivers **professional, evidence-based coaching** in a **warm, conversational style** using **UK English spelling**. 

Users experience:
- 💬 Human-like coach responses
- 🇬🇧 Familiar UK spelling
- 🎯 Clear structured outcomes
- 💡 Thoughtful reflective questions
- ✨ Engaging, professional experience

---

**Your GROW coaching tool now feels like a real conversation with a supportive coach!** 🎯
