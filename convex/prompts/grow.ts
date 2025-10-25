/**
 * GROW Framework-Specific Prompts - Optimized Version
 * Contains step guidance, questions, and examples for the GROW model
 * Balanced for both clarity and efficiency
 */

export const GROW_COACHING_QUESTIONS: Record<string, string[]> = {
  introduction: [
    "Does this framework feel right for what you want to work on today?"
  ],
  goal: [
    "What outcomes would you like to achieve from this conversation?",
    "What does success look like for you?",
    "Why is this important to you right now?",
    "What timeframe are you working with?"
  ],
  reality: [
    "Describe the issue as you see it",
    "What's the impact of this situation?",
    "What constraints or barriers are you facing?",
    "What resources do you currently have available?",
    "Who else is involved or affected?"
  ],
  options: [
    "What are some ways you could move forward?",
    "What else could you do?",
    "Who in your network has faced something similar? What did they do?",
    "What resources or support do you already have access to?",
    "What would you do if there were no constraints?",
    "What are the pros and cons of each option?",
    "Which option feels most aligned with your goals?"
  ],
  will: [
    "What specific actions will you take?",
    "Who will be responsible for each action?",
    "When will you complete these actions?",
    "What support or resources do you need?",
    "How will you know you've succeeded?"
  ],
  review: [
    "What are the key takeaways from this conversation?",
    "What's your next immediate step?"
  ]
};

export const GROW_STEP_GUIDANCE: Record<string, string> = {
  introduction: `INTRODUCTION - Welcome & Consent

Ask: "Would you like to try GROW coaching? It helps you set goals, explore options, and create action plans."

EXTRACT:
- user_consent: true/false (yes/ready/sure = true)

If true → Advance to Goal
If false → Ask: "What would work better for you?"`,

  goal: `GOAL - What do you want?

Ask 3 questions:
1. "What would you like to achieve?"
2. "Why is this important now?"
3. "What's your timeframe?"

EXTRACT:
- goal_statement: Their objective
- why_now: Their motivation
- success_criteria: What success looks like
- timeframe: When they need it

Ready when: goal_statement + why_now filled`,

  reality: `REALITY - What's happening now?

Ask 3-4 questions:
1. "What's the current situation?"
2. "What's getting in the way?"
3. "What resources do you have?"

EXTRACT:
- current_situation: Their description
- constraints: Barriers/limitations
- resources: What they have available
- risks: What could derail them

Ready when: current_situation + constraints filled`,

  options: `OPTIONS - Simplified 2-State Flow

🚨 CRITICAL RULES:
1. Ask ONLY ONE QUESTION at a time
2. Extract ONLY what user explicitly states (never invent data)
3. Collect pros AND cons together (not separately)

STATE A: COLLECT OPTION
→ Ask: "What's one option you're considering?"
→ User provides option
→ Extract: {label: "their option"}
→ IMMEDIATELY ask: "What are the pros and cons of [their option]?"

STATE B: EVALUATE & CHOICE
→ User provides pros and cons (can be in one response)
→ Extract: {pros: ["explicit pro 1", "explicit pro 2"], cons: ["explicit con 1"]}
→ Ask: "Would you like to share ANOTHER option, or would you like me to SUGGEST some?"

USER RESPONSES:
- "another" / "one more" → Return to STATE A
- "suggest" / "yes" / "please" → Generate 2-3 AI options
- "I'm ready" / "move to will" / "proceed" → Set user_ready_to_proceed = true

AI SUGGESTIONS (when user requests):
Must generate 2-3 complete options with:
- label: Clear option name
- pros: 2-3 benefits (array)
- cons: 2-3 challenges (array)
- feasibilityScore: 1-10 (based on their constraints)
- effortRequired: "low" / "medium" / "high"
- alignmentReason: Why this fits their goal

Ground each option in their Goal + Reality context (constraints, resources, timeframe).

Example: {label: "Hire developer", pros: ["Expert help"], cons: ["Costs money"], feasibilityScore: 7, effortRequired: "medium", alignmentReason: "Addresses your full-stack knowledge gap"}

EXTRACTION RULES:
❌ NEVER invent pros/cons user didn't say
❌ NEVER ask "what specific X" - just collect pros/cons
❌ NEVER collect pros and cons separately
✅ If user only gives pros → Set cons=[], ask for cons
✅ If user only gives cons → Set pros=[], ask for pros
✅ Extract exactly what they said, not paraphrased versions

READINESS CHECK:
After showing AI suggestions, ask: "Do any of these work for you?"
- If "yes" → Set user_ready_to_proceed = true
- If "more" → Generate 3 more options (max 2 rounds)

Complete when: 2+ options, 1+ explored (has pros+cons), user_ready_to_proceed = true`,

  will: `WILL - Action Plan (5 Core Fields)

For each chosen option, ask:
1. "What action will you take?" → title
2. "When?" → due_days
3. "Who's responsible?" → owner (default: "me")
4. "How track progress?" → accountability_mechanism
5. "What support needed?" → support_needed

Optional (only if volunteered):
- firstStep, specificOutcome, reviewDate, potentialBarriers

Ready when: 1+ action with all 5 core fields`,

  review: `REVIEW - Wrap Up

Ask:
1. "Key takeaways?"
2. "Next immediate step?"

EXTRACT:
- key_insights: Their learnings
- next_step: Immediate action
- confidence_level: 1-10

Then generate report.`
};
