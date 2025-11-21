# Productivity Coach - Implementation Progress

**Status:** Framework Schema Complete ✅  
**Date:** November 20, 2025

---

## ✅ Completed

### 1. Framework Schema Definition
**File:** `convex/frameworks/productivity.ts` (331 lines)

**Structure:** 5 deterministic steps
1. **ASSESSMENT** (2 min) - Current productivity state
2. **FOCUS_AUDIT** (2 min) - Time and energy analysis
3. **SYSTEM_DESIGN** (3 min) - Build personalized system
4. **IMPLEMENTATION** (2 min) - First action and commitment
5. **REVIEW** (1 min) - Reflection and scores

**Features:**
- ✅ Proper FrameworkDefinition type
- ✅ JSON schema for each step
- ✅ System prompts with clear instructions
- ✅ Coaching questions (progressive)
- ✅ Guardrails to prevent AI overreach
- ✅ Transition rules between steps
- ✅ Completion validation

### 2. Type System Updates
**File:** `convex/frameworks/types.ts`

- ✅ Added 'PRODUCTIVITY' to FrameworkId type
- ✅ Added 'LEADERSHIP' to FrameworkId type
- ✅ Added 'COMMUNICATION' to FrameworkId type
- ✅ Updated isValidFrameworkId() function

### 3. Deployment
- ✅ Deployed to production successfully

---

## 🔄 Next Steps

### Remaining Work for Productivity Coach (6-8 hours)

#### 1. Coach Logic (2 hours)
**File:** `convex/coach/productivity.ts`

Need to create:
```typescript
export class ProductivityCoach {
  // Check if each step is complete
  checkStepCompletion(step: string, payload: any, skipCount: number): boolean
  
  // Define step transitions
  getStepTransitions(step: string): { message: string; nextStep: string }
}
```

**Pattern:** Copy from `convex/coach/grow.ts` or `convex/coach/career.ts`

#### 2. Prompts (2 hours)
**File:** `convex/prompts/productivity.ts`

Need to create detailed step guidance:
- Progressive question flows
- Field extraction rules
- DO NOT auto-fill warnings
- WRONG vs CORRECT examples

**Pattern:** Copy from `convex/prompts/career.ts` or `convex/prompts/compass.ts`

#### 3. Reports (1 hour)
**File:** `convex/reports/productivity.ts`

Need to create:
```typescript
export class ProductivityReportGenerator implements FrameworkReportGenerator {
  generateReport(data: SessionReportData): FormattedReport
}
```

**Sections:**
- Productivity Assessment
- Time & Energy Audit
- Your Productivity System
- Implementation Plan
- Recommended Reading (RAG - automatic)

**Pattern:** Copy from `convex/reports/career.ts`

#### 4. Frontend Integration (1 hour)
**File:** `src/components/SessionView.tsx`

Need to add:
- PRODUCTIVITY to step arrays
- Add to frameworkSteps mapping
- Add getNextStepName logic
- Add COACHING_TIPS

#### 5. Router Integration (30 min)
**Files:**
- `convex/coach/base.ts` - Add PRODUCTIVITY to router
- `convex/prompts/index.ts` - Export productivity prompts
- `convex/reports/index.ts` - Register productivity report generator

#### 6. Testing (1 hour)
- [ ] Start PRODUCTIVITY session
- [ ] Complete all 5 steps
- [ ] Verify field extraction
- [ ] Check report generation
- [ ] Test knowledge recommendations
- [ ] Verify dashboard display

---

## 📋 Copy-Paste Checklist

### Coach Logic Template
```bash
# Copy GROW coach logic as template
cp convex/coach/grow.ts convex/coach/productivity.ts

# Then modify:
# 1. Change class name to ProductivityCoach
# 2. Update step names (ASSESSMENT, FOCUS_AUDIT, etc.)
# 3. Adjust completion criteria per step
# 4. Update transition messages
```

### Prompts Template
```bash
# Copy CAREER prompts as template
cp convex/prompts/career.ts convex/prompts/productivity.ts

# Then modify:
# 1. Update step guidance for each step
# 2. Add progressive question flows
# 3. Add field extraction rules
# 4. Add DO NOT auto-fill warnings
```

### Reports Template
```bash
# Copy CAREER reports as template
cp convex/reports/career.ts convex/reports/productivity.ts

# Then modify:
# 1. Change class name to ProductivityReportGenerator
# 2. Extract productivity-specific fields
# 3. Build report sections
# 4. Format output
```

---

## 🎯 Success Criteria

- ✅ Framework schema complete and deployed
- ⏳ Coach logic implements all 5 steps
- ⏳ Prompts provide detailed guidance
- ⏳ Reports generate correctly
- ⏳ Frontend integration works
- ⏳ Session completes in 10 minutes
- ⏳ Knowledge recommendations appear

---

## 📊 Estimated Time Remaining

**Productivity Coach:** 6-8 hours
- Coach logic: 2 hours
- Prompts: 2 hours
- Reports: 1 hour
- Frontend: 1 hour
- Integration: 30 min
- Testing: 1 hour
- Documentation: 30 min

**Then:**
- Leadership Coach: 12-15 hours
- Communication Coach: 9-12 hours

**Total remaining:** 27-35 hours (3-4 days)

---

## 🚀 Quick Start Commands

```bash
# Deploy current progress
npx convex deploy --yes

# Create coach logic file
touch convex/coach/productivity.ts

# Create prompts file
touch convex/prompts/productivity.ts

# Create reports file
touch convex/reports/productivity.ts

# Test the framework
# 1. Start new session
# 2. Select PRODUCTIVITY framework
# 3. Complete all steps
# 4. View report
```

---

## 📝 Notes

- Framework schema follows CAREER pattern exactly
- All type safety maintained (no `any` types)
- Progressive questioning enforced in prompts
- Knowledge recommendations will work automatically
- Dashboard integration will show new framework
- Print functionality already works

**Status:** Foundation complete, ready for coach logic implementation!
