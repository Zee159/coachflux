# Career Coach Implementation Guide

## 🎯 Executive Summary

**Framework Name:** `CAREER` (Career Advancement & Readiness Coach)  
**Coach Display Name:** "Career Coach"  
**Framework ID:** `'CAREER'`  
**Duration:** 25 minutes (5 steps)  
**Challenge Type:** `'career_development'`

---

## 📐 Design Principles

### 1. **Linear & Deterministic Flow**

Unlike COMPASS (which has branching), CAREER follows a strict linear progression:

```
INTRODUCTION → ASSESSMENT → GAP_ANALYSIS → ROADMAP → REVIEW
```

**No branching logic.** Every user goes through all 5 steps in order.

**Deterministic Completion Criteria:**
- Each step has **exact field requirements**
- Progressive relaxation based on skip count (like COMPASS)
- No AI judgment calls - only field presence checks

### 2. **Hallucination Prevention Strategy**

Following GROW/COMPASS patterns with enhanced guardrails:

#### **A. Opportunistic Extraction (from base prompts)**
- Extract only explicitly stated information
- Use user's exact words, never paraphrase
- If 10%+ uncertain, ask instead of extracting
- Acknowledge what was captured before moving on

#### **B. Step-Specific Guardrails**

**ASSESSMENT Step:**
```
❌ WRONG: "Based on your background, you probably need leadership skills"
✅ CORRECT: "What specific skills do you feel you need to develop?"

DO NOT:
- Assume career stage from years of experience
- Auto-fill target role based on current role
- Suggest timeframes without user input
- Invent skill gaps

ONLY EXTRACT:
- Explicitly stated current role
- Explicitly stated target role
- User-provided timeframe
- User-identified career stage
```

**GAP_ANALYSIS Step:**
```
❌ WRONG: "Common gaps for your role include X, Y, Z"
✅ CORRECT: "What skills does your target role require that you don't have yet?"

DO NOT:
- Generate skill lists from job descriptions
- Assume transferable skills
- Prioritize gaps without user input
- Add skills user didn't mention

ONLY EXTRACT:
- Skills user explicitly identifies as gaps
- Experiences user says they lack
- Skills user claims as transferable
- Priorities user ranks themselves
```

**ROADMAP Step:**
```
❌ WRONG: "You should take a course on leadership"
✅ CORRECT: "What learning actions could help you develop [skill]?"

DO NOT:
- Suggest specific courses/certifications
- Create action timelines without user input
- Invent networking strategies
- Auto-generate milestones

ONLY EXTRACT:
- Actions user commits to
- Timelines user sets
- Milestones user defines
```

#### **C. Field Validation Rules**

Every field has strict validation:

```typescript
// Example: skill_gaps field
{
  type: "array",
  items: { type: "string", minLength: 3, maxLength: 100 },
  minItems: 1,
  maxItems: 8
}
```

**Validation prevents:**
- Empty strings
- Single-word answers (minLength: 3)
- Essay-length responses (maxLength: 100)
- Excessive lists (maxItems: 8)

---

## 🔢 Step-by-Step Breakdown

### **Step 1: INTRODUCTION** (2 minutes)

**Objective:** Confirm career coaching intent and obtain consent

**Required Fields:**
```typescript
{
  user_consent: boolean,
  coaching_focus: "career_development" | "role_transition" | "skill_building",
  coach_reflection: string (minLength: 20)
}
```

**Question Flow:**
1. Welcome + explain Career Coach purpose
2. Ask: "Are you looking for career development, a role transition, or skill building?"
3. Extract `coaching_focus`
4. Ask: "Ready to begin?"
5. Extract `user_consent`

**Completion Criteria:**
- `user_consent === true`
- `coaching_focus` is set
- `coach_reflection` length >= 20

**Guardrails:**
- If user says "no" to consent → offer GROW framework instead
- If user describes non-career goal → redirect to GROW
- No auto-consent extraction

---

### **Step 2: ASSESSMENT** (6 minutes)

**Objective:** Understand current state and career target

**Required Fields:**
```typescript
{
  current_role: string (minLength: 3, maxLength: 100),
  years_experience: number (minimum: 0, maximum: 50),
  industry: string (minLength: 3, maxLength: 50),
  target_role: string (minLength: 3, maxLength: 100),
  timeframe: "3-6 months" | "6-12 months" | "1-2 years" | "2+ years",
  career_stage: "early" | "mid" | "senior" | "executive",
  initial_confidence: number (1-10),
  assessment_score: number (1-10)
}
```

