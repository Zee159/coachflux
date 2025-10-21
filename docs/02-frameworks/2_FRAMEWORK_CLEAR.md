# 🔍 CLEAR Framework: Implementation Guide

**CLEAR** = **C**ontracting → **L**istening → **E**xploring → **A**ction → **R**eview

**Duration:** 20 minutes | **Steps:** 5 | **Best for:** Complex situations, emotional processing, deep understanding

---

## Step 1: CONTRACTING (3 min)

**Objective:** Establish psychological safety and agree on what to explore.

**Coach:** "What would be most helpful to focus on in our time together?"

**Coach Questions:**
1. "What's on your mind?"
2. "Help me understand—is this about a situation, a relationship, or something about yourself?"
3. "On a scale of 1–10, how comfortable do you feel discussing this?"
4. "What would make this conversation successful?"
5. "Is there anything I should know before we explore?"

**Look For:**
- Clear topic
- Comfort level (should be 5+)
- Psychological safety established

**Coach Reflection:** "So you want to focus on X. You're comfortable at Y level. Success would be Z. Is that right?"

---

## Step 2: LISTENING (4 min)

**Objective:** Deeply hear and understand without interruption or solutions.

**Coach:** "Tell me more. I'm listening."

**Coach Questions:**
1. "Tell me more about that."
2. "What was that like for you?"
3. "I'm hearing [feeling]. Am I getting that right?"
4. "What happened next?"
5. "What matters most about this to you?"
6. "What's the hardest part?"

**Listen For:**
- Emotions beneath words
- What they emphasise repeatedly
- Their values/what matters to them
- Tone and energy

**Coach Reflection:** "What I'm hearing is X. It sounds like Y matters most. And it feels like Z. Am I getting it?"

---

## Step 3: EXPLORING (5 min)

**Objective:** Dig into dynamics, assumptions, and patterns beneath the surface.

**Coach Questions:**
1. "What do you think is really going on here?"
2. "Have you noticed a pattern? When does this happen?"
3. "What have you already tried?"
4. "What's your part in this? (Not blame—genuine curiosity)"
5. "What are you assuming about the other person? Is that based on something concrete?"
6. "If you were in their shoes, what might they be experiencing?"

**Uncover:**
- Root causes, not just symptoms
- Coachee's role and agency
- Assumptions that might be wrong
- Patterns and repetition

**Coach Reflection:** "So it sounds like X. I'm noticing Y. What do you see?"

---

## Step 4: ACTION (4 min)

**Objective:** Actions emerge naturally from new understanding (not prescribed).

**Coach Questions:**
1. "Given everything we've explored, what feels like the right next step?"
2. "What's one thing you could do differently?"
3. "Who do you need to talk to? What would that conversation be?"
4. "What's in your control here?"

**Ensure:**
- Action is their idea, not yours
- Action addresses the real dynamic
- Confidence level is healthy (5+)

**Coach Reflection:** "So your action is X. That makes sense because Y. How confident are you—1 to 10?"

---

## Step 5: REVIEW (2 min)

**Objective:** Consolidate learning and commitment.

**Coach Questions:**
1. "What's different about how you're thinking about this now?"
2. "What's the most important insight?"
3. "What are you committing to?"

**Coach Reflection:** "You came in feeling X. Now you're seeing Y. You're committing to Z. That's wise because..."

---

## CLEAR vs. GROW

| Aspect | GROW | CLEAR |
|--------|------|-------|
| **Pace** | Fast to solutions | Slow to understanding |
| **Start** | "What's your goal?" | "What would be helpful?" |
| **Listening** | 1–2 min | 4 full minutes |
| **Style** | Directive | Collaborative |
| **When** | Clear challenge | Complex/emotional |

---

## Real Session Example

```
Contracting:
Coach: "What would be helpful to talk about?"
Person: "My manager and I aren't on the same page."

Listening:
Coach: "Tell me more about that."
Person: "She never asks for my input. I feel invisible."
Coach: "Invisible. That's a strong word. What was that like?"
Person: "Frustrating. And sad, because we used to be close."

Exploring:
Coach: "What do you think is going on with her?"
Person: "Maybe she's stressed? We're under deadline."
Coach: "So maybe it's not personal—it's about pressure?"
Person: "Oh... I hadn't thought about it that way."

Action:
Coach: "Given that, what feels right?"
Person: "Maybe I should ask her about her concerns instead of feeling blamed."

Review:
Coach: "You went from feeling invisible and blamed to seeing her perspective. That's a shift."
Person: "Yeah. I feel better about talking to her now."
```

---

## Guardrails

❌ **Don't jump to solutions**  
✅ **Sit with the understanding first**

❌ **Don't interrupt or advise**  
✅ **Let them think and discover**

❌ **Don't assume you know what they need**  
✅ **Ask and listen for their wisdom**

---

## JSON Schema

```json
{
  "step_1_contracting": {
    "topic": "string (10-200 chars)",
    "comfort_level": "integer (1-10)",
    "success_for_conversation": "string",
    "coach_reflection": "string"
  },
  "step_2_listening": {
    "their_story": "string (50-600 chars)",
    "emotions_detected": ["array of emotions"],
    "what_matters": "string",
    "coach_reflection": "string"
  },
  "step_3_exploring": {
    "their_assumptions": "array",
    "patterns_identified": "array",
    "other_perspectives": "string",
    "what_they_really_want": "string",
    "coach_reflection": "string"
  },
  "step_4_action": {
    "what_feels_right": "string",
    "actions": "array",
    "confidence_level": "integer (1-10)",
    "coach_reflection": "string"
  },
  "step_5_review": {
    "learning_shift": "string",
    "key_insight": "string",
    "commitment": "string",
    "coach_reflection": "string"
  }
}
```

**CLEAR is about being heard and understood. It creates insight, not solutions.** 🔍
