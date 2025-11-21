# New Coaches Implementation Plan

**Status:** Ready to Build  
**Date:** November 20, 2025

---

## ✅ Completed: Foundation

### 1. Framework Implementation Guide
- ✅ Complete 1,600+ line guide with all patterns
- ✅ Report generation architecture
- ✅ Post-session RAG integration documented
- ✅ Dashboard, actions, CSS/CaSS scoring patterns
- ✅ Complete checklist for new coaches

### 2. Post-Session Knowledge Integration
- ✅ Backend: `knowledgeSearch.ts` + `knowledgeRecommendations.ts`
- ✅ Frontend: `KnowledgeRecommendations.tsx` component
- ✅ SessionReport integration
- ✅ **DEPLOYED SUCCESSFULLY** ✅

### 3. Knowledge Base
- ✅ 40+ enhanced articles (1,200-1,400 words each)
- ✅ Categories: Career, Personal Dev, Relationships, Health, Productivity, Management
- ✅ Vector embeddings ready
- ✅ Semantic search operational

---

## 🎯 Next: Build 3 New Coaches

### Coach 1: Productivity Coach ⚡

**Framework:** 5 deterministic steps  
**Duration:** 8-10 minutes  
**Target:** Professionals struggling with focus, time management, productivity systems

**Steps:**
1. **ASSESSMENT** (2 min)
   - Current productivity level (1-10)
   - Biggest challenge
   - Main distractions, time wasters
   - Productivity goal

2. **FOCUS_AUDIT** (2 min)
   - Time breakdown (deep work %, meetings %, interruptions %)
   - Peak energy hours
   - Distraction triggers
   - Focus blockers

3. **SYSTEM_DESIGN** (3 min)
   - Choose framework (Time Blocking, Pomodoro, Deep Work, GTD, Hybrid)
   - Design morning routine
   - Schedule deep work blocks
   - Select productivity tools
   - System confidence score (1-10)

4. **IMPLEMENTATION** (2 min)
   - First action + start date
   - Daily commitment
   - Accountability method
   - Obstacles + contingency plans
   - Implementation confidence (1-10)

5. **REVIEW** (1 min)
   - Key insight
   - Immediate next step
   - Biggest concern
   - Final confidence, system clarity, session helpfulness (1-10 each)

**Knowledge Base Categories:**
- productivity (deep work, time blocking, inbox zero, meeting efficiency, focus techniques)

**Report Sections:**
- Productivity assessment
- Time & energy audit
- Your productivity system
- Implementation plan
- Recommended reading (RAG)

---

### Coach 2: Leadership Coach 📋

**Framework:** 6 deterministic steps  
**Duration:** 10-12 minutes  
**Target:** First-time managers, struggling leaders, difficult team situations

**Steps:**
1. **ASSESSMENT** (2 min)
   - Leadership role + team size
   - Biggest leadership challenge
   - Current confidence (1-10)
   - Leadership goal

2. **SITUATION_ANALYSIS** (2 min)
   - Describe the situation
   - People involved
   - Impact on team
   - What's been tried
   - Root cause hypothesis

3. **FRAMEWORK_SELECTION** (2 min)
   - AI suggests relevant frameworks:
     - Direct, Kind Feedback
     - SBIR + 30-60-90 PIP
     - Delegation (5 levels)
     - Difficult Conversations
     - Trust Building
   - User selects 1-2 frameworks

4. **ACTION_DESIGN** (3 min)
   - Specific actions using chosen framework
   - Timeline
   - Success metrics
   - Potential obstacles

5. **SCRIPT_PREP** (2 min)
   - Key talking points
   - Difficult questions to expect
   - Backup plans
   - Confidence score (1-10)

6. **REVIEW** (1 min)
   - Key insight
   - Immediate next step (48 hours)
   - Biggest concern
   - Final confidence, clarity, helpfulness (1-10 each)

**Knowledge Base Categories:**
- management (first-time manager, feedback, performance reviews, delegation, toxic behavior, 1-on-1s)

**Report Sections:**
- Leadership challenge
- Situation analysis
- Chosen frameworks
- Action plan with scripts
- Success metrics
- Recommended reading (RAG)

---

### Coach 3: Communication Coach 💬

**Framework:** 5 deterministic steps  
**Duration:** 8-10 minutes  
**Target:** Difficult conversations, conflict resolution, feedback delivery, boundary setting

**Steps:**
1. **ASSESSMENT** (2 min)
   - Communication challenge type (difficult conversation, conflict, feedback, boundaries)
   - Who's involved
   - Current anxiety level (1-10)
   - Desired outcome

2. **CONVERSATION_PREP** (2 min)
   - What needs to be said
   - Why it matters
   - Potential reactions
   - Your triggers
   - Conversation confidence (1-10)

3. **SCRIPT_BUILDING** (3 min)
   - Opening statement
   - Key points (3-5)
   - Handling pushback
   - Closing statement
   - Practice confidence (1-10)

