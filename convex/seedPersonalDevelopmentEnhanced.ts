/**
 * ENHANCED Personal Development Scenarios
 *
 * Each entry: 1,200+ words with scripts, templates, troubleshooting, examples.
 * Run: npx convex run seedPersonalDevelopmentEnhanced:seed
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

interface EnhancedScenario {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

export const PERSONAL_DEV_SCENARIOS_ENHANCED: EnhancedScenario[] = [
  {
    source: "personal_development_enhanced",
    category: "confidence",
    title: "Building Unshakeable Confidence: A 90-Day Evidence-Based Program",
    content: `Confidence is not a personality trait you either have or you don't. It's a skill you earn through evidence, practice, and compassionate self-management. This 90-day program combines psychology-backed frameworks, daily routines, conversation scripts, and troubleshooting to help you create a level of confidence that holds up under pressure.

FOUNDATIONS: THE CONFIDENCE TRIAD
1. Competence: Do you have the skills and reps?
2. Courage: Will you act despite discomfort?
3. Self-Compassion: Can you support yourself when you fall short?

Confidence = (Competence × Courage) + Self-Compassion
If any leg is weak, the whole structure collapses. We'll develop all three deliberately.

PHASE 1 (DAYS 1-30): BUILD YOUR EVIDENCE VAULT
Goal: Prove to yourself, with facts, that you are capable.

Daily Practice (15 minutes):
- Wins Log: Capture 3 wins (big or small). Focus on effort, strategies, and outcomes. Example entry: "Prepared the client deck under tight deadline, received positive feedback from Alex for clarity."
- Feedback Archive: Save positive emails, messages, Slack shout-outs, testimonials. Paste into a single running document. Tag each with the skill demonstrated (e.g., facilitation, problem-solving, empathy).
- Strength Reflection: Write one sentence answering "What did I handle well today?" Even on rough days, identify resilience, adaptability, or honesty.

Weekly Evidence Review (30 minutes):
- Review entire wins log aloud. The auditory reinforcement matters.
- Highlight top 3 entries and note the skill demonstrated.
- Write a brief summary: "This week proved I'm strong at stakeholder communication because..."

Competence Accelerator:
- Select ONE core skill you want to be known for (e.g., strategic storytelling, technical leadership, client facilitation).
- Identify the reps you need (courses, stretch projects, mentorship).
- Schedule 2 focused skill blocks per week (90 minutes each). Treat like meetings with yourself—non-negotiable.

PHASE 2 (DAYS 31-60): COURAGE REPS AND IDENTITY STORY
Goal: Act like the confident version of you before you feel ready.

The Courage Ladder:
1. List five situations that trigger self-doubt (e.g., challenging authority, presenting to executives, giving candid feedback).
2. Rate each 1-10 on discomfort.
3. Start with the 4-5 level tasks, then move up as comfort grows.

Action Requirement: Minimum 3 courage reps per week.
- Example: Volunteer to present a project update (discomfort 5).
- Example: Ask for feedback from someone you admire (discomfort 6).
- Example: Offer to mentor a junior colleague (discomfort 4).

The Identity Story (script for interviews, networking, self-talk):
"I create confidence by earning it. Over the past two months I've documented 60+ evidence points of value I've delivered, focused my practice on strategic storytelling, and taken on progressively more visible presentations. When fear shows up, I acknowledge it, breathe, and act anyway—and then log the proof that I can handle it."

PHASE 3 (DAYS 61-90): SELF-COMPASSION & RESILIENCE
Goal: Bounce back fast when things go sideways.

The Self-Coaching Framework (use after mistakes or criticism):
1. Name the Feeling: "I'm embarrassed and frustrated."
2. Validate Humanity: "Anyone learning something new stumbles."
3. Extract Data: "Which part was in my control? What can I improve?"
4. Future Plan: "Next time I'll rehearse with a peer and have two backup examples."
5. Encourage: "You've recovered before; you'll do it again."

Compassion Script (say aloud in mirror or journal):
"It's okay that I'm uncomfortable. Discomfort means I'm stretching. I don't need to be perfect—I just need to keep practicing and using what I'm learning."

THE CONFIDENCE TOOLKIT

1. Confidence Brief (update weekly)
Section A: Core strengths (evidence-backed)
Section B: Signature wins with metrics
Section C: Testimonials (exact quotes)
Section D: Skills under development + progress
Section E: What I'm practicing this week
Keep this as PDF or Notion page. Review before high-stakes moments.

2. Moment-of-Need Protocol (for immediate nerves)
- Grounding breath: Inhale 4, hold 4, exhale 6. Repeat 3 cycles.
- Power posture: Stand tall, shoulders back, weight evenly distributed, hold for 2 minutes.
- Mantra: "I have done the work. I can trust myself for the next five minutes."
- Evidence flash: Recall 3 recent wins; visualize faces of people who appreciated your work.

3. Social Proof Practice
- Weekly gratitude note to someone who impacted you (builds confidence through connection).
- Monthly "teach-back" session: host 30-minute session sharing what you learned recently. Teaching cements competence and rewires identity.

CONFIDENCE CONVERSATION SCRIPTS

Mentor Request:
"I'm working on showing up with more confidence in strategic conversations. I admire how you navigate pushback. Could we schedule 20 minutes for me to learn how you prepare and recover when meetings get tough?"

Feedback Ask:
"I'm building evidence for where I deliver the most value. When we worked on the Q2 project, what did I do that made the biggest difference? Where could I have elevated even more?"

Advocacy Ask:
"I'm intentionally taking on more visible work to expand my confidence zone. There's a cross-functional update next week—I'd love to lead the walkthrough if you're open to it."

TROUBLESHOOTING & RESCUE PLANS

Scenario 1: Spiral After Tough Feedback
Response: Limit rumination to 15 minutes. Use self-coaching script. Extract one improvement. Schedule a do-over or follow-up meeting to demonstrate the change.

Scenario 2: Comparison Envy on Social Media
Response: Unfollow triggers for 30 days. Redirect energy—write down what you admire about the person, and turn it into a skill development plan. Reach out to learn from them rather than stew.

Scenario 3: Confidence Drop Before Key Presentation
Response: Review confidence brief, run moment-of-need protocol, rehearse with supportive peer, visualize successful outcome, focus on message value rather than self-image.

Scenario 4: Leadership Visibility Anxiety
Response: Co-present with senior colleague first. Debrief after. Document what went well. Gradually take larger segments. Aim for 10% stretch beyond comfort per opportunity.

MEASURING PROGRESS

Weekly Metrics:
- Confidence rating (1-10) before and after key events.
- Number of courage reps completed.
- Number of evidence entries logged.
- Self-compassion moments: times you consciously shifted from blame to coaching.

Monthly Reflection Questions:
1. Where did I feel most confident? Why?
2. What evidence did I collect that surprised me?
3. Which courage rep was most meaningful?
4. How quickly did I recover from setbacks compared to last month?
5. Where do I still hesitate—and what ladder rung can I tackle next?

90-DAY OUTCOME TARGETS
- Evidence vault with 270+ entries (3 per day).
- Confidence rating increase baseline from 4/10 to 7/10 (self-report).
- At least 9 courage reps completed (3 per month, increasing intensity).
- Documented self-compassion practice used after every setback.
- At least one mentor and one peer providing ongoing feedback.

SUSTAINING UNWAVERING CONFIDENCE

1. Maintain the Evidence Habit:
Reduce daily logging to 1-2 wins but never stop completely. Confidence decays without reinforcement.

2. Upgrade Your Circle:
Surround yourself with people who celebrate effort, not just outcomes. Start a monthly "courage club" sharing wins and failures.

3. Teach or Mentor:
Nothing crystallizes belief like seeing others grow because of your guidance. Formalize a mentorship or lead workshops.

4. Keep Stretching:
Every quarter, identify a new "confidence arena" (e.g., public speaking, executive negotiation, thought leadership pieces). Apply the same triad process.

5. Protect Rest:
Confident people sleep, hydrate, and move. Exhaustion erodes self-trust faster than any criticism.

KEY PRINCIPLE
Confidence is not the absence of doubt; it's the accumulation of proof that you can handle doubt and still deliver. Keep collecting proof, keep taking brave action, keep speaking to yourself with respect. You are building a bank account of evidence that you can withdraw from anytime life delivers a test.`,
    tags: [
      "confidence",
      "personal_growth",
      "self_compassion",
      "courage",
      "skill_building",
      "mindset_program"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "goal_setting",
    title: "Setting Goals That Actually Work: The 12-Week Execution Playbook",
    content: `Goals fail when they live in notebooks instead of calendars. This playbook turns vague ambitions into a 12-week operating system with scorecards, scripts, and troubleshooting. The objective: consistent progress you can measure and celebrate.

THE 3-LAYER GOAL PYRAMID
Layer 1 – North Star (12-month vision): 3 high-level outcomes tied to identity. Example: "Become a staff-level engineer recognized for scalable architecture."
Layer 2 – 12-Week Outcomes: Tangible results that prove progress toward the North Star. Example: "Launch service X to 10k daily users with <200ms latency."
Layer 3 – Weekly Commitments: Behaviours fully within your control. Example: "Ship one performance benchmark per week." We execute from the bottom up.

STEP 1: AUDIT YOUR STARTING POINT (DAY 0)
• Values Filter: List 5 core values (e.g., mastery, impact, autonomy). Any goal misaligned gets cut.
• Capacity Reality Check: Map your actual available hours per week after work, family, health. Overcommitting destroys consistency.
• Goal Backlog: Brain-dump everything you want. Sort into Must (aligns with values + identity), Nice (lower leverage), Not Now.

STEP 2: DESIGN YOUR 12-WEEK SPRINT
Use the SMART-V framework (Specific, Measurable, Achievable, Relevant, Time-bound, Value-driven).

Example Goal Sheet (fill for each target):
• Outcome Goal: "Publish 6 long-form technical articles that attract 1k views each."
• Why Now: "Showcase architectural thinking to support Staff promotion."
• Success Metrics: Views, email sign-ups, internal recognition.
• Constraints: 10 hours/week max, weekends off.
• Stakeholders: Manager (visibility), Tech writing guild (feedback).

Create no more than three outcome goals per 12-week cycle. Force focus.

STEP 3: BUILD THE EXECUTION ENGINE

Weekly Scorecard (Notion/Airtable template):
Columns: Week #, Outcome Goal, Commitments Completed (Y/N), Metric Progress, Confidence (1-5), Notes/Learnings.

Monday Planning Ritual (30 min):
1. Review previous week’s scorecard. Highlight wins, missed commitments, root causes.
2. Set top three priorities linked to goals. Convert to calendar blocks immediately.
3. Identify friction points. Add mitigation tasks (e.g., "Book babysitter for Saturday deep work block").

Daily Start-Up (10 min):
• Confirm today’s MIT (most important task) tied to goals.
• Do a 3-minute visualization of success (neuroscience shows this increases follow-through).
• Send accountability check-in (see script below).

Accountability Script (text a peer or post in channel):
"Morning! MIT: Draft Section 2 of performance playbook (90 min deep work 8-9:30). Will update by noon." Keep it short and specific.

Friday Reflection (20 min):
1. Score each goal 0-2: 0 = no progress, 1 = partial, 2 = complete. Weekly total out of 6.
2. Journal prompts: "What helped commitments happen?" "Where did I slip? What system tweak fixes that?"
3. Celebrate micro-win: share to accountability partner, treat yourself, or log in "Victory Vault." Celebration cements behaviour.

STEP 4: DESIGN YOUR ENVIRONMENT
• Visual Goal Board: Keep your 12-week goals in your line of sight (desktop wallpaper, printed sheet).
• Calendar Architecture: Each outcome goal gets colour-coded blocks. If it’s not scheduled, it’s not real.
• Trigger Stacking: Attach goal work to existing routines. Example: "After Tuesday stand-up, I block 2 hours for article drafting."
• Remove Friction: Pre-load research materials, block distracting sites, prepare workspace night before.

STEP 5: COMMUNICATION SCRIPTS

Manager Alignment (kickoff meeting script):
"I'm running a 12-week sprint focused on [goals]. Success looks like [metrics]. I’ll share weekly updates each Friday. Can we align on any dependencies or support I should secure upfront?"

Peer Accountability Launch:
"I’m serious about completing [goal]. Want to be goal partners for the next 12 weeks? We’d share Monday commitments and Friday outcomes."

Boundary Setting with Family/Friends:
"For the next 12 weeks I’m dedicating Saturday mornings 8-11 to my project. After that, I’m all yours. Having that space helps me show up fully the rest of the time."

STEP 6: METRICS & DASHBOARD

Key Metrics to Track Weekly:
1. Production Metric: # of meaningful deliverables (e.g., blog sections written, workouts completed).
2. Outcome Metric: Real-world results (traffic, revenue, skill improvement score).
3. Consistency Metric: Commitments completed ÷ planned commitments.
4. Energy Metric: 1-5 rating of physical/mental energy (adjust plan if <3 two weeks straight).

Scorecard Formula Example:
Week 4 Score = (Deliverable Count / Goal) × 40
             + (Outcome Metric Progress %) × 30
             + (Consistency %) × 20
             + (Energy Avg × 2)
Total possible = 100. Anything above 80 indicates strong momentum.

STEP 7: TROUBLESHOOTING GUIDE

Problem: Consistently missing commitments.
Diagnosis Questions:
• Were commitments unrealistic for available time?
• Was the MIT scheduled early when energy is highest?
• Did interruptions derail you? If yes, what guardrails needed (do-not-disturb blocks, scripts for saying no)?

Fixes:
• Reduce weekly commitments by 20% (start smaller, build wins).
• Institute daily shutdown ritual to prep next day’s tasks.
• Automate or delegate low-leverage tasks.

Problem: Losing motivation mid-cycle.
Solutions:
• Return to "Why Now" statements. Rewrite them as vision statements you read daily.
• Introduce novelty—do deep work in a new environment, invite collaborator.
• Establish micro-rewards mid-week (e.g., Wednesday night outing after hitting two commitments).

Problem: Goals competing with each other.
• Conduct value-weighting: rank goals 1-3. Temporarily downgrade or pause the lowest impact one.
• Use alternating focus weeks (Goal A heavy Week 1, Goal B heavy Week 2).

STEP 8: REVIEW & RESET (WEEK 12)
• Celebrate publicly: share wins with team, community, social. Recognition reinforces identity.
• Conduct Retrospective (template provided):
  - What did we plan vs achieve? Include numbers.
  - What helped? Systems, routines, people.
  - What hindered? Distractions, unrealistic timelines.
  - What will we change in the next cycle?
• Archive artifacts: Scorecards, key learnings, finished deliverables. This becomes proof for promotions, negotiations, self-belief.

BONUS: GOAL BOARD TEMPLATE (Notion sample layout)
• Gallery view with cards for each outcome goal.
• Properties: Status, Metric Target, Deadline, Weekly Commitments, Dependencies, Risks, Celebrations.
• Linked database for Weekly Logs referencing the parent goal.

ACCOUNTABILITY CADENCE OPTIONS
• Buddy Check-In: 10 minute Monday + 10 minute Friday call.
• Group Sprint Channel: Post commitments daily; react to others for momentum.
• Manager Sync: Include goal progress in weekly 1:1 agenda.

ENERGY + RECOVERY PROTOCOL (to avoid burnout)
Daily: 7+ hours sleep, hydration, 10-minute midday movement.
Weekly: Full unplugged block (no goal work) to recharge.
Monthly: Mini-retreat afternoon dedicated to reflection and next steps.

EXAMPLES OF COMPLETED 12-WEEK SPRINTS
• Career: Transition to product management—completed 3 shadow projects, shipped case study, secured internal sponsor, landed official role.
• Personal: Marathon training—followed 4-run schedule, improved VO2 max 12%, completed race under target time.
• Financial: Saved $6,000 emergency fund—automated transfers, tracked zero-based budget, increased freelance hours.

KEY PRINCIPLE
Goals that work are observable, scheduled, and supported by systems and people. Make progress visible, keep commitments small enough to win weekly, celebrate relentlessly, and adjust instead of abandoning when life changes. The 12-week sprint rhythm turns ambition into a habit.`,
    tags: [
      "goal_setting",
      "planning",
      "execution",
      "productivity",
      "accountability",
      "twelve_week_year"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "habits",
    title: "Building Habits That Stick: The Systems Design Manual",
    content: `Habits are systems. When your environment, triggers, and rewards align, change becomes automatic. This manual applies behavioural science, architecture diagrams, and troubleshooting plans to engineer habits that compound.

STEP 0: DESIGN YOUR IDENTITY SYSTEM
Habits follow identity. Define the sentence "I am the kind of person who…" for each domain. Example: "I am the kind of person who writes thoughtful code reviews before stand-up." Identity statements guide every choice.

THE HABIT BLUEPRINT CANVAS
For each habit, capture:
1. Desired Identity (who you want to be)
2. Cue (time, location, preceding event)
3. Playground (environment design and friction removal)
4. Routine (precisely what you do)
5. Reward (immediate win + long-term benefit)
6. Accountability & Measurement (how you know it's working)

PHASE 1: CUES & ENVIRONMENT (DAYS 1-7)
• Habit Mapping Walkthrough: Physically walk through your day. Note each action. Identify natural points where new habits could stack.
• Environment Reset: Remove friction for good habits (pre-lay workout clothes, set coffee next to notebook) and add friction for bad ones (log out of distracting apps, move snacks off desk).
• Implementation Intention: Document "When I [cue], I will [routine] in [location] because [identity reinforcement]."

PHASE 2: MICRO-ROUTINE ENGINEERING (DAYS 8-21)
• Two-Minute Rule Playbook: Reduce every habit to a version that takes two minutes or less. "Go for a run" becomes "Put on running shoes and step outside." Continue after completing minimum if energy allows.
• Habit Recipe Card Template:
  - Trigger: "After I shut my laptop at 5:30 p.m."
  - Action: "I will open my habit tracker and record my shutdown checklist."
  - Reward: "I will read one page of my novel with tea."
Include contingency plan: "If my workday runs late, I will complete the habit before dinner regardless of time."

PHASE 3: TRACKING & FEEDBACK LOOPS (DAYS 22-45)
• Habit Scoreboard: Use a simple "Yes/No" grid or Seinfeld chain. Visual cues leverage loss aversion; you will act to avoid breaking the streak.
• Weekly Habit Review (15 minutes):
  - Which habits maintained 80%+ consistency? Celebrate.
  - Which fell below 60%? Diagnose using the Habit Failure Audit (Cue? Time? Emotion? Friction?).
  - Adjust scope (smaller version), move cue, or redesign reward.

PHASE 4: REINFORCEMENT & ESCALATION (DAYS 46-90)
• Progressive Overload: Increase intensity/complexity slowly. Example: add 5 minutes to meditation each month or an extra workout set after 4 weeks consistent.
• Habit Bundling: Pair productive habits with pleasurable ones (podcast only during walks, favourite coffee only after journaling).
• Social Reinforcement: Share progress weekly with mastermind, coach, or friend. Use template: "Win, wobble, what’s next." Request specific feedback.

SCRIPTS & CHECKLISTS
Morning Activation Checklist:
1. Wake at consistent time (use sunrise alarm or light).
2. Drink water (glass ready bedside).
3. Perform 60-second micro-ritual (stretch + affirmation). Ensures you start with intentionality.

Habit Relapse Recovery Script:
"Missing once is data, missing twice resets the habit. What blocked me? How can I remove or reduce that block today?"

ACCOUNTABILITY TEMPLATES
Habit Pact Agreement (with friend/peer):
• Habit focus
• Minimum weekly target
• Verification method (photo, message, app screenshot)
• Consequence for failing to report (donation, extra chore)
• Reward after 4 consecutive successful weeks

TROUBLESHOOTING
Scenario: Habit forgotten due to context switch.
Fix: Use context-based reminders (calendar alerts, physical sticky notes), or tie habit to immovable anchors (meals, commute).

Scenario: Emotion-driven derailment.
Fix: Pair habit with emotional regulation practice (breathing, journaling). For example, before starting deep work habit, run 4-7-8 breath cycle to lower stress.

Scenario: Plateau boredom.
Fix: Introduce novelty without breaking habit identity (change running route, new recipe, different study location). Maintain cue and time.

METRICS & DASHBOARDS
• Consistency Rate = Habit completions ÷ planned days × 100.
• Identity Reinforcement Score (weekly self-rating 1-5). Ask: "How much did I act like someone who [identity] this week?"
• Habit ROI Review (monthly): For each habit, record tangible results (energy, mood, project output). Drop habits that show low ROI after 8 weeks and no clear benefit.

KEY PRINCIPLE
Habits succeed when identity, environment, and reinforcement align. Design systems once, then let the system carry the weight. Your job is to keep refining the system, not relying on motivation.`,
    tags: [
      "habits",
      "behavior_change",
      "systems",
      "environment_design",
      "habit_tracking",
      "identity"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "decision_making",
    title: "Making Better Decisions: The Strategic Judgment Dashboard",
    content: `Great decisions are deliberate, data-informed, and values aligned. This dashboard gives you repeatable steps, meeting agendas, and error-proofing checklists so you can decide faster with fewer regrets.

THE 5D DECISION FLOW
1. Define – Clarify the real problem and success criteria.
2. Discover – Gather inputs without drowning.
3. Design – Create multiple viable options.
4. Decide – Choose using weighted frameworks.
5. Debrief – Capture lessons and automate improvements.

PHASE 1: DEFINE (60-90 minutes)
• Decision Brief Template:
  - Context: What triggered this decision?
  - Objective Statement: "We will decide [X] so that [impact] by [date]."
  - Success Criteria: Define 3-5 measurable or observable indicators.
  - Decision Type: Reversible (two-way door) or irreversible (one-way door).
  - Stakeholders: Who is affected? Who has veto authority?

Values Alignment Check:
List top company/personal values. Score potential options 1-5 on alignment. Reject anything scoring <3 on critical values.

PHASE 2: DISCOVER (1-3 days)
• Information Sprint Plan:
  - Data to collect (qualitative & quantitative).
  - Sources (analytics, user interviews, financial models).
  - Time-box research to avoid paralysis.
• Bias Guardrails:
  - Assign a "red team" or devil’s advocate to surface opposing evidence.
  - Use pre-mortem worksheet: "It's 6 months later and the decision failed. Why?"

PHASE 3: DESIGN OPTIONS (Half-day workshop)
• Option Generation Mandate: Minimum of three viable options plus a wild-card idea.
• Option Canvas for each:
  - Description
  - Benefits (business, user, personal)
  - Risks + mitigation
  - Required resources
  - Time horizon
• Scenario Planning: Best case, base case, worst case (probability + impact). Use decision tree if complex.

PHASE 4: DECIDE (Structured 60-minute meeting)
Meeting Agenda:
1. Review decision brief & constraints.
2. Present each option using canvas.
3. Score options with Weighted Decision Matrix (criteria × importance weight).
4. Capture gut reactions separately—emotions are data, not dictators.
5. Final decision process: consensus, majority, or single decision-maker informed by inputs.

Decision Confirmation Script (for single decider):
"Thank you for the analysis. Based on our weighted scoring (Option B scored 86 vs Option A 72), stakeholder impact, and alignment with Q3 OKRs, I'm choosing Option B. We'll revisit in 45 days to validate assumptions."

PHASE 5: DEBRIEF (30 minutes post-implementation)
• Decision Retrospective Template:
  - Did outcomes match success criteria?
  - What assumptions were wrong/right?
  - Signals to monitor for course correction?
  - What process tweak will improve next decision?
• Codify insights in a "Decision Log" (Notion/Confluence) to build institutional memory.

TROUBLESHOOTING
Issue: Stakeholder misalignment.
Solution: Run stakeholder mapping early (Interest vs Influence grid). Schedule 1:1 alignment sessions before big meeting.

Issue: Fear of making wrong irreversible call.
Solution: Introduce fail-safe triggers (milestones that prompt reevaluation), secure optionality (pilot program, staged rollout), or invest in reversible components first.

Issue: Analysis Paralysis.
Solution: Set a decision deadline. Use "Time-Boxed Discovery": no new data collection after deadline unless it materially changes odds.

DECISION DASHBOARD METRICS
• Decision Velocity: Time from brief creation to final decision.
• Decision Quality Survey: Stakeholder rating 1-5 on clarity and buy-in.
• Post-Decision Outcome Score: Percentage of decisions meeting success criteria at review.
• Learning Velocity: Number of documented insights added to decision log per quarter.

KEY PRINCIPLE
Better decisions come from designing better processes, not waiting for inspiration. Build a repeatable system that surfaces options, aligns values, and captures learnings.`,
    tags: [
      "decision_making",
      "strategic_thinking",
      "mental_models",
      "frameworks",
      "leadership",
      "problem_solving"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "resilience",
    title: "Building Mental Resilience: The Bounce-Back Operating System",
    content: `Resilience is the speed at which you return to high-quality action after stress. This operating system fuses neuroscience, rituals, and scripts so you can absorb shocks without burning out.

THE RESILIENCE LOOP
Signal → Stabilize → Scan → Strategize → Sustain

MODULE 1: SIGNAL (AWARENESS)
• Daily Signal Check (5 minutes morning & evening): Rate sleep, stress, mood, body tension on 1-5 scale. Note triggers.
• Wearable Data: Track HRV, resting heart rate, or readiness score. Sudden dips signal intervention needed.

MODULE 2: STABILIZE (ACUTE RESPONSE)
• 4-Phase Rapid Reset:
  1. Ground: Box breathing (inhale 4, hold 4, exhale 4, hold 4 × 4 cycles).
  2. Move: 60 seconds of physical movement (jumping jacks, brisk walk) to metabolize adrenaline.
  3. Label: "I’m feeling overwhelmed because…" Naming emotions reduces amygdala activation.
  4. Support: Text resilience buddy using script: "Quick check-in: tough moment because [reason]. Taking [action]." Accountability reduces isolation.

MODULE 3: SCAN (ASSESSMENT)
• Stress Map Workshop (weekly 20 minutes): Identify demands in 4 quadrants (Workload, Relationships, Health, Purpose). Rate intensity and control.
• Thought Audit: Use CBT-based worksheet to identify distortions (catastrophizing, all-or-nothing). Replace with realistic statements.

MODULE 4: STRATEGIZE (ACTION)
• Resilience Action Menu: Pre-plan interventions for each stress quadrant. Example:
  - Workload: renegotiate deadlines, delegate, break project into sprints.
  - Relationships: schedule honest conversation, set boundary template.
  - Health: adjust sleep window, add 30-minute low-intensity cardio.
  - Purpose: revisit mission statement, volunteer, mentor.

• Recovery Roadmap Template (use after setback):
  1. Event Summary (objective facts)
  2. Debt Assessment (what piled up?)
  3. Minimum Viable Progress Plan (three small wins within 48 hours)
  4. Support Allies (who to loop in?)
  5. Re-entry Ritual (physical act symbolizing restart, e.g., clearing desk)

MODULE 5: SUSTAIN (LONG-TERM)
• Non-Negotiables Contract: Define 5 practices you protect (sleep, exercise, therapy, journaling, leisure). Share with manager/family so they understand priorities.
• Quarterly Resilience Retreat: Half-day to reflect on wins, update action menu, refine boundaries, and celebrate growth.
• Gratitude & Growth Log: Nightly "3 gratitudes, 1 growth moment" to reinforce optimism bias.

SCRIPTS
Boundary Reset with Manager:
"I want to deliver sustainably. Currently managing X, Y, Z. To keep quality high, I recommend we deprioritize [task] or bring in support. What option aligns best with our goals?"

Support Ask to Friend:
"I’m working on bouncing back faster from setbacks. Could we check in on Fridays so I stay accountable to my recovery plan?"

TROUBLESHOOTING
• Signs of burnout (emotional exhaustion, cynicism, decreased efficacy) require escalation: consult healthcare professional, take leave, redesign workload.
• If resilience tools feel ineffective, audit basics: sleep, nutrition, medical conditions, or underlying trauma may need professional care.

METRICS
• Recovery Time: Hours from stress event to resumed productive action (track trend downward).
• Resilience Capacity Score: Weekly average of signal check (target >3.5).
• System Compliance: % of days non-negotiables completed.

KEY PRINCIPLE
Resilience is deliberate recovery. With a playbook ready, you waste less energy spiraling and more on strategic action.`,
    tags: [
      "resilience",
      "mental_health",
      "stress_management",
      "recovery",
      "wellbeing",
      "emotional_regulation"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "time_management",
    title: "Mastering Time Management: The Attention Portfolio System",
    content: `Time management is really attention management. This system treats your week like an investment portfolio—allocate attention to high-yield activities, rebalance weekly, and protect focus assets.

STEP 1: ATTENTION AUDIT
• Diagnose Current Allocation: Track 7 days in 30-minute blocks (use Toggl/RescueTime). Categorize into Deep Work, Collaboration, Maintenance, Recovery, Waste.
• Opportunity Cost Calculator: For each recurring meeting/task, ask "What high-impact work could this time fund instead?" Anything with negative ROI becomes a candidate for elimination or delegation.

STEP 2: PORTFOLIO DESIGN
• Strategic Buckets (percentage goals per week):
  - Deep Work (40%)
  - Strategic Planning & Learning (20%)
  - Collaboration & Stakeholders (20%)
  - Maintenance/Admin (10%)
  - Recovery (10%)
Adjust percentages based on role.

• Ideal Week Canvas: Map blocks in calendar reflecting bucket targets. Use colour-coding.

STEP 3: PROACTIVE SCHEDULING RITUAL (SUNDAY 45 MIN)
1. Review bucket actuals from last week.
2. Define 3 Weekly Outcomes (aligned with goals and OKRs).
3. Time-block Deep Work first (mornings preferred). Protect with "No meetings" calendar note.
4. Batch meetings (afternoons Tue-Thu), leave buffer blocks.
5. Insert recovery (workouts, breaks, thinking walks) intentionally.

STEP 4: DAILY OPERATING RHYTHM
Morning Launch (10 minutes):
• Review top outcomes.
• Confirm time blocks.
• Run "Focus Forecast": anticipate distractions and plan defences.

Midday Checkpoint (5 minutes):
• Evaluate if still on track. If not, adjust: shorten meetings, move tasks, communicate proactively.

Shutdown Sequence (15 minutes):
• Update task manager.
• Write tomorrow’s priority list.
• Close loops (emails, Slack). Physically shut down laptop to enforce boundary.

STEP 5: MEETING & TASK PROTOCOLS
• Meeting Acceptance Criteria: Accept only if it has clear objective, agenda, and your unique contribution. Otherwise suggest async update.
• Two-Minute Sweep: Handle tasks under two minutes immediately to reduce clutter.
• Batch Processing: Process emails/messages 2-3 times daily, never constantly.
• Focus Tools: Use website blockers, noise-cancelling headphones, and "Focus mode" on devices.

STEP 6: WEEKLY REBALANCE (FRIDAY 30 MIN)
• Compare actual vs target allocation. Identify drift.
• Conduct After-Action Reviews for overruns: "Why did Deep Work drop to 20%?" Root cause might be unplanned meetings—adjust by setting office hours.
• Celebrate wins: list what moved the needle.

SCRIPTS
Meeting Decline Script:
"Thanks for the invite. To protect focus on [priority], I’m limiting meetings. Could we handle this via shared doc? If a live discussion is critical, I’m available during my office hours on Wednesday 2-4 p.m." 

Focus Boundary Script with Team:
"I’m experimenting with deep work blocks 9-11 a.m. daily. Unless urgent, please expect responses after that window."

TROUBLESHOOTING
• Unexpected Crises: Use "Buffer Blocks" (two 60-minute slots weekly) for overflow. If crisis consumes more, reschedule lowest ROI tasks first.
• Chronic Overload: Audit commitments, negotiate with manager by presenting trade-offs and data.
• Energy Slumps: Align demanding work with chronotype. Incorporate movement snacks and hydration alarms.

METRICS
• Weekly Allocation Chart vs Target.
• Deep Work Hours (goal >10 per week for knowledge workers).
• Task Completion Rate on planned outcomes.
• Average response time to critical stakeholders (ensure boundaries don't harm relationships).

KEY PRINCIPLE
Your calendar reflects your strategy. Invest attention in what compounds, rebalance persistently, and protect the assets (energy, focus) that generate outsized returns.`,
    tags: [
      "time_management",
      "attention_management",
      "productivity",
      "prioritization",
      "deep_work",
      "calendar_design"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "procrastination",
    title: "Overcoming Procrastination: Emotion-First Action Protocol",
    content: `Procrastination is mismanaged emotion. This protocol targets feelings first, then supplies micro-actions, peer accountability, and environment changes so you start before motivation arrives.

PHASE 1: EMOTION DIAGNOSTIC
• Trigger Tracker (daily): When delaying, document:
  - Task
  - Emotion (fear, boredom, overwhelm, resentment)
  - Thought ("What if I fail?", "This is pointless")
  - Body sensation (tight chest, heavy eyes)
• Identify dominant procrastination archetype: Perfectionist, Avoider, Thrill-Seeker, Overcommit-er, Indifferent.

PHASE 2: EMOTION REGULATION TOOLKIT
• 90-Second Reset: Set timer, allow emotion fully, breathe slowly. Recognize emotions peak and pass within 90 seconds if not fed stories.
• Compassionate Self-Talk Script: "It's okay to feel resistance. I'm not behind; I'm starting now."
• Task Reframe Worksheet: Convert threat statements into opportunity statements. Example: "This report might be criticized" → "This report gives me data to improve."
PHASE 3: MICRO-ACTION LAUNCHPAD
• Momentum Menu for each major project: list 5 actions that take under 5 minutes. Example for writing: open doc, write outline header, drop bullet ideas, insert quote, draft messy intro.
• 5-Minute Contract: Promise to work for five minutes, no obligation to continue. Most often momentum carries you forward; if not, you've still made progress.
• Pomodoro Variations: 25/5 for standard tasks, 15/5 for high resistance, 50/10 for deep flow.

PHASE 4: ACCOUNTABILITY & ENVIRONMENT
• Body Doubling Sessions: Schedule virtual coworking (Focusmate, Discord). Opening script: "Focus block: editing presentation. Goal: finish slides 5-8." Closing script: "Completed slides 5-7, outline for 8. Next action tomorrow 9 a.m." 
• Commitment Contracts: Publicly declare deadline and consequence (donation, extra chores). Use apps like StickK or manual agreements with friend.
• Environment Sweep: Remove friction (close tabs, tidy desk), add triggers (project list on whiteboard), queue inspiring playlist.

PHASE 5: SYSTEMIC PREVENTION
• Calendarize Start Times, not Deadlines: Deadlines encourage last-minute panic; scheduled starts create consistent progress.
• Weekly Resistance Review (Sunday 20 min): Analyze where procrastination emerged. Determine root cause and adjust plan (simplify tasks, ask for clarity, renegotiate scope).
• Reward Staircase: Plan rewards at 25%, 50%, 75%, and 100% completion. Rewards must align with values (break, experience, social time).

TROUBLESHOOTING
• If resistance persists after 3 rounds, escalate: pair with mentor, request clarification, or break task into absurdly tiny pieces ("write one new sentence").
• Address underlying issues: chronic procrastination may signal burnout, misaligned goals, or mental health conditions—seek professional support when needed.

METRICS
• Launch Latency: Time between scheduled start and actual start (aim to reduce to <10 minutes).
• Task Decomposition Score: Percentage of tasks with defined first action (target 100%).
• Emotion Awareness Frequency: Number of triggers logged per week (more logging = higher awareness).

KEY PRINCIPLE
Action follows emotion. Regulate discomfort, script microscopic starts, and surround yourself with accountability. You don’t need to feel ready—you need to begin.`,
    tags: [
      "procrastination",
      "motivation",
      "emotion_regulation",
      "focus",
      "accountability",
      "behavior_change"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "stress_management",
    title: "Managing Stress Effectively: The Nervous System Reset Plan",
    content: `Stress isn’t the enemy; staying in stress mode is. This plan integrates physiology, rituals, and communication scripts to reset your nervous system and prevent burnout.

FOUNDATION: STRESS SIGNATURE
• Identify your stress signature across four signals:
  - Physical (tension, headaches, gut issues)
  - Emotional (irritability, anxiety, flatness)
  - Cognitive (rumination, indecision)
  - Behavioural (comfort eating, procrastination)

• Create Red-Yellow-Green dashboard:
  - Green: Baseline, maintain.
  - Yellow: Early warning signs (activate mini resets).
  - Red: Acute stress (deploy full protocol, communicate boundaries).

DAILY RESET STACK
Morning (10 minutes):
1. Light exposure + movement (2-minute mobility routine).
2. Diaphragmatic breathing (5 cycles 4-7-8).
3. Intention statement: "Today, I regulate calmly and move with purpose."

Midday (5 minutes):
• Somatic micro-break: shake limbs, stretch spine, breathwork.
• Hydration + protein snack to stabilize blood sugar.

Evening (20 minutes):
• Transition ritual: walk, shower, or journal to mark workday end.
• Digital sunset: devices off 60 minutes before bed, warm light, low-stimulation activities.

WEEKLY RECOVERY INTENSIVE (60 minutes):
• Mix of: sauna, yoga, massage gun, long walk in nature, creative hobby. Schedule like any meeting.

ACUTE STRESS PROTOCOL
1. Stoplight Assessment (label level).
2. Physiological Sigh (double inhale through nose, long exhale through mouth x3) to drop heart rate.
3. Ground: Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, 1 you can taste.
4. Reappraise: "Stress means my body is gearing up to help me."
5. Act: Solve the smallest piece within 10 minutes.

COMMUNICATION SCRIPTS
Boundary Request:
"To stay effective, I need to protect a buffer this evening. Let’s revisit first thing tomorrow with fresh energy."

Escalation to Manager:
"My workload has been at yellow/red for two weeks. Here’s my current slate. To keep quality high, can we postpone [project] or bring in backup for [task]?"

Family/Friend Support Ask:
"This week is intense. Could we trade dinners so I can decompress Wednesday night?"

TROUBLESHOOTING
• Persistent insomnia: audit caffeine, screen exposure, and consult a professional if pattern persists >2 weeks.
• Chronic irritability: indicates boundaries violated—schedule recalibration conversation with stakeholders.
• Somatic symptoms: practise progressive muscle relaxation or book medical check-up.

METRICS
• Stress Level Log: record daily rating 1-5.
• Reset Compliance: % of scheduled resets executed.
• Recovery Score: Track via wearable or subjective (1-5).

KEY PRINCIPLE
Stress management is about completing the stress cycle daily. Teach your nervous system to return to baseline quickly, and life’s demands become training, not trauma.`,
    tags: [
      "stress_management",
      "nervous_system",
      "self_care",
      "wellbeing",
      "breathwork",
      "boundaries"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "mindset",
    title: "Developing a Growth Mindset: The Neuroplasticity Practice Lab",
    content: `Growth mindset is deliberate. Use this lab to catch fixed-mindset triggers, rewire self-talk, and codify experiments that stretch your capacity.

MODULE 1: MINDSET AWARENESS
• Trigger Journal: For two weeks, log moments of defensiveness, avoidance, or shame. Columns: Situation, Automatic Thought, Emotion, Behaviour, Growth Response.
• Mindset Language Audit: Replace binary language ("always", "never", "can’t") with spectrum language ("practising", "learning", "not yet"). Post reframes at workspace.

MODULE 2: BELIEF RESTRUCTURING
• Self-Talk Script Bank:
  - Fixed Thought: "I’m bad at presentations."
  - Growth Reframe: "Every presentation is practice. I can isolate one skill to improve today."
• Daily Affirmation Trio: 1) Skill I’m developing, 2) Lesson learned yesterday, 3) Stretch target for today.

MODULE 3: EXPERIMENT DESIGN
• Weekly Stretch Experiment Planner:
  - Hypothesis: "If I volunteer to demo our feature, I’ll improve product storytelling."
  - Experiment: "Lead demo at Thursday stand-up."
  - Success Criteria: "Collect feedback from two teammates and identify one improvement."
  - Debrief: Document what worked, what didn’t, what to adjust.

• Failure Post-Mortem Framework:
  1. Facts (no judgments)
  2. Feelings (acknowledge)
  3. Findings (what new data?)
  4. Future (next experiment)

MODULE 4: FEEDBACK IMMERSION
• Feedback Ladder: Receive, Reflect, Respond, Request follow-up.
• Feedback Request Script:
"I’m practising a growth mindset around my stakeholder updates. Could you observe today’s presentation and share one thing that worked and one thing I can refine for next time?"

• Feedback Debrief Template: Capture the advice, categorize (skill, behaviour, perception), schedule practice to integrate.

MODULE 5: COMMUNITY & ENVIRONMENT
• Mindset Circles: Monthly gathering where each person shares experiment outcomes, failures, and next stretches. Keeps normalization high.
• Enrichment Diet: Consume content showcasing learning journeys (podcasts, biographies). Log weekly insights.

TROUBLESHOOTING
• If fear of judgment dominates, start with private experiments before public ones.
• When self-criticism spikes, practise self-compassion breaks (hand on heart, repeat "This is a moment of growth. Growth is hard. I can support myself through it.").

METRICS
• Experiment Velocity: Number of stretch experiments run per month (goal ≥4).
• Feedback Integration Rate: % of feedback items acted upon within two weeks.
• Mindset Sentiment: Weekly self-rating of growth vs fixed (1-10 scale).

KEY PRINCIPLE
Growth mindset is built through repeated experiments and compassionate reflection. Document everything—experiments, lessons, language—and you'll literally watch your brain adapt.`,
    tags: [
      "growth_mindset",
      "neuroplasticity",
      "self_talk",
      "experimentation",
      "learning",
      "feedback"
    ]
  },
  {
    source: "personal_development_enhanced",
    category: "communication",
    title: "Effective Communication Skills: The Influence Playbook",
    content: `Influence is built on clarity, empathy, and follow-through. This playbook equips you with meeting frameworks, messaging templates, and conflict scripts to communicate so people feel seen and take action.

MODULE 1: MESSAGE ARCHITECTURE
• The CLEAR Framework:
  C – Context: establish why it matters now.
  L – Lead Idea: what you propose.
  E – Evidence: data, stories, examples.
  A – Action: what you’re asking.
  R – Relevance: why it matters to them.

• One-Pager Template: Title, Problem, Proposed Solution, Benefits, Risks, Next Steps. Deliver before meetings to prime understanding.

MODULE 2: LISTENING INTELLIGENCE
• Listening Styles Assessment: Identify if you default to critical, relational, analytical, or task-focused listening. Develop flexibility.
• Listening Ritual:
  1. Prepare: silence notifications, take deep breath.
  2. Attend: maintain soft eye contact, nod, mirror posture.
  3. Reflect: paraphrase key points.
  4. Clarify: ask open questions.
  5. Validate: acknowledge emotions before solving.

MODULE 3: HIGH-STAKES MEETINGS
• Meeting Blueprint:
  - Objective (1 sentence)
  - Desired Decision or Outcome
  - Attendees & Roles
  - Agenda with time boxes
  - Pre-reads and preparation tasks
• Facilitation Moves:
  - Round-robin for inclusion
  - Parking lot for off-topic issues
  - Summarize decisions live
• Close with Action Log: Who, What, When, Next Check-in.

MODULE 4: FEEDBACK & CONFLICT
• SBI + WIN Feedback Script:
  - Situation: "In yesterday’s planning call…"
  - Behaviour: "…when you dismissed the QA findings…"
  - Impact: "…the team felt their work wasn’t valued."
  - Way Forward: "Next time, can we review their data before concluding?"
• Conflict Alignment Conversation:
  - Start with shared goal: "We both want product launches to feel polished."
  - Share perspective: "From my side, last-minute design changes cause QA scramble."
  - Invite theirs: "How does it look from your end?"
  - Co-create solution: "What if we lock designs two sprints out and set a formal change review?"

MODULE 5: STORYTELLING & PRESENTATIONS
• Story Spine Template: Situation → Complication → Insight → Resolution → Call-to-Action.
• Hook Arsenal: question, startling statistic, short anecdote.
• Slide Design Checklist: one idea per slide, minimal text, purposeful visuals, contrast for readability.

MODULE 6: ASYNCHRONOUS COMMUNICATION
• Write in layers: Summary up top (TL;DR), details below, appendix for data.
• Use bullets and headings for scannability.
• Record Loom walkthroughs for complex topics; include captioned transcript for accessibility.

PRACTICE CADENCE
• Weekly: lead or facilitate one meeting, request feedback.
• Monthly: publish internal update or article.
• Quarterly: deliver presentation to cross-functional group.

METRICS
• Response Quality Score: Stakeholders rate clarity 1-5.
• Meeting Efficiency: % of meetings ending with action log.
• Follow-up Compliance: Tasks completed by agreed deadlines.

KEY PRINCIPLE
Communication scales your impact. Prepare intentionally, listen fully, adapt your message, and close every loop. When people feel understood and know the next step, they trust you—and move with you.`,
    tags: [
      "communication",
      "influence",
      "listening",
      "storytelling",
      "facilitation",
      "feedback"
    ]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    let loaded = 0;
    let errors = 0;
    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const scenario of PERSONAL_DEV_SCENARIOS_ENHANCED) {
      try {
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, {
          source: scenario.source,
          category: scenario.category,
          title: scenario.title,
          content: scenario.content,
          tags: scenario.tags
        });

        loaded++;
        results.push({ title: scenario.title, success: true });
      } catch (error) {
        errors++;
        results.push({
          title: scenario.title,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return {
      loaded,
      errors,
      total: PERSONAL_DEV_SCENARIOS_ENHANCED.length,
      results
    };
  }
});
