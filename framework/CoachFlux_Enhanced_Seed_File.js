/**
 * Enhanced Management Bible Knowledge - DEEP RAG Scenarios
 * 
 * Source: The Management Bible by Bob Nelson & Peter Economy (2005)
 * Enhancement: Extracted full content, added frameworks, scripts, troubleshooting
 * Format: Ready for seedKnowledge.ts ingestion into CoachFlux
 * 
 * Usage:
 *   1. Copy these scenarios into convex/seedKnowledge.ts SAMPLE_SCENARIOS array
 *   2. Run: npx convex run seedKnowledge:seed
 *   3. RAG will now have 3x deeper content (800-1400 words vs 200-400)
 */

const ENHANCED_SCENARIOS = [
  
  // ============================================================================
  // SCENARIO 1: Effective Delegation (ENHANCED - 1,200 words)
  // ============================================================================
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

  // ============================================================================
  // SCENARIO 2: Direct, Kind Feedback (ENHANCED - 1,400 words)
  // ============================================================================
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

  // ============================================================================
  // SCENARIO 3: Chronic Underperformance (ENHANCED - 1,300 words)
  // ============================================================================
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

];

// Export for integration
module.exports = { ENHANCED_SCENARIOS };
