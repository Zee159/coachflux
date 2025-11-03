/**
 * Career Development Knowledge Base - 10 Scenarios
 * 
 * Run this to load career coaching scenarios:
 *   npx convex run seedCareerDevelopment:seed
 */

/* eslint-disable no-console */
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const CAREER_SCENARIOS = [
  {
    source: "career_coaching",
    category: "career_transition",
    title: "Navigating a Career Pivot",
    content: `How to successfully transition to a new career or industry:

The 4-Phase Transition Model:

Phase 1: Exploration (1-3 months)
- Identify transferable skills from current role
- Research target roles and industries thoroughly
- Conduct 10+ informational interviews
- Test the waters with side projects or freelance work

Phase 2: Preparation (3-6 months)
- Build missing skills through courses or certifications
- Create portfolio or case studies demonstrating capability
- Develop industry-specific knowledge and vocabulary
- Network actively with people in target field

Phase 3: Positioning (2-4 months)
- Rebrand resume and LinkedIn for new direction
- Craft compelling transition story
- Apply strategically (quality over quantity)
- Leverage warm introductions and referrals

Phase 4: Landing (1-3 months)
- Interview with confidence about your pivot
- Address "why this change?" proactively
- Negotiate from your unique strengths
- Plan your first 90 days in new role

Common Mistakes:
- Waiting until you feel "ready" (you never will be)
- Not leveraging your existing network
- Apologizing for the career change
- Expecting the same salary immediately
- Trying to pivot too drastically in one jump

Key Principle: Your past experience is an asset, not a liability. Frame it as bringing fresh perspective and diverse skills.`,
    tags: ["career_change", "transition", "job_search", "networking", "pivot"]
  },
  {
    source: "career_coaching",
    category: "promotion",
    title: "Getting Promoted: The Unwritten Rules",
    content: `What actually gets people promoted beyond just doing good work:

The Promotion Formula:
Performance (40%) + Visibility (30%) + Relationships (30%) = Promotion

1. Performance Excellence
- Consistently exceed expectations
- Deliver measurable results with business impact
- Take on stretch assignments proactively
- Solve problems before they escalate

2. Strategic Visibility
- Make your work known without bragging
- Present at team meetings and company forums
- Document wins and share learnings publicly
- Build your internal brand and reputation

3. Key Relationships
- Build relationships with decision-makers
- Find sponsors (not just mentors) who advocate for you
- Help others succeed (reputation as team player)
- Be known as collaborative and easy to work with

The 6-Month Promotion Campaign:
Month 1-2: Document your impact with metrics and wins
Month 3-4: Have explicit "career conversation" with manager
Month 5-6: Demonstrate next-level capabilities consistently

Red Flags You're Not Ready:
- Can't articulate your impact in numbers
- Manager doesn't know you want promotion
- Haven't operated at next level yet
- No relationships outside your immediate team
- Waiting for permission instead of taking initiative

Critical Question: "If I got promoted tomorrow, what would I do differently?" Start doing that now to demonstrate readiness.`,
    tags: ["promotion", "career_growth", "visibility", "relationships", "advancement"]
  },
  {
    source: "career_coaching",
    category: "job_search",
    title: "The Modern Job Search Strategy",
    content: `How to find opportunities in the hidden job market:

The 70-20-10 Rule:
- 70% networking and referrals (highest success rate)
- 20% targeted applications (quality over quantity)
- 10% recruiters and job boards (lowest ROI)

Networking That Actually Works:

1. Identify 20 target companies you'd love to work for
2. Find 2-3 people at each company via LinkedIn
3. Request 15-minute informational interviews
4. Ask: "What's it like working there? What challenges is the team facing?"
5. Follow up with value (relevant article, introduction, insight)
6. Stay in touch quarterly with updates

The Referral Strategy:
- 80% of jobs are filled through referrals
- Referrals are 4x more likely to get interviews
- Ask: "Do you know anyone at [company] I should talk to?"
- Make it easy: provide your resume and talking points

Application Strategy:
- Quality over quantity (5 targeted > 50 spray-and-pray)
- Customize every application to the role
- Research the company and team deeply
- Follow up after 1 week if no response

LinkedIn Optimization:
- Professional photo (increases profile views 14x)
- Headline with keywords (not just job title)
- Summary telling your unique story
- Regular posts demonstrating expertise

Remember: Job searching is a full-time job. Dedicate 4-6 hours daily if unemployed, 1-2 hours daily if employed.`,
    tags: ["job_search", "networking", "linkedin", "referrals", "applications"]
  },
  {
    source: "career_coaching",
    category: "confidence",
    title: "Overcoming Imposter Syndrome",
    content: `How to manage self-doubt and feeling like a fraud:

What Imposter Syndrome Really Is:
- Not a character flaw or weakness
- Sign you're challenging yourself and growing
- Common among high achievers (70% experience it)
- Disconnection between perception and reality

The 5 Types:
1. The Perfectionist - "It's never good enough"
2. The Expert - "I need to know everything before starting"
3. The Natural Genius - "If I struggle, I'm not smart"
4. The Soloist - "I must do it alone to prove myself"
5. The Superhuman - "I should excel at everything"

Practical Strategies:

1. Collect Evidence
- Keep a "wins folder" of accomplishments
- Save positive feedback and emails
- Review when self-doubt strikes
- Let facts override feelings

2. Reframe the Narrative
- "I don't know" → "I'm learning"
- "I got lucky" → "I prepared and executed well"
- "They'll find out I'm a fraud" → "I earned this position"

3. Talk About It
- Share with trusted colleagues
- You'll find you're not alone
- Reduces power of the secret
- Normalizes the experience

4. Separate Feelings from Facts
- Feeling like a fraud ≠ being a fraud
- Your feelings are valid but not accurate
- Ask: "What evidence contradicts this feeling?"

5. Embrace "Yet"
- "I can't do this" → "I can't do this yet"
- Growth mindset vs fixed mindset
- Focus on progress, not perfection

Remember: If you feel like an imposter, it means you're growing. Comfort is the enemy of growth.`,
    tags: ["imposter_syndrome", "confidence", "self_doubt", "mindset", "growth"]
  },
  {
    source: "career_coaching",
    category: "negotiation",
    title: "Salary Negotiation Mastery",
    content: `How to negotiate compensation effectively:

The Golden Rules:
1. Always negotiate (even if happy with initial offer)
2. Never give a number first
3. Negotiate total compensation, not just salary
4. Have a walk-away number before starting

Research Phase:
- Use Glassdoor, Levels.fyi, Payscale for data
- Talk to people in similar roles
- Consider: location, company size, industry
- Know your market value ±20%

The Negotiation Script:

When asked for salary expectations:
"I'm looking for a competitive offer based on the role and my experience. What's the budget for this position?"

When you receive an offer:
"Thank you for the offer. I'm excited about the opportunity. I'd like some time to review the full package. Can we schedule a call in 2 days?"

During negotiation call:
"I'm very interested in joining. Based on my research and the value I'll bring, I was expecting [X]. Can we get closer to that number?"

If they can't move on salary:
"I understand the salary constraints. Can we discuss:
- Signing bonus to bridge the gap
- Performance bonus structure
- Additional vacation days
- Remote work flexibility
- Professional development budget
- Earlier performance review for raise"

Common Mistakes:
- Accepting first offer immediately
- Only focusing on base salary
- Not knowing your walk-away number
- Apologizing for negotiating
- Negotiating via email (always phone/video)

Remember: Companies expect negotiation. Not negotiating signals you don't value yourself. The worst they can say is no.`,
    tags: ["salary", "negotiation", "compensation", "job_offer", "benefits"]
  },
  {
    source: "career_coaching",
    category: "boundaries",
    title: "Setting Healthy Work Boundaries",
    content: `How to protect your time and energy without damaging your career:

The Boundary Framework:

1. Availability Boundaries
- Set clear work hours and communicate them
- Turn off notifications outside hours
- Use auto-responder for after-hours emails
- Example: "I'm available 9-6. For emergencies, call my cell."

2. Workload Boundaries
- Learn to say no strategically
- Use: "I can do X or Y, but not both. Which is priority?"
- Delegate or defer non-critical work
- Track your capacity honestly

3. Communication Boundaries
- Batch email checking (3x daily: 9am, 1pm, 4pm)
- Set response time expectations
- Use "Do Not Disturb" when focused
- Respond to urgent matters only outside hours

4. Meeting Boundaries
- Decline meetings without clear agenda
- Suggest async alternatives when possible
- Block focus time on calendar
- Leave meetings that don't need you

How to Say No Professionally:

❌ "I'm too busy"
✅ "I'm committed to X and Y. Taking this on would compromise quality. Can we revisit in [timeframe]?"

❌ "That's not my job"
✅ "That's outside my current scope. Let me connect you with [person] who handles that."

❌ "No"
✅ "I can't commit to that timeline, but I could deliver by [date]. Would that work?"

Red Flags You Need Boundaries:
- Working evenings and weekends regularly
- Feeling resentful about requests
- Sacrificing health or relationships for work
- Burnout symptoms appearing

Remember: Boundaries aren't selfish. They're necessary for sustainable high performance. You can't pour from an empty cup.`,
    tags: ["boundaries", "work_life_balance", "saying_no", "burnout_prevention", "wellbeing"]
  },
  {
    source: "career_coaching",
    category: "skill_development",
    title: "Strategic Skill Building",
    content: `How to develop skills that accelerate your career:

The T-Shaped Professional Model:
- Deep expertise in one area (the vertical bar)
- Broad knowledge across multiple areas (the horizontal bar)
- Ability to collaborate across disciplines

Identifying High-Value Skills:

1. Look at job postings 2 levels above you
2. Ask: "What skills do the most successful people have?"
3. Identify gaps between current and target role
4. Focus on skills with 5-10 year relevance (not fads)

The 70-20-10 Learning Model:
- 70% on-the-job experience (stretch assignments)
- 20% learning from others (mentoring, shadowing)
- 10% formal training (courses, books)

Skill-Building Strategy:

Phase 1: Learn (1-2 months)
- Take course or read authoritative books
- Watch tutorials and expert demonstrations
- Understand fundamentals and theory

Phase 2: Practice (2-3 months)
- Apply in low-stakes situations
- Get feedback from experts
- Iterate and improve continuously

Phase 3: Teach (1 month)
- Explain concepts to others
- Write articles or create content
- Mentor someone learning the skill
- Teaching solidifies your own learning

Phase 4: Master (ongoing)
- Tackle increasingly complex problems
- Innovate and improve on existing methods
- Become the go-to person for this skill

High-ROI Skills for Any Career:
- Communication (writing, presenting)
- Data analysis and interpretation
- Project management
- Emotional intelligence
- Strategic thinking
- Digital literacy and AI tools

Remember: Skills compound. Each new skill makes the next one easier to learn. Focus on fundamentals that transfer.`,
    tags: ["skill_development", "learning", "career_growth", "professional_development", "expertise"]
  },
  {
    source: "career_coaching",
    category: "networking",
    title: "Building a Powerful Professional Network",
    content: `How to network authentically and strategically:

The Network Mindset Shift:
❌ "What can I get from this person?"
✅ "How can I help this person?"

The 5-Circle Network Model:

Circle 1: Core (5-10 people)
- Mentors, sponsors, close colleagues
- Meet monthly, stay deeply connected
- They advocate for you when you're not in the room

Circle 2: Active (20-30 people)
- Regular professional contacts
- Touch base quarterly
- Mutual support and information sharing

Circle 3: Familiar (50-100 people)
- Know them, they know you
- Connect 1-2x per year
- LinkedIn connections you actually know

Circle 4: Aware (100-500 people)
- They know of you through your work/content
- Follow your content and updates
- Potential future connections

Circle 5: Strangers (everyone else)
- Target for expanding network
- Convert to Circle 4 through value

Networking Tactics That Work:

1. The Coffee Chat Strategy
- Request 15-20 minute virtual coffee
- Come prepared with specific questions
- Focus on learning, not asking for jobs
- Follow up with thank you and value-add

2. The Content Strategy
- Share insights on LinkedIn regularly
- Comment thoughtfully on others' posts
- Write articles about your expertise
- Become known for something specific

3. The Introduction Strategy
- Connect people who should know each other
- "You should meet X because Y"
- Build reputation as a connector
- What goes around comes around

4. The Event Strategy
- Attend industry events with specific goal (meet 3 new people)
- Prepare conversation starters
- Follow up within 48 hours
- Quality over quantity always

Maintaining Your Network:
- Set quarterly reminders to reach out
- Share relevant articles or opportunities
- Celebrate their wins publicly
- Ask for nothing, offer value consistently

Remember: Your network is your net worth. Invest in relationships before you need them.`,
    tags: ["networking", "relationships", "career_development", "linkedin", "connections"]
  },
  {
    source: "career_coaching",
    category: "leadership_transition",
    title: "From Peer to Manager: Navigating the Transition",
    content: `How to successfully manage former peers:

The Awkward Reality:
Yesterday you were equals. Today you're their boss. This is uncomfortable for everyone and that's normal.

Week 1: Set the Tone

1. Acknowledge the Change
"I know this is a transition for all of us. I'm committed to being fair and supporting each of you."

2. One-on-Ones with Each Person
- Ask: "How do you prefer to work?"
- Ask: "What do you need from me as your manager?"
- Listen more than talk
- Take notes and follow through

3. Establish Boundaries
- You can be friendly, not friends
- Some relationships will change
- That's okay and necessary for the role

Month 1: Build Credibility

1. Quick Wins
- Solve a problem that's been bothering the team
- Remove a blocker they've complained about
- Improve a frustrating process

2. Consistent Communication
- Weekly team meetings with clear agendas
- Regular 1-on-1s (same cadence for everyone)
- Transparent decision-making process

3. Fair Treatment
- No favoritism (even with former close friends)
- Same standards applied to everyone
- Consistent enforcement of policies

Month 2-3: Establish Your Leadership Style

1. Make Tough Decisions
- You'll need to say no to friends
- You'll need to give critical feedback
- This is part of the job, not personal

2. Delegate Effectively
- Don't do everything yourself
- Trust your team's capabilities
- Let go of your old individual contributor role

3. Seek Feedback
- Ask: "How am I doing as your manager?"
- Adjust based on input
- Show you're learning too

Common Pitfalls:

❌ Trying to stay "one of the gang"
✅ Professional boundaries with warmth

❌ Overcompensating by being too tough
✅ Fair and consistent with everyone

❌ Avoiding difficult conversations
✅ Address issues early and directly

❌ Doing your old job plus managing
✅ Delegate your old responsibilities fully

Remember: Some friendships may change. That's the cost of leadership. Focus on being a good manager to everyone, not a best friend to some.`,
    tags: ["leadership", "management", "peer_to_manager", "transition", "first_time_manager"]
  },
  {
    source: "career_coaching",
    category: "remote_work",
    title: "Thriving in Remote Work",
    content: `How to be productive and visible when working remotely:

The Remote Work Success Formula:
Communication + Boundaries + Visibility = Remote Success

1. Over-Communication
- Share what you're working on proactively
- Update status regularly in team channels
- Respond promptly to messages (within 2 hours)
- Use video when possible for important discussions

2. Strong Boundaries
- Dedicated workspace (separate from living space)
- Clear start/end times communicated to team
- Take real breaks away from desk
- "Commute" ritual (walk before/after work)

3. Strategic Visibility
- Share progress in team channels
- Document decisions and learnings publicly
- Contribute to discussions actively
- Volunteer for visible projects

Remote Work Best Practices:

Morning Routine:
- Start at same time daily for consistency
- Review priorities and plan day
- Check messages and respond
- Set 2-3 key goals for the day

During Work:
- Use Pomodoro technique (25 min focus, 5 min break)
- Block calendar for deep work time
- Turn off notifications during focus blocks
- Take lunch away from desk

End of Day:
- Review what you accomplished
- Plan tomorrow's priorities
- Close all work apps
- Physical transition (walk, exercise, hobby)

Staying Connected:
- Schedule virtual coffee chats with colleagues
- Join optional social calls
- Participate in team activities
- Reach out proactively to build relationships

Common Remote Work Challenges:

1. Isolation
- Schedule regular social interaction
- Join online communities in your field
- Work from coffee shop occasionally
- Video calls with camera on

2. Overworking
- Set hard stop time and stick to it
- Use time tracking to monitor hours
- Take all vacation days
- Protect weekends religiously

3. Communication Gaps
- Assume positive intent in messages
- Ask clarifying questions
- Use video for complex or sensitive topics
- Document decisions in writing

4. Career Visibility
- Share wins in team meetings
- Update manager regularly on progress
- Build relationships across organization
- Seek feedback proactively

Remember: Remote work requires discipline and intentionality. Create systems that work for you and stick to them.`,
    tags: ["remote_work", "productivity", "work_from_home", "communication", "visibility"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding Career Development scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of CAREER_SCENARIOS) {
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
    console.log(`  Total: ${CAREER_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: CAREER_SCENARIOS.length
    };
  },
});
