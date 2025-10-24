# GROW Framework Enhancements: OPTIONS & WILL Steps

**Date:** October 24, 2025  
**Status:** ✅ Implemented

---

## Overview

Enhanced the GROW framework's OPTIONS and WILL steps to provide:
1. **Better context-grounded option suggestions** 
2. **Stricter completion criteria for quality decisions**
3. **Resource-finding assistance for actions**

---

## 🎯 OPTIONS Step Enhancements

### What Changed

#### 1. Context-Grounded AI Suggestions
**Before:** Generic options that didn't account for user's specific constraints
```
❌ "Join a developer community" (too vague)
❌ "Hire a consultant" (ignores budget constraints)
```

**After:** Options grounded in Goal + Reality context
```
✅ "Find technical mentor in Perth AI community"
   - References location: Perth
   - Acknowledges constraints: 4 hours/day, limited funds
   - Pros: "Free guidance", "Local network", "In-person meetings"
   - Cons: "Takes 2-3 weeks to find", "Requires 4-hour weekly commitment"
   - alignmentReason: "Leverages your Perth location and fits your 4-hour schedule"
```

#### 2. Increased Quality Requirements
- **Minimum options:** 2 → **3 options**
- **Explored options:** 1 → **2 options** (with pros/cons)
- **Variety:** Mix of low-effort, moderate-effort, and high-impact options

#### 3. Enhanced AI Suggestion Rules
When generating options, the coach now:
- Extracts full context (goal, timeframe, constraints, resources, risks)
- References specific constraints in suggestions
- Provides 3 options with varying effort levels
- Adds `alignmentReason` field explaining why each option fits
- Ensures at least ONE option addresses their biggest risk

#### 4. Rejection Handling
If user rejects options ("none of those look right"):
1. **Probe:** "What's missing from these options?"
2. **Identify gap:** Extract unaddressed needs
3. **Regenerate:** Create new options based on clarified needs
4. **Limit rounds:** Max 2 rounds of suggestions (avoid analysis paralysis)

### Implementation Files
- ✅ `convex/prompts/grow.ts` - Updated OPTIONS guidance (lines 181-294)
- ✅ `convex/coach/grow.ts` - Updated completion criteria (lines 111-146)

### Testing Instructions

**Test Case 1: Context-Grounded Suggestions**
```
Goal: "Launch web app by Jan 2026"
Reality Constraints: 
  - Perth, Western Australia
  - 4 hours/day development time
  - Limited funds
  - Not a full-stack developer

Expected: AI suggestions should reference Perth location and 4-hour constraint
Example: "Find technical mentor in Perth AI community" (not generic "join a community")
```

**Test Case 2: Option Rejection**
```
User Input: "none of those options look right"
Expected: Coach asks "What's missing from these options?" 
Then regenerates based on user's clarification
```

**Test Case 3: Completion Criteria**
```
Scenario: User provides 2 options with pros/cons
Expected: Coach asks for more options (need 3 total, 2 explored)
```

---

## ✅ WILL Step Enhancements

### What Changed

#### 1. Resource Assistance Capability (NEW)
Coach can now help users find specific resources for their actions:

**Before:** User struggles with vague action
```
User: "I'll find a mentor"
Coach: "When will you do this?" (no help with HOW)
```

**After:** Coach offers concrete resource suggestions
```
User: "I'll find a mentor"
Coach: "Finding a technical mentor is a great choice! Would you like suggestions on where to find mentors in Perth? You could start by searching LinkedIn for 'AI developer Perth' and filtering by location, or check Meetup.com for Perth AI groups. When will you start this search?"
```

#### 2. Resource Types Offered
The coach can suggest:

**Professional Networks:**
- LinkedIn search strategies (specific queries + filters)
- Geographic-specific recommendations

**Community Platforms:**
- Meetup.com groups for their city/topic
- Reddit, Discord, Slack communities
- Local tech groups

**Learning Resources:**
- Coursera, Udemy, edX courses
- Certification programs
- Documentation/tutorials

**Search Strategies:**
- Specific search terms
- Filter criteria
- Where to start

#### 3. When Resource Help is Offered
- User says: "I don't know where to start"
- Action involves: "find", "search", "locate", "connect with"
- User seems stuck: "I'm not sure how to do this"
- Geographic context available: Always mention location-specific resources

#### 4. How Resources are Provided
✅ **Conversational format** (woven into coaching language)
```
"You could start by searching LinkedIn for 'AI developer Perth' and filtering by people who work in AI. Another option is checking Meetup.com for Perth tech groups."
```

❌ **NOT as a separate field** (keeps coach_reflection natural)
```
// Don't do this:
resources: ["LinkedIn", "Meetup.com"]
```

### Implementation Files
- ✅ `convex/prompts/grow.ts` - Updated WILL guidance (lines 296-417)

### Testing Instructions

**Test Case 1: Resource Suggestion Trigger**
```
User Action: "I'll find a mentor"
Expected: Coach offers: "Would you like suggestions on where to find mentors in [city]?"
```

**Test Case 2: Context-Specific Resources**
```
User Location: Perth, Western Australia
User Action: "Find AI developers"
Expected: Coach suggests "LinkedIn search 'AI developer Perth'" and "Meetup Perth AI groups"
NOT generic "search online"
```

**Test Case 3: Multiple Resource Types**
```
User Action: "Learn TypeScript"
Expected: Coach suggests:
- Learning platforms (Coursera, Udemy)
- Documentation (TypeScript official docs)
- Community (TypeScript Discord/Reddit)
Max 2-3 suggestions (not overwhelming)
```

