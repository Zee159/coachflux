/**
 * Personal Development Knowledge Base - 10 Scenarios
 * 
 * Run this to load personal development scenarios:
 *   npx convex run seedPersonalDevelopment:seed
 */

/* eslint-disable no-console */
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const PERSONAL_DEV_SCENARIOS = [
  {
    source: "personal_development",
    category: "confidence",
    title: "Building Unshakeable Confidence",
    content: `How to develop genuine confidence from the inside out:

The Confidence Equation:
Confidence = (Competence × Courage) + Self-Compassion

1. Competence (Build Skills)
- Master something difficult through deliberate practice
- Track your progress with specific metrics
- Celebrate small wins along the way
- Accumulate evidence of your capability

2. Courage (Take Action Despite Fear)
- Do the thing that scares you regularly
- Start small, build gradually (exposure therapy)
- Reframe failure as learning opportunity
- Action creates confidence, not the reverse

3. Self-Compassion (Be Kind to Yourself)
- Talk to yourself like you'd talk to a friend
- Acknowledge struggles without harsh judgment
- Recognize everyone feels inadequate sometimes
- Progress over perfection always

The 30-Day Confidence Challenge:

Week 1: Evidence Collection
- Write down 3 wins daily (any size)
- Save positive feedback and compliments
- List your strengths and past successes
- Review this evidence when doubting yourself

Week 2: Comfort Zone Expansion
- Do one scary thing daily
- Speak up in meetings or groups
- Start conversations with strangers
- Try something new each day

Week 3: Posture and Presence
- Stand tall (power posing actually works)
- Make eye contact consistently
- Speak slower and more clearly
- Take up space physically

Week 4: Self-Talk Transformation
- Notice negative self-talk patterns
- Challenge them with evidence
- Reframe to growth mindset
- Practice positive affirmations

Quick Confidence Boosters:
- Recall a past success in detail
- Power pose for 2 minutes before important moments
- Deep breathing (4-7-8 technique)
- Dress well and groom intentionally
- Help someone else (builds competence)

Remember: Confidence isn't about being perfect. It's about being okay with being imperfect and trying anyway.`,
    tags: ["confidence", "self_esteem", "personal_growth", "mindset", "courage"]
  },
  {
    source: "personal_development",
    category: "goal_setting",
    title: "Setting Goals That Actually Work",
    content: `How to set and achieve meaningful goals:

The SMART Framework (Enhanced):
- Specific: Exactly what will you achieve?
- Measurable: How will you track progress?
- Achievable: Challenging but possible given resources
- Relevant: Aligns with your values and priorities
- Time-bound: Clear deadline creates urgency

The 3-Tier Goal System:

Tier 1: Outcome Goals (What you want)
- "Get promoted to senior engineer"
- "Save $20,000 for house down payment"
- "Run a marathon under 4 hours"

Tier 2: Performance Goals (How you'll get there)
- "Complete 2 major projects successfully"
- "Save $1,667 per month consistently"
- "Run 4 times per week, increasing distance"

Tier 3: Process Goals (Daily habits)
- "Code for 2 focused hours daily"
- "Pack lunch instead of buying out"
- "Run before work every Monday/Wednesday/Friday/Saturday"

Focus 80% of your energy on Tier 3 (process), not Tier 1 (outcome).

The Goal-Setting Process:

1. Brainstorm (No limits, no censoring)
2. Prioritize (Choose 3-5 maximum)
3. Break Down (Make it actionable)
4. Schedule (Put it in calendar)
5. Review (Weekly check-ins)

Common Goal-Setting Mistakes:

❌ Too many goals at once (scattered focus)
✅ Focus on 3-5 maximum for the quarter

❌ Only outcome goals (no control over results)
✅ Focus on process goals you control

❌ No accountability mechanism
✅ Share with someone, track publicly

The 12-Week Year Method:
- Treat 12 weeks as 1 year
- Creates healthy urgency
- Faster feedback loops
- More achievable and motivating

Remember: Goals should excite you, not exhaust you. If a goal feels like a burden, reassess why you set it.`,
    tags: ["goal_setting", "planning", "achievement", "productivity", "smart_goals"]
  },
  {
    source: "personal_development",
    category: "habits",
    title: "Building Habits That Stick",
    content: `How to create lasting behavior change:

The Habit Loop:
Cue → Routine → Reward → Repeat

The 4 Laws of Behavior Change:

1. Make it Obvious (Cue)
- Use visual cues (put gym clothes out)
- Implementation intention: "When X happens, I'll do Y"
- Habit stacking: "After I brush teeth, I'll meditate"
- Environment design: Make good choices easy

2. Make it Attractive (Craving)
- Pair habit with something you enjoy
- Join a group doing the habit
- Reframe mindset: "I get to" not "I have to"
- Visualize the benefits vividly

3. Make it Easy (Response)
- Start tiny (2-minute rule)
- Reduce friction and barriers
- Prepare environment in advance
- Lower barrier to entry

4. Make it Satisfying (Reward)
- Immediate gratification after completing
- Track progress visually
- Celebrate small wins
- Never miss twice in a row

The 2-Minute Rule:
- Want to read more? Read 1 page daily
- Want to exercise? Do 1 pushup
- Want to meditate? Breathe for 2 minutes
- Start so small it's impossible to fail

Habit Stacking Examples:
- After I pour coffee, I'll write 3 gratitudes
- After I close laptop, I'll do 10 pushups
- After I eat lunch, I'll walk for 5 minutes

Breaking Bad Habits:

1. Make it Invisible - Remove cues
2. Make it Unattractive - Highlight costs
3. Make it Difficult - Increase friction
4. Make it Unsatisfying - Add accountability

The Plateau of Latent Potential:
- Habits feel useless at first
- Results lag behind effort
- Breakthrough comes suddenly
- Trust the process

Remember: You fall to the level of your systems. Focus on systems, not goals.`,
    tags: ["habits", "behavior_change", "discipline", "systems", "atomic_habits"]
  },
  {
    source: "personal_development",
    category: "decision_making",
    title: "Making Better Decisions",
    content: `How to make choices you won't regret:

The Decision-Making Framework:

1. Define the Decision Clearly
2. Gather Relevant Information
3. Identify All Options
4. Evaluate Each Option
5. Make the Decision
6. Review and Learn

Decision-Making Mental Models:

The 10-10-10 Rule:
- How will I feel in 10 minutes?
- How will I feel in 10 months?
- How will I feel in 10 years?

The Regret Minimization Framework:
- At age 80, what will I regret more?
- Not trying or trying and failing?
- Usually: we regret inaction more than action

The Two-Way Door:
- Reversible decisions: Make them fast
- Irreversible decisions: Take your time
- Most decisions are reversible

Common Decision-Making Traps:

1. Analysis Paralysis
- Solution: Set a decision deadline

2. Sunk Cost Fallacy
- Solution: Focus only on future value

3. Confirmation Bias
- Solution: Seek disconfirming evidence

4. Social Proof Trap
- Solution: Check alignment with YOUR values

5. Recency Bias
- Solution: Look at longer time horizons

Remember: Make the best choice with available information, then make it right through execution.`,
    tags: ["decision_making", "critical_thinking", "problem_solving", "judgment", "mental_models"]
  },
  {
    source: "personal_development",
    category: "resilience",
    title: "Building Mental Resilience",
    content: `How to bounce back from setbacks:

The Resilience Formula:
Resilience = (Adversity × Adaptive Response) ÷ Recovery Time

The 7 Pillars of Resilience:

1. Self-Awareness - Recognize emotions and triggers
2. Self-Regulation - Manage emotional responses
3. Realistic Optimism - Focus on what you can control
4. Mental Agility - Reframe negative thoughts
5. Strengths Focus - Leverage your capabilities
6. Strong Connections - Build support network
7. Clear Purpose - Connect to something bigger

Building Resilience Daily:

Morning (5 min):
- List 3 gratitudes
- Set intention
- Positive affirmation
- Mindful breathing

During Challenges:
- Name the emotion
- Take 3 deep breaths
- Ask: "What can I control?"
- Focus on next small step

Evening (5 min):
- Reflect on what went well
- Learn from what didn't
- Plan for tomorrow
- Practice self-compassion

The Post-Setback Protocol:

1. Feel It (24-48 hours max)
2. Analyze It (extract learning)
3. Reframe It (gain perspective)
4. Move Forward (take action)

Remember: Resilience is a skill you build through practice, not a fixed trait.`,
    tags: ["resilience", "mental_health", "adversity", "coping", "growth_mindset"]
  },
  {
    source: "personal_development",
    category: "time_management",
    title: "Mastering Time Management",
    content: `How to make the most of your time:

The Eisenhower Matrix:

Quadrant 1: Urgent & Important (Crisis)
- Handle immediately
- Goal: Minimize through prevention

Quadrant 2: Not Urgent & Important (Quality)
- Schedule time for this
- Goal: Maximize time here

Quadrant 3: Urgent & Not Important (Distraction)
- Delegate or minimize
- Goal: Reduce significantly

Quadrant 4: Not Urgent & Not Important (Waste)
- Eliminate completely

The Time Blocking Method:

1. Theme Your Days
- Monday: Meetings
- Tuesday/Thursday: Deep work
- Wednesday: Learning
- Friday: Planning

2. Block Your Calendar
- Deep work blocks (2-4 hours)
- Meeting blocks (batch together)
- Admin blocks (email, planning)
- Break blocks (schedule breaks)

3. Protect Your Time
- Mark blocks as "Busy"
- Turn off notifications
- Communicate schedule
- Say no to non-essential

Time Management Tactics:

1. Two-Minute Rule - If < 2 min, do it now
2. Batch Similar Tasks - Reduce context switching
3. Pomodoro Technique - 25 min focus, 5 min break
4. Plan Tomorrow Today - 10 min at end of day

Energy Management > Time Management:
- Schedule difficult tasks during peak energy
- Take breaks before tired
- Exercise regularly
- Sleep 7-9 hours
- Eat well

Remember: Manage your attention and energy, not just time.`,
    tags: ["time_management", "productivity", "prioritization", "focus", "eisenhower_matrix"]
  },
  {
    source: "personal_development",
    category: "procrastination",
    title: "Overcoming Procrastination",
    content: `How to stop putting things off:

Understanding Procrastination:

It's about emotion regulation, not laziness.

The Procrastination Equation:
Procrastination = (Expectancy × Value) ÷ (Impulsivity × Delay)

The 5-Minute Rule:
"I'll just work on this for 5 minutes"
- Lowers barrier to starting
- Once started, often continue
- Breaks the inertia

The Procrastination-Busting Process:

1. Identify the Real Reason
- What am I actually avoiding?
- Fear, boredom, overwhelm, or uncertainty?

2. Break It Down Smaller
- "Write one sentence" not "Write report"
- "Put on gym clothes" not "Work out"
- "Open the file" not "Complete project"

3. Remove Friction
- Prepare everything the night before
- Eliminate distractions in advance
- Make starting as easy as possible

4. Add Accountability
- Tell someone your commitment
- Work alongside someone
- Use tracking apps
- Create consequences

5. Reward Yourself
- Celebrate starting, not just finishing
- Use temptation bundling
- Track progress visually

Specific Procrastination Types:

1. The Perfectionist - Set "good enough" standard
2. The Overwhelmed - Break into tiny steps
3. The Unclear - Spend 5 min planning
4. The Avoider - Do it first thing in morning
5. The Distracted - Remove distractions first

The 2-Minute Momentum Builder:
1. Set timer for 2 minutes
2. Start the task
3. When timer ends, can stop guilt-free
4. Usually, you'll keep going

Remember: You don't need motivation to start. Start to get motivation.`,
    tags: ["procrastination", "productivity", "motivation", "action", "getting_started"]
  },
  {
    source: "personal_development",
    category: "stress_management",
    title: "Managing Stress Effectively",
    content: `How to handle stress in healthy ways:

Understanding Stress:

Good Stress (Eustress) - Motivates
Bad Stress (Distress) - Overwhelms

Completing the Stress Cycle:

Physical Activities (Most Effective):
- Exercise (20-30 minutes)
- Dancing or movement
- Deep breathing exercises
- Progressive muscle relaxation

The 4 A's of Stress Management:

1. Avoid - Eliminate unnecessary stress
2. Alter - Change the situation
3. Accept - Change your reaction
4. Adapt - Change your expectations

Daily Stress Management:

Morning (10 min):
- Meditation or breathing
- Light stretching
- Gratitude journaling
- Set intentions

During Day:
- Breaks every 90 minutes
- Step outside for air
- Drink water regularly
- Mini-meditations (2 min)

Evening (15 min):
- Exercise or walk
- Disconnect from work
- Relaxing activity
- Prepare for tomorrow

Emergency Stress Relief:

1. Box Breathing
- Inhale 4, Hold 4, Exhale 4, Hold 4

2. 5-4-3-2-1 Grounding
- 5 things you see
- 4 things you touch
- 3 things you hear
- 2 things you smell
- 1 thing you taste

Warning Signs of Chronic Stress:
- Physical: Headaches, sleep issues
- Emotional: Irritability, anxiety
- Behavioral: Changes in appetite, withdrawal

When to Seek Help:
- Interfering with daily life
- Unhealthy coping mechanisms
- Feeling hopeless
- Physical symptoms persisting

Remember: Stress is inevitable, chronic stress is optional.`,
    tags: ["stress_management", "mental_health", "coping", "wellbeing", "self_care"]
  },
  {
    source: "personal_development",
    category: "mindset",
    title: "Developing a Growth Mindset",
    content: `How to shift from fixed to growth mindset:

Fixed vs Growth Mindset:

Fixed Mindset:
- Intelligence is fixed
- Failure means you're not good enough
- Effort is for people who lack ability
- Feedback is personal criticism

Growth Mindset:
- Abilities can be developed
- Failure is opportunity to learn
- Effort is path to mastery
- Feedback is valuable information

Shifting to Growth Mindset:

1. Recognize Fixed Mindset Triggers
- When do you feel defensive?
- When do you want to give up?
- When do you feel threatened?

2. Reframe Your Self-Talk

Fixed → Growth:
- "I'm not good at this" → "I'm not good at this yet"
- "I failed" → "I learned what doesn't work"
- "This is too hard" → "This will take time and effort"
- "I can't do this" → "I can't do this yet, but I can learn"

3. Embrace the Power of "Yet"
- Add "yet" to any limiting statement
- Implies future possibility and growth

4. Value Process Over Outcome
- Praise effort, strategy, and progress
- Not just results or innate ability

5. See Failure as Information
- What can I learn from this?
- What would I do differently?
- How can I improve next time?

6. Celebrate Others' Success
- What strategies did they use?
- What can I learn from them?
- Their success doesn't diminish mine

The Growth Mindset Practice:

Daily:
- Notice fixed mindset thoughts
- Reframe them to growth mindset
- Celebrate effort and learning

Weekly:
- Try something new or challenging
- Ask for feedback
- Learn from a mistake

The Neuroscience:
- Brain is plastic (neuroplasticity)
- New neural connections form through practice
- You can literally grow your brain
- Age doesn't prevent learning

Remember: Mindset is a choice you make repeatedly, not a one-time decision.`,
    tags: ["growth_mindset", "mindset", "learning", "personal_growth", "neuroplasticity"]
  },
  {
    source: "personal_development",
    category: "communication",
    title: "Effective Communication Skills",
    content: `How to communicate clearly and persuasively:

The Communication Stack:

Level 1: Clarity - Be understood
Level 2: Empathy - Understand others
Level 3: Impact - Drive action

The 3-Part Message Structure:

1. Context - "Given that [situation]..."
2. Content - "I believe [main point] because [reason]..."
3. Call to Action - "The next step is [action] by [date]..."

Active Listening Techniques:

1. Full Attention
- Put phone away
- Make eye contact
- Don't interrupt
- Silence inner monologue

2. Reflect Back
- "What I'm hearing is..."
- "It sounds like you're saying..."
- Paraphrase in your own words

3. Ask Clarifying Questions
- "Tell me more about..."
- "What do you mean by..."
- "How did that make you feel?"

4. Validate Feelings
- "That makes sense given..."
- "I can see why you'd feel that way"
- Acknowledge before problem-solving

Difficult Conversations:

The SBI Framework:
- Situation: "In yesterday's meeting..."
- Behavior: "When you interrupted me..."
- Impact: "I felt disrespected"

Then request: "Going forward, I'd appreciate if you'd let me finish."

Handling Conflict:

1. Stay Calm - Breathe, lower voice, slow down
2. Seek to Understand - "Help me understand your perspective"
3. Find Common Ground - "We both want..."
4. Problem-Solve Together - "What if we..."

Non-Verbal Communication:
- Open posture
- Appropriate eye contact
- Nodding to show engagement
- Tone matches message

Remember: Communication is not just what you say, but how you make people feel.`,
    tags: ["communication", "listening", "conflict_resolution", "feedback", "interpersonal"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding Personal Development scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of PERSONAL_DEV_SCENARIOS) {
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
    console.log(`  Total: ${PERSONAL_DEV_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: PERSONAL_DEV_SCENARIOS.length
    };
  },
});