**Question Flow (Progressive):**
1. "What's your current role?" → Extract `current_role`
2. "How many years of experience do you have?" → Extract `years_experience`
3. "What industry are you in?" → Extract `industry`
4. "What role are you targeting?" → Extract `target_role`
5. "What's your timeframe?" → Extract `timeframe`
6. "How would you describe your career stage?" → Extract `career_stage`
7. "On a scale of 1-10, how confident are you about making this transition?" → Extract `initial_confidence`
8. "On a scale of 1-10, how clear are you on what it takes to get there?" → Extract `assessment_score`

**Opportunistic Extraction:**
If user says: "I'm a mid-level Product Manager with 5 years in tech, looking to become a Senior PM in the next year"

Extract immediately:
- `current_role`: "Product Manager"
- `years_experience`: 5
- `industry`: "tech"
- `target_role`: "Senior PM"
- `timeframe`: "6-12 months"
- `career_stage`: "mid"

Then skip to: "On a scale of 1-10, how confident are you about making this transition?"

**Completion Criteria:**
- **Strict (0 skips):** 7/8 fields required
- **Lenient (1 skip):** 5/8 fields required
- **Very Lenient (2+ skips):** 3/8 fields required

**Guardrails:**
```
DO NOT:
- Infer career stage from years of experience
- Suggest target roles based on current role
- Assume industry from role title
- Auto-fill timeframe based on seniority gap

ONLY EXTRACT:
- Roles user explicitly states
- Numbers user provides
- Timeframes user chooses
- Confidence ratings user gives
```

---

### **Step 3: GAP_ANALYSIS** (7 minutes)

**Objective:** Identify skill/experience gaps and transferable strengths

**Required Fields:**
```typescript
{
  skill_gaps: string[] (minItems: 1, maxItems: 8),
  experience_gaps: string[] (minItems: 0, maxItems: 5),
  transferable_skills: string[] (minItems: 1, maxItems: 8),
  development_priorities: string[] (minItems: 1, maxItems: 3),
  gap_analysis_score: number (1-10)
}
```

**Question Flow (Progressive):**
1. "What skills does your target role require that you don't currently have?" → Extract `skill_gaps`
2. "What types of experience are you missing?" → Extract `experience_gaps`
3. "What skills from your current role transfer to your target role?" → Extract `transferable_skills`
4. "Of all the gaps we've identified, which 3 are most critical to address first?" → Extract `development_priorities`
5. "On a scale of 1-10, how manageable do these gaps feel?" → Extract `gap_analysis_score`

**Completion Criteria:**
- **Strict (0 skips):** 4/5 fields required
- **Lenient (1 skip):** 3/5 fields required
- **Very Lenient (2+ skips):** 2/5 fields required

**Guardrails:**
```
DO NOT:
- Generate skill lists from job descriptions
- Suggest "common gaps" for the role
- Invent transferable skills
- Prioritize gaps without user input

ONLY EXTRACT:
- Skills user explicitly identifies as gaps
- Experiences user says they lack
- Skills user claims as transferable
- Priorities user ranks (must be from their gap list)
```

---

### **Step 4: ROADMAP** (7 minutes)

**Objective:** Create concrete action plan with milestones

**Required Fields:**
```typescript
{
  learning_actions: Array<{action: string, timeline: string, resource: string}>,
  networking_actions: Array<{action: string, timeline: string}>,
  experience_actions: Array<{action: string, timeline: string}>,
  milestone_3_months: string (minLength: 10, maxLength: 200),
  milestone_6_months: string (minLength: 10, maxLength: 200),
  roadmap_score: number (1-10)
}
```

**Question Flow (Progressive):**
1. "What learning actions will you take to close your skill gaps?" → Extract `learning_actions`
2. "What networking actions will help you?" → Extract `networking_actions`
3. "What hands-on experience can you get?" → Extract `experience_actions`
4. "What will you achieve in 3 months?" → Extract `milestone_3_months`
5. "What about 6 months?" → Extract `milestone_6_months`
6. "On a scale of 1-10, how committed are you to this roadmap?" → Extract `roadmap_score`

**Completion Criteria:**
- **Strict (0 skips):** 5/6 fields required
- **Lenient (1 skip):** 4/6 fields required
- **Very Lenient (2+ skips):** 3/6 fields required

**Guardrails:**
```
DO NOT:
- Suggest specific courses or certifications
- Recommend networking events
- Create timelines without user input
- Auto-generate milestones

ONLY EXTRACT:
- Actions user commits to taking
- Timelines user sets themselves
- Resources user identifies
- Milestones user defines
```

---

