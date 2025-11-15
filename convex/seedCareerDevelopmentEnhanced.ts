/**
 * ENHANCED Career Development Scenarios - All 10
 * 
 * Each scenario: 1,200-1,400 words with scripts, templates, troubleshooting
 * 
 * To integrate: Copy these into seedCareerDevelopment.ts to replace basic versions
 * Or run as separate seed file
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

interface CareerEnhancedScenario {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

type KnowledgeEmbeddingArgs = {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
};

type KnowledgeEmbeddingArgsCandidate = {
  source: unknown;
  category: unknown;
  title: unknown;
  content: unknown;
  tags: unknown;
};

const isKnowledgeEmbeddingArgs = (
  value: KnowledgeEmbeddingArgsCandidate
): value is KnowledgeEmbeddingArgs =>
  typeof value.source === "string" &&
  typeof value.category === "string" &&
  typeof value.title === "string" &&
  typeof value.content === "string" &&
  Array.isArray(value.tags) &&
  value.tags.every((tag) => typeof tag === "string");

const buildKnowledgeEmbeddingArgs = (
  scenario: CareerEnhancedScenario
): KnowledgeEmbeddingArgs => {
  const candidate: KnowledgeEmbeddingArgsCandidate = {
    source: scenario.source,
    category: scenario.category,
    title: scenario.title,
    content: scenario.content,
    tags: scenario.tags
  };

  if (!isKnowledgeEmbeddingArgs(candidate)) {
    throw new Error(`Scenario data invalid for ${scenario.title}`);
  }

  return {
    source: candidate.source,
    category: candidate.category,
    title: candidate.title,
    content: candidate.content,
    tags: [...candidate.tags]
  };
};

export const CAREER_SCENARIOS_ENHANCED: CareerEnhancedScenario[] = [
  // Scenario 1: Career Pivot
  {
    source: "career_coaching_enhanced",
    category: "career_transition",
    title: "Navigating a Career Pivot: The Complete Transition Playbook",
    content: `Career pivots are scary. You're leaving the known for the unknown. But with the right strategy, you can successfully transition to a new career or industry without starting from scratch.

THE 4-PHASE TRANSITION MODEL:

PHASE 1: EXPLORATION (1-3 Months)

Goal: Validate your pivot direction before committing

Step 1: Identify Transferable Skills

Your past experience isn't wasted—it's your competitive advantage.

Transferable Skills Audit:
- Leadership: Have you managed people or projects?
- Communication: Do you write, present, or influence?
- Analysis: Can you interpret data and solve problems?
- Technical: What tools and systems do you know?
- Domain Knowledge: What industries/functions do you understand?

Exercise:
List 10 achievements from your current role. For each, identify the underlying skill (not the job-specific task).

Example:
❌ "Managed sales team" (job-specific)
✅ "Led team of 8, coached performance, resolved conflicts" (transferable)

Step 2: Research Target Roles Thoroughly

Don't guess what the job is like. Talk to people doing it.

Research Checklist:
✅ Read 20+ job descriptions for target role
✅ Identify common requirements and skills
✅ Understand typical career progression
✅ Research salary ranges (Glassdoor, Levels.fyi)
✅ Join industry communities (Reddit, Slack groups)

Step 3: Conduct 10+ Informational Interviews

This is the most important step. Don't skip it.

Informational Interview Script:

Outreach Message:
"Hi [NAME], I'm exploring a transition into [FIELD] and came across your profile. I'd love to learn about your experience in [SPECIFIC AREA]. Would you have 15 minutes for a quick call? Happy to work around your schedule."

During the Call:
1. "How did you get into this field?"
2. "What does a typical day/week look like?"
3. "What skills are most important for success?"
4. "What do you wish you knew before starting?"
5. "What are the biggest challenges in this role?"
6. "Who else should I talk to?"

Follow-Up:
Send thank you within 24 hours. Share something valuable (article, introduction, insight).

Step 4: Test the Waters

Don't quit your job to "try" something. Test first.

Ways to Test:
- Freelance projects on Upwork/Fiverr
- Volunteer work in target field
- Side projects demonstrating capability
- Part-time consulting
- Online courses with hands-on projects

Goal: Validate you actually like the work, not just the idea of it.

PHASE 2: PREPARATION (3-6 Months)

Goal: Build credibility and close skill gaps

Step 1: Build Missing Skills

Focus on skills that appear in 80%+ of job descriptions.

Learning Strategy:
- Online courses (Coursera, Udemy, LinkedIn Learning)
- Certifications if industry-standard (PMP, AWS, etc.)
- Books by practitioners (not academics)
- YouTube tutorials for technical skills
- Practice projects to apply learning

Time Investment:
- 10-15 hours/week if employed
- 30-40 hours/week if unemployed

Step 2: Create Portfolio or Case Studies

Show, don't just tell.

Portfolio Components:
1. 3-5 projects demonstrating target skills
2. Before/after or problem/solution format
3. Quantified results where possible
4. Process documentation (how you approached it)
5. Lessons learned section

Example Case Study Structure:

CHALLENGE: [What problem were you solving?]
APPROACH: [What did you do? Why?]
RESULTS: [What happened? Metrics?]
LEARNINGS: [What would you do differently?]

Step 3: Develop Industry Knowledge

You need to speak the language.

Industry Immersion:
- Read industry publications daily
- Follow thought leaders on LinkedIn/Twitter
- Listen to industry podcasts
- Attend virtual conferences/webinars
- Join professional associations

Goal: In 3 months, you should be able to discuss current trends, challenges, and key players in the industry.

Step 4: Network Actively

Your network is your net worth in a career pivot.

Networking Strategy:
- Attend 2-3 industry events per month
- Join relevant LinkedIn groups and participate
- Connect with 5-10 new people weekly
- Offer value before asking for anything
- Build relationships, not just contacts

PHASE 3: POSITIONING (2-4 Months)

Goal: Rebrand yourself for the new direction

Step 1: Rebrand Resume and LinkedIn

Your resume should tell a story of intentional progression, not random jobs.

Resume Rebranding:
- Lead with target role in headline
- Summary focused on transferable skills
- Reframe past experience for new context
- Highlight relevant projects/achievements
- Remove irrelevant details

Example Reframe:
❌ "Sales Manager at Tech Corp"
✅ "Customer Success Leader | Drove $2M Revenue Growth | Expert in Stakeholder Management"

LinkedIn Optimization:
- Headline with keywords for target role
- Summary telling your pivot story
- Featured section with portfolio work
- Regular posts demonstrating expertise
- Recommendations from credible sources

Step 2: Craft Compelling Transition Story

You need a clear, confident answer to "Why this change?"

The Transition Story Formula:

1. Where You've Been (15 seconds)
"I spent 5 years in sales, where I developed strong skills in relationship building and problem-solving."

2. The Turning Point (15 seconds)
"I realized my favorite part was analyzing customer data to identify patterns and improve processes."

3. Where You're Going (15 seconds)
"That's why I'm transitioning to data analytics. I've completed certifications in SQL and Python, and built 3 portfolio projects."

4. Why You're Excited (15 seconds)
"I'm excited to combine my business acumen with technical skills to drive data-informed decisions."

Total: 60 seconds, confident and clear.

Step 3: Apply Strategically

Quality over quantity. 5 targeted applications > 50 spray-and-pray.

Application Strategy:
- Target companies where you have connections
- Customize every application to the role
- Lead with transferable skills, not job titles
- Address the pivot proactively in cover letter
- Follow up after 1 week if no response

Cover Letter Pivot Template:

"While my background is in [OLD FIELD], I'm transitioning to [NEW FIELD] because [REASON]. My experience in [OLD FIELD] gives me unique perspective on [RELEVANT INSIGHT]. I've prepared for this transition by [ACTIONS TAKEN]. I'm excited to bring [TRANSFERABLE SKILLS] to [COMPANY]."

Step 4: Leverage Warm Introductions

Referrals are 4x more likely to get interviews.

Referral Strategy:
- Ask your network: "Do you know anyone at [COMPANY]?"
- Make it easy: provide your resume and talking points
- Offer to draft the introduction email
- Follow up with the referrer and the contact

PHASE 4: LANDING (1-3 Months)

Goal: Convert interviews into offers

Step 1: Interview with Confidence

Address the elephant in the room proactively.

Pivot Interview Script:

"Why are you changing careers?"
"I've spent [X years] in [OLD FIELD], where I developed [TRANSFERABLE SKILLS]. I realized my passion is [NEW FIELD] because [REASON]. I've prepared for this transition by [ACTIONS]. I'm excited to bring a fresh perspective and diverse skill set to this role."

"Why should we hire someone without direct experience?"
"While I don't have the exact job title, I have the core skills: [LIST]. My diverse background means I approach problems differently, which often leads to innovative solutions. I'm also highly motivated—I chose this field intentionally, not by default."

"Aren't you starting over?"
"I'm not starting over—I'm building on a strong foundation. My [OLD FIELD] experience gives me [UNIQUE ADVANTAGE]. I'm combining that with new technical skills to create a unique value proposition."

Step 2: Negotiate from Your Strengths

You might take a pay cut, but negotiate other things.

Negotiation Strategy:
- Acknowledge you're pivoting: "I understand I'm building experience in this role"
- Emphasize unique value: "My [OLD FIELD] background brings [ADVANTAGE]"
- Negotiate non-salary items: remote work, learning budget, title, equity
- Ask for performance review in 6 months with raise potential

Step 3: Plan Your First 90 Days

Prove you made the right choice—fast.

90-Day Plan:
Days 1-30: Learn everything
- Understand the business, team, and processes
- Build relationships with key stakeholders
- Identify quick wins

Days 31-60: Deliver quick wins
- Solve a problem that's been lingering
- Bring fresh perspective from old field
- Demonstrate value quickly

Days 61-90: Establish yourself
- Take on stretch project
- Share learnings publicly
- Position yourself for growth

COMMON PIVOT MISTAKES:

Mistake 1: Waiting Until You Feel "Ready"
You'll never feel 100% ready. Start before you're ready.

Mistake 2: Not Leveraging Your Network
80% of jobs are filled through referrals. Use your network.

Mistake 3: Apologizing for the Career Change
Don't apologize. Frame it as bringing fresh perspective and diverse skills.

Mistake 4: Expecting the Same Salary Immediately
You might take a 10-20% pay cut initially. Plan for it financially.

Mistake 5: Trying to Pivot Too Drastically
Don't go from accountant to circus performer. Make adjacent moves.

PIVOT READINESS CHECKLIST:

Before quitting your job:
✅ 6-12 months emergency fund saved?
✅ Completed 10+ informational interviews?
✅ Built portfolio demonstrating capability?
✅ Tested the work through projects?
✅ Have at least 3 people in target field who can refer you?
✅ Clear transition story prepared?
✅ LinkedIn and resume rebranded?

If you can't check all boxes, keep preparing while employed.

KEY PRINCIPLE:

Your past experience is an asset, not a liability. Frame it as bringing fresh perspective, diverse skills, and unique insights.

The best pivots combine old expertise with new skills to create unique value.`,
    tags: ["career_change", "transition", "job_search", "networking", "pivot", "career_transition"]
  },
  {
    source: "career_coaching_enhanced",
    category: "confidence",
    title: "Overcoming Imposter Syndrome: From Self-Doubt to Self-Trust",
    content: `Imposter syndrome isn’t cured by more achievements—it’s resolved by rebuilding the evidence you trust about yourself, updating your identity narrative, and practicing courage before confidence. This approach gives you a structured plan to name, neutralize, and ultimately leverage self-doubt as fuel instead of friction.

UNDERSTAND YOUR PATTERN
Identify which archetype resonates:
1. The Perfectionist – sets impossible standards, fixates on flaws.
2. The Expert – believes “I must know everything before I start.”
3. The Natural Genius – equates effort with failure.
4. The Soloist – thinks asking for help proves incompetence.
5. The Superhuman – overcommits to prove value in every area.

Run a weekly reflection: When did imposter thoughts spike? What triggered them? What story did you tell yourself? Document patterns.

BUILD THE EVIDENCE VAULT
Create a “wins folder” (Notion, Google Doc, email label). Include:
- Metrics: revenue generated, cost saved, efficiency gained.
- Testimonials: screenshots of positive feedback.
- Milestones: promotions, awards, shipped projects.
- Personal growth: skills learned, difficult conversations navigated.
Review before high-stakes moments. Facts quiet feelings.

REWRITE YOUR NARRATIVE
Use the Thought → Evidence → Reframe loop:
1. Thought: “I don’t deserve to be here.”
2. Evidence: list concrete achievements proving otherwise.
3. Reframe: “I earned this seat through [specific contributions]. Doubt is normal—and I can still deliver.”

Practise out-loud reframes. When brain hears your voice reinforcing a new story, it starts to accept it.

TURN COMPARISON INTO DATA
When envy hits, ask: What skill or behaviour do they demonstrate that I admire? Treat envy as a roadmap. Add that skill to your development plan. Replace “Why not me?” with “What can I learn from them?”

CREATE A SUPPORT LOOP
• Peer circle: 3–5 trusted colleagues who share struggles and celebrate wins.
• Mentors: people 1–2 levels ahead who normalise the growth path.
• Therapist/coach: if anxiety interferes with sleep, health, or relationships.
Discuss imposter moments openly. Normalisation reduces shame.

PERFORMANCE RITUALS
Before presentations or major deliverables:
• Review evidence vault.
• Power pose + deep breathing (inhale 4, hold 4, exhale 6).
• Affirmation: “I prepared thoroughly. I can handle whatever comes.”

Afterward:
• Debrief 3 wins, 1 lesson.
• Archive positive feedback immediately.

BUILD SELF-TRUST MUSCLE
Self-trust is doing what you say you will do. Use weekly commitments:
1. Choose three priorities.
2. Block time for each.
3. Track completion. Adjust scope rather than abandoning commitments.

TEACH TO REINFORCE
Share knowledge via lunch-and-learns, blog posts, or mentoring. Teaching proves you understand material and locks learning in place.

TROUBLESHOOTING TRIGGERS
• First-time leadership: schedule weekly reflection with mentor.
• Executive audiences: role-play Q&A with peers, prepare “I don’t know YET” responses.
• Role changes: document early wins, share progress updates widely.

KEY PRINCIPLE
Confidence isn’t the absence of doubt; it’s the practice of moving forward alongside doubt. Evidence, reframing, and community turn imposter moments into growth fuel.`,
    tags: ["imposter_syndrome", "confidence", "self_trust", "mindset", "growth"]
  },

  {
    source: "career_coaching_enhanced",
    category: "negotiation",
    title: "Salary Negotiation: Scripts and Leverage Points",
    content: `Job hunting today is a digital-first, narrative-driven, relationship-heavy campaign. This modern job search system ensures you show up everywhere with a clear value proposition, high-quality assets, and a velocity that creates momentum.

PREPARE YOUR LEVERAGE
• Research: Glassdoor, Levels.fyi, industry reports, peer conversations.
• Map total compensation: base, bonus, equity, signing bonus, benefits, learning budget, remote flexibility.
• Define three numbers: walk-away (minimum acceptable), target (realistic), dream (high but defensible).

NEGOTIATION TIMELINE
1. Receive offer – express enthusiasm, request 2–3 days to evaluate.
2. Evaluate – calculate total comp, compare to market, identify gaps.
3. Counteroffer discussion – schedule call, present rationale, collaborate.
4. Follow up – confirm changes in writing, sign once satisfied.

CORE SCRIPTS
Salary expectations question:
“I’m looking for competitive compensation aligned with the scope and impact of this role. What range did you have budgeted?”

Initial counter:
“I’m excited about joining. Based on my research and the value I’ll bring through [specific achievements], I was expecting [target number]. Can we explore getting closer to that?”

If they can’t move on base:
“Understood. Could we look at other levers—signing bonus, earlier review cycle, additional vacation, or remote flexibility—to bridge the gap?”

Multiple offers:
“I have another offer at [X]. I prefer [YOUR COMPANY] because [reasons], and would accept if we can get to [target].”

USE SILENCE & QUESTIONS
After presenting your ask, stop talking. Let them respond. If they hesitate, ask, “What would need to happen internally to make that possible?”

DOCUMENT AGREEMENTS
Request revised offer letter detailing base, bonus, equity vesting schedule, start date, any negotiated adjustments. Do not resign from current role until you have written confirmation.

COMMON MISTAKES TO AVOID
• Accepting first offer immediately.
• Negotiating exclusively over email.
• Apologising for negotiating (“Sorry to ask…”).
• Lying about other offers (destroys trust).
• Failing to clarify performance expectations tied to bonus/equity.

PLAN B IF OFFER IS CAPPED
• Ask for six-month compensation review with KPIs.
• Negotiate professional development stipend.
• Request title upgrade or expanded scope to accelerate future raises.

KEY PRINCIPLE
You’re negotiating based on the business value you’ll deliver. Be confident, collaborative, and anchored in data. The worst they can say is no—and even then, you’ll know you advocated for yourself.`,
    tags: ["negotiation", "salary", "compensation", "job_offer", "career_strategy"]
  },

  {
    source: "career_coaching_enhanced",
    category: "boundaries",
    title: "Setting Work Boundaries Without Hurting Your Reputation",
    content: `Getting promoted isn’t just about working harder—it’s about aligning your contributions to what leadership values, making your impact visible, and preparing your successor before anyone asks “Who will take over?”.
High performers without boundaries burn out; high performers with boundaries inspire trust.

FOUR TYPES OF BOUNDARIES
1. Time Boundaries – work hours, response expectations, focus blocks.
2. Workload Boundaries – what you take on, when to say no, delegation.
3. Communication Boundaries – how/when people contact you.
4. Energy Boundaries – activities and people that drain vs energise.

SET EXPECTATIONS EARLY
Send a norms email to your team:
“I’m typically online 9–6. I batch emails at 9, 1, and 4. For urgent issues outside hours, please call/text. Otherwise I’ll respond next business day.”

CALENDAR DEFENCE
• Block focus time daily (mark as Busy).
• Hold weekly review to prioritise and drop non-critical tasks.
• Use meeting acceptance criteria: Does it have agenda? Clear role for me? If not, request clarification or decline.

SAYING NO WITH RESPECT
Framework: Acknowledge → Explain capacity → Offer alternative.
“Thanks for thinking of me. This week I’m at capacity with [projects]. I can support after [date], or suggest looping in [person]. What works best?”

HANDLE SCOPE CREEP
“The original request was X. We’re now adding Y and Z. To deliver all three by Friday I’d need [extra resources/extended deadline]. Which priority should we focus on?”

RESETTING AFTER BURNOUT SIGNALS
Signs: irritability, late-night work, resentment. Steps:
1. Pause non-critical commitments.
2. Communicate with manager: “I want to maintain quality but current workload isn’t sustainable. Let’s re-prioritise together.”
3. Reintroduce recovery habits (sleep, exercise, social time).

TEAM BOUNDARIES AS LEADER
• Publicly respect others’ boundaries (no late-night pings, praise saying no when it protects quality).
• Set up coverage plans for vacations.
• Assess capacity before assigning work.

KEY PRINCIPLE
Boundaries aren’t walls—they’re guardrails that keep you performing at your best. Communicate them clearly, model them consistently, and back them up with excellence.`,
    tags: ["boundaries", "work_life_balance", "energy_management", "communication", "burnout_prevention"]
  },

  {
    source: "career_coaching_enhanced",
    category: "skill_development",
    title: "Strategic Skill Building: Become the Go-To Expert",
    content: `Skill building only compounds when it’s strategic, measured, and connected to visibility. This system takes you from “I should learn something new” to “I have a 12-month roadmap and sponsors who see my growth.”

IDENTIFY HIGH-ROI SKILLS
• Analyse job descriptions two levels above yours.
• Ask leaders: “Which skills separate top performers?”
• Map to long-term industry trends (automation, AI, sustainability, data fluency).

BUILD A SKILL ROADMAP
1. Foundation (1–2 months): courses, books, foundational theory.
2. Practice (2–3 months): apply in real projects, side gigs, hackathons.
3. Feedback (ongoing): mentors review your work, give direct critique.
4. Multiplication (ongoing): teach, document, systematise.

70-20-10 LEARNING MODEL
• 70% on-the-job stretch assignments.
• 20% coaching/mentorship.
• 10% formal training.
Convert learning into deliverables: write playbooks, build templates, record Loom explainers.

TRACK PROGRESS
• Maintain skill matrix (novice → advanced).
• Capture before/after examples of work quality.
• Celebrate milestones (certification earned, presentation delivered, process improved).

SHOWCASE EXPERTISE
• Create portfolio: architecture diagrams, dashboards, code repos, playbooks.
• Share insights publicly (LinkedIn posts, conference talks, internal wiki).
• Volunteer for high-impact problems that need your emerging skill.

KEY PRINCIPLE
Skills compound. Focus on durable capabilities that future-proof your career—storytelling, analytics, leadership, product sense, AI fluency.`,
    tags: ["skill_development", "learning", "career_growth", "expertise", "professional_development"]
  },

  {
    source: "career_coaching_enhanced",
    category: "networking",
    title: "Building a Network That Opens Doors",
    content: `Your network is an asset that appreciates with investment. Approach relationships with a “give first” mindset.

THE FIVE RINGS OF CONNECTION
1. Inner Circle (5–8 people): mentors, sponsors, trusted peers. Meet monthly.
2. Active Circle (20–30): regular collaborators. Connect quarterly.
3. Familiar Circle (50–100): occasional touchpoints. Share updates semi-annually.
4. Visibility Circle (hundreds): know you via content. Provide value via insights, introductions.
5. Growth Circle: new contacts you’re cultivating.

CONNECTION SYSTEM
• Use CRM (Notion, Clay, spreadsheet). Track how you met, interests, last interaction, promised follow-ups.
• Weekly ritual: send 5 “just because” notes congratulating achievements or sharing resources.
• Monthly ritual: host or attend mastermind, roundtable, or virtual coffee.

VALUE-FIRST OUTREACH
“I appreciated your talk on [topic]. I built a checklist based on it—thought you might find it useful. Would love to exchange ideas sometime.”

INTRODUCTIONS THAT MATTER
• Get permission before connecting folks.
• Provide context: why they should meet, what to discuss.
• Follow up to ensure connection was helpful.

HOST EXPERIENCES
• Start monthly lunch-and-learn, book club, or project jam session.
• Curate invite list intentionally (diverse roles, shared interests).

MAINTAIN WITHOUT BURNOUT
• Batch outreach (Friday mornings or calendar reminder).
• Use voice notes or Loom for personal touch when short on time.

KEY PRINCIPLE
Network equity grows when you help others succeed. Be the connector, the resource, the person who follows through. Opportunities will compound.`,
    tags: ["networking", "relationships", "career_development", "community", "visibility"]
  },

  {
    source: "career_coaching_enhanced",
    category: "leadership_transition",
    title: "From Peer to Manager: Leading Former Colleagues",
    content: `Transitioning from peer to manager is awkward but manageable with transparency, fairness, and structure.

FIRST 30 DAYS FRAMEWORK
1. Acknowledge the change: “I know our dynamic shifts with me in this role. My goal is to support you and keep communication open.”
2. Reset expectations: one-on-ones with each teammate to understand goals, working styles, support needs.
3. Establish norms: decision rights, meeting cadence, feedback channels.

PROFESSIONAL BOUNDARIES
• Friendly, not friends. Reduce gossip, avoid sharing confidential info.
• Decline exclusive social invites that could be perceived as favouritism.

BUILD TRUST THROUGH FAIRNESS
• Equal access to you (consistent 1:1 cadence).
• Transparent criteria for assignments and recognition.
• Address underperformance quickly—even if it’s a friend.

COMMUNICATION TEMPLATES
Feedback: “I value our history, and part of my role now is giving direct feedback. In yesterday’s stand-up, [behaviour]. Let’s align on expectations going forward.”
Delegation: “You’ve demonstrated strength in [skill]. Owning [project] will stretch you towards [goal]. I’ll support with [resources].”

UPWARD MANAGEMENT
• Keep your manager informed about team dynamics.
• Ask for coaching on tough situations.
• Share wins from the team to build visibility for them.

KEY PRINCIPLE
Lead with clarity, consistency, and empathy. When teammates see you advocating for them and holding a fair bar, respect replaces awkwardness.`,
    tags: ["leadership", "first_time_manager", "peer_to_manager", "team_dynamics", "management"]
  },

  {
    source: "career_coaching_enhanced",
    category: "remote_work",
    title: "Thriving in Remote Work: Visibility, Productivity, Balance",
    content: `Remote success requires deliberate systems for communication, visibility, and wellbeing.

BUILD YOUR OPERATING SYSTEM
• Workspace: dedicated setup, ergonomic, reliable tech.
• Rituals: start-of-day planning, mid-day break, end-of-day shutdown routine.
• Timeboxing: calendar blocks for deep work, collaboration, admin.

COMMUNICATE PROACTIVELY
• Daily async stand-up (What I’m working on / Blockers / Needs).
• Weekly summary email: wins, metrics, learnings, upcoming priorities.
• Use video for complex topics, async updates for routine matters.

STAY VISIBLE WITHOUT NOISE
• Document decisions and share widely.
• Present wins in team meetings, credit collaborators.
• Contribute to knowledge base (playbooks, FAQs, process docs).

PREVENT OVERWORK
• Define clear “done for the day” ritual (close laptop, change clothes, walk).
• Disable work notifications outside hours. Communicate emergency protocol.
• Schedule exercise and social time like meetings.

FIGHT ISOLATION
• Pair programming or co-working sessions.
• Virtual coffees with peers.
• Engage in interest-based communities.

KEY PRINCIPLE
Remote work rewards intentionality. Run your day like a well-designed product: clear goals, strong communication loops, and guardrails against burnout.`,
    tags: ["remote_work", "productivity", "communication", "visibility", "wellbeing"]
  },
];

// Export for integration
export const seed = action({
  args: {},
  handler: async (ctx) => {
    let loaded = 0;
    let errors = 0;
    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const scenario of CAREER_SCENARIOS_ENHANCED) {
      try {
        const payload = buildKnowledgeEmbeddingArgs(scenario);
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, payload);

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
      total: CAREER_SCENARIOS_ENHANCED.length,
      results
    };
  }
});
