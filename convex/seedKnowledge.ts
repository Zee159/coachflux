/* eslint-disable no-console */
/**
 * Seed knowledge base with Management Bible content
 * 
 * Run this to load sample scenarios:
 *   npx convex run seedKnowledge:seed
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

const SAMPLE_SCENARIOS = [
  {
    source: "management_bible",
    category: "performance_management",
    title: "Setting Clear Expectations",
    content: `Setting clear expectations is fundamental to effective management.

Key Principles:
1. Be Specific - "Complete the report by Friday 5pm" not "finish soon"
2. Measurable - Define what success looks like
3. Documented - Write it down, share it
4. Agreed Upon - Get commitment, not just compliance
5. Reviewed Regularly - Check-ins prevent surprises

Common Mistakes:
- Assuming people know what you want
- Being vague to avoid conflict
- Setting expectations once and never revisiting
- Not checking for understanding

Best Practice:
After setting an expectation, ask: "What's your understanding of what I'm asking for?"
This reveals gaps immediately.`,
    tags: ["expectations", "clarity", "communication", "performance"]
  },
  {
    source: "management_bible",
    category: "feedback",
    title: "The Feedback Sandwich Myth",
    content: `The "feedback sandwich" (positive-negative-positive) is widely taught but often ineffective.

Why It Fails:
1. People learn to ignore the positive (waiting for the "but")
2. The negative gets diluted
3. Feels manipulative when overused
4. Confuses the message

Better Approach: Direct, Kind Feedback
1. State the specific behavior
2. Explain the impact
3. Request the change
4. Offer support

Example:
"In yesterday's meeting, you interrupted Sarah three times. This makes her 
reluctant to share ideas. I need you to let people finish their thoughts. 
Would it help if I gave you a signal when you're interrupting?"

This is clear, kind, and actionable.`,
    tags: ["feedback", "communication", "difficult_conversations"]
  },
  {
    source: "management_bible",
    category: "performance_management",
    title: "Handling Chronic Underperformance",
    content: `When a team member consistently underperforms despite feedback:

The SBIR Model:
- Situation: "In the Q3 project..."
- Behavior: "You missed 3 deadlines..."
- Impact: "This delayed client delivery and affected team morale..."
- Request: "I need you to meet agreed deadlines or flag issues 48hrs in advance"

30-60-90 Day Plan:
- 30 days: Specific improvements expected
- 60 days: Measurable progress checkpoints
- 90 days: Final assessment

Document Everything:
- Specific examples with dates
- Conversations and agreements
- Support provided
- Progress (or lack thereof)

Red Flags (Time to Exit):
- No improvement after 60 days
- Defensive/blaming behavior
- Impact on team morale
- Unwillingness to acknowledge issues`,
    tags: ["underperformance", "pip", "feedback", "documentation"]
  },
  {
    source: "management_bible",
    category: "team_dynamics",
    title: "Resolving Team Conflict",
    content: `When team members are in conflict:

Step 1: Assess Severity
- Healthy debate? Let it continue
- Personal attacks? Intervene immediately
- Passive-aggressive? Address privately first

Step 2: Meet Individually
- Hear each perspective
- Identify the real issue (often not what they say)
- Gauge willingness to resolve

Step 3: Facilitated Conversation
- Set ground rules (no interrupting, focus on behavior not character)
- Each person shares their perspective
- Find common ground
- Agree on specific behaviors going forward

Step 4: Follow-Up
- Check in after 1 week
- Reinforce positive interactions
- Address backsliding immediately

When to Escalate:
- Harassment or discrimination
- Violence or threats
- Refusal to work together after intervention`,
    tags: ["conflict", "mediation", "team_dynamics"]
  },
  {
    source: "management_bible",
    category: "change_management",
    title: "Leading Through Change",
    content: `People resist change when they don't understand it or feel excluded.

The Change Curve:
1. Shock/Denial - "This won't really happen"
2. Anger/Resistance - "This is stupid"
3. Exploration - "Maybe this could work"
4. Acceptance - "This is how we do it now"

Your Role at Each Stage:
- Shock: Communicate clearly and repeatedly
- Anger: Listen, validate feelings, explain why
- Exploration: Provide support, answer questions
- Acceptance: Reinforce new behaviors, celebrate wins

Quick Wins Strategy:
Identify 2-3 easy wins in first 30 days to build momentum and credibility.

Common Mistakes:
- Announcing change once and expecting compliance
- Ignoring emotional reactions
- Not involving people in implementation
- Declaring victory too early`,
    tags: ["change", "resistance", "communication", "leadership"]
  },
  {
    source: "management_bible",
    category: "leadership",
    title: "First-Time Manager Survival Guide",
    content: `Common mistakes new managers make and how to avoid them:

1. Not Realizing You're On Stage
- Your team constantly monitors your words and actions
- Manage how you communicate in meetings and one-on-ones
- Your mood and reactions set the team's tone

2. Trying to Be Everyone's Friend
- You can be friendly without being friends
- Maintain professional boundaries
- Make decisions based on what's right, not what's popular

3. Doing Instead of Delegating
- Your job is now to develop others, not do everything yourself
- Let go of tasks you used to own
- Coach team members through challenges instead of solving for them

4. Avoiding Difficult Conversations
- Problems don't resolve themselves
- Address issues early before they escalate
- Direct, kind feedback is better than avoiding conflict

5. Not Asking for Feedback
- You need to know how you're perceived
- Ask: 'What should I start/stop/continue doing?'
- Adjust based on what you learn

Key Principle: Management is about getting work done through others, not doing it all yourself.`,
    tags: ["first_time_manager", "leadership", "common_mistakes", "delegation"]
  },
  {
    source: "management_bible",
    category: "delegation",
    title: "Effective Delegation Without Micromanaging",
    content: `How to delegate effectively while maintaining quality:

The 5 Levels of Delegation:
1. 'Do exactly this' - Specific instructions (for new/critical tasks)
2. 'Research and report back' - They gather info, you decide
3. 'Recommend, then act' - They propose, you approve
4. 'Act, then report' - They decide and inform you
5. 'Act independently' - Full autonomy (for experienced team)

Delegation Framework:
1. Define the Outcome (not the process)
   - What success looks like
   - Deadline and priority
   - Quality standards

2. Provide Context
   - Why this matters
   - How it fits the bigger picture
   - Who else is involved

3. Agree on Check-ins
   - Milestone reviews (not daily updates)
   - 'Let me know if X happens'
   - Regular 1-on-1s for general updates

4. Give Authority with Responsibility
   - Let them make decisions
   - Don't override unless critical
   - Support their choices publicly

Red Flags You're Micromanaging:
- You're checking in multiple times per day
- You redo their work your way
- You can't take vacation without everything falling apart
- Team waits for your approval on everything

Remember: Different outcomes are okay. Their 80% solution done independently is better than your 100% solution that requires your constant involvement.`,
    tags: ["delegation", "micromanagement", "empowerment", "trust"]
  },
  {
    source: "management_bible",
    category: "team_dynamics",
    title: "Managing Toxic Team Members",
    content: `How to identify and address toxic behavior:

Types of Toxic Behavior:
1. The Underminer - Questions decisions publicly, spreads negativity
2. The Credit Stealer - Takes credit for others' work
3. The Gossip - Creates drama, shares confidential info
4. The Bully - Intimidates, belittles others
5. The Victim - Nothing is ever their fault, constant complaints

Intervention Strategy:

Step 1: Document Specific Behaviors
- Not: 'They have a bad attitude'
- Yes: 'In Monday's meeting, they rolled their eyes when Sarah spoke and said "that will never work" without explanation'

Step 2: Private Conversation
- State the behavior: 'I noticed you rolled your eyes and dismissed Sarah's idea'
- Explain the impact: 'This discourages team members from sharing ideas'
- Set clear expectation: 'I need you to listen respectfully and provide constructive feedback'
- Ask for commitment: 'Can you do that?'

Step 3: Monitor and Follow Up
- Watch for behavior change
- Acknowledge improvements
- Address relapses immediately

Step 4: Escalate if Needed
- If behavior continues after 2-3 conversations
- Document everything
- Involve HR for formal warning
- Be prepared to exit them

Critical Question: Is their technical contribution worth the team damage they cause?

Often the answer is no. One toxic person can drive away multiple good employees.`,
    tags: ["toxic_behavior", "team_dynamics", "intervention", "difficult_people"]
  },
  {
    source: "management_bible",
    category: "performance_management",
    title: "Delivering Difficult Performance Reviews",
    content: `How to conduct performance reviews when the news isn't good:

Preparation:
1. Gather Specific Examples
   - Dates, situations, measurable outcomes
   - Not: 'You're often late'
   - Yes: 'You arrived after 9:30am on March 3, 10, 15, and 22'

2. Separate Performance from Potential
   - They can be a great person but underperforming
   - Focus on behaviors and results, not character

The Conversation Structure:

1. Set the Tone (30 seconds)
   'I want to discuss your performance. Some of this will be difficult to hear, but my goal is to help you improve.'

2. State the Facts (2-3 minutes)
   'Over the past quarter, you missed 4 out of 6 deadlines. The Q2 report had 12 errors that required rework. Client feedback mentioned concerns about responsiveness.'

3. Listen (5 minutes)
   'Help me understand what's happening.'
   - Let them explain
   - Don't argue or defend
   - Ask clarifying questions

4. Collaborative Problem-Solving (10 minutes)
   'What needs to change? What support do you need?'
   - Create specific improvement plan
   - Set measurable goals
   - Agree on timeline and check-ins

5. Document and Confirm (2 minutes)
   'I'm going to send you a summary of what we agreed. Please review and let me know if I missed anything.'

Common Mistakes:
- Sandwiching criticism between praise (confuses the message)
- Being vague to avoid discomfort
- Letting them derail with excuses
- Not documenting the conversation

Remember: Honest feedback is a gift. Letting someone fail without clear feedback is cruel.`,
    tags: ["performance_review", "difficult_conversations", "feedback", "documentation"]
  },
  {
    source: "management_bible",
    category: "wellbeing",
    title: "Preventing Manager Burnout",
    content: `How to sustain yourself as a manager:

Warning Signs of Burnout:
- Dreading work on Sunday evenings
- Snapping at team members
- Avoiding difficult conversations
- Working late but accomplishing less
- Physical symptoms: headaches, poor sleep, fatigue

Root Causes:
1. Doing instead of delegating
2. No boundaries (always available)
3. Perfectionism
4. Lack of support from your manager
5. Caring more about outcomes than your team does

Prevention Strategies:

1. Set Clear Boundaries
   - No emails after 7pm (except emergencies)
   - Block focus time on calendar
   - Take your full lunch break
   - Use all your vacation days

2. Delegate Ruthlessly
   - If someone else can do it 70% as well, delegate it
   - Your job is strategy and development, not execution
   - Let your team grow by giving them challenges

3. Build Your Support System
   - Find a peer manager to vent with
   - Get a mentor or coach
   - Regular 1-on-1s with YOUR manager
   - Join a manager community

4. Manage Your Energy, Not Just Time
   - Schedule difficult conversations when you're fresh
   - Take breaks between intense meetings
   - Exercise, sleep, eat well (basics matter)

5. Let Go of Perfection
   - Good enough is often good enough
   - Not every decision is life-or-death
   - Your team's 80% solution builds their capability

Critical Mindset Shift:
You can't pour from an empty cup. Taking care of yourself isn't selfish—it's required to take care of your team.

If you're burned out, you can't coach, can't make good decisions, and can't model healthy work habits.`,
    tags: ["burnout", "wellbeing", "boundaries", "self_care", "sustainability"]
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
