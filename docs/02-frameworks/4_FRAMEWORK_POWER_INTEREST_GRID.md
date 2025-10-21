# 📊 Power-Interest Grid Framework: Stakeholder Management

**Also called:** Mendelow's Matrix  
**Duration:** 20 minutes | **Steps:** 3 | **Best for:** Stakeholder influence, gaining buy-in, political navigation

---

## The 2×2 Matrix

```
                    INTEREST
                  Low    High
        ┌─────────────────────────┐
 POWER  │ MONITOR │ KEEP          │
 High   │         │ SATISFIED     │
        ├─────────────────────────┤
 Low    │ LOW     │ KEEP INFORMED │
        │ PRIORITY│               │
        └─────────────────────────┘
```

**Key Insight:** Most initiatives fail because they ignore HIGH POWER + LOW INTEREST stakeholders (those who could block it but don't care yet).

---

## Step 1: MAP STAKEHOLDERS (6 min)

**Objective:** List ALL relevant people/groups for this initiative.

**Coach Questions:**
1. "Who has decision-making authority?"
2. "Who executes or implements this?"
3. "Who's directly affected by the outcome?"
4. "Who could block this?"
5. "Who would benefit?"
6. "Anyone we might have missed? (admin staff, IT, compliance, unions?)"
7. "For each person, what's their current stance? (supporter, neutral, blocker, unknown)"

**Get Specific:**
- Don't say "Finance"—say "CFO", "Finance Manager", "Budget Committee"
- People or groups, not abstract functions
- At least 5–7 stakeholders

**Stakeholder Details:**
- Name/Role
- Current stance (supporter/neutral/blocker/unknown)
- Why they have that stance

---

## Step 2: ASSESS POWER & INTEREST (7 min)

**For each stakeholder, rate:**
- **POWER** (1–10): Can they block/significantly influence?
- **INTEREST** (1–10): Do they care about the outcome?

**Power Definition:**
- High Power: Decision authority, controls resources, influences others
- Low Power: Opinion matters but can't actually block

**Interest Definition:**
- High Interest: Directly affected, will pay attention
- Low Interest: Not directly affected, out of sight = out of mind

**Coach Questions (for each person):**
1. "Do they have power to block this?"
2. "Are they directly affected? Do they care?"
3. "Rate their power 1–10"
4. "Rate their interest 1–10"
5. "Is their current stance aligned with their power?"

**Calculate Quadrant:**
- High Power (7–10) + High Interest (7–10) = **MANAGE CLOSELY**
- High Power (7–10) + Low Interest (1–6) = **KEEP SATISFIED**
- Low Power (1–6) + High Interest (7–10) = **KEEP INFORMED**
- Low Power (1–6) + Low Interest (1–6) = **MONITOR**

---

## Step 3: DEVELOP INFLUENCE STRATEGY (7 min)

### MANAGE CLOSELY (High Power + High Interest)
**Strategy:** Keep them involved and updated constantly.

- Meet weekly or bi-weekly
- Involve in decisions
- Escalate issues immediately
- Build strong relationship
- Listen to their input and act

**Example:** Sarah (CEO), James (Product VP)

### KEEP SATISFIED (High Power + Low Interest)
**Strategy:** Keep informed but don't overwhelm.

- Update monthly (not weekly)
- Executive summaries (not deep details)
- Focus on impacts that matter to THEM
- Make it easy—low friction
- Watch for interest increase

**Example:** Mike (CFO)—has budget power but not enthusiastic

### KEEP INFORMED (Low Power + High Interest)
**Strategy:** Give them detailed information and use as advocates.

- Share detailed updates
- Involve in decisions where relevant
- Use them as champions with peers
- Celebrate their contributions
- They'll amplify your message

**Example:** Lisa (Marketing)—loves the idea, will evangelize

### MONITOR (Low Power + Low Interest)
**Strategy:** Minimal effort.

- Standard communications
- Watch for interest/power changes
- Reassess periodically
- Don't spend energy here

**Example:** Tom (Budget Manager—not directly involved)

---

## Critical Path Stakeholder

**Identify 1–2 most important people:**
- Who could make-or-break this?
- Usually High Power with concerning stance (blocker or neutral)

**For Critical Path Person:**
1. "What are their concerns?"
2. "What do they care about?"
3. "How does this connect to their goals?"
4. "What's your first conversation with them?"
5. "How will you know you've successfully shifted them?"

**Example:**
- **Stakeholder:** Mike (CFO)
- **Power:** 8/10 (controls budget)
- **Interest:** 3/10 (approved but not enthusiastic)
- **Critical Path:** Yes (if Mike becomes blocker, project dies)
- **Strategy:** Schedule 15-min briefing on financial ROI. Show numbers. Move his interest from 3 to 6–7.

---

## Action Plan

**Commit to:**
1. **Manage Closely:** Weekly sync with X and Y
2. **Keep Satisfied:** Monthly update to Mike with ROI focus
3. **Keep Informed:** Weekly deep dives with Maria (engineer)
4. **Monitor:** Quarterly touch-base with Tom

**For Critical Path (Mike):**
1. **Action:** Schedule financial ROI briefing this week
2. **Message:** "Mike, I want to make sure this makes financial sense. Here's the case..."
3. **Success:** "Mike rates it 6–7 on interest; asks engaged questions"

---

## Real Example: Product Launch

**Stakeholders Mapped:**
- Sarah (CEO): Founder, wants launch
- Mike (CFO): Controls budget
- James (Product VP): Building it
- Maria (Engineering Lead): Must build it
- David (VP Customer Success): Will sell to customers
- Lisa (Marketing): Will market it
- Tom (Budget Manager): Processes invoices

**Power & Interest Assessed:**
- Sarah: 9 power, 9 interest = **Manage Closely**
- Mike: 8 power, 3 interest = **Keep Satisfied** ← CRITICAL PATH
- James: 7 power, 9 interest = **Manage Closely**
- Maria: 7 power, 5 interest = **Keep Satisfied**
- David: 4 power, 6 interest = **Keep Informed**
- Lisa: 5 power, 8 interest = **Keep Informed**
- Tom: 2 power, 2 interest = **Monitor**

**Strategy:**
1. **Manage Closely:** Weekly syncs with Sarah and James (project team)
2. **Keep Satisfied:** Mike needs monthly updates showing financial progress. Maria needs technical input honoured.
3. **Keep Informed:** David and Lisa need detailed info so they can evangelize
4. **Critical Path:** Mike is the blocker. First action: prepare financial ROI case. Get him from 3 to 6 on interest.

---

## Guardrails

❌ **Don't ignore High Power + Low Interest stakeholders**  
They're most dangerous because they can block silently.

❌ **Don't treat all stakeholders equally**  
Different quadrants need very different approaches.

❌ **Don't just communicate—listen**  
Especially with sceptics. Understand their concerns first.

❌ **Don't assume approval = enthusiasm**  
Neutral agreement can flip to blocking if unaddressed.

❌ **Don't forget to reassess**  
Stakeholder positions shift over time.

---

## JSON Schema

```json
{
  "stakeholder_assessment": [
    {
      "name": "string",
      "role": "string",
      "power_level": "integer (1–10)",
      "interest_level": "integer (1–10)",
      "quadrant": "enum: manage_closely|keep_satisfied|keep_informed|monitor",
      "why_power": "string",
      "why_interest": "string"
    }
  ],
  "critical_path_stakeholder": {
    "name": "string",
    "why_critical": "string",
    "current_stance": "string",
    "their_concerns": ["array"],
    "first_conversation": "string",
    "success_metric": "string"
  },
  "actions": [
    {
      "stakeholder": "string",
      "action": "string",
      "by_when": "string"
    }
  ],
  "coach_reflection": "string"
}
```

**Power-Interest Grid maps who can help or hurt, then influences accordingly.** 📊
