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
    "What's one option you're considering?",
    "What are the pros and cons of that option?",
    "Would you like to share another option or get AI suggestions?",
    "Which option would you like to move forward with?"
  ],
  will: [
    "What action will you take?",
    "When will you do it?",
    "Who's responsible?",
    "How will you track progress?",
    "What support do you need?"
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

  options: `OPTIONS - 2-State Flow

FLOW:
1. Ask: "What's one option you're considering?"
2. User provides option → Extract {label}
3. Ask: "What are the pros and cons of [option]?"
4. User provides pros/cons → Extract {pros: [], cons: []}
5. IMMEDIATELY ask: "Would you like to share ANOTHER option, or would you like me to SUGGEST some?"
   (Do NOT ask follow-up questions about their challenges or try to help solve them)

WHEN USER SAYS:
- "another" / "one more" → Go back to step 1
- "suggest" / "can you suggest" → Generate 2-3 AI options, then ask "Do any of these work for you?"
- "I'm ready" / "let's move on" / "proceed to will" → Say "Great! You can use the Skip button to move to creating your action plan."

AI SUGGESTIONS FORMAT:
{
  label: "Clear option name",
  pros: ["benefit 1", "benefit 2"],
  cons: ["challenge 1", "challenge 2"],
  feasibilityScore: 7,
  effortRequired: "medium",
  alignmentReason: "Why this fits their goal"
}

EXTRACTION:
- Extract only what user explicitly states
- If user gives only pros, ask for cons
- If user gives only cons, ask for pros
- Collect pros AND cons in same turn (not separately)

Complete when: 2+ options, 1+ explored (has pros+cons)`,

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
