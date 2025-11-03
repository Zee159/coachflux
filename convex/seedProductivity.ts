/**
 * Productivity & Focus Knowledge Base - 5 Scenarios
 * 
 * Run this to load scenarios:
 *   npx convex run seedProductivity:seed
 */

/* eslint-disable no-console */
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const PRODUCTIVITY_SCENARIOS = [
  {
    source: "productivity",
    category: "deep_work",
    title: "Mastering Deep Work",
    content: `How to do focused, high-value work:

What is Deep Work?

Professional activities performed in distraction-free concentration that push cognitive capabilities to their limit.

Benefits:
- Produce better quality work
- Learn faster
- Accomplish more in less time
- Find work more satisfying

The Deep Work Formula:

Deep Work = Time × Intensity of Focus

2 hours deep work > 8 hours shallow work

Creating Deep Work Blocks:

1. Schedule It
- Block 2-4 hour chunks
- Same time daily if possible
- Treat as non-negotiable

2. Eliminate Distractions
- Phone on airplane mode
- Close all tabs and apps
- Use website blockers
- Inform others you're unavailable

3. Prepare Environment
- Clean, organized workspace
- Everything you need ready
- Comfortable temperature
- Good lighting

4. Set Clear Goal
- Know exactly what you'll accomplish
- Specific outcome for the session
- Measurable progress

The Deep Work Ritual:

Before:
- Review goal for session
- Gather all materials
- Eliminate distractions
- Set timer

During:
- Single-task only
- No checking email/messages
- Take notes as you work
- Push through resistance

After:
- Review what you accomplished
- Plan next session
- Celebrate progress

Building Deep Work Capacity:

Week 1-2: 1 hour sessions
Week 3-4: 1.5 hour sessions
Week 5-6: 2 hour sessions
Week 7+: 2-4 hour sessions

Most people max out at 4 hours of deep work per day.

Protecting Deep Work Time:

- Block calendar as "Busy"
- Turn on "Do Not Disturb"
- Use auto-responder
- Set boundaries with team

Common Obstacles:

"I get interrupted constantly"
→ Communicate your schedule, work from different location

"I can't focus that long"
→ Start with 25 minutes, build gradually

"My work doesn't allow deep work"
→ Even 1 hour daily makes huge difference

Remember: Deep work is a skill. Practice builds capacity over time.`,
    tags: ["deep_work", "focus", "productivity", "concentration", "flow_state"]
  },
  {
    source: "productivity",
    category: "time_blocking",
    title: "Time Blocking for Maximum Productivity",
    content: `How to structure your day for peak performance:

What is Time Blocking?

Dividing your day into blocks of time, each dedicated to specific tasks or types of work.

Benefits:
- Reduces decision fatigue
- Prevents multitasking
- Ensures important work gets done
- Creates realistic expectations

The Time Blocking Method:

1. List All Tasks
- Everything that needs to get done
- Include meetings, breaks, admin

2. Estimate Time Needed
- Be realistic (add 25% buffer)
- Account for interruptions

3. Block Your Calendar
- Assign tasks to specific time slots
- Color code by type
- Include breaks and transitions

4. Protect Your Blocks
- Treat like important meetings
- Say no to non-urgent requests
- Reschedule if needed, don't skip

Sample Time-Blocked Day:

6:00-7:00 AM: Morning routine
7:00-9:00 AM: Deep work (most important task)
9:00-9:15 AM: Break
9:15-11:00 AM: Deep work (second priority)
11:00-12:00 PM: Meetings
12:00-1:00 PM: Lunch break
1:00-2:00 PM: Email and admin
2:00-3:30 PM: Collaborative work
3:30-4:00 PM: Planning tomorrow
4:00-5:00 PM: Learning or development
5:00 PM: End of work day

Theme Your Days:

Monday: Meetings and planning
Tuesday: Deep work and creation
Wednesday: Collaboration and communication
Thursday: Deep work and creation
Friday: Review, admin, and learning

Time Blocking Strategies:

1. Task Batching
- Group similar tasks together
- Check email 3× daily (not constantly)
- Make all calls in one block

2. Energy Management
- Schedule hardest work during peak energy
- Easier tasks during low energy
- Most people peak mid-morning

3. Buffer Blocks
- Leave 30-60 min unscheduled daily
- Handles unexpected urgent items
- Prevents schedule from breaking

4. Transition Time
- 5-10 min between blocks
- Mental reset
- Prepare for next task

Common Mistakes:

❌ Blocking every minute → ✅ Leave buffer time
❌ Not protecting blocks → ✅ Treat as non-negotiable
❌ Too rigid → ✅ Adjust as needed
❌ Ignoring energy levels → ✅ Match task to energy

Tools:

- Google Calendar (color coding)
- Notion (time block templates)
- Paper planner (tactile)
- Time blocking apps

Remember: Time blocking is planning, not restriction. It gives you control over your day.`,
    tags: ["time_blocking", "productivity", "scheduling", "time_management", "planning"]
  },
  {
    source: "productivity",
    category: "email_management",
    title: "Inbox Zero: Email Management",
    content: `How to manage email without it managing you:

The Inbox Zero Philosophy:

Goal: Empty inbox regularly (daily or weekly)
Not about: Responding to everything immediately
About: Processing efficiently, deciding quickly

The 4 D's Method:

For each email, decide:

1. Delete (or Archive)
- No action needed
- FYI only
- Outdated information

2. Delegate
- Someone else should handle
- Forward with clear request
- Remove from your inbox

3. Do (if < 2 minutes)
- Quick response
- Simple task
- Get it done now

4. Defer (if > 2 minutes)
- Add to task list
- Schedule time to handle
- Move to action folder

Email Processing System:

Set Times to Check:
- 9:00 AM (morning check)
- 1:00 PM (after lunch)
- 4:00 PM (end of day)
- NOT constantly throughout day

Process, Don't Check:
- Go through entire inbox
- Make decision on each email
- Get to zero or near-zero
- Close email until next time

Folder Structure:

Keep it simple:
- Inbox (temporary holding)
- Action (needs response)
- Waiting (waiting on others)
- Archive (everything else)

Or even simpler:
- Inbox
- Archive

Use search, not folders, to find old emails.

Writing Better Emails:

1. Clear Subject Line
- Specific and descriptive
- Include action if needed: "ACTION: Review by Friday"

2. Start with Bottom Line
- Main point first
- Details after
- Busy people scan

3. Use Bullet Points
- Easier to scan
- Clearer action items
- Less wall of text

4. One Topic Per Email
- Easier to file
- Easier to action
- Clearer communication

5. Clear Call to Action
- What do you need?
- By when?
- From whom?

Reducing Email Volume:

1. Unsubscribe Ruthlessly
- If you haven't read last 3, unsubscribe
- Use unroll.me or similar

2. Use Filters
- Auto-archive newsletters
- Auto-label by sender
- Skip inbox for FYI emails

3. Set Expectations
- Don't respond immediately
- Train people you're not always available
- Use auto-responder if needed

4. Pick Up the Phone
- Long email chains → 5 min call
- Faster resolution
- Better communication

Email Etiquette:

- Reply within 24-48 hours
- Use BCC for mass emails
- Don't "Reply All" unless necessary
- Proofread before sending
- Use professional signature

Remember: Email is a tool, not a task. Process efficiently and move on.`,
    tags: ["email_management", "inbox_zero", "productivity", "communication", "organization"]
  },
  {
    source: "productivity",
    category: "meetings",
    title: "Running Effective Meetings",
    content: `How to make meetings productive:

Before Scheduling a Meeting:

Ask: Could this be an email?
- Simple updates → Email
- Quick questions → Slack/Teams
- Decision with discussion → Meeting

If Meeting is Necessary:

1. Clear Purpose
- What's the goal?
- What decision needs to be made?
- What outcome do you want?

2. Right People Only
- Who needs to be there?
- Who can be optional?
- Keep it small (< 8 people ideal)

3. Set Duration
- Default to 25 or 50 minutes (not 30/60)
- Builds in buffer
- Forces focus

4. Send Agenda in Advance
- Topics to cover
- Time allocation
- Pre-reading if needed
- Expected outcomes

The Meeting Agenda Template:

Meeting: [Purpose]
Date/Time: [When]
Attendees: [Who]
Duration: [How long]

Agenda:
1. Topic 1 (10 min) - [Expected outcome]
2. Topic 2 (15 min) - [Expected outcome]
3. Decisions needed (10 min)
4. Next steps (5 min)

Pre-reading: [Links/docs]

During the Meeting:

1. Start on Time
- Don't wait for latecomers
- Rewards those who are on time

2. Assign Roles
- Facilitator (keeps on track)
- Note-taker (captures decisions)
- Timekeeper (watches clock)

3. Follow the Agenda
- Stay on topic
- Park off-topic items
- Respect time limits

4. Encourage Participation
- Ask quiet people for input
- Limit dominant speakers
- Create psychological safety

5. Make Decisions
- Clarify what was decided
- Who owns what
- By when

6. End with Next Steps
- Recap decisions
- Assign action items
- Set deadlines
- Schedule follow-up if needed

7. End on Time
- Respect people's calendars
- Schedule follow-up if needed
- Don't let it run over

After the Meeting:

1. Send Notes Within 24 Hours
- Key decisions
- Action items with owners
- Deadlines
- Next meeting date

2. Follow Up on Action Items
- Check in before deadline
- Offer support if needed
- Hold people accountable

Meeting Types:

1. Status Updates (15-25 min)
- Quick round-robin
- Blockers and wins
- Could often be async

2. Brainstorming (50 min)
- Generate ideas
- No criticism phase
- Build on each other

3. Decision-Making (25-50 min)
- Present options
- Discuss trade-offs
- Make decision

4. Problem-Solving (50 min)
- Define problem
- Root cause analysis
- Generate solutions
- Decide on action

Declining Meetings:

When to say no:
- No clear agenda
- You're not needed
- Could be handled async
- Back-to-back all day

How to decline:
"I don't think I can add value to this discussion. Could you send me the notes after?"

Or suggest alternative:
"Could we handle this via email instead?"

Meeting Hygiene:

- Camera on for remote meetings
- Mute when not speaking
- No multitasking
- Be present and engaged
- Respect others' time

Remember: Meetings are expensive. Make them count or don't have them.`,
    tags: ["meetings", "productivity", "collaboration", "communication", "time_management"]
  },
  {
    source: "productivity",
    category: "focus",
    title: "Building Laser Focus",
    content: `How to improve concentration and attention:

Understanding Focus:

Focus is a skill that can be trained like a muscle.

Two Types:
1. Sustained Attention - Staying on one task
2. Selective Attention - Filtering distractions

The Focus Formula:

Focus = (Clear Goal + Removed Distractions) × Energy

Building Focus Capacity:

Week 1-2: 25-minute focused sessions (Pomodoro)
Week 3-4: 45-minute sessions
Week 5-6: 60-minute sessions
Week 7+: 90-minute sessions

Most people max out at 90-120 min before needing break.

The Pomodoro Technique:

1. Choose task
2. Set timer for 25 minutes
3. Work with full focus
4. Take 5-minute break
5. After 4 pomodoros, take 15-30 min break

Why it works:
- Creates urgency
- Makes focus manageable
- Builds in recovery

Eliminating Distractions:

Digital Distractions:
- Phone on airplane mode or different room
- Close all browser tabs except needed
- Use website blockers (Freedom, Cold Turkey)
- Turn off all notifications
- Use full-screen mode

Physical Distractions:
- Clean, organized workspace
- Noise-canceling headphones
- "Do Not Disturb" sign
- Work in different location if needed

Internal Distractions:
- Keep notepad for random thoughts
- Write it down, return to task
- Practice meditation to improve awareness

Optimizing for Focus:

1. Morning is Best
- Peak cognitive performance
- Fewest distractions
- Highest willpower

2. Manage Energy
- Sleep 7-9 hours
- Exercise regularly
- Eat balanced meals
- Stay hydrated
- Take breaks

3. Single-Tasking
- One thing at a time
- Multitasking reduces productivity 40%
- Context switching is expensive

4. Clear Goal
- Know exactly what you're doing
- Specific outcome
- Measurable progress

Focus-Enhancing Habits:

Morning:
- No phone for first hour
- Exercise or meditation
- Eat protein-rich breakfast
- Plan top 3 priorities

During Work:
- Work in 90-min blocks
- Take 10-15 min breaks
- Move your body
- Get sunlight

Evening:
- No screens 1 hour before bed
- Reflect on day
- Plan tomorrow
- Wind down routine

The Attention Restoration Theory:

After intense focus, restore attention with:
- Nature walks
- Meditation
- Light exercise
- Creative hobbies
- Social connection

Avoid:
- More screen time
- Demanding tasks
- Stressful activities

Training Focus:

Like a muscle, focus improves with practice:

1. Meditation (10 min daily)
- Trains attention control
- Improves awareness
- Reduces mind-wandering

2. Reading (30 min daily)
- Sustained attention practice
- No skimming or scanning
- Deep engagement

3. Single-Tasking Challenges
- One task for set time
- No switching
- Notice urge to switch

Measuring Progress:

Track:
- How long you can focus
- How often you get distracted
- Quality of work produced
- How you feel after sessions

Celebrate improvements!

Remember: Focus is your superpower in a distracted world. Protect and train it.`,
    tags: ["focus", "concentration", "attention", "productivity", "pomodoro", "deep_work"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding Productivity scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of PRODUCTIVITY_SCENARIOS) {
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
    console.log(`  Total: ${PRODUCTIVITY_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: PRODUCTIVITY_SCENARIOS.length
    };
  },
});