4. **CONTINGENCY_PLANNING** (2 min)
   - If they get defensive
   - If they shut down
   - If they escalate
   - Your boundaries
   - Exit strategy

5. **REVIEW** (1 min)
   - Key insight
   - Immediate next step
   - Biggest concern
   - Final confidence, script clarity, helpfulness (1-10 each)

**Knowledge Base Categories:**
- relationships (difficult conversations, conflict resolution, feedback, trust building, boundaries)

**Report Sections:**
- Communication challenge
- Conversation script
- Contingency plans
- Boundaries & exit strategy
- Recommended reading (RAG)

---

## Implementation Checklist

### For Each Coach (9-15 hours per coach)

#### Backend (Convex) - 6 hours
- [ ] `convex/frameworks/[name].ts` - Schema definition (1 hour)
  - Follow CAREER pattern exactly
  - 5-6 steps with clear objectives
  - Required fields per step
  - Completion criteria

- [ ] `convex/coach/[name].ts` - Completion logic (2 hours)
  - `checkStepCompletion()` for each step
  - `getStepTransitions()` for flow control
  - Progressive relaxation logic
  - Button-based flows where needed

- [ ] `convex/prompts/[name].ts` - Step guidance (2 hours)
  - Detailed coaching questions per step
  - Field extraction rules
  - DO NOT auto-fill warnings
  - WRONG vs CORRECT examples
  - Progressive questioning flows

- [ ] `convex/reports/[name].ts` - Report generator (1 hour)
  - Extract data from reflections
  - Format sections
  - Calculate scores if applicable
  - Type-safe helpers

#### Frontend (React) - 3 hours
- [ ] `src/components/SessionView.tsx` - Integration
  - Add framework to step arrays
  - Add to frameworkSteps mapping
  - Add getNextStepName logic
  - Add COACHING_TIPS

#### Testing - 2 hours
- [ ] Complete full session
- [ ] Verify all fields extract correctly
- [ ] Test skip handling
- [ ] Test amendment flow
- [ ] Verify report generation
- [ ] Test knowledge recommendations
- [ ] Verify dashboard display

#### Documentation - 1 hour
- [ ] Add to README
- [ ] Document step sequence
- [ ] Add example session
- [ ] Update framework list

---

## Quick Start: Copy-Paste Pattern

### 1. Framework Schema
**Copy from:** `convex/frameworks/career.ts`  
**Pattern:** 5-6 steps, each with:
- name, order, duration_minutes
- objective
- required_fields_schema (JSON schema)
- system_prompt
- coaching_questions
- guardrails
- transition_rules

### 2. Coach Logic
**Copy from:** `convex/coach/grow.ts` or `convex/coach/career.ts`  
**Pattern:**
- Class extending base coach
- `checkStepCompletion()` with progressive relaxation
- `getStepTransitions()` with custom messages

### 3. Prompts
**Copy from:** `convex/prompts/career.ts` or `convex/prompts/compass.ts`  
**Pattern:**
- Progressive question flows (Q1 → Q2 → Q3...)
- Explicit field extraction rules
- DO NOT auto-fill warnings
- WRONG vs CORRECT examples

### 4. Reports
**Copy from:** `convex/reports/career.ts`  
**Pattern:**
- Extract reflections by step
- Type-safe helper functions
- Build sections array
- Return FormattedReport

---

## Deployment Process

### After Building Each Coach:

```bash
# 1. Deploy to Convex
npx convex deploy --yes

# 2. Test in development
# - Start new session
# - Complete all steps
# - View report
# - Verify recommendations

# 3. Update documentation
# - Add to framework list
# - Document any special features
```

---

## Success Criteria

### Per Coach:
- ✅ Session completes in target time (8-12 min)
- ✅ All fields extract correctly
- ✅ Report generates with all sections
- ✅ Knowledge recommendations appear (3-5 articles)
- ✅ No TypeScript errors
- ✅ No console errors in production

### Overall:
- ✅ 3 new coaches operational
- ✅ All integrated with RAG recommendations
- ✅ Dashboard shows all frameworks
- ✅ Action tracking works
- ✅ Reports are printable
- ✅ Dark mode works

---

## Estimated Timeline

**Productivity Coach:** 9-12 hours  
**Leadership Coach:** 12-15 hours (more complex)  
**Communication Coach:** 9-12 hours  

**Total:** 30-39 hours (3-5 days of focused work)

---

## Current Status

✅ **Foundation Complete** - All infrastructure ready  
✅ **Knowledge Integration Deployed** - RAG working  
🔄 **Productivity Coach** - Schema started, needs completion  
⏳ **Leadership Coach** - Not started  
⏳ **Communication Coach** - Not started  

**Next Action:** Complete Productivity Coach schema, logic, prompts, and reports following the CAREER pattern exactly.

---

## Notes

- The framework implementation guide has EVERYTHING needed
- Copy-paste from CAREER/COMPASS and modify
- Don't reinvent patterns - follow existing structure
- Test after each step completion
- Knowledge recommendations work automatically once deployed
- Focus on deterministic flows - no AI routing needed
