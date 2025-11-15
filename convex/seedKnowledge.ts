/* eslint-disable no-console */
/**
 * Seed knowledge base with Management Bible content
 *
 * Run this to load sample scenarios:
 *   npx convex run seedKnowledge:seed
 *
 * Updated: Nov 15, 2025 - All 10 scenarios enhanced to 1,000+ words
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

interface KnowledgeScenario {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

const SAMPLE_SCENARIOS: KnowledgeScenario[] = [
  {
    source: "management_bible_enhanced",
    category: "performance_management",
    title: "Setting Clear Expectations: The Foundation of Performance",
    content: `Setting clear expectations is the #1 predictor of team performance. When expectations are unclear, employees guess, waste time, and deliver the wrong thing. When clear, they execute with confidence.

THE EXPECTATION-SETTING FRAMEWORK:

The 5 Elements of Clear Expectations:

1. SPECIFIC - Exactly what needs to be done
❌ "Improve the customer experience"
✅ "Reduce average support ticket response time from 24 hours to 12 hours"

2. MEASURABLE - How you'll know it's done well
❌ "Make the report better"
✅ "Include 5 data visualizations, executive summary under 200 words, recommendations with ROI calculations"

3. DOCUMENTED - Written down and shared
❌ Verbal mention in passing
✅ Email confirmation with bullet points, calendar reminder for deadline

4. AGREED UPON - Commitment, not compliance
❌ "I need this done"
✅ "Can you commit to delivering this by Friday 5pm? What obstacles do you foresee?"

5. REVIEWED REGULARLY - Check-ins prevent surprises
❌ Set it and forget it
✅ "Let's check in Wednesday at 2pm to review progress"

THE EXPECTATION-SETTING CONVERSATION:

Opening Script:
"I want to make sure we're aligned on [PROJECT/TASK]. Let me walk through what I'm looking for, and then I'd like your input on feasibility and timeline."

The 7-Point Checklist:

✅ What: "The deliverable is [SPECIFIC OUTPUT]"
Example: "A 10-slide presentation for the board meeting"

✅ Why: "This matters because [BUSINESS IMPACT]"
Example: "The board decides Q4 budget allocation based on this"

✅ When: "I need this by [DATE/TIME]"
Example: "Friday, November 15th by 3pm (board meets at 4pm)"

✅ Quality Standard: "Success looks like [CRITERIA]"
Example: "Data-driven recommendations, 3 options with pros/cons, clear next steps"

✅ Resources: "You have access to [BUDGET/TOOLS/PEOPLE]"
Example: "Use the Q3 sales data from Sarah, $500 budget for design if needed"

✅ Authority: "You can decide [X] without me, but check on [Y]"
Example: "Choose the design template yourself, but run final recommendations by me Thursday"

✅ Check-ins: "Let's review progress [FREQUENCY]"
Example: "Quick 15-min check-in Wednesday at 10am"

Confirmation Script:
"Before we move forward, can you walk me through your understanding of what I'm asking for? What's your first step? Do you foresee any obstacles?"

COMMON EXPECTATION-SETTING MISTAKES:

Mistake 1: Assuming They Know
❌ "Just do what you did last time"
Problem: They might not remember, or last time was wrong
✅ "Here's what worked last time [SPECIFIC]. Let's repeat that approach."

Mistake 2: Being Vague to Avoid Conflict
❌ "Try to get it done soon-ish"
Problem: "Soon" means different things to different people
✅ "I need this by Friday 5pm. Is that realistic given your current workload?"

Mistake 3: Set-It-and-Forget-It
❌ Assign task, never follow up until deadline
Problem: They're stuck, going wrong direction, or forgot
✅ "Let's check in Wednesday to make sure you're on track"

Mistake 4: Not Checking for Understanding
❌ "Any questions? No? Great, get started."
Problem: They're confused but don't want to look dumb
✅ "Walk me through what you're going to do first. What's your plan?"

Mistake 5: Documenting Poorly
❌ Verbal conversation only, no follow-up
Problem: Memory fades, details forgotten
✅ Send email summary: "Per our conversation, here's what we agreed..."

TROUBLESHOOTING SCENARIOS:

Scenario 1: They Say "Yes" But Look Confused

Signs: Nodding but avoiding eye contact, hesitant "yeah, sure"

Script:
"I'm sensing some hesitation. What part is unclear? Let's make sure we're aligned before you start."

Scenario 2: They Push Back on Timeline

Response:
"Help me understand the constraint. What would a realistic timeline be? If I need it sooner, what resources or support would help?"

Scenario 3: They Deliver Wrong Thing

Post-Mortem Script:
"Let's debrief. What was your understanding of what I asked for? Where did we miscommunicate? How can I be clearer next time?"

Scenario 4: They Don't Ask Questions When Confused

Prevention:
"I want you to feel comfortable asking questions. It's better to clarify now than redo work later. What's one thing you're uncertain about?"

THE EXPECTATION DOCUMENTATION TEMPLATE:

TASK: [One-sentence description]
OWNER: [Name]
DUE DATE: [Date and time]
WHY IT MATTERS: [Business impact]

DELIVERABLE:
- [Specific output 1]
- [Specific output 2]
- [Specific output 3]

SUCCESS CRITERIA:
✅ [Measurable standard 1]
✅ [Measurable standard 2]
✅ [Measurable standard 3]

RESOURCES AVAILABLE:
- [Budget/tools/people]

DECISION AUTHORITY:
- You decide: [What they can do independently]
- Check with me: [What needs approval]

CHECK-INS:
- [Date/time for progress review]

OBSTACLES/QUESTIONS:
- [Any concerns raised]

AGREED: [Date] - Manager: _____ Employee: _____

EXPECTATION REVIEW CADENCE:

For New Employees (First 90 Days):
- Daily check-ins first week
- Every other day weeks 2-4
- Weekly after that

For Experienced Employees:
- Set expectations clearly upfront
- Check in at 25%, 50%, 75% completion
- Available for questions anytime

For High-Stakes Projects:
- More frequent check-ins
- Written documentation always
- Escalation path if issues arise

THE EXPECTATION RESET CONVERSATION:

When expectations weren't clear initially:

Script:
"I realize I wasn't clear enough when I assigned this. Let me clarify what I'm actually looking for. Here's what I need: [SPECIFIC]. Does that make sense? What questions do you have?"

KEY PRINCIPLE:

The time you invest in setting clear expectations upfront saves 10x the time you'd spend fixing misaligned work later.

EXPECTATION-SETTING CHECKLIST:

Before assigning any task:
✅ Can I describe the deliverable in one sentence?
✅ Have I explained why this matters?
✅ Is the deadline specific (date + time)?
✅ Have I defined what "good" looks like?
✅ Do they have the resources they need?
✅ Have I scheduled a check-in?
✅ Did I ask them to explain their understanding?
✅ Did I document this in writing?

If you can't check all 8 boxes, you haven't set clear expectations yet.`,
    tags: ["expectations", "clarity", "communication", "performance", "delegation", "accountability"]
  },
  {
    source: "management_bible_enhanced",
    category: "feedback",
    title: "Direct, Kind Feedback: Scripts for 7 Tough Situations",
    content: `The feedback gap: 58% of employees seldom/never receive thanks from managers, yet recognition is the #1 motivating factor.

THE #1 FEEDBACK RULE: Pure Praise

❌ WRONG (Contaminated):
"Great report, but there were typos."

Why fails: "But" erases everything before it.

✅ RIGHT (Pure):
"Great report. The analysis was thorough and recommendations actionable."

[Separate conversation, different time]
"Let's talk about proofreading strategies for future reports."

WHY THE FEEDBACK SANDWICH FAILS:

Formula: Positive + Negative + Positive

Problems:
1. Employees learn to ignore praise (waiting for "but")
2. Negative gets diluted, behavior doesn't change
3. Feels manipulative, reduces trust
4. Confuses the message (feel good or bad?)

THE DIRECT, KIND MODEL:

Formula: Behavior + Impact + Request + Support

Template:
"[SPECIFIC BEHAVIOR]. [IMPACT]. [REQUEST]. [SUPPORT]?"

Example:
"In yesterday's meeting, you interrupted Sarah three times while she explained the API delay. This makes her reluctant to raise issues early, so we miss problems until too late. I need you to let people finish thoughts. Would it help if I signaled when you're interrupting?"

7 FEEDBACK SCRIPTS:

SITUATION 1: Missed Deadline (No Warning)

Setup: Private, calm

"The Q3 report was due Friday 5pm. You submitted Monday 11am without advance notice. This delayed our board presentation and created last-minute exec stress. I need 48-hour warning if you'll miss deadlines so we can adjust plans. What happened?"

[Listen to explanation]

"Going forward, if you'll miss a deadline:
1. Tell me immediately (don't wait hoping to catch up)
2. Propose new ETA
3. Explain what's blocking
4. Ask if I can remove obstacles

Can you commit?"

SITUATION 2: Quality Issues (Repeated Errors)

"I've noticed 5 calculation errors in financial models over the past month [SHOW EXAMPLES]. These reached the CFO twice, damaging our credibility. I need <1% error rate before documents leave our team. Let's diagnose: Are you:
- Rushing due to time pressure?
- Unclear on formulas?
- Not using check process?

What support do you need to improve accuracy?"

SITUATION 3: Poor Meeting Behavior (Disengagement)

"In the last three stand-ups, you've been on laptop typing emails. When Sarah asked a direct question, you had to ask her to repeat it. This signals you don't value the team's time. I need you to close laptop and engage. If meeting isn't valuable, let's discuss attendance. But if you're there, be present. Agreed?"

SITUATION 4: Communication Style (Too Blunt)

"When you told Jake his code was 'a mess' in team Slack, he felt embarrassed and defensive. I saw him withdraw immediately. The quality issue was real, but delivery shut down collaboration. Instead of 'this is a mess,' try: 'I see areas we could clean up. Want to pair on this?' Can you commit to that approach?"

SITUATION 5: Attitude Problem (Negativity)

"I've heard you say this week: 'This project is doomed,' 'Leadership has no idea,' 'Why do we bother?' Your team hears this and morale drops. They start believing nothing matters. If you have concerns about direction, bring them to me privately and we'll address them. But in team spaces, I need constructive input. If you can't be positive, we need to discuss whether this role fits. What's going on?"

SITUATION 6: Inappropriate Behavior (Boundary Cross)

"Yesterday you made a comment about Sarah's appearance in the break room. [QUOTE SPECIFIC COMMENT]. Regardless of intent, appearance comments create discomfort and risk harassment claims. Our policy: No comments on appearance, period. This is your official warning. If repeated, we involve HR. Understood?"

[Document immediately]

SITUATION 7: Lack of Initiative (Passive)

"Over the past month, you've completed assigned tasks but haven't proposed improvements or flagged emerging issues. For your level, I expect proactive thinking: 'I noticed X problem, here's my solution.' Let's start with one area you can take initiative. Where do you see improvement opportunity?"

HANDLING DEFENSIVE REACTIONS:

Reaction 1: Denial ("I didn't do that")
"Let me share specific examples: [DATES, TIMES]. I'm not assuming—I observed directly. Help me understand your perspective."

Reaction 2: Excuses ("Not my fault")
"I hear external factors played a role. Let's separate what you control from what you don't. What could YOU have done differently, regardless of circumstances?"

Reaction 3: Emotional ("This isn't fair!")
"I can see you're upset. Take a moment. This feedback is about helping you succeed, not attacking personally. When ready, let's discuss moving forward."

Reaction 4: Counter-Attack ("Well YOU do X...")
"I'm open to feedback about my performance separately. Right now, we're discussing your [BEHAVIOR]. Can we focus on that?"

THE RECOGNITION GAP:

Research: Recognition = most motivating, yet 58% seldom receive it.

Why managers don't recognize:
1. Assume employees know
2. Waiting for perfection
3. Too busy (forget later)
4. Feel awkward

THE 5:1 RATIO RULE:

For every 1 correction, give 5 recognitions.

Why? Negative feedback is 5x more impactful psychologically. Balance maintains morale.

CREATIVE RECOGNITION (Beyond Money):

Daily:
- Verbal thank you (specific, immediate)
- Public acknowledgment (meetings, Slack)
- Handwritten note (rare = special)

Weekly:
- Spotlight email (to your boss, cc employee)
- Peer recognition (team nominates each other)

Monthly/Quarterly:
- Choice assignment (pick next project)
- Development opportunity (fund training/cert)
- Extra time off (reward results with flexibility)

FEEDBACK FREQUENCY:

High Performers:
- Positive: Weekly
- Developmental: Monthly
- Formal review: Quarterly

Average Performers:
- Positive: 2x/week
- Developmental: Bi-weekly
- Formal review: Quarterly

Struggling Performers:
- Positive: Daily (catch anything right!)
- Developmental: Weekly (structured plan)
- Formal review: Bi-weekly (close monitoring)

"CATCH PEOPLE DOING THINGS RIGHT" SYSTEM:

Setup:
1. Daily reminder: "Have I praised anyone today?"
2. Keep "wins log" - note small achievements
3. Share one specific recognition daily

Small wins to recognize:
- Helped colleague solve problem
- Took initiative without being asked
- Met deadline early
- Improved a process
- Asked great question in meeting
- Handled difficult customer gracefully
- Stayed calm under pressure

DOCUMENTATION TEMPLATE:

For developmental/corrective feedback:

FEEDBACK DOCUMENTATION
Date: [DATE]
Employee: [NAME]
Issue: [One-sentence]

Specific Behavior:
- [What, when, where]

Impact:
- [Business impact]
- [Team impact]
- [Customer impact]

Feedback Given:
- [What you said]
- [Their response]

Expectations Forward:
- [Behavior change required]
- [Timeline for improvement]
- [Support offered]

Next Check-In:
- [Date and purpose]

Manager: _______ Employee: _______

When to document:
- First time discussing performance concern
- Any behavioral issue (always)
- When you say "This is your warning"
- Before moving to formal discipline

FEEDBACK CHECKLIST:

Before giving critical feedback:
✅ Specific examples (dates, quotes, observables)?
✅ Checked emotional state (am I calm)?
✅ Private (not in front of others)?
✅ Time for full conversation (not rushed)?
✅ Prepared support to offer (not just criticism)?
✅ Ready to listen to their perspective?
✅ Will I document this?

After:
✅ Documented conversation?
✅ Set clear follow-up date?
✅ Ended constructively?
✅ They know what success looks like?
✅ Provided promised resources/support?`,
    tags: ["feedback", "difficult_conversations", "recognition", "communication", "performance", "coaching"]
  },
  {
    source: "management_bible_enhanced",
    category: "performance_management",
    title: "Handling Chronic Underperformance: The SBIR Framework & 30-60-90 PIP",
    content: `When feedback isn't working, you're dealing with chronic underperformance.

RED FLAGS:

1. Pattern: 3+ months below-standard work
2. Multiple conversations: Feedback given 2+ times, no improvement
3. Documented examples: Specific instances with dates
4. Team impact: Others picking up slack, morale suffering
5. No acknowledgment: Denies problem or blames others

THE SBIR CONVERSATION:

SBIR = Situation-Behavior-Impact-Request

Script:
SITUATION: "In the Q3 project..."

BEHAVIOR: "...you missed 3 of 4 milestones:
- Code review (Sept 15): Delivered Sept 22
- Feature completion (Sept 30): Delivered Oct 8
- Testing handoff (Oct 7): Delivered Oct 15"

IMPACT: "This delayed client delivery 2 weeks, jeopardized $400K contract renewal, forced team to work weekends. Product manager received direct client complaints."

REQUEST: "I need you to meet deadlines OR flag issues 48hrs in advance. No surprises. Can you commit?"

Why SBIR works:
- Specific: Concrete data, not vague
- Observable: Behavior anyone could see
- Impact-focused: Shows consequences
- Actionable: Clear what needs to change

THE 30-60-90 DAY PIP:

Purpose: Clear path to success OR clear timeline to exit.

30-Day Goals: Initial Improvement
- 2-3 specific, measurable objectives
- Weekly check-ins (scheduled, documented)
- Clear success criteria

Example:
GOAL 1: Meet 100% of deadlines OR notify 48hrs advance
- Success: 0 missed deadlines without notice
- Measurement: Project tracker timestamps

GOAL 2: Code passes first QA with ≤2 bugs (down from 8 average)
- Success: Average ≤2 bugs across 3 submissions
- Measurement: QA bug reports

GOAL 3: Attend all stand-ups (currently 60%)
- Success: 100% attendance or advance approval
- Measurement: Meeting attendance log

60-Day Goals: Sustained Progress
- Building on 30-day success
- Reduced check-in frequency (bi-weekly if improving)
- Demonstrating consistency

90-Day Assessment: Final Decision
- Performance reached acceptable standard?
- Improvement trajectory positive?
- Decision: Continue OR separate

CRITICAL DOCUMENTATION:

Document every time:
1. Date and time of conversation
2. Specific examples with dates/details
3. What you said (paraphrase key points)
4. Employee response (explanation/reaction)
5. Agreed action items (specific, measurable)
6. Timeline for next check-in
7. Support provided (training, resources, coaching)
8. Consequences if no improvement

Template:

PERFORMANCE DOCUMENTATION

Date: October 15, 2025, 2:00 PM
Location: Conference Room B
Attendees: [Manager], [Employee]

Issue: Chronic missed deadlines (3 in Q3)

Examples:
1. Sept 15: missed by 7 days (no notice)
2. Sept 30: missed by 8 days (no notice)
3. Oct 7: missed by 8 days (claimed unaware)

Business Impact:
- Client delivery delayed 2 weeks
- Team worked 3 weekends compensating
- $400K contract renewal at risk

Conversation:
- Reviewed all three missed deadlines
- Employee acknowledged, attributed to "being busy"
- Manager explained team/client impact
- Employee agreed pattern unacceptable

Expectations Forward:
1. Meet all assigned deadlines
2. Flag delays 48hrs advance minimum
3. Attend weekly planning (Mondays 10am)
4. Update project tracker daily

Support:
- Time management training (LinkedIn Learning)
- Daily 10-min check-ins (first 2 weeks)
- Manager helps prioritize if overwhelming

Timeline:
- 30-day review: Nov 15, 2025
- Weekly check-ins: Fridays 3pm
- Expectation: Zero missed deadlines next 30 days

Consequences:
If no improvement by 30-day review, formal PIP with potential termination at 90 days.

Employee Response:
Acknowledged understanding, committed to improvement. Expressed feeling overwhelmed but agrees current approach isn't working.

Manager: _______ Date: _______
Employee: _______ Date: _______
(Signature = discussion occurred, not agreement)

RED FLAGS TO EXIT EARLY:

Don't wait full 90 days if:

1. No Improvement After 60 Days
- Pattern unchanged despite clear expectations
- Multiple documented conversations

2. Defensive/Blaming
- Consistently blames others
- Makes excuses without ownership
- "It's not my fault because..."

3. Team Impact
- Morale declining
- Others complaining or doing their work
- Good employees considering leaving

4. Won't Acknowledge Problem
- "I don't see an issue"
- "You're targeting me unfairly"
- "Everyone else does this"

5. Integrity Issues
- Lying about completion status
- Falsifying reports
- Claiming credit for others' work

Exit script when futile:
"We've had three documented conversations about [ISSUE] over 60 days. Despite clear expectations, support, and weekly check-ins, issues continue. At this point, this role isn't the right fit. We're ending employment effective [DATE]. Here's info about final paycheck, benefits, next steps."

[Have HR present]

TROUBLESHOOTING SCENARIOS:

Scenario 1: High Performer Suddenly Struggling

Questions:
"Your performance has been excellent for 2 years, but I've noticed change the past 2 months. Is everything okay? What's different? How can I support you getting back on track?"

Likely causes:
- Personal crisis (divorce, illness, family)
- Burnout from overwork
- Team conflict
- Loss of motivation
- Health issues

Approach:
- Empathy first, performance second
- Offer EAP if personal issues
- Adjust workload if burnout
- Address team issues if interpersonal
- Focus on recovery, not punishment

Scenario 2: Never High Performer (Wrong Hire)

Signs:
- Struggling from day one
- Needs constant hand-holding
- Others more advanced after less time
- Skills don't match job requirements

Diagnostic:
"Let's assess whether this role aligns with your strengths"
Review job description vs actual skills
"Is this what you expected?"

Approach:
- Might be wrong role, not bad employee
- Explore if different position better fit
- If no fit anywhere, exit compassionately
- "This isn't working out" is okay if truly mismatched

Scenario 3: Personal Issues Affecting Work

Balance:
- Compassionate about personal situation
- Accountable for work impact
- Offer accommodations where possible
- Set clear expectations and timeline

Script:
"I understand you're dealing with [SITUATION] and I'm sorry. We can be flexible on [X], but I still need [Y DELIVERABLE] by [DATE]. What support would help you succeed despite circumstances? If you need FMLA leave, let's discuss with HR."

Scenario 4: Skills Gap (Trainable)

Signs:
- Effort is there, results aren't
- Specific technical deficiency
- Willing to learn
- Coachable attitude

Approach:
- Invest in training (courses, mentoring, pair programming)
- 60-day skill development plan
- Provide resources and time to learn
- Measure progress weekly

Different from general underperformance: Fixable with training.

LEGAL CONSIDERATIONS (Involve HR):

When to loop in HR:
- Before formal PIP
- If employee claims discrimination
- If termination likely
- Behavior could be harassment
- Employee requests ADA accommodation
- Before final termination decision

Legal Do's:
✅ Document everything
✅ Apply policies consistently
✅ Focus on observable behaviors/results
✅ Provide clear expectations, reasonable time
✅ Show you offered support/resources

Legal Don'ts:
❌ Make assumptions about why
❌ Compare to other employees by name
❌ Make it personal ("you're lazy")
❌ Fire without documentation
❌ Treat protected classes differently

THE COMPASSIONATE EXIT:

When termination necessary:

"[Name], we've had multiple conversations about [ISSUE] over [TIME]. Despite clear expectations and support, performance hasn't improved to needed level. We've decided to end your employment, effective [DATE].

Next steps:
- Final paycheck includes [X days] pay + [Y days] PTO
- Benefits continue through [DATE]
- [Severance/package] details
- HR will discuss COBRA, references, logistics

I know this is difficult. I want you to succeed, and I believe you will in a role better matching your strengths. I'm happy to serve as reference for [SPECIFIC STRENGTHS].

Questions?"

Tone: Firm but respectful. Not angry, not apologetic—factual.

Logistics:
- HR present
- Box for personal items
- Disable system access immediately after
- Security escort if concern about reaction
- Early in week (not Friday)
- Offer references for genuine strengths (if appropriate)`,
    tags: ["underperformance", "pip", "performance_improvement", "documentation", "termination", "legal"]
  },
  {
    source: "management_bible_enhanced",
    category: "team_dynamics",
    title: "Resolving Team Conflict: The Manager's Mediation Playbook",
    content: `Team conflict is inevitable. Your job isn't to prevent it—it's to channel it productively. Healthy conflict drives innovation. Toxic conflict destroys teams.

THE CONFLICT SEVERITY ASSESSMENT:

Level 1: Healthy Debate (Let It Continue)
Signs: Disagreement on ideas, respectful tone, focus on solutions
Action: Stay out of it, let them work it out
Example: "I think we should use React" vs "I prefer Vue"

Level 2: Tension (Monitor Closely)
Signs: Terse communication, avoiding each other, passive-aggressive comments
Action: Check in individually, address before escalation
Example: Eye rolls in meetings, excluding someone from emails

Level 3: Open Conflict (Intervene Immediately)
Signs: Raised voices, personal attacks, refusing to collaborate
Action: Separate them, meet individually, facilitate resolution
Example: "You never listen!" "Well you're incompetent!"

Level 4: Toxic/Dangerous (Escalate to HR)
Signs: Harassment, discrimination, threats, violence
Action: Document, involve HR immediately, separate parties
Example: Threats, intimidation, protected class discrimination

THE 4-STEP CONFLICT RESOLUTION PROCESS:

STEP 1: ASSESS SEVERITY & GATHER INTEL

Before intervening, understand what's really happening:

Questions to Ask Yourself:
- How long has this been going on?
- Is this a one-time flare-up or pattern?
- Is work being affected?
- Are others on the team impacted?
- What's the power dynamic? (peer vs peer, or manager vs report?)

Information Gathering:
- Observe interactions directly
- Ask trusted team members (confidentially)
- Review email/Slack threads if relevant
- Check project collaboration history

STEP 2: MEET INDIVIDUALLY (CRITICAL STEP)

Never skip this. Going straight to joint meeting often backfires.

Individual Meeting Script:

Opening:
"I've noticed some tension between you and [NAME]. I want to understand your perspective before we address this together. This conversation is confidential."

Key Questions:
1. "What's happening from your point of view?"
2. "What specific behaviors are bothering you?"
3. "How is this affecting your work?"
4. "What outcome would you like?"
5. "Are you willing to work toward resolution?"

Listen For:
- The real issue (often not what they first say)
- Their role in the conflict (not just blaming)
- Willingness to resolve vs wanting to "win"
- Any deal-breakers or red lines

Red Flags:
❌ "I refuse to work with them"
❌ "They need to apologize first"
❌ "Everyone agrees with me"
❌ All blame, zero ownership

Green Flags:
✅ "I may have contributed to this"
✅ "I want to find a way forward"
✅ "I'm willing to hear their side"
✅ Focus on work impact, not personal grievances

STEP 3: FACILITATED JOINT CONVERSATION

Only proceed if both parties willing. If not, consider reassignment or escalation.

Pre-Meeting Prep:
- Set ground rules in advance
- Choose neutral location
- Block 60-90 minutes (don't rush)
- Have HR present if Level 3+ conflict

Opening Script:
"Thank you both for being here. Our goal is to understand each other's perspectives and agree on how to work together effectively going forward. Here are the ground rules:

1. One person speaks at a time, no interrupting
2. Focus on specific behaviors, not character attacks
3. Use 'I' statements, not 'you always/never'
4. Listen to understand, not to rebut
5. We're here to solve the problem, not assign blame

[NAME], please share your perspective first. [OTHER NAME], your job is to listen and understand. You'll get your turn."

The Facilitation Framework:

Phase 1: Each Person Shares (15 min each)
- Let them speak uninterrupted
- Take notes on key points
- Ask clarifying questions only
- Don't let it become a debate

Phase 2: Identify Common Ground (10 min)
"Let me reflect what I heard. You both want:
- To deliver quality work
- To be respected
- To reduce tension
- To move forward

Is that accurate?"

Phase 3: Explore Root Causes (15 min)
"Let's dig into what's driving this. Often conflicts are about:
- Communication styles (direct vs indirect)
- Work styles (fast vs thorough)
- Unclear roles/responsibilities
- Competing priorities
- Past misunderstandings

Which of these resonates?"

Phase 4: Generate Solutions Together (20 min)
"What specific changes would help? Let's brainstorm."

Encourage them to propose solutions, not you.

Good Solutions:
✅ "I'll loop you in earlier on decisions"
✅ "I'll ask clarifying questions instead of assuming"
✅ "We'll have a weekly 15-min sync"
✅ "I'll give you 24hrs to respond before escalating"

Bad Solutions:
❌ "I'll try to be nicer" (too vague)
❌ "They need to change" (one-sided)
❌ "We'll just avoid each other" (not sustainable)

Phase 5: Document Agreement (10 min)
Write down specific commitments:

CONFLICT RESOLUTION AGREEMENT

Date: [DATE]
Participants: [NAME 1], [NAME 2], Manager: [YOUR NAME]

What we agreed to:
1. [NAME 1] will: [SPECIFIC BEHAVIOR]
2. [NAME 2] will: [SPECIFIC BEHAVIOR]
3. Both will: [SHARED COMMITMENT]

Check-in date: [1 WEEK FROM NOW]

Signatures: _______ _______

STEP 4: FOLLOW-UP & MONITOR

Week 1: Check in individually
"How's it going with [NAME]? Any issues?"

Week 2: Check in jointly (brief)
"I wanted to see how things are going between you two."

Week 4: Final check-in
If improved: "Great progress. Keep it up."
If not improved: Escalate to formal process

TROUBLESHOOTING DIFFICULT SCENARIOS:

Scenario 1: One Person Dominates the Conversation

Intervention:
"[NAME], I want to make sure we hear from both of you equally. Let's pause here and hear [OTHER NAME]'s perspective."

Scenario 2: They Start Arguing in the Meeting

Intervention:
"Hold on. We're slipping into debate mode. Remember, we're here to understand, not convince. [NAME], can you restate what you just heard [OTHER NAME] say?"

Scenario 3: One Person Won't Take Any Responsibility

Intervention:
"I'm hearing a lot about what [OTHER NAME] did wrong. Help me understand what you might have done differently."

If they still refuse: "I need to see some ownership here. Conflicts are rarely 100% one person's fault. If you can't identify anything you'd do differently, we may need to involve HR."

Scenario 4: They Agree in the Meeting, Then Backslide

Response:
"We had an agreement. You committed to [SPECIFIC BEHAVIOR]. That's not happening. Help me understand why."

Then: Document the backsliding, set clear consequences, involve HR if pattern continues.

Scenario 5: The Conflict is Really About You (The Manager)

Signs:
- They unite against you
- Complaints about your decisions
- "You're playing favorites"

Response:
"I'm hearing this might be about my management style. Let's address that directly. What specifically would you like me to do differently?"

Be open to feedback, but don't let them deflect from their conflict.

WHEN TO ESCALATE TO HR:

Immediate escalation required:
- Harassment (sexual, racial, etc.)
- Discrimination based on protected class
- Threats of violence
- Actual violence
- Retaliation claims
- Refusal to work together after intervention

Document before escalating:
- Dates and details of incidents
- Your intervention attempts
- Their responses
- Impact on team/work

CONFLICT PREVENTION STRATEGIES:

1. Clear Roles & Responsibilities
- Use RACI matrix (Responsible, Accountable, Consulted, Informed)
- Document who owns what
- Reduce overlap and ambiguity

2. Team Norms
- Establish how team communicates
- Define response time expectations
- Agree on meeting protocols
- Create psychological safety

3. Regular Check-Ins
- Weekly 1-on-1s catch issues early
- Team retrospectives surface tensions
- Anonymous feedback mechanisms

4. Model Healthy Conflict
- Disagree openly but respectfully
- Change your mind when presented with evidence
- Admit mistakes publicly
- Focus on ideas, not people

CONFLICT RESOLUTION CHECKLIST:

Before intervening:
✅ Assessed severity level?
✅ Gathered information from multiple sources?
✅ Identified real issue vs stated issue?
✅ Determined if HR involvement needed?

During individual meetings:
✅ Created safe space for honesty?
✅ Asked open-ended questions?
✅ Listened more than talked?
✅ Assessed willingness to resolve?

During joint meeting:
✅ Set clear ground rules?
✅ Ensured equal airtime?
✅ Identified common ground?
✅ Generated specific, actionable solutions?
✅ Documented agreement?

After resolution:
✅ Scheduled follow-up check-ins?
✅ Monitored for backsliding?
✅ Reinforced positive behaviors?
✅ Documented outcome?

KEY PRINCIPLE:

Your goal isn't to make them friends. It's to make them effective colleagues who can work together professionally despite personal differences.

Sometimes the best outcome is "respectful coexistence" not "best buddies."`,
    tags: ["conflict", "mediation", "team_dynamics", "difficult_conversations", "hr"]
  },
  {
    source: "management_bible_enhanced",
    category: "change_management",
    title: "Leading Through Change: The Change Curve Playbook",
    content: `Change is constant. Your job isn't to prevent resistance—it's to guide people through it. People don't resist change itself; they resist loss of control, uncertainty, and being excluded from decisions.

THE CHANGE CURVE: 4 Predictable Stages

Every person goes through these stages at their own pace. Your job: meet them where they are.

STAGE 1: SHOCK/DENIAL (Days 1-7)

What They're Thinking:
- "This won't really happen"
- "They'll change their minds"
- "This doesn't apply to me"

What They're Feeling:
Confusion, disbelief, numbness

What You See:
- Blank stares in meetings
- No questions asked
- Business as usual behavior
- "Wait and see" attitude

Your Role: COMMUNICATE CLEARLY & REPEATEDLY

Script for Announcement:
"I know this is a lot to process. Here's what's changing: [SPECIFIC]. Here's why: [REASON]. Here's the timeline: [DATES]. Here's what's NOT changing: [CONSTANTS]. I'll share more details as I have them. Questions?"

Key Actions:
✅ Announce in person (not email)
✅ Explain the why (business case)
✅ Be specific about timeline
✅ Acknowledge it's a lot
✅ Repeat message 7+ times
✅ Create FAQ document
✅ Schedule follow-up Q&A

What NOT to Say:
❌ "It'll be fine, don't worry"
❌ "Just trust me"
❌ "Details coming later"
❌ "It's not that big a deal"

STAGE 2: ANGER/RESISTANCE (Weeks 2-4)

What They're Thinking:
- "This is stupid"
- "Why are we doing this?"
- "The old way was better"
- "Leadership has no idea"

What They're Feeling:
Frustration, fear, anxiety, anger

What You See:
- Complaints and pushback
- Passive-aggressive behavior
- Productivity dips
- "This won't work because..."
- Increased absenteeism

Your Role: LISTEN, VALIDATE, EXPLAIN WHY

Script for Resistance:
"I hear your frustration. Help me understand your specific concerns."

[Listen without defending]

"Those are valid concerns. Here's how we're addressing [CONCERN]: [PLAN]. What would make this more workable for you?"

Key Actions:
✅ Hold listening sessions
✅ Validate emotions (not agreement)
✅ Address concerns specifically
✅ Involve them in HOW (not IF)
✅ Share the "why" repeatedly
✅ Be transparent about challenges
✅ Give them some control

Handling Specific Resistance:

Resistance Type 1: "This won't work"
Response: "What specifically concerns you? How could we address that?"

Resistance Type 2: "You're making a mistake"
Response: "I appreciate your perspective. What data or experience informs that view?"

Resistance Type 3: "I'm not doing it"
Response: "I understand this is difficult. This change is happening. Let's talk about how to make it work for you. What support do you need?"

Resistance Type 4: "Why wasn't I consulted?"
Response: "You're right, I should have involved you earlier. I value your input. What would you have suggested? Can we incorporate that now?"

STAGE 3: EXPLORATION (Weeks 4-8)

What They're Thinking:
- "Maybe this could work"
- "How do I do this?"
- "What if I mess up?"

What They're Feeling:
Curiosity, cautious optimism, anxiety

What You See:
- Questions about implementation
- Tentative trying
- Mistakes and learning
- Asking for help

Your Role: PROVIDE SUPPORT & ANSWER QUESTIONS

Script for Support:
"I know you're figuring this out. What questions do you have? What's working? What's not? How can I help?"

Key Actions:
✅ Provide training and resources
✅ Create safe space for questions
✅ Celebrate small wins
✅ Share success stories
✅ Pair people up (buddy system)
✅ Be available and visible
✅ Expect mistakes, coach through them

Support Structures:
- Weekly Q&A sessions
- Champions/early adopters as mentors
- Documentation and guides
- Practice/sandbox environments
- Office hours for questions

STAGE 4: ACCEPTANCE (Weeks 8-12+)

What They're Thinking:
- "This is how we do it now"
- "I can see the benefits"
- "What's next?"

What They're Feeling:
Confidence, competence, normalcy

What You See:
- New behaviors becoming habits
- Helping others adapt
- Suggesting improvements
- Productivity returning/improving

Your Role: REINFORCE & CELEBRATE

Script for Reinforcement:
"I've noticed you're [NEW BEHAVIOR]. That's exactly what we need. How's it going? What's improved?"

Key Actions:
✅ Celebrate wins publicly
✅ Share metrics showing progress
✅ Recognize early adopters
✅ Incorporate feedback/improvements
✅ Make it the new normal
✅ Stop talking about "the change"

THE QUICK WINS STRATEGY:

Identify 2-3 easy wins in first 30 days to build momentum and credibility.

Good Quick Wins:
✅ Solve a known pain point
✅ Achievable in 2-4 weeks
✅ Visible to many people
✅ Low risk if it fails
✅ Builds confidence in change

Example Quick Wins:
- Eliminate annoying process step
- Fix long-standing bug/issue
- Improve meeting efficiency
- Provide better tools/resources

CHANGE COMMUNICATION PLAN:

Week 1: Announce (In-person, all-hands)
Week 2: FAQ & Q&A session
Week 3: Training begins
Week 4: Check-in (how's it going?)
Week 6: Share early wins
Week 8: Gather feedback, adjust
Week 10: Celebrate progress
Week 12: New normal established

Communication Channels:
- All-hands meetings (big picture)
- Team meetings (specific impact)
- 1-on-1s (individual concerns)
- Email updates (written record)
- Slack/chat (quick questions)
- Office hours (deep dives)

COMMON CHANGE LEADERSHIP MISTAKES:

Mistake 1: Announcing Once and Expecting Compliance
❌ "I told them, they should know"
✅ Repeat message 7+ times in different formats

Mistake 2: Ignoring Emotional Reactions
❌ "Just get over it"
✅ "I know this is hard. What concerns you most?"

Mistake 3: Not Involving People in Implementation
❌ "Here's the new process, follow it"
✅ "Here's what we need to achieve. How should we do it?"

Mistake 4: Declaring Victory Too Early
❌ "Great, everyone's on board" (after week 2)
✅ Wait until new behaviors are habits (8-12 weeks)

Mistake 5: Not Addressing the "Why"
❌ "Because leadership said so"
✅ "Here's the business problem we're solving..."

TROUBLESHOOTING DIFFICULT SCENARIOS:

Scenario 1: Vocal Resistor Influencing Others

Action:
Meet privately: "I've noticed you're expressing concerns about the change. I want to understand your perspective. What specifically worries you?"

[Listen, address concerns]

"I need you to support this change publicly, even if you have private reservations. Can you do that? If not, we need to discuss whether this role is still the right fit."

Scenario 2: Silent Resistance (Compliance Without Commitment)

Signs: Doing minimum, no enthusiasm, waiting for it to fail

Action:
"I notice you're going through the motions but not engaged. What's holding you back? What would make this work better for you?"

Scenario 3: Change Fatigue (Too Many Changes)

Signs: "Not another change," exhaustion, cynicism

Action:
"I know we've had a lot of changes. This one matters because [SPECIFIC IMPACT]. What can we pause or slow down to make room for this?"

CHANGE READINESS CHECKLIST:

Before announcing change:
✅ Clear business case (why now?)
✅ Leadership aligned and committed?
✅ Resources allocated (time, budget, people)?
✅ Communication plan ready?
✅ Training/support plan ready?
✅ Quick wins identified?
✅ Metrics to track progress?
✅ Feedback mechanisms in place?

KEY PRINCIPLE:

Change doesn't fail because people resist it. Change fails because leaders don't guide people through the emotional journey of letting go of the old and embracing the new.

Your job: Be the guide, not the dictator.`,
    tags: ["change", "resistance", "communication", "leadership", "change_management"]
  },
  {
    source: "management_bible_enhanced",
    category: "leadership",
    title: "First-Time Manager Survival Guide: Your First 90 Days",
    content: `Congratulations, you're a manager! Now what? The transition from individual contributor to manager is one of the hardest career shifts. You're no longer judged by what you do—you're judged by what your team accomplishes.

THE 5 DEADLY MISTAKES NEW MANAGERS MAKE:

MISTAKE 1: Not Realizing You're On Stage

The Reality:
Your team constantly monitors your words, actions, mood, and reactions. Everything you do sends a signal.

What They're Watching:
- How you react to bad news
- Who you spend time with
- What you celebrate vs criticize
- Your energy level and mood
- How you handle conflict
- What you prioritize

The "Manager Mood Tax":
If you're stressed, your team gets stressed. If you're calm, they stay calm. Your emotional state ripples through the entire team.

How to Manage It:

✅ Be Intentional About Communication
Before speaking in meetings, ask: "What message does this send?"

✅ Maintain Consistent Mood
Don't bring personal stress to work. Your team can't tell if you're upset about work or home.

✅ Be Visible and Accessible
Walk around, attend team events, be present. Absence creates anxiety.

Script for Bad Days:
"I'm dealing with something unrelated to the team today, so if I seem off, it's not about you or your work. I'm still here if you need me."

MISTAKE 2: Trying to Be Everyone's Friend

The Dilemma:
You want to be liked. But popularity and effectiveness don't always align.

What Happens:
- You avoid giving critical feedback
- You make decisions based on what's popular, not what's right
- You struggle to hold people accountable
- Your authority erodes

The Boundary Shift:

Before (Peer):
- Share personal problems
- Complain about leadership together
- Socialize outside work frequently
- Discuss salaries and promotions

After (Manager):
- Keep personal life more private
- Support leadership decisions publicly
- Maintain professional distance
- Can't discuss compensation details

How to Navigate It:

✅ Be Friendly, Not Friends
You can be warm, approachable, and caring without being buddies.

✅ Make Decisions Based on What's Right
"I know this isn't popular, but here's why it's the right call..."

✅ Maintain Professional Boundaries
Decline invitations that blur lines (bachelor parties, late-night drinking)

Script for Former Peers:
"Our relationship is changing. I value our connection, but I need to maintain some professional distance now. I hope you understand."

MISTAKE 3: Doing Instead of Delegating

The Trap:
You got promoted because you were great at doing the work. Now your job is to develop others to do the work.

Why Managers Do This:
- "It's faster if I just do it myself"
- "No one can do it as well as I can"
- "I don't want to burden my team"
- "I don't know how to delegate"

The Cost:
- You're overwhelmed and working 60+ hours
- Your team isn't developing
- You're a bottleneck
- You can't focus on strategy

The Shift:

Your Old Job: Execute tasks excellently
Your New Job: Develop people who execute tasks excellently

How to Let Go:

✅ Accept the 80% Solution
Their 80% done independently > Your 100% requiring constant involvement

✅ Delegate Development Opportunities
Give away tasks you love but others need to learn

✅ Coach, Don't Rescue
When they're stuck: "What have you tried? What are your options?" (not "Here, I'll do it")

Delegation Script:
"I'm delegating [TASK] to you because it develops your [SKILL]. Here's what success looks like: [CRITERIA]. Check in with me [FREQUENCY]. Questions?"

MISTAKE 4: Avoiding Difficult Conversations

The Fear:
"What if they get upset? What if they quit? What if they hate me?"

The Reality:
Problems don't resolve themselves. They escalate. The longer you wait, the harder the conversation becomes.

What Happens When You Avoid:
- Poor performance continues
- Good employees get frustrated
- You lose credibility
- The problem becomes a crisis

The Conversation Formula:

1. State the Behavior (Specific, Observable)
"In the past two weeks, you've missed 3 deadlines without advance notice."

2. Explain the Impact (Business Consequences)
"This delayed client delivery and forced the team to work weekends."

3. Set Clear Expectation (What Needs to Change)
"I need you to meet deadlines OR flag issues 48 hours in advance."

4. Ask for Commitment (Get Agreement)
"Can you commit to that?"

5. Offer Support (Show You Care)
"What obstacles are in your way? How can I help?"

Script for Addressing Issues Early:
"I want to address something while it's still small. I've noticed [BEHAVIOR]. Can we talk about what's going on?"

MISTAKE 5: Not Asking for Feedback

The Blind Spot:
You don't know how you're perceived. Your team sees things you don't.

Why Managers Don't Ask:
- Fear of looking weak
- Don't want to hear criticism
- Assume they're doing fine
- Don't know how to ask

The Cost:
- You repeat mistakes
- Team loses trust
- You miss opportunities to improve
- Resentment builds silently

How to Ask for Feedback:

✅ Make It Safe
"I'm learning this role. I need your honest input to improve. There's no wrong answer."

✅ Ask Specific Questions
Not: "How am I doing?"
Yes: "What should I start/stop/continue doing?"

✅ Listen Without Defending
"Thank you for sharing that. Can you give me an example?"

✅ Act on What You Hear
"Last month you said I interrupt in meetings. I've been working on that. Have you noticed improvement?"

The Start/Stop/Continue Framework:

Start: "What's one thing I should START doing?"
Stop: "What's one thing I should STOP doing?"
Continue: "What's one thing I should CONTINUE doing?"

Feedback Request Script:
"I want to be a better manager for you. What's one thing I could do differently that would make your job easier?"

YOUR FIRST 90 DAYS: THE PLAYBOOK

DAYS 1-30: Listen and Learn

Goals:
- Understand the team
- Build relationships
- Identify quick wins
- Establish credibility

Actions:
✅ 1-on-1 with each team member (ask about their goals, challenges, what they need from you)
✅ Understand current projects and priorities
✅ Meet with key stakeholders
✅ Observe team dynamics
✅ Identify one quick win to build momentum

What NOT to Do:
❌ Make big changes immediately
❌ Criticize how things were done before
❌ Promise things you can't deliver

DAYS 31-60: Establish Your Approach

Goals:
- Set expectations
- Make small improvements
- Build trust through consistency
- Start delegating

Actions:
✅ Communicate your management philosophy
✅ Set team norms and expectations
✅ Implement one process improvement
✅ Start regular 1-on-1s
✅ Give first round of feedback

Management Philosophy Template:
"Here's how I work:
- I value [VALUES]
- I expect [EXPECTATIONS]
- You can count on me to [COMMITMENTS]
- I need you to [REQUESTS]"

DAYS 61-90: Drive Results

Goals:
- Deliver on commitments
- Address performance issues
- Establish rhythm
- Plan for future

Actions:
✅ Complete first major project/milestone
✅ Address any performance concerns
✅ Establish regular team rituals
✅ Set quarterly goals
✅ Seek feedback on your first 90 days

COMMON FIRST-TIME MANAGER SCENARIOS:

Scenario 1: Managing Former Peers

Challenge: They remember when you were equals

Script:
"I know this is weird. Yesterday we were peers, today I'm your manager. I value our relationship and want to maintain it, but some things will change. I need your support as I figure this out. Can we talk about how to make this work?"

Scenario 2: Inheriting a Problem Employee

Challenge: Previous manager didn't address issues

Action:
Start fresh with clear expectations. Don't assume past problems will continue, but document new issues immediately.

Script:
"I want to start with a clean slate. Here's what I need going forward: [EXPECTATIONS]. Can you commit to that?"

Scenario 3: Your Team is Older/More Experienced

Challenge: Imposter syndrome, lack of credibility

Action:
Leverage their expertise, focus on enabling their success, not proving yours.

Script:
"I know you have more experience in [AREA]. I'm here to support you, remove obstacles, and help you succeed. What do you need from me?"

Scenario 4: You're Overwhelmed

Signs: Working 60+ hours, can't keep up, constant firefighting

Action:
- Delegate ruthlessly
- Say no to non-essential requests
- Block focus time on calendar
- Ask your manager for help prioritizing

THE NEW MANAGER CHECKLIST:

Week 1:
✅ Meet with each team member 1-on-1
✅ Understand current priorities
✅ Set up regular 1-on-1 schedule
✅ Meet with your manager to align on expectations

Month 1:
✅ Communicate your management approach
✅ Identify one quick win
✅ Establish team norms
✅ Start delegating

Month 3:
✅ Deliver on first major commitment
✅ Give feedback to each team member
✅ Address any performance issues
✅ Seek feedback on your management

KEY PRINCIPLES FOR NEW MANAGERS:

1. Your Job Changed
You're no longer paid to do the work. You're paid to develop people who do the work.

2. Slow Down to Speed Up
Investing time in people development pays off exponentially.

3. Be Consistent
Your team needs to know what to expect from you. Consistency builds trust.

4. Ask for Help
Every manager struggles. Find mentors, peers, coaches. You don't have to figure it out alone.

5. Give Yourself Grace
You'll make mistakes. Apologize, learn, adjust. That's how you grow.

FINAL THOUGHT:

Management is about getting work done through others, not doing it all yourself. The sooner you embrace that shift, the more effective you'll be.

Your success is now measured by your team's success. Invest in them, and you'll both thrive.`,
    tags: ["first_time_manager", "leadership", "common_mistakes", "delegation", "new_manager", "management_transition"]
  },
  {
    source: "management_bible_enhanced",
    category: "delegation",
    title: "The Art of Effective Delegation: 5 Levels Framework",
    content: `Delegation isn't dumping work—it's developing your team while freeing yourself for high-leverage activities. The 80/20 rule: 20% of results come from 80% of work. Your job: orchestrate the team toward goals, not do everything yourself.

THE 5 LEVELS OF DELEGATION:

Level 1: Direct & Control
"Do exactly this, this way"
Use for: New employees, critical tasks, emergencies
Example: "Process this refund using steps 1-7 in manual. Check with me before hitting submit."

Level 2: Investigate & Report
"Research and give me findings"
Use for: Information gathering, market research
Example: "Survey 10 customers about checkout satisfaction. Report findings Friday."

Level 3: Recommend & Act
"Propose solution, get approval, execute"
Use for: Experienced employees learning decision-making
Example: "Analyze supplier proposals, recommend which to choose. We'll review together."

Level 4: Act & Report
"Make the decision, implement, then inform me"
Use for: Trusted employees on routine decisions
Example: "You handle client scheduling conflicts. Just let me know what you decided."

Level 5: Full Autonomy
"You own this completely"
Use for: Expert employees in their domain
Example: "The Q3 budget is yours. I trust your judgment."

TASKS YOU SHOULD ALWAYS DELEGATE:

1. Detail Work (80% effort, 20% results)
Why: You're paid for strategy, not pixel-pushing
Examples: Formatting presentations, data entry, scheduling
Template: "I need [OUTCOME] by [DATE]. Format: [SPECS]. Check [REFERENCE]. Questions?"

2. Information Gathering
Why: Free yourself to analyze and strategize
Examples: Competitive intelligence, customer feedback compilation
Template: "Research [TOPIC], summarize: (1) Key findings, (2) Implications, (3) Recommendations. Deadline: [DATE]."

3. Repetitive Assignments  
Why: Once you know how, teach someone else
Examples: Weekly reports, recurring meetings
Script: "I've done [TASK] for [X months]. You've seen how. Starting [DATE], you own it."

THE DELEGATION DISCUSSION:

Step 1: Set Context
"I'm delegating [TASK] because [REASON]. It's important because [IMPACT]. This develops your [SKILL]."

Step 2: Clarify Expectations (SMART-C)
Specific: Exact deliverable
Measurable: How we'll know it's done well
Authority: What you can decide without me
Resources: What you have access to
Timeline: Due date with check-ins
Consequence: Why this matters

Step 3: Confirm Understanding
"Walk me through your understanding. What's your first step?"

Step 4: Agree on Check-ins
"Let's check in [FREQUENCY]. Flag me if [CONDITIONS]."

COMMON MISTAKES & FIXES:

Mistake 1: Reverse Delegation (they give work back)
Signs: "I tried but couldn't figure it out. Can you just do it?"
Fix: "Let's problem-solve together. What have you tried? What are your options? Which would you recommend? Why?"
Don't: Take work back
Do: Coach through thinking process

Mistake 2: Delegating Outcome but Not Authority
Signs: Employee asks permission for every decision
Fix: Clarify decision rights
"$0-500: You decide, no approval
$501-2000: Propose to me, quick approval
$2001+: We decide together"

Mistake 3: Micromanaging the "How"
Signs: You specify exact steps, check in multiple times daily
Fix: Shift language
❌ "Use this exact script..."
✅ "Here's one approach. What would you do?"
❌ "Did you complete step 3?"
✅ "How's it going? On track?"

Mistake 4: Can't Let Go
Reality: Don't delegate tasks you love just because you "should"
Delegate what: (1) develops others, (2) frees you for strategy, (3) you're not uniquely good at

THE TRUST-BUT-VERIFY BALANCE:

Early (Times 1-3):
- Check-ins: 2-3 per project
- Review: Before stakeholder delivery
- Message: "I'm here to support"

Middle (Times 4-10):
- Check-ins: Once per project
- Review: Spot-check 25%
- Message: "I trust you, noting exceptions"

Mastery (Time 11+):
- Check-ins: As-needed, they drive
- Review: None unless requested
- Message: "You own this"

RECOVERY SCRIPTS:

Missed Deadline:
"Let's debrief: What got in the way? What would you do differently? How can I support better? Adjust timeline going forward?"

Quality Issues:
"This doesn't meet standard for [REASON]. Here's what good looks like [EXAMPLE]. Can you rework sections 2-4? Let's review together before continuing."

"I Don't Have Time":
"Let's look at priorities. What can we defer or delegate? This is priority #[X]."

THE 80% SOLUTION PRINCIPLE:

Key: Their 80% solution done independently beats your 100% solution requiring constant involvement.

Why?
- Scalability: You can't be everywhere
- Development: They learn by doing imperfectly
- Ownership: When they create it, they own it
- Your time: Frees you for work only you can do

When to accept 80%:
- Internal deliverables
- Routine client interactions
- Process work not directly impacting revenue/reputation

When to require 100%:
- External comms to key stakeholders
- Legal/compliance matters
- Crisis situations
- First impressions (onboarding, interviews)

DELEGATION CHECKLIST:

Before delegating:
✅ Explained WHY this matters (context)?
✅ Defined SUCCESS (outcome, not process)?
✅ Clarified AUTHORITY (what they decide alone)?
✅ Identified RESOURCES (budget, tools, people)?
✅ Agreed on CHECK-INS (not too much/little)?
✅ Confirmed UNDERSTANDING ("Walk me through...")?
✅ Committed to COACHING not RESCUING?

SUCCESS METRICS:

Track quarterly:
1. Time freed: Hours/week reclaimed for strategy
2. Team growth: What can team do now vs 6 months ago?
3. Quality ratio: % of delegated work meeting standards without rework
4. Autonomy level: % of team at Level 4-5
5. Your stress: Reasonable hours? Taking vacation?

Target: Within 6 months, 80% of routine work at Level 4-5.`,
    tags: ["delegation", "empowerment", "trust", "micromanagement", "autonomy", "development"]
  },
  {
    source: "management_bible_enhanced",
    category: "team_dynamics",
    title: "Managing Toxic Team Members: Intervention & Exit Strategies",
    content: `One toxic person can poison an entire team. High performers leave, morale tanks, and productivity suffers. Your job: intervene quickly or exit them decisively.

THE 5 TYPES OF TOXIC BEHAVIOR:

TYPE 1: The Underminer

Behaviors:
- Questions decisions publicly
- Spreads negativity about leadership
- Says "this won't work" without offering solutions
- Creates doubt and resistance

Impact:
- Team loses confidence in direction
- Others start questioning everything
- Change initiatives fail

Intervention Script:
"I've noticed you've expressed concerns about [DECISION] in team meetings. I want to understand your perspective, but I need you to bring concerns to me privately first, not undermine decisions publicly. Can you commit to that?"

TYPE 2: The Credit Stealer

Behaviors:
- Takes credit for others' work
- Says "I did this" when it was a team effort
- Presents others' ideas as their own
- Minimizes others' contributions

Impact:
- Team members stop sharing ideas
- Collaboration breaks down
- Resentment builds

Intervention Script:
"In yesterday's meeting, you presented the API redesign as your work. Sarah led that project. I need you to give credit where it's due. Going forward, acknowledge team contributions. Understood?"

TYPE 3: The Gossip

Behaviors:
- Shares confidential information
- Creates drama between team members
- Spreads rumors
- Talks about people behind their backs

Impact:
- Trust erodes
- Team fractures into factions
- Confidential info leaks

Intervention Script:
"I've heard you've been sharing information about [TOPIC] that was discussed in confidence. This breaks trust and creates drama. I need you to keep confidential information confidential. This is your warning."

TYPE 4: The Bully

Behaviors:
- Intimidates others
- Belittles people publicly
- Uses aggressive tone/language
- Makes people afraid to speak up

Impact:
- Psychological safety destroyed
- Good people leave
- Ideas suppressed

Intervention Script:
"In Monday's meeting, you said Sarah's idea was 'stupid' and rolled your eyes. This is unacceptable. I need you to treat everyone with respect, even when you disagree. If this happens again, we'll involve HR. Clear?"

TYPE 5: The Victim

Behaviors:
- Nothing is ever their fault
- Constant complaints
- Blames others or circumstances
- Refuses accountability

Impact:
- Team tired of excuses
- No ownership culture
- Problems never solved

Intervention Script:
"I'm hearing a lot about what others did wrong and external factors. I need to see ownership. What could YOU have done differently? What will YOU do next time?"

THE INTERVENTION FRAMEWORK:

STEP 1: Document Specific Behaviors

Bad Documentation:
"They have a bad attitude"
"They're negative"
"They're difficult"

Good Documentation:
"In Monday's 10am meeting, they rolled their eyes when Sarah spoke and said 'that will never work' without explanation. Sarah stopped contributing for the rest of the meeting."

Documentation Template:

Date: [DATE]
Time: [TIME]
Location: [WHERE]
Behavior: [EXACTLY WHAT THEY DID/SAID]
Impact: [OBSERVABLE CONSEQUENCES]
Witnesses: [WHO SAW IT]

STEP 2: Private Conversation (First Warning)

The 4-Part Script:

1. State the Behavior (Specific, Observable)
"I noticed in Monday's meeting, you rolled your eyes and dismissed Sarah's idea without explanation."

2. Explain the Impact (Business Consequences)
"This discourages team members from sharing ideas. Sarah stopped contributing for the rest of the meeting."

3. Set Clear Expectation (What Must Change)
"I need you to listen respectfully and provide constructive feedback, even when you disagree."

4. Ask for Commitment (Get Agreement)
"Can you commit to that?"

Listen to Their Response:

If they take ownership:
"I appreciate you acknowledging that. Let's move forward with this new approach."

If they make excuses:
"I understand there's context, but the behavior needs to change regardless. Can you commit?"

If they deny:
"I observed this directly. Multiple people noticed. The behavior happened. What I need from you is commitment to change. Can you do that?"

STEP 3: Monitor and Follow Up

Week 1: Watch closely
- Observe their behavior in meetings
- Check in with team members
- Look for improvement or relapse

If Improved:
"I've noticed you've been more constructive in meetings. That's exactly what I need. Keep it up."

If No Change:
Move to Step 4 immediately

STEP 4: Escalate (Second Warning with HR)

When to Involve HR:
- After 2-3 documented conversations with no improvement
- Any harassment, discrimination, or threats
- When you're considering termination

The HR Conversation:

Present:
- You (manager)
- HR representative
- The employee

Script:
"We've had two previous conversations about [BEHAVIOR] on [DATE 1] and [DATE 2]. The behavior has continued. [RECENT EXAMPLE]. This is a formal warning. If the behavior continues, we will terminate your employment. Do you understand?"

Document Everything:
- Date and time of meeting
- Who was present
- What was said
- Employee's response
- Next steps and timeline

STEP 5: Exit if Necessary

When to Exit:
- Behavior continues after formal warning
- Team is suffering (good people leaving or threatening to)
- Their technical contribution doesn't justify the damage
- They show no willingness to change

The Critical Question:
"Is their technical contribution worth the team damage they cause?"

Often the answer is NO. One toxic person can drive away 3-5 good employees.

The Exit Conversation:

Script:
"We've had multiple documented conversations about [BEHAVIOR] over [TIMEFRAME]. Despite clear expectations and warnings, the behavior has continued. [RECENT EXAMPLE]. We've decided to end your employment, effective [DATE].

Next steps:
- Final paycheck includes [X]
- Benefits through [DATE]
- HR will discuss logistics

Do you have questions?"

Have HR Present:
- For legal protection
- To handle logistics
- To de-escalate if needed

TROUBLESHOOTING DIFFICULT SCENARIOS:

Scenario 1: They're a High Performer

Challenge: "But they deliver great work!"

Reality Check:
- How many hours do you spend managing their behavior?
- How many people have left or want to leave because of them?
- What's the cost of lost talent vs their contribution?

Action:
High performance doesn't excuse toxic behavior. Address it or exit them.

Script:
"Your technical work is strong, but your behavior is damaging the team. Both matter. I need you to improve [BEHAVIOR] while maintaining [PERFORMANCE]. Can you do both?"

Scenario 2: They Have Tenure/Seniority

Challenge: "They've been here 10 years!"

Reality:
Tenure doesn't grant immunity. Standards apply to everyone.

Script:
"I value your experience and contributions over the years. And I need your behavior to align with our team standards. That's non-negotiable."

Scenario 3: They're Friends with Leadership

Challenge: "They golf with the CEO!"

Action:
Document everything meticulously. Loop in your manager early. Let HR and leadership know the situation.

Script (to your manager):
"I need to address [BEHAVIOR] with [NAME]. I know they have relationships with leadership. Here's my documentation. I wanted you aware before I proceed."

Scenario 4: The Team Likes Them

Challenge: "But everyone thinks they're funny!"

Reality:
Popularity doesn't excuse toxicity. Some people laugh at bullying to avoid being targeted.

Action:
Talk to team members privately. You'll often find people are relieved someone is finally addressing it.

Scenario 5: They Threaten to Quit

Response:
"I'd hate to lose you, but I can't compromise on team standards. The behavior needs to change. If you choose to leave over that, I'll understand."

Don't negotiate on standards. Call their bluff.

THE COST OF INACTION:

What Happens When You Don't Address Toxic Behavior:

1. Good People Leave
Your best employees have options. They'll use them.

2. Standards Erode
If you tolerate bad behavior, it becomes the new normal.

3. You Lose Credibility
Your team watches. If you don't act, they lose respect for you.

4. The Behavior Spreads
Others see toxic behavior rewarded (or at least tolerated) and copy it.

5. You Become the Problem
By not addressing it, you're enabling it. You're now part of the toxicity.

PREVENTION STRATEGIES:

1. Hire for Culture Fit
Technical skills can be taught. Values and behavior patterns are harder to change.

Interview Questions:
- "Tell me about a time you disagreed with a teammate. How did you handle it?"
- "Describe a situation where you made a mistake. What happened?"
- "How do you give feedback to peers?"

2. Set Clear Team Norms
Define acceptable and unacceptable behavior explicitly.

Team Norms Example:
✅ We disagree respectfully
✅ We give credit where due
✅ We address issues directly, not through gossip
✅ We assume positive intent
❌ No personal attacks
❌ No undermining decisions publicly
❌ No taking credit for others' work

3. Address Issues Early
Don't wait for patterns. Address first instance immediately.

Script for Early Intervention:
"I want to address this while it's small. In today's meeting, you [BEHAVIOR]. That's not how we operate here. Going forward, I need [EXPECTATION]. Okay?"

4. Model the Behavior You Want
Your team mirrors you. If you gossip, they'll gossip. If you're respectful, they'll be respectful.

TOXIC BEHAVIOR CHECKLIST:

When you observe concerning behavior:
✅ Document it immediately (date, time, specifics)
✅ Assess severity (minor issue or serious problem?)
✅ Decide on intervention approach
✅ Have private conversation within 48 hours
✅ Set clear expectations
✅ Follow up within 1 week
✅ Escalate if no improvement
✅ Involve HR before termination

KEY PRINCIPLE:

Your job is to protect the team, not protect the toxic person. One toxic employee is not worth losing three good ones.

Act quickly, document thoroughly, and don't hesitate to exit them if they won't change.`,
    tags: ["toxic_behavior", "team_dynamics", "intervention", "difficult_people", "termination", "hr"]
  },
  {
    source: "management_bible_enhanced",
    category: "performance_management",
    title: "Delivering Difficult Performance Reviews: The Complete Guide",
    content: `Performance reviews are hard when the news is good. They're excruciating when it's not. But honest feedback is a gift—letting someone fail without clear feedback is cruel.

THE DIFFICULT REVIEW FRAMEWORK:

PREPARATION PHASE (1-2 Days Before):

Step 1: Gather Specific Examples

Bad Examples (Vague):
- "You're often late"
- "Your work quality needs improvement"
- "You have attitude problems"

Good Examples (Specific):
- "You arrived after 9:30am on March 3, 10, 15, and 22 without advance notice"
- "The Q2 report had 12 calculation errors that required 8 hours of rework"
- "In Monday's meeting, you interrupted Sarah 3 times and said 'that won't work' without explanation"

Documentation Checklist:
✅ Dates and times
✅ Specific behaviors or deliverables
✅ Measurable outcomes
✅ Impact on team/business
✅ Previous conversations about the issue

Step 2: Separate Performance from Potential

Remember:
- They can be a great person but underperforming
- Focus on behaviors and results, not character
- This is about work, not who they are as a person

Mindset Shift:
❌ "They're lazy/incompetent/difficult"
✅ "Their performance in [AREA] is below standard"

Step 3: Prepare Your Emotional State

Before the meeting:
- Take 10 deep breaths
- Remember your goal: help them improve
- Anticipate their reactions
- Practice staying calm
- Have tissues ready

THE CONVERSATION STRUCTURE:

PHASE 1: Set the Tone (30 seconds)

Script:
"Thank you for meeting with me. I want to discuss your performance over the past [PERIOD]. Some of this will be difficult to hear, but my goal is to help you improve and succeed in this role."

What This Does:
- Sets expectation (this won't be easy)
- Shows your intent (help, not punish)
- Frames it as improvement opportunity

PHASE 2: State the Facts (2-3 minutes)

The Formula: Behavior + Impact + Pattern

Script:
"Over the past quarter, you missed 4 out of 6 deadlines without advance notice. This delayed client delivery by 2 weeks and forced the team to work weekends to compensate. The Q2 report had 12 errors that required rework, which damaged our credibility with the CFO. Client feedback mentioned concerns about responsiveness—you took 3+ days to respond to urgent requests."

Delivery Tips:
- Speak calmly and factually
- Don't apologize or soften
- Maintain eye contact
- Pause after each point
- Let the information land

PHASE 3: Listen (5-10 minutes)

Script:
"Help me understand what's happening from your perspective."

Then: BE QUIET and LISTEN

What You're Listening For:
- Do they take ownership or make excuses?
- Are there legitimate external factors?
- Do they understand the impact?
- Are they willing to change?

Responses and How to Handle:

Response 1: Denial
"I don't think I missed that many deadlines"

Your Response:
"Let me share the specific dates: [LIST]. These are documented in our project tracker. The pattern is clear."

Response 2: Excuses
"It's not my fault because [EXTERNAL FACTOR]"

Your Response:
"I understand [FACTOR] played a role. And you're still responsible for the outcomes. What could you have done differently given those constraints?"

Response 3: Emotional
"This isn't fair! You're targeting me!"

Your Response:
"I can see you're upset. Take a moment if you need. This feedback is based on documented performance data, not personal feelings. When you're ready, let's discuss how to move forward."

Response 4: Ownership
"You're right. I've been struggling with [X]"

Your Response:
"I appreciate you acknowledging that. Let's talk about how to address it."

PHASE 4: Collaborative Problem-Solving (10-15 minutes)

Script:
"What needs to change for you to meet expectations? What support do you need from me?"

Create Specific Improvement Plan:

1. Identify Root Causes
"What's driving these issues? Time management? Unclear priorities? Skills gap? Personal challenges?"

2. Set Measurable Goals
❌ "Improve quality"
✅ "Reduce errors to <2 per deliverable"

❌ "Be more responsive"
✅ "Respond to urgent requests within 4 hours"

3. Agree on Timeline
"Let's check in weekly for the next month. I expect to see improvement within 30 days."

4. Offer Specific Support
"I can provide:
- Time management training
- Daily check-ins for first 2 weeks
- Help prioritizing if you're overwhelmed
- Access to [RESOURCE]

What would be most helpful?"

PHASE 5: Document and Confirm (2 minutes)

Script:
"I'm going to send you a summary of what we discussed and agreed to. Please review it and let me know if I missed anything or if you have questions."

Email Template:

Subject: Performance Discussion Summary - [DATE]

[NAME],

Thank you for meeting with me today. Here's a summary of our conversation:

PERFORMANCE CONCERNS:
1. [SPECIFIC ISSUE with dates/examples]
2. [SPECIFIC ISSUE with dates/examples]
3. [SPECIFIC ISSUE with dates/examples]

IMPACT:
- [Business impact]
- [Team impact]
- [Client impact]

IMPROVEMENT PLAN:
Goal 1: [SPECIFIC, MEASURABLE]
Goal 2: [SPECIFIC, MEASURABLE]
Goal 3: [SPECIFIC, MEASURABLE]

SUPPORT PROVIDED:
- [Resource/training]
- [Check-in schedule]
- [Other support]

TIMELINE:
- Weekly check-ins: [DAY/TIME]
- 30-day review: [DATE]
- Expected improvement: [SPECIFIC METRICS]

NEXT STEPS:
If performance doesn't improve to expected standards within 30 days, we'll discuss next steps, which may include a formal Performance Improvement Plan or other actions.

Please reply to confirm you received and reviewed this summary.

[YOUR NAME]

COMMON MISTAKES TO AVOID:

Mistake 1: The Feedback Sandwich

❌ "You're doing great! But there are some issues. Overall you're wonderful!"

Why It Fails:
- Confuses the message
- They focus on the positive and miss the serious concerns
- Reduces urgency

✅ Instead:
Be direct. If it's a difficult review, don't pretend it's not.

Mistake 2: Being Vague to Avoid Discomfort

❌ "You need to improve your communication"
❌ "Your work quality could be better"
❌ "Sometimes you're not a team player"

✅ Instead:
"In Monday's meeting, you interrupted Sarah 3 times. I need you to let people finish their thoughts."

Mistake 3: Letting Them Derail with Excuses

Them: "But Sarah did X and John did Y and the system is broken and..."

❌ Getting pulled into debate about others
✅ "I'm not discussing others' performance. We're here to talk about your performance. Let's stay focused on that."

Mistake 4: Not Documenting

Why It Matters:
- Legal protection if termination needed
- Clear record of what was discussed
- Holds both parties accountable
- Shows you took it seriously

✅ Always:
- Send written summary within 24 hours
- Keep copy in personnel file
- Note their response

Mistake 5: Apologizing for Giving Feedback

❌ "I'm sorry, but I have to tell you..."
❌ "I feel bad saying this..."

✅ Instead:
"I need to share some difficult feedback about your performance."

HANDLING DIFFICULT REACTIONS:

Reaction 1: Crying

What to Do:
- Have tissues ready
- Give them a moment
- Don't rush to comfort
- Stay calm and professional

Script:
"I know this is hard to hear. Take the time you need. When you're ready, let's talk about moving forward."

What NOT to Do:
❌ Backtrack or soften the message
❌ Say "Don't cry"
❌ Get emotional yourself

Reaction 2: Anger/Defensiveness

What to Do:
- Stay calm (don't match their energy)
- Acknowledge their feelings
- Redirect to facts
- Set boundaries if needed

Script:
"I can see you're upset. The feedback is based on documented performance data. Let's take a 5-minute break and reconvene."

If They Won't Calm Down:
"We need to have this conversation professionally. If you need time to process, we can reschedule for tomorrow. But we will have this conversation."

Reaction 3: Shutting Down

Signs: No eye contact, one-word answers, checked out

What to Do:
- Name what you're observing
- Give them space to respond
- Don't fill silence

Script:
"I notice you've gone quiet. What's going through your mind right now?"

Reaction 4: Blame Shifting

Them: "It's not my fault, it's [OTHER PERSON/SYSTEM/CIRCUMSTANCE]"

Script:
"I understand there are external factors. You're still responsible for the outcomes. What could YOU have done differently?"

THE PERFORMANCE IMPROVEMENT PLAN (PIP):

When to Use:
- Performance hasn't improved after initial conversation
- Issues are serious enough to warrant formal process
- You're considering termination

The 30-60-90 Day Structure:

30 Days: Initial Improvement
- 2-3 specific, measurable goals
- Weekly check-ins
- Clear success criteria

60 Days: Sustained Progress
- Building on 30-day success
- Demonstrating consistency
- Reduced check-in frequency if improving

90 Days: Final Assessment
- Performance at acceptable standard?
- Improvement trajectory positive?
- Decision: Continue or separate

PIP Documentation Template:

PERFORMANCE IMPROVEMENT PLAN

Employee: [NAME]
Manager: [YOUR NAME]
Start Date: [DATE]
Review Date: [30/60/90 DAYS]

PERFORMANCE CONCERNS:
1. [SPECIFIC ISSUE with metrics]
2. [SPECIFIC ISSUE with metrics]
3. [SPECIFIC ISSUE with metrics]

IMPROVEMENT GOALS:
Goal 1: [SPECIFIC, MEASURABLE, TIME-BOUND]
Success Criteria: [HOW WE'LL MEASURE]

Goal 2: [SPECIFIC, MEASURABLE, TIME-BOUND]
Success Criteria: [HOW WE'LL MEASURE]

Goal 3: [SPECIFIC, MEASURABLE, TIME-BOUND]
Success Criteria: [HOW WE'LL MEASURE]

SUPPORT PROVIDED:
- [Training/resources]
- [Check-in schedule]
- [Other support]

CHECK-IN SCHEDULE:
- Weekly: [DAY/TIME]
- 30-day review: [DATE]
- 60-day review: [DATE]
- 90-day final review: [DATE]

CONSEQUENCES:
If performance does not improve to meet the goals outlined above by [DATE], employment may be terminated.

Employee Signature: _______ Date: _______
Manager Signature: _______ Date: _______
HR Signature: _______ Date: _______

AFTER THE DIFFICULT REVIEW:

Day 1-7: Monitor Closely
- Watch for immediate changes
- Be available for questions
- Reinforce expectations

Week 2-4: Check In Regularly
- Weekly 1-on-1s
- Acknowledge improvements
- Address backsliding immediately

Month 2-3: Assess Progress
- Is performance improving?
- Are they committed to change?
- Decision point: continue or exit

WHEN TO INVOLVE HR:

Always Loop in HR For:
- Formal PIP
- Any mention of termination
- Legal concerns (discrimination claims, etc.)
- Harassment or hostile behavior
- Employee requests accommodations

Before the Meeting:
"I'm planning a difficult performance conversation with [NAME]. Here's my documentation. I wanted HR aware."

DIFFICULT REVIEW CHECKLIST:

Before the meeting:
✅ Gathered specific examples with dates?
✅ Documented impact on business/team?
✅ Prepared emotionally (calm, centered)?
✅ Blocked enough time (45-60 min)?
✅ Private location secured?
✅ Tissues available?
✅ HR looped in if needed?

During the meeting:
✅ Set clear tone upfront?
✅ Stated facts specifically?
✅ Listened without defending?
✅ Created improvement plan together?
✅ Offered specific support?
✅ Set clear timeline and consequences?

After the meeting:
✅ Sent written summary within 24 hours?
✅ Documented in personnel file?
✅ Scheduled follow-up check-ins?
✅ Informed HR if appropriate?

KEY PRINCIPLE:

Honest feedback is a gift. Letting someone fail without clear feedback is cruel.

Your job is to be direct, kind, and clear. If they choose not to improve after receiving clear feedback and support, that's their choice—not your failure.`,
    tags: ["performance_review", "difficult_conversations", "feedback", "documentation", "pip", "performance_management"]
  },
  {
    source: "management_bible_enhanced",
    category: "wellbeing",
    title: "Preventing Manager Burnout: Sustaining Yourself for the Long Haul",
    content: `Management is a marathon, not a sprint. Burnout doesn't happen overnight—it's death by a thousand cuts. Your job: recognize the warning signs early and take action before you're toast.

THE BURNOUT ASSESSMENT:

WARNING SIGNS (Check all that apply):

Physical:
 Dreading work on Sunday evenings
 Trouble sleeping or sleeping too much
 Frequent headaches or body aches
 Getting sick more often
 Constant fatigue despite rest
 Changes in appetite

Emotional:
 Snapping at team members
 Cynicism about work
 Feeling detached or numb
 Lack of satisfaction from wins
 Increased irritability
 Sense of failure or self-doubt

Behavioral:
 Avoiding difficult conversations
 Working late but accomplishing less
 Procrastinating on important tasks
 Withdrawing from colleagues
 Increased alcohol/caffeine use
 Neglecting personal relationships

Scoring:
0-3 checks: You're managing well
4-7 checks: Early warning signs—take action now
8+ checks: You're burned out—urgent intervention needed

THE 5 ROOT CAUSES OF MANAGER BURNOUT:

CAUSE 1: Doing Instead of Delegating

The Pattern:
- You're working 60+ hours/week
- Your team leaves at 5pm while you stay until 8pm
- You're the bottleneck on everything
- You can't take vacation without chaos

Why It Happens:
- "It's faster if I just do it myself"
- "No one can do it as well as I can"
- "I don't want to burden my team"
- "I don't know how to delegate"

The Fix:
 Delegate ruthlessly: If someone can do it 70% as well, delegate it
 Your job is strategy and development, not execution
 Let your team grow by giving them challenges

Delegation Audit:
List everything you did this week. For each item, ask:
- Could someone else do this?
- Does this require my unique skills/authority?
- Am I doing this because I should, or because I can't let go?

If it doesn't require YOU specifically, delegate it.

CAUSE 2: No Boundaries (Always Available)

The Pattern:
- Checking email at 10pm
- Responding to Slack on weekends
- Never fully disconnecting
- Feeling guilty for taking time off

Why It Happens:
- "What if something urgent comes up?"
- "I don't want to let the team down"
- "Everyone else is always on"
- "This is what good managers do"

The Fix:
 Set clear boundaries and communicate them
 Model healthy work habits for your team
 Trust your team to handle things

Boundary-Setting Script:
"I'm setting some boundaries to be more sustainable. I won't check email after 7pm or on weekends except for true emergencies. If something urgent comes up, call me. Otherwise, I'll respond during work hours."

Boundaries to Set:
- No email after [TIME] except emergencies
- Block focus time on calendar (no meetings)
- Take full lunch break away from desk
- Use all vacation days (no rollover)
- One work-free day per weekend minimum

CAUSE 3: Perfectionism

The Pattern:
- Redoing team members' work
- Obsessing over minor details
- Never satisfied with outcomes
- Holding team to impossible standards

Why It Happens:
- "If I don't do it perfectly, it reflects poorly on me"
- "Good enough isn't good enough"
- "I'm responsible for everything"

The Fix:
 Accept the 80% solution
 Good enough is often good enough
 Not every decision is life-or-death
 Your team's 80% solution builds their capability

The Perfectionism Test:
Before redoing someone's work, ask:
- Will anyone other than me notice this imperfection?
- Does this actually impact the outcome?
- What's the cost of my time to perfect this vs the benefit?
- What message does redoing their work send?

Often, your perfectionism is costing more than it's worth.

CAUSE 4: Lack of Support from Your Manager

The Pattern:
- Your manager is absent or unhelpful
- You have no one to vent to
- You're figuring everything out alone
- You don't get feedback or coaching

Why It Happens:
- Your manager is overwhelmed too
- They assume you're fine
- You don't ask for help
- They don't know how to support managers

The Fix:
 Be explicit about what you need
 Schedule regular 1-on-1s with YOUR manager
 Ask for specific support

Script for Asking for Support:
"I'm feeling overwhelmed with [SITUATION]. I could use your help with [SPECIFIC REQUEST]. Do you have 30 minutes this week to discuss?"

What to Ask For:
- Help prioritizing conflicting demands
- Air cover for difficult decisions
- Coaching on specific challenges
- Resources (budget, headcount, tools)
- Permission to say no to requests

CAUSE 5: Caring More Than Your Team Does

The Pattern:
- You're more stressed about deadlines than they are
- You're working harder than your team
- You feel personally responsible for everything
- You can't let go of outcomes

Why It Happens:
- You're accountable for results
- You care deeply about quality
- You don't trust your team
- You haven't set clear expectations

The Fix:
 Set clear expectations and consequences
 Hold team accountable
 Let them experience natural consequences
 Stop rescuing them

The Ownership Transfer:
If you care more than they do, you own it. Transfer ownership back:

Script:
"This deadline is [DATE]. If we miss it, [CONSEQUENCE]. I need you to own this. I'm here to support, but this is your responsibility. Do you understand the stakes?"

Then: Let them own it. Don't rescue.

PREVENTION STRATEGIES:

STRATEGY 1: Manage Your Energy, Not Just Time

The Reality:
You have limited mental and emotional energy. Manage it like a budget.

Energy Drains:
- Difficult conversations
- Conflict
- Context switching
- Back-to-back meetings
- Decision fatigue

Energy Boosters:
- Exercise
- Time in nature
- Deep work on meaningful projects
- Connecting with people you like
- Accomplishing something tangible

How to Manage Energy:
 Schedule difficult conversations when you're fresh (morning)
 Take breaks between intense meetings (15 min minimum)
 Block focus time for deep work
 Limit decisions (automate routine choices)
 Exercise, sleep, eat well (basics matter)

STRATEGY 2: Build Your Support System

You can't do this alone. You need:

1. Peer Manager to Vent With
Someone who gets it. Not your team, not your manager—a peer.

Where to Find:
- Other managers in your company
- Manager communities online
- Former colleagues who are now managers

What to Talk About:
- Challenges you're facing
- How they handle similar situations
- Venting (in confidence)
- Celebrating wins

2. Mentor or Coach
Someone more experienced who can guide you.

What They Provide:
- Perspective
- Pattern recognition
- Advice based on experience
- Accountability

3. Regular 1-on-1s with YOUR Manager
Your manager should be supporting you too.

What to Discuss:
- Challenges you're facing
- Resources you need
- Feedback on your performance
- Career development

4. Manager Community
Online or in-person groups of managers.

Benefits:
- You're not alone
- Learn from others' experiences
- Resources and templates
- Emotional support

STRATEGY 3: Let Go of Perfection

The Perfectionism Mantras:

"Good enough is often good enough"
Not every deliverable needs to be perfect. Most need to be good enough.

"Not every decision is life-or-death"
Most decisions are reversible. Make the call and move on.

"Your team's 80% solution builds their capability"
Let them learn by doing imperfectly.

"Done is better than perfect"
Shipping something good beats perfecting something forever.

The Perfectionism Audit:
When you catch yourself perfecting something, ask:
- What's the actual cost of this not being perfect?
- What's the cost of my time to perfect it?
- Is this the best use of my energy right now?

Often, the answer is: let it go.

RECOVERY STRATEGIES (If You're Already Burned Out):

STEP 1: Acknowledge It
"I'm burned out. This isn't sustainable. Something needs to change."

Don't minimize it. Don't power through. Address it.

STEP 2: Take Time Off
You can't recover while still in the fire.

Minimum: 1 week completely disconnected
Ideal: 2 weeks

Truly disconnect:
- Delete work email from phone
- Set out-of-office with backup contact
- Don't check in "just once"

STEP 3: Identify What Needs to Change
What specifically is causing burnout?

Common Culprits:
- Workload too high
- Lack of support
- Toxic team member
- Unclear expectations from above
- Perfectionism
- No boundaries

Pick 1-2 to address first.

STEP 4: Have the Conversation
With your manager:

Script:
"I need to talk about my workload and sustainability. I'm working 60+ hours/week and it's not sustainable. I need help prioritizing or getting resources. Can we discuss?"

Be specific about what you need:
- Headcount
- Budget
- Permission to say no
- Help prioritizing
- Reduced scope

STEP 5: Make Changes
Based on what you identified, make concrete changes:

Examples:
- Delegate 3 tasks this week
- Set email boundary (no checking after 7pm)
- Block 2 hours/day for focus time
- Start saying no to non-essential requests
- Find a peer manager to vent with

BURNOUT PREVENTION CHECKLIST:

Weekly:
 Took at least 1 full day off (no work)?
 Exercised 3+ times?
 Had at least 1 meal with family/friends?
 Got 7+ hours sleep most nights?
 Did something just for fun?

Monthly:
 Took at least 1 full weekend off?
 Had meaningful conversation with peer manager?
 Delegated at least 1 new task?
 Said no to at least 1 non-essential request?
 Reviewed and adjusted boundaries?

Quarterly:
 Took at least 1 week vacation?
 Assessed energy levels and burnout signs?
 Made adjustments based on what's not working?
 Celebrated wins and progress?

KEY PRINCIPLES:

1. You Can't Pour from an Empty Cup
Taking care of yourself isn't selfish—it's required to take care of your team.

2. Burnout is a System Problem, Not a Personal Failure
If you're burned out, something about the system needs to change.

3. Model Healthy Habits
Your team watches you. If you're always on, they'll feel they should be too.

4. Ask for Help Early
Don't wait until you're toast. Address warning signs immediately.

5. Management is a Marathon
Pace yourself. You need to be sustainable for years, not months.

FINAL THOUGHT:

If you're burned out, you can't coach, can't make good decisions, and can't model healthy work habits.

Your effectiveness as a manager depends on your wellbeing. Protect it fiercely.`,
    tags: ["burnout", "wellbeing", "boundaries", "self_care", "sustainability", "work_life_balance", "manager_health"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding knowledge base with Management Bible scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of SAMPLE_SCENARIOS) {
      try {
        console.log(`Loading: ${scenario.title}`);
        
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, {
          source: scenario.source,
          category: scenario.category,
          title: scenario.title,
          content: scenario.content,
          tags: scenario.tags
        });
        
        loaded++;
        console.log(`  ✅ Loaded`);
        
      } catch (error) {
        errors++;
        console.error(`  ❌ Error:`, error);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  Loaded: ${loaded}`);
    console.log(`  Errors: ${errors}`);
    console.log(`  Total: ${SAMPLE_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: SAMPLE_SCENARIOS.length
    };
  },
});
