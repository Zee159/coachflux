/**
 * Relationships & Communication Knowledge Base - 5 Scenarios
 * 
 * Run this to load scenarios:
 *   npx convex run seedRelationships:seed
 */

/* eslint-disable no-console */
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const RELATIONSHIPS_SCENARIOS = [
  {
    source: "relationships",
    category: "difficult_conversations",
    title: "Having Difficult Conversations",
    content: `How to navigate challenging discussions effectively:

The SBI-R Framework:

Situation: "In yesterday's meeting..."
Behavior: "When you interrupted me three times..."
Impact: "I felt disrespected and couldn't finish my point"
Request: "Going forward, I'd appreciate if you'd let me finish"

Preparation Phase:

1. Clarify Your Intent
- What outcome do you want?
- What's the real issue?
- What's your role in this?

2. Choose Right Time and Place
- Private, neutral location
- When both parties calm
- Adequate time
- Face-to-face when possible

3. Prepare Your Opening
- Start with facts, not judgments
- Use "I" statements
- Be specific about behavior
- Express impact on you

During the Conversation:

1. Start with Curiosity
- "Help me understand your perspective"
- Listen first, speak second

2. Stay Calm
- Breathe deeply
- Pause before responding
- Lower voice if emotions rise

3. Use "I" Statements
❌ "You always interrupt me"
✅ "I feel frustrated when interrupted"

4. Acknowledge Their Perspective
- "I can see why you'd feel that way"
- Validation ≠ Agreement

5. Focus on Solutions
- "What would work better?"
- Collaborate, don't dictate

Common Pitfalls:

❌ Bringing up past issues
✅ Focus on current situation

❌ Using "always", "never"
✅ Be specific

❌ Getting defensive
✅ Stay curious

When They Get Defensive:

1. Acknowledge reaction
2. Reaffirm your intent
3. Take break if needed
4. Return to facts

Remember: Goal is understanding, not being right.`,
    tags: ["difficult_conversations", "conflict_resolution", "communication", "feedback", "sbi_framework"]
  },
  {
    source: "relationships",
    category: "conflict_resolution",
    title: "Resolving Conflicts Constructively",
    content: `How to turn conflicts into growth opportunities:

The Interest-Based Approach:

Positions (What people say):
- "I want window open"
- "I want window closed"

Interests (Why they want it):
- "I need fresh air"
- "I don't want draft"

Solution: Open window in another room

The 5-Step Process:

Step 1: Create Safety
- Private, neutral space
- Both parties calm
- Agree to listen respectfully

Step 2: Understand Each Perspective
- Each person shares uninterrupted
- Use active listening
- Ask clarifying questions

Step 3: Identify Common Ground
- What do we both want?
- What do we agree on?

Step 4: Explore Interests
- Why is this important?
- What need are you meeting?
- What would ideal outcome look like?

Step 5: Generate Solutions Together
- Brainstorm options
- Combine ideas creatively
- Agree on next steps

Conflict Styles:

1. Competing (Win-Lose) - Quick decisions
2. Accommodating (Lose-Win) - Issue more important to them
3. Avoiding (Lose-Lose) - Need time to cool
4. Compromising (Partial Win-Win) - Time pressure
5. Collaborating (Win-Win) - Best for relationships

De-escalation Techniques:

1. Lower Your Voice
2. Acknowledge Emotions
3. Take a Break
4. Use "And" Instead of "But"

Repairing After Conflict:

1. Acknowledge Impact
2. Take Responsibility
3. Make Amends
4. Learn and Grow

Remember: Conflict can strengthen relationships when handled well.`,
    tags: ["conflict_resolution", "mediation", "relationships", "communication", "win_win"]
  },
  {
    source: "relationships",
    category: "feedback",
    title: "Giving and Receiving Feedback",
    content: `How to make feedback a gift:

The COIN Framework:

Context: "In yesterday's presentation..."
Observation: "I noticed you spoke very quickly"
Impact: "It was hard to follow"
Next Steps: "Try slowing down and pausing"

Principles of Good Feedback:

1. Timely - Soon after event
2. Specific - Not vague
3. Balanced - What worked + improvement
4. Actionable - Clear next steps
5. Behavior-Focused - Not personal

Receiving Feedback Well:

1. Listen Fully
- Don't interrupt
- Ask clarifying questions
- Take notes
- Say thank you

2. Separate Feelings from Facts
- You might feel defensive (normal)
- But feedback might be valid

3. Look for Kernel of Truth
- Even harsh feedback has some truth
- What can you learn?

4. Ask Follow-Up Questions
- "Can you give specific example?"
- "What would success look like?"

5. Decide What to Do
- Not all feedback equally valid
- Consider the source
- Look for patterns

When Feedback Feels Unfair:

1. Pause Before Responding
2. Seek to Understand
3. Share Your Perspective (Calmly)
4. Find Common Ground

Creating Feedback Culture:

1. Ask for Feedback Regularly
2. Model Receiving It Well
3. Make it Two-Way

The Radical Candor Framework:

Care Personally + Challenge Directly = Radical Candor

Remember: Feedback is a gift for growth.`,
    tags: ["feedback", "communication", "growth", "radical_candor", "coin_framework"]
  },
  {
    source: "relationships",
    category: "trust",
    title: "Building Trust in Relationships",
    content: `How to build and maintain trust:

The Trust Equation:

Trust = (Credibility + Reliability + Intimacy) ÷ Self-Orientation

1. Credibility - Do you know your stuff?
2. Reliability - Do you do what you say?
3. Intimacy - Can people be vulnerable?
4. Self-Orientation - Is it about them or you?

The 8 Pillars of Trust:

1. Clarity - Clear communication
2. Compassion - Show you care
3. Character - Do the right thing
4. Competence - Be good at what you do
5. Commitment - Follow through
6. Connection - Build genuine relationship
7. Contribution - Add value
8. Consistency - Behave predictably

Building Trust (Takes Time):

Phase 1: Consistency (Weeks)
- Show up reliably
- Do what you say

Phase 2: Competence (Months)
- Demonstrate capability
- Deliver results

Phase 3: Vulnerability (Months to Years)
- Share appropriately
- Admit mistakes

Rebuilding Broken Trust:

1. Acknowledge the Breach
2. Take Full Responsibility
3. Understand the Impact
4. Make Amends
5. Change Your Behavior
6. Be Patient

Trust Destroyers:

❌ Lying or deception
❌ Breaking confidences
❌ Inconsistency
❌ Blaming others
❌ Making excuses

Trust Builders:

✅ Keep your word
✅ Admit mistakes quickly
✅ Give credit generously
✅ Listen actively
✅ Follow through consistently

The Vulnerability Cycle:

1. You share (small risk)
2. They respond with empathy
3. They share (reciprocity)
4. You respond with empathy
5. Trust deepens

Remember: Trust is built in drops and lost in buckets.`,
    tags: ["trust", "relationships", "vulnerability", "integrity", "credibility"]
  },
  {
    source: "relationships",
    category: "boundaries",
    title: "Setting Healthy Boundaries",
    content: `How to protect wellbeing while maintaining relationships:

What Boundaries Are:

Boundaries are NOT:
- Walls to keep people out
- Punishment
- Selfish

Boundaries ARE:
- Limits you set for yourself
- Protection of wellbeing
- Clarity about what's acceptable

Types of Boundaries:

1. Physical - Personal space, touch, privacy
2. Emotional - Not taking on others' emotions
3. Time - How you spend your time
4. Mental - Your thoughts and opinions
5. Material - Money and possessions

The Boundary-Setting Process:

1. Identify the Need
2. Get Clear on Your Limit
3. Communicate Clearly
4. Follow Through

Boundary Scripts:

Time: "I'm not available after 9pm"
Emotional: "I care, but I can't take on your problem"
Requests: "I'm not able to help with that"
Behavior: "When you speak that way, I'll end the conversation"

Handling Pushback:

1. Guilt-Tripping
Response: "I understand you're disappointed, and my answer is still no"

2. Anger
Response: "I can see you're upset. This is what works for me"

3. Negotiating
Response: "I'm not able to make an exception"

4. Ignoring
Response: Restate and enforce consequence

Boundary Mistakes:

❌ Over-explaining
✅ Simple, clear statement

❌ Apologizing for needs
✅ State confidently

❌ Not enforcing
✅ Follow through

Signs You Need Boundaries:

- Feeling resentful
- Saying yes when you mean no
- Feeling drained
- Taking on others' problems

Building Boundary Confidence:

- Start small
- Expect discomfort
- Remember your why
- Find support

Remember: Boundaries are self-respect and self-care.`,
    tags: ["boundaries", "self_care", "relationships", "assertiveness", "wellbeing"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding Relationships scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of RELATIONSHIPS_SCENARIOS) {
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
    console.log(`  Total: ${RELATIONSHIPS_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: RELATIONSHIPS_SCENARIOS.length
    };
  },
});
