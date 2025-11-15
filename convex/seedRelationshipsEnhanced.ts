/**
 * ENHANCED Relationships & Communication Scenarios
 *
 * Each entry delivers 1,100+ words of frameworks, scripts, templates, troubleshooting, and case examples.
 * Run: npx convex run seedRelationshipsEnhanced:seed
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

export const RELATIONSHIPS_SCENARIOS_ENHANCED: EnhancedScenario[] = [
  {
    source: "relationships_enhanced",
    category: "difficult_conversations",
    title: "Mastering Difficult Conversations with Radical Empathy",
    content: `Difficult conversations become easier when you know exactly how to prepare, how to show up in the moment, and what to do afterward. This playbook combines neuroscience, negotiation strategy, and trauma-informed communication to help you walk into high-stakes conversations with clarity—and walk out with stronger trust.

MISSION SNAPSHOT
Objective: Address a sensitive issue while maintaining the relationship and co-creating a solution.
Time Horizon: 3 phases—Preparation (24-48 hours), Live Conversation (30-60 minutes), Follow-Through (7 days).
Success Criteria: Both parties feel heard, the core issue is named, concrete next steps agreed, relationship strengthened.

PHASE 1: PREPARATION LAB (90 minutes total)
1. Outcome Clarity Canvas (20 minutes)
   - Define success in observable terms: “We agree on communication norms for meetings.”
   - Identify non-negotiables vs. flex areas.
   - Note the relationship intention: “I want to preserve trust and show respect.”

2. Narrative Deconstruction (15 minutes)
   - Automatic story: “They don’t respect me.”
   - Alternative explanations: “They may be under pressure, unaware, distracted.”
   - Evidence inventory: Separate facts (timestamped behaviors) from interpretations.

3. Emotion Regulation Protocol (10 minutes)
   - Name your emotion (“frustrated”, “anxious”) to reduce amygdala activation.
   - Practice 4-7-8 breathing cycle twice to calm nervous system.
   - Rehearse self-compassion script: “Tough conversations are a leadership skill I’m mastering.”

4. Empathy Mapping (15 minutes)
   - What is their likely goal? Fear? Pressure point?
   - What identity are they protecting? (expertise, autonomy, reputation)
   - What do they need to hear to stay open? (respect, appreciation, safety)

5. Opening Statement Draft (10 minutes)
   - Formula: Appreciation + Observation + Impact + Invitation.
   - Example: “I value how quickly you jump in to solve issues. Yesterday when the client question came up, you stepped in three times before I finished. I felt sidelined and the client looked confused. Can we talk about how we handle hand-offs?”

6. Anticipate Forks & Detours (20 minutes)
   - If they deny: Have data and neutral phrasing ready (“My notes show…”).
   - If they attack: Use boundary script (“I want to answer, and I need us to stay on the current topic.”).
   - If they shut down: Offer choice (“Do you want a five-minute break or to continue?”).

PHASE 2: LIVE CONVERSATION FLOW (30-60 minutes)
Stage 1: Set the Frame (2 minutes)
   - “Thanks for making time. I asked to chat because our collaboration matters, and I want us to navigate yesterday’s meeting in a way that works for both of us.”

Stage 2: Share Observation & Impact (3 minutes)
   - Speak to patterns, not character. Use even tone. Stop talking after 2-3 sentences to reduce defensiveness.

Stage 3: Invite Their Story (8-12 minutes)
   - Core prompt: “What was happening for you?”
   - Follow-ups: “What felt important in that moment?” “What outcome were you aiming for?”
   - Reflect summary: “So you were worried the client might think we were unprepared, and you wanted to reassure them quickly. Makes sense.”

Stage 4: Co-Diagnose Root Issue (5 minutes)
   - “It sounds like rapid response is key for you, and clarity of roles is key for me. Where do you see overlap or tension?”
   - Use whiteboard or shared doc to list interests.

Stage 5: Co-Create Agreements (10 minutes)
   - Agreement template: Trigger → New behavior → Support → Timeline.
   - Example: “When clients ask technical questions mid-presentation, let’s jot them down and tag-team answers during Q&A. I’ll call on you explicitly. Let’s pilot in next Thursday’s review.”

Stage 6: Confirm Next Steps & Appreciation (2 minutes)
   - “Thanks for being open. I’m committed to making this smoother. I’ll send a summary and the Q&A template tonight.”

SCRIPTS FOR COMMON SCENARIOS
When they explode:
   - “I can see this topic hits a nerve. I want to understand. Can we take two minutes to breathe and then keep going?”
When they minimize:
   - “I hear you saying it was minor. The reason I’m raising it is because it affected our client’s confidence. Can we look at the impact together?”
When you lose the thread:
   - “I’m noticing I’m getting defensive. Let me reset. Here’s what I want: a plan to signal hand-offs in meetings.”
When conversation derails into past grievances:
   - “Those older issues sound important. Let’s park them in a shared doc so we can address them separately. For today, can we finish this specific topic?”

TOOLS & TEMPLATES
1. Difficult Conversation Prep Worksheet (fillable table)
   - Topic, Stakes, Desired Future State
   - Evidence Log (Date, What happened, Impact)
   - Empathy Map (What matters to them, What they fear, How they prefer to communicate)
   - Support Plan (breathing, grounding, ally check-in)

2. Live Conversation Agenda Template (printed or digital)
   - Frame intent
   - Share observation
   - Invite perspective
   - Explore root cause
   - Co-create plan
   - Confirm follow-up

3. Post-Conversation Debrief Checklist
   - Did we agree on specific behaviors?
   - Did we schedule a check-in?
   - Did both parties speak 50/50?
   - What did I learn about them? About myself?
   - Send recap email within 12 hours.

4. Recap Email Script
   - Subject: “Great sync—next steps we agreed on”
   - Paragraph 1: Appreciation + summary of intent.
   - Paragraph 2: Bullet list of agreements (owner, behavior, timeline).
   - Paragraph 3: Reinforce partnership (“Excited to test this with you.”).

TROUBLESHOOTING MATRIX
Scenario: They refuse the meeting.
   - Response: Send Value Framing note—“This will help us deliver for the client faster.” Offer optional third-party facilitator.

Scenario: They dominate the conversation.
   - Response: Use timeboxing—“Let’s take two minutes each to outline priorities.” Use timer on table.

Scenario: Emotion spikes and conversation stalls.
   - Response: Suggest a tactical break (“Water refill?”). Resume with a future-focused question (“What does a great collaboration look like two weeks from now?”).

Scenario: Agreement breaks within a week.
   - Response: Address immediately. Use micro-feedback script: “Quick check-in—yesterday we slipped back into old pattern. What got in the way? How do we adjust?”

Scenario: Power dynamics uneven (manager vs. IC).
   - Response: Bring data, align with organizational goals, involve neutral sponsor if necessary. Anchor in shared mission to reduce hierarchy stress.

CASE STUDY: ENGINEERING LEAD & PRODUCT MANAGER
Context: PM feels steamrolled during sprint planning.
Results after using playbook:
   - 2 prep sessions (90 minutes) to map interests.
   - Reframed convo around shared metric (deployment frequency).
   - Created “Idea Parking Lot” during meeting to capture interruptions.
   - Follow-up survey showed 40% increase in perceived psychological safety.
   - Formalized monthly retrospective to catch friction early.

FOLLOW-THROUGH (7 DAY PLAN)
Day 0 (same day): Send recap email, log insights in relationship journal.
Day 2: Quick pulse check—“How is the new hand-off cue working?”
Day 5: Share appreciation publicly if appropriate (“Shout-out to Alex for helping streamline Q&A flow.”).
Day 7: Reflect personally—What skill improved? What still rough? Capture in growth log.

COACHING PROMPTS FOR SELF OR TEAM
   - “What emotion am I protecting by avoiding this conversation?”
   - “What evidence would convince them this matters?”
   - “What does success look like for them? For us together?”
   - “Where can I offer choice to increase their sense of control?”

Remember: Difficult conversations are laboratories for trust. With structure, empathy, and disciplined follow-up, the scariest dialogue becomes the moment people realize you have their back even when you disagree.`,
    tags: [
      "difficult_conversations",
      "conflict_resolution",
      "communication",
      "relationship_management",
      "empathy"
    ]
  },
  {
    source: "relationships_enhanced",
    category: "conflict_resolution",
    title: "Transforming Conflict into Collaboration: The 5-Session Repair Sprint",
    content: `Conflict is energy. The choice is whether that energy scorches the relationship or powers innovation. This repair sprint guides you through five touchpoints that take a festering conflict and convert it into a shared roadmap. Use it for co-founders, department heads, couples in business together, or leadership peers whose friction is blocking progress.

CONFLICT DIAGNOSTIC (SESSION 0 PREP)
1. Snapshot Survey (send separately to each person)
   - “Describe the conflict in three sentences.”
   - “What do you think they believe about you right now?”
   - “What outcome would make this conflict worth resolving?”
   - “How resourced (time, energy, skills) do you feel to address this?”

2. Pattern Timeline
   - Build a shared timeline listing key incidents, emotional spikes, and unresolved decisions.
   - Highlight moments of successful collaboration to remind participants the relationship has worked before.

3. Conflict Archetype Mapping
   - Identify whether dynamic is Pursuer-Distancer, Overfunctioner-Underfunctioner, or Controller-Free Spirit.
   - Tailor interventions: Pursuer needs reassurance, Distancer needs autonomy; Controller needs predictability, Free Spirit needs flexibility.

REPAIR SPRINT STRUCTURE
Session 1 (90 minutes): Establish Safety & Shared Intent
   - Opening script: “We’re here because our collaboration matters and this tension is costing us results and trust.”
   - Facilitated listening drill: 5 minutes each uninterrupted sharing, followed by reflective paraphrasing.
   - Joint charter creation: Document 5 Guiding Norms (e.g., “Assume positive intent”, “Debate ideas, not identities”).

Session 2 (75 minutes): Surface Underlying Interests
   - Use the “Iceberg Model”: above water = positions, below water = needs.
   - Tool: Interest Cards (autonomy, respect, recognition, clarity, fairness). Each person selects top three needs driving their behavior.
   - Output: Venn diagram of shared vs. unique interests.

Session 3 (75 minutes): Map Systemic Factors
   - Analyze structures feeding conflict (ambiguous roles, scarce resources, conflicting KPIs).
   - Template: RACI reset—who is Responsible, Accountable, Consulted, Informed across contentious activities.
   - Script to reframe blaming: “Instead of ‘You ignored the plan’, try ‘Our delivery workflow doesn’t make ownership clear.’”

Session 4 (90 minutes): Design Experiments & Agreements
   - Brainstorm 10 possible experiments (e.g., rotating meeting facilitation, shared KPI dashboard, decision log).
   - Select top 3 using Impact vs. Ease matrix.
   - Draft “Collaboration Agreement” with the following table:
        Trigger | New Habit | Owner | Start Date | Checkpoint
        Missed deadline | 24-hour risk alert | Taylor | Immediately | Weekly retro
   - Include escalation ladder (self-correct → peer feedback → manager mediation).

Session 5 (60 minutes): Measure, Celebrate, Reinforce
   - Review experiment data (through shared spreadsheet or project tool).
   - Share appreciations: each person names 2 behaviors the other improved.
   - Codify maintenance rituals: fortnightly friction scan, quarterly appreciation ritual, one-page playbook stored in shared drive.

SCRIPT LIBRARY
Interrupting the blame loop:
   - “Let’s pause. What does success look like for the customer right now?”
   - “Can we restate this without the words ‘always’ or ‘never’?”

When one party stonewalls:
   - “I’m noticing silence. Do you need more time, or is there something unsafe about the topic we should address?”

Requesting accountability without shaming:
   - “We agreed you’d send the status report by Tuesday. It’s now Thursday. What happened, and how do we prevent the miss repeating?”

Rapid repair after conflict flashback in meeting:
   - “I want to acknowledge we just slipped into our old pattern—voices raised, quick rebuttals. Can we pause and apply the hand-raising norm we committed to?”

TROUBLESHOOTING GRID
Issue: One person keeps relitigating history.
   - Intervention: Use the “Archive Document”. Capture grievances with date, impact, desired repair. Schedule dedicated session to resolve archived topics so current meeting stays on track.

Issue: Power imbalance (manager-direct report, senior-junior partner).
   - Intervention: Bring in champion for lower-power party during sessions 1-3. Ensure agenda includes explicit check for psychological safety (“Do you feel you can disagree without penalty?”).

Issue: Cultural differences in directness.
   - Intervention: Co-create “Translation Guide”. Example: direct feedback statement vs. relational preface.

Issue: Conflict tied to burnout.
   - Intervention: Layer in wellbeing audit: hours worked, capacity to recover, workload fairness. Sometimes conflict is a symptom of exhaustion—not values misalignment.

TOOLS & TEMPLATES
1. Conflict Cost Calculator (spreadsheet)
   - Inputs: Time lost per week, revenue impact, turnover risk, customer impact.
   - Outputs: Monetary estimate to underscore urgency of resolution.

2. Session Agenda Kit (editable doc)
   - Outline, goals, facilitator notes, timing, key questions.
   - Space for live note-taking and decisions.

3. Collaboration Agreement Template
   - Sections: Vision, Norms, Decision Rights, Feedback Cadence, Escalation Pathways, Renewal Date.
   - Signatures: Each participant signs digitally to symbolize commitment.

4. Feedback Radar Chart
   - Axes: Communication clarity, responsiveness, trust, reliability, emotional maturity.
   - Used in Session 5 to visualize progress. Each person scores themselves and the other, then discusses gaps.

CASE STUDY: MARKETING & SALES TEAMS
Background: Quarterly planning meetings devolved into blame; pipeline stalled.
Intervention:
   - Session 1: Joint charter titled “Grow Together, Win Together”.
   - Session 2: Interests revealed Sales needed reliable collateral; Marketing needed clear priorities.
   - Session 3: Mapped conflict to overlapping KPIs; introduced single “Revenue Council”.
   - Session 4: Created 30-day experiment with shared Asana board, daily 10-minute huddles.
   - Session 5: Reported 22% increase in qualified leads, 15% faster proposal turnaround, morale scores up 18 points.

MAINTENANCE RITUALS
   - Monthly Tension Audit: each person submits “What energized me / What drained me / Request”. Reviewed together.
   - Quarterly Story Swap: share one success story highlighting the other’s contribution to reinforce positive attribution.
   - Annual reset: revisit collaboration agreement, sunset rituals that no longer serve, add new experiments.

REFLECTION QUESTIONS
   - “What is the conflict protecting that we actually value?”
   - “What future opportunity becomes possible when this tension is resolved?”
   - “How will we know early if we’re slipping back into the old pattern?”

Remember: Conflict doesn’t disappear—it becomes data. When you treat disagreements as prototypes, you create a culture where candor and care can coexist, and teams stop wasting energy fighting each other and start fighting for the mission.`,
    tags: [
      "conflict_resolution",
      "mediation",
      "collaboration",
      "team_dynamics",
      "repair_framework"
    ]
  },
  {
    source: "relationships_enhanced",
    category: "feedback",
    title: "Giving and Receiving Feedback as a Superpower System",
    content: `Feedback should feel like a precision tool, not a blunt weapon. This system helps you design a feedback culture where praise and constructive guidance happen weekly, not once a year. You will build scripts, rituals, and dashboards so feedback becomes a source of motivation, not dread.

SYSTEM OVERVIEW
Foundation Pillars: Safety, Specificity, Speed, Sustainability.
Artifacts: Feedback OS Canvas, Conversation Scripts, Calibration Matrix, Recovery Playbook.
Cadence: Micro-feedback daily, developmental feedback biweekly, strategic feedback quarterly.

PART 1: BUILDING THE FEEDBACK OS
1. Shared Language Deck
   - Define terms: “Feedforward” (future-focused advice), “Appreciation”, “Coaching”.
   - Introduce the Feedback Impact Formula: Useful Feedback = (Specific Observation × Behavior Focus × Joint Solution) ÷ Ego Reactivity.

2. Feedback Charter Workshop (60 minutes)
   - Exercise: Each participant writes “Feedback horror story” and “Feedback dream scenario”; identify themes.
   - Co-create norms: “We ask before giving feedback”, “We appreciate twice as often as we critique”, “We never weaponize private info.”
   - Document in shared workspace; revisit monthly.

3. Feedback Roles Inventory
   - Map who gives feedback to whom (manager, peer, cross-functional partner, self).
   - Identify gaps—who currently receives no constructive feedback? Who lacks appreciation?

PART 2: PREPARING FEEDBACK (GIVER PLAYBOOK)
1. Precision Observation Log
   - Keep rolling document of behavior snapshots. Include date, context, behavior, impact, emotion triggered, desired outcome.

2. Intent Check
   - Ask: “Am I giving this to help them succeed, or to discharge my frustration?” If latter, pause and regulate.

3. Story Separation Drill
   - Fact: “You submitted the deck at 11:45 AM, 45 minutes before client call.”
   - Story: “You don’t respect deadlines.”
   - Replace story with curiosity question: “What happened upstream?”

4. Feedback Script Templates
   - Appreciation Script: “I noticed when you..., it achieved..., thank you. Keep doing...”
   - Coaching Script (SBI + Next Step): “In [Situation], I observed [Behavior]. It impacted [Result/people]. Going forward, can we [Next Step]?”
   - Partnership Script: “What’s one thing I can adjust to support you better?”

5. Timing Decision Tree
   - Immediate: Safety or ethics breaches.
   - Within 24 hours: Behavior affecting others’ work.
   - Weekly 1:1: Developmental themes.
   - Quarterly: Strategic career acceleration conversations.

PART 3: RECEIVING FEEDBACK (RECIPIENT PLAYBOOK)
1. Somatic Awareness Practice
   - Identify body cues when feedback lands (tight chest, flushed cheeks). Have a grounding micro-practice ready (press feet into floor, inhale 4 counts, exhale 6).

2. Response Script
   - Step 1: Listen fully.
   - Step 2: Paraphrase (“So you’re saying the rapid-fire updates overwhelmed the client.”).
   - Step 3: Ask clarifying question (“Which part felt most confusing?”).
   - Step 4: Share perspective without defensiveness.
   - Step 5: Agree on specific next action.

3. Feedback Journal (weekly review)
   - Sections: Feedback Received, What I Heard, What I Felt, What I Will Try, Follow-up Date.
   - Track patterns—are multiple people flagging the same theme?

4. Reframing Tough Feedback
   - Trigger phrase: “This is valuable data about how my work lands.”
   - Visualization: Picture future self mastering the skill thanks to this moment.

PART 4: FEEDBACK RITUALS & TOOLS
1. Weekly Appreciation Round
   - Five-minute ritual in team meeting: each person thanks another for specific behavior, linking to team values.

2. Feedback Friday (async)
   - Prompt: “What’s one thing I’m proud of this week? One thing I need help improving?”
   - Team members respond in thread with coaching and resources.

3. Quarterly Mirror Session
   - 90-minute retrospective using Calibration Matrix: axes = Challenge Directly, Care Personally (Radical Candor).
   - Identify if team is slipping into Ruinous Empathy or Obnoxious Aggression.

4. Feedback Dashboard
   - Track metrics: average turnaround time for feedback, ratio of appreciation to coaching, follow-through rate on action plans.

5. AI-Assisted Prep (optional)
   - Use template to feed anonymized situation into AI tool to draft possible scripts. Review and personalize before delivering.

PART 5: TROUBLESHOOTING & RECOVERY
Scenario: Feedback weaponized in performance review.
   - Solution: Reinforce “no surprises” rule, require monthly documented coaching notes.

Scenario: Person nods but never acts.
   - Solution: Introduce accountability tracker; schedule 15-minute follow-up strictly to review agreed actions.

Scenario: Team allergic to criticism.
   - Solution: Start with micro-experiments like “Two Plus One”: each week, share two appreciations and one improvement area per person.

Scenario: Virtual teams misread tone.
   - Solution: Default to video or voice for sensitive feedback; follow-up with written summary capturing agreements, not emotions.

Scenario: Cross-cultural misunderstandings.
   - Solution: Build “Cultural Feedback Guide” describing directness preferences, norms around hierarchy. Invite colleagues to add notes.

CASE EXAMPLES
1. Product Design Team
   - Before: Feedback only from manager quarterly; creativity stalled.
   - After adopting Feedback OS: daily design critiques framed as experiments, peer appreciation channel on Slack, NPS from stakeholders rose from 32 to 64.

2. Healthcare Clinic Staff
   - Challenge: Nurses felt physician feedback was dismissive.
   - Intervention: Introduced somatic awareness training, co-created charter focusing on patient safety. Result: incident reports decreased 18%, satisfaction scores up 22%.

3. Startup Founders
   - Issue: Co-founders avoided tough conversations until resentments exploded.
   - Solution: Instituted weekly 30-minute “Founder Forum” using COIN framework, plus gratitude postcard each quarter. Outcome: faster decision cycles, investor confidence restored.

FOLLOW-UP SEQUENCE
Day 0: Document feedback in shared tracker, schedule follow-up.
Day 2: Check-in—“How is the new approach going? Need support?”
Day 7: Observe whether behavior shifted; acknowledge progress.
Day 14: Evaluate impact metrics (customer feedback, cycle time, quality). Adjust plan.

COACHING QUESTIONS
   - “How can I make this feedback irresistible to act on?”
   - “What skill or investment do they need from me to succeed after hearing this?”
   - “Which of my behaviors makes it safer for people to tell me hard truths?”

Remember: Feedback is a shared design project. When you treat every conversation as a prototype—prepare with intent, deliver with compassion, inspect and adapt afterward—you turn what most teams dread into your organization’s competitive advantage.`,
    tags: [
      "feedback",
      "communication",
      "radical_candor",
      "culture",
      "coaching"
    ]
  },
  {
    source: "relationships_enhanced",
    category: "trust",
    title: "Building Unbreakable Trust Through Consistency and Repair",
    content: `Trust is not a feeling; it is a stack of actions observed over time. This blueprint expands the classic Trust Equation (Credibility + Reliability + Intimacy ÷ Self-Orientation) into daily, weekly, and quarterly practices you can follow to accumulate “trust capital” and repair it when it fractures.

TRUST CAPITAL MODEL
1. Credibility (the mind): expertise, clarity, honesty.
2. Reliability (the calendar): promises kept, punctuality, operational excellence.
3. Intimacy (the heart): vulnerability, empathy, confidentiality.
4. Self-Orientation (the compass): whose interests you prioritize when stakes rise.

Use the Trust Capital Ledger to track deposits and withdrawals in each category. Aim for at least three deposits per week across the pillars.

PHASE 1: ASSESS CURRENT TRUST LEVELS
1. Stakeholder Mapping
   - Identify core relationships (manager, direct reports, peers, clients, partner).
   - Rate trust on scale 1-10; note evidence supporting rating.

2. Behavior Audit Checklist
   - Credibility: Do I communicate progress proactively? Do I admit uncertainty?
   - Reliability: Do I meet deadlines? Do I renegotiate proactively when risks emerge?
   - Intimacy: Do I ask about their life beyond tasks? Do I keep confidences?
   - Self-Orientation: Do I share credit publicly? Do I consider their workloads when making requests?

3. Story Inventory
   - Collect 5 stories others tell about working with you. Are they about responsiveness, empathy, competence or the opposite? Stories reveal brand.

PHASE 2: DAILY & WEEKLY TRUST HABITS
Daily 10-Minute Trust Ritual
   - Morning: Scan calendar, identify one commitment to reaffirm with stakeholder (“Confirming we’re still on for 3 PM.”).
   - Midday: Send micro-appreciation (“Thanks for the detailed bug notes, saved us an hour.”).
   - Evening: Log trust deposits/withdrawals; plan repair if needed.

Weekly Trust Review (60 minutes on Fridays)
   - Review ledger. For each stakeholder, mark whether you made deposit in credibility (share insight), reliability (kept promise), intimacy (personal check-in).
   - Identify emerging gaps. Schedule actions for next week (e.g., “Need to brief Priya on strategy change before announcing publicly.”).

PHASE 3: TRUST-BUILDING PLAYBOOKS
1. First 30 Days with New Stakeholder
   - Day 1-7: Listen Tour—ask about goals, preferred communication, success definitions.
   - Day 8-14: Share Personal Manual (workstyle, values, commitments).
   - Day 15-21: Deliver quick win aligned to their priority.
   - Day 22-30: Schedule trust calibration—“How am I meeting your expectations? What should I adjust?”

2. Trust Reset after Misstep
   - Step 1: Immediate acknowledgment (“I missed the deadline. No excuse—here’s what happened.”).
   - Step 2: Impact statement demonstrating empathy (“I know this put you on the spot with leadership.”).
   - Step 3: Repair plan (“Delivering updated report by 3 PM, adding executive summary you requested.”).
   - Step 4: Prevention commitment (“I’ve updated my risk tracker to flag dependencies 48 hours earlier.”).
   - Step 5: Follow-through and check-in (“Report sent—anything else needed to restore your confidence?”).

3. Trust Expansion in High-Stakes Projects
   - Kickoff ritual: Each member shares “strength I bring” and “support I need when stressed.”
   - Transparency dashboard: real-time progress, risks, owners.
   - Vulnerability micro-habits: leaders admit mistakes publicly, invite dissent (“What am I missing?”).
   - Celebration protocol: credit contributors in the format they value (public Slack, handwritten note, executive shout-out).

PHASE 4: TRUST METRICS & DASHBOARDS
1. Trust Pulse Survey (monthly, 3 questions)
   - “I can depend on this person to do what they say.”
   - “This person listens and adapts when things go wrong.”
   - “This person has my interests in mind when making decisions.”
   - Use 1-5 scale; track trends.

2. Trust Lag Indicators
   - Increased “checking in” behavior from others (signals doubt).
   - Delayed responses to requests.
   - Exclusion from strategic conversations.
   - Rising escalation or requests for written proof.

3. Trust Leading Indicators
   - Invitations to collaborate early.
   - People share worries with you preemptively.
   - Stakeholders advocate for you when you are not in the room.

PHASE 5: TRUST REPAIR INTENSIVE (when breach occurs)
Situation: Confidential info leaked; client confidence shaken.
Intervention:
   - Within 24 hours: Own the breach; communicate discovery and immediate containment.
   - 48 hours: Present full Incident Report: what happened, impacted parties, mitigation timeline.
   - 72 hours: Conduct Listening Tour with affected parties; validate emotions, gather needs.
   - 1 week: Launch new safeguards (access controls, revised protocols). Share progress updates.
   - 30 days: Follow-up with metrics (zero further incidents, customer satisfaction rebound).

Scripts for Repair Conversations
   - “I broke our agreement by sharing your idea prematurely. You trusted me with it, and I violated that trust. Here’s what I’ve done to prevent a repeat. Is there anything else you need to feel confident partnering with me again?”
   - “Your frustration makes sense. I’d feel the same. While I can’t undo the breach, I can show you what I’m putting in place to rebuild reliability.”

CASE STUDIES
1. Consultancy Partner & Enterprise Client
   - Trust dip after missed deliverable. Consultant used Trust Reset plan; shared transparent kanban board. Within six weeks, client renewed contract and expanded scope 30%.

2. Engineering Manager & Team
   - Team felt manager was aloof. Introduced daily Appreciation Ping, weekly one-on-one with personal check-in, monthly growth conversations. Employee engagement score rose from 61 to 84 in one quarter.

3. Co-Founders After Equity Dispute
   - Facilitated three-session repair using sincerity letters, financial transparency updates, and shared advisor oversight. Result: restructured agreement, restored confidence, successful Series B.

TRUST TOOLKIT
   - Trust Ledger Spreadsheet: columns for stakeholder, event, deposit type, withdrawal notes, repair actions.
   - Credibility Content Calendar: schedule thought leadership updates or insight memos to maintain expertise perception.
   - Reliability Radar: automated reminders if commitments lack due dates.
   - Intimacy Prompts Deck: questions to deepen rapport (“What’s something exciting outside work?” “How do you prefer to receive recognition?”).
   - Self-Orientation Audit: monthly reflection—“Where did I prioritize my win over the shared win? What will I do differently?”

COACHING REFLECTIONS
   - “If this relationship were a bank account, have I deposited enough to make a withdrawal?”
   - “How quickly do I admit when I’m wrong? What story do others tell about my humility?”
   - “Who currently trusts me by default? Who trusts me only with proof? Why?”

Remember: Trust is earned through choreography: small consistent steps, timely repairs when you misstep, and intentional celebrations when trust is honored. When trust is high, coordination costs drop, innovation rises, and stakeholders choose you even when alternatives exist.`,
    tags: [
      "trust",
      "relationships",
      "leadership",
      "psychological_safety",
      "accountability"
    ]
  },
  {
    source: "relationships_enhanced",
    category: "boundaries",
    title: "Setting Boundaries Without Burning Bridges: The Boundaries Operating Manual",
    content: `Boundaries protect your energy, time, and emotional health so you can contribute sustainably. This manual helps you define, communicate, and enforce boundaries with colleagues, clients, friends, and family—without guilt. You will create scripts, automation, and decision criteria that make boundaries natural rather than confrontational.

BOUNDARIES FOUNDATIONS
Definition: A boundary is a rule you set for yourself about what you will or will not allow, paired with an action you will take when the rule is violated.
Types: Physical, Emotional, Time, Digital, Financial, Intellectual.
Myths to retire: “Boundaries are selfish”, “If they loved me, they’d know”, “Saying no means I’m difficult”.
Truth: Boundaries teach others how to treat you and are acts of self-respect.

STEP 1: BOUNDARY INVENTORY (45 minutes)
1. Energy Audit
   - List top 10 recurring requests. Rate each on Energy Gain/Loss, Alignment to goals, Relationship value.
   - Highlight red items (high loss, low alignment). These need immediate boundaries.

2. Trigger Tracker
   - For one week, log moments you felt resentment, dread, or overwhelm. Note who, what, where, why.
   - Patterns reveal boundary breaches.

3. Value Alignment Map
   - Identify top 5 personal values (e.g., family presence, health, focus time, integrity, creativity).
   - For each boundary breach, note which value is compromised.

STEP 2: BOUNDARY DESIGN BLUEPRINT
Boundary Statement Formula: “When X happens, I will Y, because I value Z.”
Examples:
   - Time: “When meetings are scheduled after 6 PM, I will decline or propose next-day slots because I protect family dinner.”
   - Emotional: “When conversations shift to personal attacks, I will pause the discussion because I value respectful dialogue.”
   - Digital: “When clients message on weekends, I will respond Monday because I prioritize rest to serve them well.”

Boundary Categories & Tools
1. Calendar Boundaries
   - Time-block focus work; mark as busy. Use auto-replies for out-of-office focus sprints.
   - Scheduler settings: limit same-day bookings, insert buffer time pre/post meetings.

2. Communication Boundaries
   - Set email response windows (e.g., 11 AM and 4 PM). Update signature: “I reply within 24 hours. For urgent matters call/text.”
   - Slack/Teams status: “Deep work 2-4 PM—message if urgent.”

3. Accessibility Boundaries
   - Managers: create “office hours” for drop-ins, communicate to team.
   - Friends/family: share availability blocks and preferred channels.

4. Emotional Labor Boundaries
   - Use empathy scripts without over-functioning: “I’m sorry you’re going through that; I’m not in a place to give advice right now, but I can help you find resources.”

STEP 3: COMMUNICATING BOUNDARIES WITH CARE
1. Pre-Conversation Script
   - Appreciation: “I value our collaboration.”
   - Explanation: “I’ve noticed I’m spread thin after 6 PM calls.”
   - Boundary: “Going forward, I’ll accept meetings between 8-5. If something urgent emerges after hours, please text ‘urgent’.”
   - Mutual Benefit: “This ensures I show up rested and focused.”

2. Delivery Techniques
   - Use steady voice, open body posture.
   - Avoid over-explaining; one sentence rationale is enough.
   - Provide alternatives when possible (“I can help Tuesday morning or connect you with Maria.”).

3. Written Boundary Templates
   - Email to client: “I devote weekends to recharge. I’ll reply Monday by noon. If you need immediate assistance, here’s our 24/7 support line.”
   - Text to family member: “I love our talks. Weeknights after 9 PM I’m winding down, so let’s schedule catch-ups for Sundays at 4.”

STEP 4: ENFORCEMENT & MAINTENANCE
1. Boundary Enforcement Ladder
   - Gentle reminder (“Just a reminder I’m offline after 6 PM.”).
   - Restate boundary with consequence (“If meetings continue after 6, I’ll need to decline.”).
   - Follow-through on consequence (decline meeting, leave conversation, reassign task).
   - Reassess relationship if boundary repeatedly violated.

2. Accountability Partners
   - Share boundary plan with trusted friend or mentor. Ask them to flag when you slip.

3. Technology Aids
   - Use calendar automations (Calendly, Clockwise) to auto-block personal time.
   - Email filters tag after-hours requests.

4. Self-Check Rituals
   - Weekly journaling: “Where did I honor boundaries? Where did I wobble? What support do I need?”

STEP 5: HANDLING PUSHBACK
Common Pushbacks & Scripts
   - Guilt Trip: “After all I’ve done for you…”
     Response: “I appreciate your support, and my decision stands because this keeps me healthy.”
   - Anger: “You’re being impossible.”
     Response: “I hear that you’re upset. I’m available to discuss during my available hours.”
   - Minimizing: “It’s just a quick thing.”
     Response: “It may be quick, and it still disrupts my focus block. Let’s schedule another time.”
   - Silent Treatment: “...”
     Response: Send calm message reiterating boundary and inviting conversation when they’re ready.

STEP 6: SPECIAL SCENARIOS
1. Boundaries with Boss
   - Focus on shared goals: “To deliver high-quality analyses, I protect 9-11 AM for deep work. I’ll send status updates daily at 4 PM.”
   - If they insist, propose experiment: “Let’s try this structure for two weeks and review.”

2. Boundaries with Clients
   - Set expectations during onboarding. Include service hours in contract.
   - Offer escalation path for true emergencies.

3. Boundaries at Home
   - Family meeting to list individual needs. Use “traffic light” method: green (always ok), yellow (ask first), red (never).
   - Create household operating manual accessible to everyone.

4. Boundaries with Yourself
   - Identify self-betrayal patterns (overcommitting, doom scrolling). Design self-boundaries (time limit for social apps, no laptop in bedroom).

BOUNDARIES TOOLKIT
   - Boundaries Matrix Spreadsheet: columns for Situation, Desired Boundary, Script, Consequence, Follow-up Date.
   - Auto-Responder Templates for email and chat.
   - Boundary Buddy System: shared checklist with accountability partner.
   - Self-Compassion Audio: 5-minute guided track to soothe guilt after enforcing boundary.
   - “Say No” Phrasebook: 25 variations (“I’m honored, and I’m at capacity”, “No for now, revisit in Q3”).

MEASURING IMPACT
   - Track weekly hours reclaimed, stress level (1-10), quality of sleep, satisfaction with relationships.
   - Monitor burnout indicators: resentment, fatigue, brain fog. Should decline as boundaries hold.

CASE STORIES
1. Project Manager Overwhelmed by Slack messages
   - Implemented “response windows” + focus blocks + autoresponder. Outcome: 20% productivity lift, reduced weekend work to zero.

2. Entrepreneur with demanding clients
   - Added boundaries to contracts, set emergency retainer for after-hours support. Clients respected new system because onboarding emphasized value.

3. Caregiver balancing family demands
   - Family boundary meeting produced shareable calendar, delegated tasks. Emotional labor load dropped, relationships improved due to clarity.

SELF-REFLECTION QUESTIONS
   - “Where am I trading short-term comfort for long-term resentment?”
   - “Which value am I protecting with this boundary?”
   - “What would future-me thank me for saying no to today?”

Remember: Boundaries are kindness in action. They allow you to show up with your best energy for the people and projects that matter. When you document them, communicate them early, and enforce them consistently, others learn to trust your yes because they trust your no.`,
    tags: [
      "boundaries",
      "self_care",
      "communication",
      "assertiveness",
      "wellbeing"
    ]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    let loaded = 0;
    let errors = 0;
    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const scenario of RELATIONSHIPS_SCENARIOS_ENHANCED) {
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
      total: RELATIONSHIPS_SCENARIOS_ENHANCED.length,
      results
    };
  }
});