**Test Case 4: No Unsolicited Resources**
```
User Action: "Review code at 2pm today"
Expected: Coach focuses on timeline, owner, commitment
Does NOT suggest "use GitHub" or other tools unless user asks
```

---

## 📊 Completion Criteria Summary

| Step | Previous | Updated | Rationale |
|------|----------|---------|-----------|
| **OPTIONS** | 2 options, 1 explored | **3 options, 2 explored** | Better decision quality, more thorough exploration |
| **WILL** | 2 actions minimum | 2 actions minimum (unchanged) | Already sufficient |

### Progressive Relaxation (unchanged)
- **Loop detected:** Lower requirements (system stuck)
- **1 skip used:** Slightly relaxed
- **2+ skips:** Minimal requirements (force advance)

---

## 🎨 Example Conversation Flow

### OPTIONS Phase (Enhanced)
```
Coach: "What's one option you're considering?"
User: "Hire a developer"

Coach: "What are the advantages and challenges of hiring a developer?"
User: "I could get expert help, but it's expensive and takes time to onboard"

Coach: "Thanks for sharing. Would you like to share another option, or would you 
       like me to suggest some based on what we've discussed?"
User: "Please suggest"

Coach: "Based on what you've shared about being in Perth with 4 hours/day and 
       limited funds, here are some options that might work for you:

       1. Find technical mentor in Perth AI community
          ✓ Free guidance, Builds local network, In-person meetings possible
          ✗ Takes 2-3 weeks to find, Requires 4-hour weekly commitment
          
       2. Join online AI developer community (Discord/Slack)
          ✓ Free, Immediate access, 24/7 support, Learn from others
          ✗ Quality varies, Takes time to build trust, Async communication
          
       3. Hire part-time contractor for AI-specific tasks
          ✓ Expert help on demand, Pay only for needed hours
          ✗ Still costs money (but less than full-time), Need to scope tasks
          
       Do any of these resonate with you?"
```

### WILL Phase (Enhanced)
```
Coach: "Which option feels right for you?"
User: "Finding a technical mentor"

Coach: "Great choice! What specific actions will you take to find a mentor?"
User: "I'll search for one"

Coach: "Let's make that more concrete. Would you like suggestions on where to 
       find mentors in Perth? I can point you to specific platforms."
User: "Yes please"

Coach: "You could start by searching LinkedIn for 'AI developer Perth' and 
       filtering by people who work in AI. Another option is checking 
       Meetup.com for Perth tech groups like 'Perth AI Meetup' or 
       'Tech Perth'. Which of these will you start with?"
User: "I'll search LinkedIn tomorrow and check Meetup in a week"

Coach: "Perfect! So that's two actions:
       1. Search for AI developers on LinkedIn in Perth - tomorrow
       2. Look for AI developer events on Meetup - in 1 week
       
       Who will be responsible for these actions?"
User: "Me"

Coach: "Great! When do you want to have completed both of these searches?"
User: "In 2 weeks"

[Coach validates against Goal timeframe of "Jan 2026" - plenty of time ✓]
```

---

## 🚀 Impact

### User Experience Improvements
1. **Less confusion:** Options are grounded in their specific context
2. **Better decisions:** More options explored before committing
3. **Actionable guidance:** Concrete resources instead of vague "search online"
4. **Reduced friction:** Rejection handling prevents dead-ends

### Quality Improvements
1. **Contextual relevance:** All suggestions reference user's constraints
2. **Geographic awareness:** Location-specific resources when available
3. **Effort variety:** Options at different effort levels
4. **Risk mitigation:** At least one option addresses biggest risk

---

## 🔍 Validation Checklist

Before deploying, verify:

**OPTIONS Step:**
- [ ] AI suggestions reference specific constraints from Reality phase
- [ ] Options include `alignmentReason` field
- [ ] 3 options generated (not 2)
- [ ] Options vary in effort level (low, moderate, high)
- [ ] Rejection prompts user for what's missing
- [ ] Max 2 rounds of AI suggestions

**WILL Step:**
- [ ] Resource suggestions offered for "find/search/locate" actions
- [ ] Suggestions are conversational (not bullet lists)
- [ ] Geographic context used when available
- [ ] Max 2-3 resource suggestions (not overwhelming)
- [ ] Resources only offered when relevant (not unsolicited)
- [ ] Resources woven into coach_reflection naturally

---

## 📝 Next Steps

### Testing Required
1. Run full GROW session with complex goal requiring options
2. Test rejection handling (user says "none of those work")
3. Test resource assistance with various action types
4. Verify geographic context is used (test with different locations)
5. Ensure completion criteria work correctly (3 options, 2 explored)

### Future Enhancements
1. **Web search integration:** Actually search for resources dynamically
2. **Resource templates:** Pre-built resource lists for common actions
3. **Success tracking:** Track which resources users found most helpful
4. **AI-powered matching:** Match users with specific mentors/communities

---

## 📚 Related Documentation
- [GROW Framework Implementation](./02-frameworks/GROW_COACHING_MODEL.md)
- [Coach Modularization](./COACH_MODULARIZATION_COMPLETE.md)
- [Coaching Prompts](../convex/prompts/grow.ts)

---

**Status:** ✅ Ready for testing  
**Next Action:** Run end-to-end GROW session with real user scenario