### **Step 5: REVIEW** (3 minutes)

**Objective:** Summarize session and measure confidence gain

**Required Fields:**
```typescript
{
  key_takeaways: string (minLength: 50, maxLength: 500),
  immediate_next_step: string (minLength: 10, maxLength: 200),
  biggest_challenge: string (minLength: 10, maxLength: 200),
  final_confidence: number (1-10),
  final_clarity: number (1-10),
  session_helpfulness: number (1-10)
}
```

**Question Flow (Progressive):**
1. "What are your key takeaways from this session?" → Extract `key_takeaways`
2. "What's your immediate next step (within 48 hours)?" → Extract `immediate_next_step`
3. "What's your biggest challenge in executing this plan?" → Extract `biggest_challenge`
4. "On a scale of 1-10, how confident are you now about your career transition?" → Extract `final_confidence`
5. "How clear are you on your path forward (1-10)?" → Extract `final_clarity`
6. "How helpful was this session (1-10)?" → Extract `session_helpfulness`

**Completion Criteria:**
- **Strict (0 skips):** 5/6 fields required
- **Lenient (1 skip):** 4/6 fields required
- **Very Lenient (2+ skips):** 3/6 fields required

**Guardrails:**
```
DO NOT:
- Summarize for the user
- Suggest next steps
- Invent challenges
- Auto-fill confidence scores

ONLY EXTRACT:
- Takeaways user articulates
- Next step user commits to
- Challenge user identifies
- Scores user provides
```

---

## 📊 Career Success Score (CaSS)

**Composite metric measuring career readiness (similar to COMPASS CSS)**

### **Formula:**

```typescript
CaSS = (
  (confidence_delta * 0.30) +      // 30% weight: confidence growth
  (clarity_score * 0.25) +          // 25% weight: path clarity
  (action_commitment * 0.25) +      // 25% weight: roadmap commitment
  (gap_manageability * 0.20)        // 20% weight: gap perception
) * 10

Where:
- confidence_delta = (final_confidence - initial_confidence) / 10
- clarity_score = final_clarity / 10
- action_commitment = roadmap_score / 10
- gap_manageability = gap_analysis_score / 10

Result: 0-100 score
```

### **Success Levels:**

- **90-100:** EXCELLENT - Ready to execute with high confidence
- **75-89:** GOOD - Clear path with manageable gaps
- **60-74:** FAIR - Some clarity, needs refinement
- **40-59:** MARGINAL - Significant gaps or low confidence
- **0-39:** INSUFFICIENT - Needs more exploration

---

## 📄 Session Report Structure

### **Report Sections:**

```markdown
# Career Development Session Report

## 📊 Career Success Score (CaSS): [XX/100] - [LEVEL]

**Dimension Breakdown:**
- Confidence Growth: [initial] → [final] (+[delta])
- Path Clarity: [score]/10
- Action Commitment: [score]/10
- Gap Manageability: [score]/10

---

## 🎯 Career Target

**Current Position:**
- Role: [current_role]
- Industry: [industry]
- Experience: [years_experience] years
- Career Stage: [career_stage]

**Target Position:**
- Role: [target_role]
- Timeframe: [timeframe]
- Initial Confidence: [initial_confidence]/10

---

## 📋 Gap Analysis

### Skills to Develop
[List of skill_gaps]

### Experience Needed
[List of experience_gaps]

### Transferable Strengths
[List of transferable_skills]

### Top 3 Development Priorities
1. [priority 1]
2. [priority 2]
3. [priority 3]

---

## 🗺️ Career Roadmap

### Learning Actions
| Action | Timeline | Resource |
|--------|----------|----------|
| [action] | [timeline] | [resource] |

### Networking Actions
| Action | Timeline |
|--------|----------|
| [action] | [timeline] |

### Experience-Building Actions
| Action | Timeline |
|--------|----------|
| [action] | [timeline] |

### Milestones
- **3 Months:** [milestone_3_months]
- **6 Months:** [milestone_6_months]

---

## 💡 Session Insights

**Key Takeaways:**
[key_takeaways]

**Immediate Next Step (48 hours):**
[immediate_next_step]

**Biggest Challenge:**
[biggest_challenge]

**Final Confidence:** [final_confidence]/10
**Path Clarity:** [final_clarity]/10
**Session Helpfulness:** [session_helpfulness]/10

---

## 📈 Recommended Next Steps

1. Execute immediate next step within 48 hours
2. Schedule first learning action
3. Reach out for first networking action
4. Review progress at 3-month milestone
5. Consider follow-up Career Coach session in [timeframe/2]
```

---

