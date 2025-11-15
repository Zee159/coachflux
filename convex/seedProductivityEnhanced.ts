/**
 * ENHANCED Productivity & Focus Scenarios
 *
 * Each scenario delivers ~1,200 words of operating systems, scripts, templates, troubleshooting, and examples.
 * Run: npx convex run seedProductivityEnhanced:seed
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

export const PRODUCTIVITY_SCENARIOS_ENHANCED: EnhancedScenario[] = [
  {
    source: "productivity_enhanced",
    category: "deep_work",
    title: "Deep Work Engine: Architecting 4-Hour Focus Blocks in a Distracted World",
    content: `Deep, uninterrupted work is the force multiplier behind creative breakthroughs and strategic execution. This operating system gives you step-by-step rituals, environmental design, team agreements, and troubleshooting to consistently produce 4+ hours of deep work per day—even in interrupt-heavy roles.

MISSION SNAPSHOT
Objective: Establish two daily deep work blocks (60-120 minutes each) with 90% adherence, measurable output targets, and clear guardrails from team and technology interruptions.
Components: Focus Scorecard, Environment Blueprint, Collaboration Contracts, Recovery Protocols, Metrics Dashboard.

PHASE 1: DEFINE THE WORK THAT DESERVES DEPTH
1. Identify Deep Work Candidates
   - List tasks that create disproportionate value: product strategy, research synthesis, writing, design, code architecture, critical analysis.
   - Run each through the Impact-Longevity Test: “Will this matter in 12 months?” “Does quality improve with concentration?”
   - Create Deep Work Menu with 10 recurring activities, each including definition of done.

2. Quantify Output Metrics
   - Choose lag metrics (features shipped, chapters drafted) and lead metrics (hours in deep work, number of distraction-free blocks completed).
   - Use Focus Score (0-100) daily: (Minutes of Deep Work ÷ Planned Deep Work Minutes) × Quality Rating (1-5).

3. Stakeholder Alignment
   - Share deep work plan with manager/team: “These blocks ensure I deliver strategic outcomes faster. Here’s how I’ll stay responsive outside blocks.”
   - Add deep work windows to shared calendars as "Focus - Heads Down".

PHASE 2: ENGINEER YOUR ENVIRONMENT
1. Physical Space Design
   - Dedicated zone for deep work; remove clutter, add visual cue (Do Not Disturb sign, closed door).
   - Equip with analog tools (whiteboard, notepad) to reduce digital toggling.
   - Optimize ergonomics: chair support, monitor height, temperature 68-72°F.

2. Digital Defense System
   - Configure Focus modes (macOS, Windows, mobile) blocking notifications except from critical people.
   - Install website blockers (Freedom, Cold Turkey) during blocks.
   - Use separate browser profile for deep work with only required tabs.

3. Context Reset Ritual
   - Pre-block checklist: clear desk, fill water, open project brief, review acceptance criteria.
   - Entry anchor: breathe 4-7-8 once, read focus statement: “For the next 90 minutes I’m building the product roadmap narrative.”
   - Set intention timer (Time Timer, analog clock) to visualize block duration.

PHASE 3: STRUCTURE THE BLOCK
1. Block Anatomy (90 minutes example)
   - Minutes 0-15: Clarify deliverable. Update working doc, list micro milestones.
   - Minutes 15-60: Execute primary task, log progress in real time (comments, version notes).
   - Minutes 60-75: quick stretch/reset, check progress vs. plan, adjust approach.
   - Minutes 75-90: Polish output, record summary note for future self.

2. Cognitive Positioning
   - Use "Attention Ladder": warm-up (read previous notes), climb to flow (single-task, noise blocked), hold focus (tidy workspace, set audible reminders).
   - Deploy Pomodoro variants if necessary (3 × 25 minutes with 5-minute breaks) but maintain single task.

3. Output Logging
   - End block by updating Focus Journal: what was achieved, where friction arose, next steps, idea parking lot.
   - Send quick async update if stakeholders waiting (“Deep block complete: draft sections 1-2 done, ready for review tomorrow.”).

PHASE 4: TEAM & SYSTEM ALIGNMENT
1. Collaboration Contract
   - Draft agreement clarifying availability: “Reachable 11:30-12 and 4-5 daily; focus blocks 9-11 and 1-3.”
   - Define escalation path: text or call for true emergencies (list criteria). Everything else via async.

2. Meeting Architecture
   - Batch synchronous calls outside deep work windows. Prefer no-meeting mornings or afternoons.
   - Use shared agenda doc to reduce ad hoc syncs.

3. Async Communication Practices
   - Templates for status updates: “Context, current state, blockers, requests.”
   - Encourage team to use scheduled send, thread replies, and documented decisions to maintain flow for all.

PHASE 5: TROUBLESHOOTING
Issue: Interruptions persist.
   - Solution: Re-educate stakeholders, update calendar holds, use auto-responder (“In focus block until 3 PM. Leave notes; I’ll reply then.”). Track interruptions to identify patterns.

Issue: Mind wanders or procrastination.
   - Solution: Shorten block to 45 minutes, build ramp-up routine (3 minutes tidying, 2 minutes breathing). Use commitment device (work with focus buddy on video, body doubling).

Issue: Task ambiguous.
   - Solution: Pause block, clarify deliverable (“What does done look like?”). Break into smaller milestones before resuming.

Issue: Energy crash.
   - Solution: Align blocks with peak cognitive times (chronotype). Ensure nutrition/hydration; insert micro-movement break at minute 45.

Issue: After block, re-entry chaos.
   - Solution: Allocate 15-minute buffer for triaging messages. Use triage matrix (urgent/important). Re-enter shallow work intentionally.

TOOLS & TEMPLATES
1. Deep Work Planner (Notion/Spreadsheet)
   - Columns: Date, Block Start/End, Focus Task, Metrics, Obstacles, Next Action.

2. Focus Contract Template
   - Section: Why deep work matters, schedule, availability guidelines, escalation paths, support needed.

3. Distraction Audit Sheet
   - Track source, time, reason, mitigation plan.

4. Recovery Ritual Menu
   - 5-minute (stretch), 10-minute (walk), 20-minute (meditation) options to reset after intense blocks.

CASE STUDIES
Case 1: Product designer in high meeting culture
   - Introduced Focus Contract, shifted team stand-up to async updates, secured two 90-minute blocks daily.
   - Output: Prototyping speed doubled, stakeholder satisfaction improved.

Case 2: Academic researcher juggling teaching
   - Bunched lectures into two days, used deep work mornings three days/week. Created door sign “Writing in progress—available at 1 PM.”
   - Published 30% more papers, reduced weekend grading.

Case 3: Engineering lead with constant Slack pings
   - Implemented Slack statuses with auto responses, empowered team with "Office Hours" for questions.
   - Achieved consistent 4 hours deep work/day, no drop in team responsiveness scores.

Remember: Deep work is a systemic choice. Protect your best hours, communicate expectations, and iterate on rituals weekly. Once the engine is running, breakthroughs become predictable—not accidental.`,
    tags: [
      "deep_work",
      "focus",
      "productivity",
      "time_management",
      "flow_state"
    ]
  },
  {
    source: "productivity_enhanced",
    category: "time_blocking",
    title: "Time Blocking Mastery: Turn Your Calendar into a Strategy Map",
    content: `Time blocking transforms a calendar from a meeting graveyard into a strategic control center. This playbook teaches you to map priorities, budget energy, coordinate with stakeholders, and recover from disruptions so your schedule reflects your most important work—and your life outside of it.

MISSION SNAPSHOT
Objective: Operate with a rolling 2-week time-blocked calendar where 80% of blocks are honored, priorities are front-loaded, and resilience strategies reclaim derailed days within 24 hours.
Components: Priority Pyramid, Energy Budget Planner, Calendar Coding System, Recovery Toolkit, Feedback Loop.

PHASE 1: PRIORITY ARCHITECTURE
1. Build Priority Pyramid
   - Tier 1: Mission-critical (OKRs, deliverables, personal non-negotiables).
   - Tier 2: Maintenance (team management, admin, health).
   - Tier 3: Growth (learning, networking, innovation).
   - Identify max three Tier 1 items per week.

2. Define Success Metrics
   - Weekly scoreboard: % of Tier 1 blocks executed, hours protected for health/family, buffer hours remaining.
   - Document “Why” for each priority—clarity builds commitment.

3. Workload Reality Check
   - Inventory meetings, ask “Does this align with any tier?” If not, challenge or delegate.
   - Determine capacity: e.g., 40-hour week minus 10 hours meetings = 30 hours for blocks.

PHASE 2: CALENDAR DESIGN
1. Block Template Creation
   - Morning anchors: deep work or strategic planning during energy peak.
   - Midday: collaboration, 1:1s, decision syncs.
   - Late afternoon: shallow work, admin, inbox zero.
   - Evenings/weekends: personal commitments, recovery, reflection.

2. Color-Coding & Naming Convention
   - Use colors for tiers (Tier 1 = bold color, Tier 2 = neutral, personal = green, recovery = blue).
   - Title format: [Tier] Verb + Output (“T1 Draft product narrative”).

3. Buffer Strategy
   - Insert 15-minute buffers between blocks for transitions.
   - Reserve contingency block (e.g., Friday 2-4 PM) to absorb overruns or catch-up.

4. Ritual Blocks
   - Weekly review (Friday 4 PM) to plan upcoming weeks.
   - Daily start-up (10 minutes) and shutdown (15 minutes) routines.
   - Health anchors: workouts, meals, family time scheduled first.

PHASE 3: IMPLEMENTATION & COMMUNICATION
1. Weekly Planning Ritual (Sunday or Friday)
   - Review goals, plan Tier 1 blocks, align with stakeholders.
   - Send calendar summary email to key collaborators if helpful (“Heads-up: focus blocks Tue/Thu 9-11”).

2. Daily Calibration
   - Morning: confirm blocks, identify potential obstacles.
   - Midday: quick check to adjust for new info.
   - Evening: log block adherence, note lessons.

3. Team Alignment
   - Share time blocking philosophy with team. Provide escalation criteria.
   - Encourage others to adopt blocking for smoother collaboration.

PHASE 4: RECOVERY FROM DISRUPTION
1. Disruption Triage
   - Step 1: Pause, assess what shifted.
   - Step 2: Reschedule displaced block within 24 hours; if impossible, renegotiate deadline.
   - Step 3: Document reason to spot patterns.

2. PM Game Plan
   - For morning block lost: move to afternoon or next morning, drop less critical block.
   - For multiple disruptions: activate “minimal viable day” (complete top 2 tasks, reschedule rest).

3. Decision Framework
   - Evaluate new requests: Does it support Tier 1? If yes, schedule intentionally. If no, negotiate or delegate.

PHASE 5: TROUBLESHOOTING & OPTIMIZATION
Issue: Calendar becomes too rigid.
   - Solution: Build flexible blocks titled “Open Focus” that adjust to emerging needs while aligning with priorities.

Issue: Others schedule over blocks.
   - Solution: Mark as busy, set meeting scheduler preferences, create shared doc explaining blocks and alternatives.

Issue: Personal time gets sacrificed.
   - Solution: Treat personal blocks as Tier 1. Communicate boundaries. Use “personal commitment” label to maintain privacy with firmness.

Issue: Energy mismatched to block.
   - Solution: Track energy levels, reposition high-cognitive tasks to peaks, match low-energy tasks to dips.

Issue: Underestimation of time.
   - Solution: Add 25% buffer when uncertain. Review weekly to recalibrate estimates.

TOOLS & TEMPLATES
1. Priority to Calendar Worksheet
   - Map goals → projects → tasks → blocks.

2. 2-Week Rolling Calendar Template
   - Visual layout with standard recurring blocks, easy duplication.

3. Decision Scripts
   - Declining meeting: “I’m protecting focus block to finish the launch plan. Could we async this or meet during my collaboration window?”

4. Reflection Prompts
   - “Which block delivered highest ROI?”
   - “Which interruption can I prevent next week?”

CASE STUDIES
Case 1: Marketing manager with reactive schedule
   - Implemented color-coded calendar, weekly planning ritual, meeting intake form.
   - Result: regained 12 hours weekly for strategic work, campaign launch quality improved.

Case 2: Founder balancing product and fundraising
   - Split week into theme days (Product Mon/Tue, Fundraising Wed, Ops Thu, Flex Fri). Protected personal evenings.
   - Reduced decision fatigue, improved investor updates.

Case 3: Parent returning to workforce
   - Time-blocked childcare swaps, commute, focused work, self-care. Communicated availability to team.
   - Achieved consistent working hours without burnout.

Remember: Time blocking works when the calendar tells the story of your priorities. Iterate weekly, guard your blocks, and measure success by how well the schedule reflects who you want to become.`,
    tags: [
      "time_blocking",
      "calendar_management",
      "prioritization",
      "planning",
      "energy_management"
    ]
  },
  {
    source: "productivity_enhanced",
    category: "email_management",
    title: "Inbox Command Center: Achieve Inbox Zero Without Living in Email",
    content: `Email is a powerful tool when it supports outcomes—not when it owns your day. This command center system brings structure to triage, batching, templates, and delegation so you can hit inbox zero daily within 30 minutes and keep your attention on higher-value work.

MISSION SNAPSHOT
Objective: Triage inbox to zero at least once per day, limit email handling to two 30-minute blocks, maintain SLA expectations with stakeholders, and reduce response anxiety through clear workflows.
Components: Email Triage Framework, Batching Schedule, Template Library, Delegation Playbook, Metrics Tracker.

PHASE 1: SET EMAIL INTENTIONS & BOUNDARIES
1. Define Role-Based SLAs
   - Map stakeholders (clients, team, executives) and expected response times (e.g., clients within 8 hours, team within 24 hours).
   - Communicate availability via signature (“Emails reviewed at 11 AM and 4 PM. For urgent issues, Slack me or call.”).

2. Choose Email Blocks
   - Block calendar for two daily sessions (e.g., 11:00-11:30 and 16:00-16:30). Optionally add 5-minute quick scan early morning for emergencies without replying.
   - Turn off push notifications. Use VIP alerts only for critical senders.

3. Inbox Architecture
   - Create action folders: Reply Today, Waiting, Delegated, Archive, Reference, Someday.
   - Use rule-based filters to auto-sort newsletters, receipts, system alerts.

PHASE 2: TRIAGE FRAMEWORK
1. Triage Steps (A.R.T.)
   - Assess: Scan subject/sender. Use keyboard shortcuts to move quickly.
   - Route: Delete, archive, delegate, respond, or schedule.
   - Take Action: If reply <2 minutes, respond. If longer, move to Reply Today, add to task list with deadline.

2. Processing Flow
   - Start with newest or oldest? Choose consistent method (e.g., oldest first to avoid stale messages).
   - Use split inbox view (in Gmail) to read and route simultaneously.

3. Batch-Like Items
   - Create template bank for frequent responses (intros, meeting confirmations, status updates, declines).
   - Use text expanders (e.g., TextExpander, aText) with snippets pre-written.

PHASE 3: COMPOSE WITH CLARITY
1. Email Structure Template
   - Subject: actionable (Prefix with [Action], [Info], [Decision]).
   - Opening: context and purpose.
   - Body: bullet points, bold key actions.
   - Close: clear ask + deadline + next step (“Please confirm by Thursday 3 PM”).

2. Reduce Thread Length
   - Summarize decisions in bullet list.
   - Use TL;DR section for long threads.
   - Switch to call if back-and-forth >3 emails.

3. Delegation & Follow-Up
   - When delegating, include context, desired outcome, deadline, resources.
   - Track delegated emails via "Waiting" folder + weekly review.

PHASE 4: ADVANCED AUTOMATIONS
1. Filters & Labels
   - Filter newsletters to “Review Friday” label. Batch read weekly.
   - Auto-forward receipts to finance folder.

2. Priority Inbox Configuration
   - Mark VIP senders as priority.
   - Use "Snooze" feature for emails requiring action later; add note to calendar if critical.

3. Integrations
   - Task manager integration (Todoist, Asana). Convert email to task with link back.
   - CRM sync for sales roles.

PHASE 5: TROUBLESHOOTING
Issue: Inbox overflows daily.
   - Solution: Increase filtering, unsubscribe aggressively, create optional alias for sign-ups.

Issue: Anxiety about missing urgent emails.
   - Solution: Set up VIP alerts. Define emergency channel; rehearse trust in system.

Issue: Reply chains missing decisions.
   - Solution: Summarize decisions in bold, add meeting notes to shared doc, close loop with final confirmation email.

Issue: Delegated emails boomerang back incomplete.
   - Solution: Provide clearer briefs, confirm understanding, set check-in reminders.

Issue: Email tasks leak into deep work blocks.
   - Solution: Close email tab, rely on scheduled blocks, remind team of preferred communication windows.

TOOLS & TEMPLATES
1. Email Processing Checklist
   - Steps to follow during each batch session.

2. Template Library
   - 15+ canned responses (meeting request, decline, follow-up, update, introduction, thanks, escalation).

3. Metrics Tracker
   - Daily log of inbox zero time, response SLA adherence, number of emails sent/received.

CASE STUDIES
Case 1: Account manager with 200+ daily emails
   - Implemented triage blocks, templates, delegation. Created client FAQ doc.
   - Reduced inbox processing from 3 hours to 50 minutes, client satisfaction remained high.

Case 2: CTO drowning in status updates
   - Instituted team weekly report; filtered updates to single folder. Reviewed once daily.
   - Gained 90 minutes/day for technical strategy.

Case 3: Entrepreneur managing investor communications
   - Crafted template responses, used assistant for scheduling, set investor update cadence.
   - Maintained professional touchpoints without sacrificing focus on operations.

Remember: Email is a workflow problem, not a character flaw. When you batch, template, and automate the routine, you reclaim attention for the work that moves the needle.`,
    tags: [
      "email_management",
      "inbox_zero",
      "communication",
      "productivity",
      "workflow"
    ]
  },
  {
    source: "productivity_enhanced",
    category: "meeting_efficiency",
    title: "Meeting Operating System: Run Sessions That Produce Decisions, Not Fatigue",
    content: `Meetings should be decision and alignment accelerators. This operating system equips you with agenda design, facilitation scripts, participant agreements, and follow-through mechanisms to ensure every meeting justifies its cost and drives tangible outcomes.

MISSION SNAPSHOT
Objective: Achieve 90% meeting effectiveness score (participants agree meeting was necessary and productive), reduce recurring meeting time by 30%, and generate documented decisions and owners within 12 hours.
Components: Meeting Audit, Agenda Builder, Facilitation Script Library, Decision Log, Async Alternative Toolkit.

PHASE 1: MEETING AUDIT & PURPOSE ALIGNMENT
1. Inventory Meetings
   - List all recurring/non-recurring meetings, attendees, purpose, duration.
   - Rate ROI (High/Medium/Low). Cancel or replace low ROI with async updates.

2. Meeting Purpose Framework (The 5 Ds)
   - Decide, Design, Debate, Diagnose, Develop. If meeting request doesn’t match any, decline or reformat.

3. Cost Awareness
   - Calculate meeting cost = duration × attendees × hourly rate. Share data to shift mindset.

PHASE 2: PREP LIKE A PRODUCER
1. Agenda Builder Template
   - Sections: Outcome (what’s different after), Pre-work, Topics with time boxes, Owner, Decision required.
   - Send 24 hours in advance with materials.

2. Role Assignment
   - Facilitator, Scribe, Timekeeper, Decision Owner. Rotate roles to build shared ownership.

3. Pre-Work Enforcement
   - Use asynchronous prep (docs, Loom videos). Cancel meeting if pre-work incomplete.

PHASE 3: FACILITATION PLAYBOOK
1. Opening Script (2 minutes)
   - “Purpose today is to decide X. We’ll cover A, B, C. Ground rules: stay on agenda, cameras on, one mic at a time.”

2. During Meeting
   - Timeboxing: use visible timer, call out remaining time.
   - Use facilitation techniques: round-robin, parking lot for off-topic, silent brainstorm with sticky notes or shared doc.
   - Name dynamics: “I’m noticing we’re cycling without decision. Let’s identify criteria and vote.”

3. Decision Protocols
   - Use DACI or RACI clarifying decider vs. contributor.
   - Document decision options, pros/cons, final choice.

4. Close Strong
   - Recap decisions, owners, deadlines. Confirm in room.
   - Ask: “Is there any reason we can’t commit to this plan?”

PHASE 4: FOLLOW-THROUGH & CONTINUOUS IMPROVEMENT
1. Decision Log
   - Maintain shared log with Date, Meeting, Decision, Owner, Due, Status.
   - Review in weekly leadership sync.

2. Meeting Feedback Pulse
   - Post-meeting 30-second survey: “Was this meeting necessary?” “Did we achieve objective?” “Suggestions?”
   - Adjust format or cancel recurring meetings if scores drop.

3. Async Alternatives Toolkit
   - Provide templates for decision memos, async brainstorm boards, recorded updates.
   - Encourage “write first, meet second” culture.

PHASE 5: TROUBLESHOOTING
Issue: Certain attendees dominate conversation.
   - Solution: Use facilitation techniques—structured rounds, pass the mic, use chat for contributions. Private coaching if pattern persists.

Issue: Meetings run over.
   - Solution: Shorten to 25/50 minutes, enforce hard stop, schedule follow-up if required. Review agenda realism.

Issue: Decisions aren’t implemented.
   - Solution: Ensure owners agree to timelines, use decision log, follow-up in next meeting.

Issue: Hybrid/remote engagement low.
   - Solution: Prompt cameras on, use collaborative tools (Miro, FigJam), assign co-facilitator to monitor chat.

Issue: Too many attendees.
   - Solution: Invite only decision-makers; share notes with others. Provide optional async input forms.

TOOLS & TEMPLATES
1. Meeting Prep Checklist
   - Verify purpose, outcome, agenda, roles, materials.

2. Facilitation Script Pack
   - Phrases for redirecting, clarifying, escalating decisions.

3. Async Request Form
   - “What decision/problem? Who needs to weigh in? Deadline? Proposed solution?”

CASE STUDIES
Case 1: Product triad meetings bloated
   - Reduced attendees, implemented DACI, introduced decision log.
   - Decision cycle time dropped 40%.

Case 2: Executive staff meeting
   - Switched to memo-first model, 30-minute discussion blocks, action summary doc.
   - Meeting satisfaction score rose from 3.1 to 4.6/5.

Case 3: Customer success syncs
   - Replaced weekly meeting with async dashboard updates; monthly deep-dive meeting remains for problem-solving.
   - Team reclaimed 4 hours/month.

Remember: Meetings are a product. Design them thoughtfully, measure their impact, and ship improvements. When every meeting has a clear outcome, respectful facilitation, and crisp follow-through, your team’s default mode becomes execution—not endless discussion.`,
    tags: [
      "meetings",
      "facilitation",
      "decision_making",
      "collaboration",
      "team_operations"
    ]
  },
  {
    source: "productivity_enhanced",
    category: "focus_techniques",
    title: "Focus Toolkit 4D: Diagnose, Design, Deploy, and Defend Your Attention",
    content: `Focus is a trainable capability grounded in nervous system regulation, environment design, and deliberate practice. The Focus Toolkit 4D system helps you diagnose attention drains, design personalized interventions, deploy routines across work contexts, and defend focus from internal and external threats.

MISSION SNAPSHOT
Objective: Increase sustained attention capacity to 45-90 minutes, reduce context switching by 50%, and create a living playbook of focus techniques tailored to multiple environments (office, home, travel).
Components: Attention Diagnostic, Environmental Playbook, Cognitive Conditioning Drills, Defense Protocols, Progress Dashboard.

PHASE 1: DIAGNOSE ATTENTION DRAINS
1. Focus Audit (7 days)
   - Track distractions: source, time, emotional state, cost (minutes lost).
   - Identify patterns: notifications, hunger, boredom, unclear goals, social media, coworkers.

2. Attention Baseline Testing
   - Measure current focus span: use Pomodoro test (work until attention slips). Note duration.
   - Evaluate cognitive bandwidth with quick assessments (Stroop test, dual n-back) weekly to monitor gains.

3. Internal State Awareness
   - Journal triggers: “When do I self-interrupt?” Identify emotional drivers (anxiety, excitement, avoidance).
   - Rate environment quality (lighting 1-5, noise 1-5, temperature 1-5).

PHASE 2: DESIGN FOCUS ENVIRONMENTS
1. Environment Matrix
   - Create playbooks for primary environments (office, home, coffee shop). For each, list setup steps, tools, backups.
   - Example: Office focus kit includes noise-canceling headphones, desk lamp, white noise playlist, focus cards.

2. Stimulus Control
   - Align sensory inputs with focus: neutral background music or binaural beats, adjustable lighting, aromatherapy if supportive.
   - Use visual cues (focus flag, door sign) to signal availability.

3. Nutrition & Energy Alignment
   - Pre-focus fueling: balanced snacks (protein + complex carbs). Avoid heavy meals before focus sessions.
   - Hydration plan, caffeine timing before blocks.

PHASE 3: DEPLOY COGNITIVE PRACTICES
1. Focus Ladder Routine
   - Step 1 (2 minutes): Box breathing.
   - Step 2 (3 minutes): Review focus statement.
   - Step 3 (10 minutes): Warm-up task to gain momentum (review notes).
   - Step 4: Enter main focus task.

2. Interval Techniques
   - Choose focus cycle: 45/15, 60/10, or Flowtime (work until you feel fatigue, then break matching duration up to 15 minutes).
   - Use analog timer to avoid digital distractions.

3. Attention Conditioning Exercises
   - Brain endurance training: maintain attention on a single stimulus while ignoring distractions (use focus apps like Focus@Will, or manual exercises counting breaths).
   - Meditation practice: 10 minutes daily of attention or open monitoring meditation.

4. Task Design
   - Break large projects into “definition of progress” segments to avoid procrastination.
   - Set clear next actions at end of each session to reduce friction when resuming.

PHASE 4: DEFEND FOCUS
1. Boundary Scripts
   - Colleagues: “I’m in focus mode 2-4 PM. Can we queue questions for my 4:15 office hour?”
   - Family/roommates: “Headphones on means I’m in focus sprint. Tap me only for emergencies.”

2. Technology Guardrails
   - Use app blockers, set phone to grayscale, log out of social accounts.
   - Leverage scheduling to send messages later.

3. Internal Defense
   - When mind wanders, note thought, label (“planning”), gently return to task.
   - Use mantra: “Not now; scheduled for later.” Document in idea parking lot.

4. Recovery & Reward
   - After focus block, celebrate progress, stretch, check off tracker to reinforce habit.
   - Avoid jumping immediately into high-stimulation reward (social media). Choose calming break.

PHASE 5: MONITOR & EVOLVE
1. Focus Dashboard
   - Track hours of focused work, number of blocks completed, distractions avoided, energy rating.

2. Weekly Review
   - Analyze which techniques worked, adjust playbook, update environment setups.
   - Experiment with new methods monthly (visual timers, standing desk, mindfulness apps).

3. Focus Sprint Challenges
   - 7-day focus challenge with accountability partner. Share daily metrics.
   - Team focus weeks: align schedules to create culture of concentration.

CASE STUDIES
Case 1: Software engineer in open office
   - Implemented focus flag, noise-canceling headphones, morning focus sprint, midday walk.
   - Deep work hours increased from 1.5 to 3.5 per day.

Case 2: Remote marketer with home distractions
   - Created environment zones, used Freedom app, scheduled co-working sessions.
   - Reported 50% reduction in context switching.

Case 3: Student balancing part-time job
   - Adopted focus ladder, 45/15 intervals, used campus library quiet room.
   - Grades improved, stress decreased.

Remember: Focus thrives when you treat it like a system. Diagnose what breaks it, design spaces and rituals that support it, deploy daily practices, and defend your attention like the critical asset it is.`,
    tags: [
      "focus",
      "attention_management",
      "habits",
      "productivity",
      "cognitive_performance"
    ]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    let loaded = 0;
    let errors = 0;
    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const scenario of PRODUCTIVITY_SCENARIOS_ENHANCED) {
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
      total: PRODUCTIVITY_SCENARIOS_ENHANCED.length,
      results
    };
  }
});
