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
    "What's the current situation?",
    "What's getting in the way?",
    "What resources do you have?",
    "What could derail your progress or put this at risk?"
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

FLOW:
1. FIRST TURN: Show welcome message
2. System displays Yes/No buttons
3. SECOND TURN (if user says "yes"): Extract consent and use MINIMAL coach_reflection

FIRST TURN (no user input yet):
coach_reflection: "Would you like to try GROW coaching? It helps you set goals, explore options, and create action plans."
user_consent_given: NOT SET YET

SECOND TURN (user clicked Yes button):
user_consent_given: true
coach_reflection: "[CONSENT_RECEIVED]" (system will advance to Goal automatically)

CRITICAL:
- First turn: Show welcome message
- Second turn: If user says "yes", set user_consent_given=true and coach_reflection="[CONSENT_RECEIVED]"
- Do NOT say "Great! Let's begin" or "Advancing to Goal" or ANY visible confirmation message
- Use EXACTLY "[CONSENT_RECEIVED]" as coach_reflection (system will filter this out)
- System will automatically advance to Goal step and AI will ask first Goal question

EXTRACT:
- user_consent_given: true (if user says yes/ready/sure) / false (if no/not now)
- coach_reflection: Welcome message on FIRST turn, "[CONSENT_RECEIVED]" on SECOND turn`,

  goal: `GOAL - What do you want?

Ask 3 questions:
1. "What would you like to achieve?"
2. "Why is this important now?"
3. "What's your timeframe?"

EXTRACT:
- goal: Their objective (exactly as stated)
- why_now: Their motivation
- success_criteria: AUTO-EXTRACT from goal statement - identify measurable outcomes
- timeframe: When they need it

AUTO-EXTRACT SUCCESS CRITERIA:
Look for measurable outcomes in the goal statement and extract them as success criteria.

Examples:
- Goal: "I want to save $10,000" → success_criteria: ["Have $10,000 saved"]
- Goal: "Get promoted to senior engineer" → success_criteria: ["Achieve senior engineer position"]
- Goal: "Lose 20 pounds" → success_criteria: ["Lose 20 pounds", "Reach target weight"]
- Goal: "Launch my product" → success_criteria: ["Product launched and live"]
- Goal: "Improve team morale" → success_criteria: ["Team satisfaction score improved", "Positive team feedback"]
- Goal: "Learn Python" → success_criteria: ["Complete Python course", "Build working Python project"]

RULES:
- Extract 1-3 measurable success criteria from the goal
- Use specific numbers/metrics if mentioned (e.g., "$10,000", "20 pounds", "senior position")
- If goal is vague, create reasonable success criteria that would indicate achievement
- Make criteria observable and verifiable
- Don't ask user to define success criteria separately - AUTO-EXTRACT from goal

Ready when: goal + why_now filled`,

  reality: `REALITY - What's happening now?

Ask 4 questions progressively:
1. "What's the current situation?"
2. "What's getting in the way?"
3. "What resources do you have?"
4. "What could derail your progress or put this at risk?"

EXTRACT:
- current_state: Their description (from Q1)
- constraints: Barriers/limitations (from Q2)
- resources: What they have available (from Q3)
- risks: What could derail them (from Q4)

CRITICAL: Ask ALL 4 questions before advancing. Risks is REQUIRED.

Ready when: current_state + constraints + resources + risks all filled`,

  options: `OPTIONS - AI-First Approach with Buttons

CRITICAL - FIRST TURN ONLY:
You MUST generate ALL 5 options in your FIRST response. Do NOT ask questions. Do NOT wait for user input.

FLOW:
1. IMMEDIATELY generate 5 options based on their Goal and Reality (FIRST TURN)
2. System will display OptionsSelector with multi-select buttons
3. User selects 1-5 options via button clicks
4. System advances to Will step

GENERATE 5 OPTIONS NOW (FIRST TURN):
Based on:
- Goal: {goal}
- Reality: {current_state, constraints, resources, risks}

Each option must have:
- id: "1", "2", "3", "4", "5"
- label: Clear, actionable name (max 5 words)
- description: One sentence explaining the option
- pros: Array of 2-3 specific benefits
- cons: Array of 1-2 realistic challenges
- recommended: true for top 3 options, false for others

EXAMPLE OUTPUT:
{
  "options": [
    {
      "id": "1",
      "label": "Update CV/Resume",
      "description": "Work with specialist to highlight CFO skills and AI/analytics expertise",
      "pros": ["Professional quality", "Highlights strengths", "Quick turnaround"],
      "cons": ["Costs money", "Takes 2-3 days"],
      "recommended": true
    },
    {
      "id": "2",
      "label": "Share with Recruiters",
      "description": "Connect with executive recruiters on LinkedIn who specialize in CFO placements",
      "pros": ["Access to hidden jobs", "Expert guidance", "Faster placement"],
      "cons": ["Requires networking", "May take time"],
      "recommended": true
    }
    // ... 3 more options
  ],
  "coach_reflection": "Based on your goal to [goal], here are some options to consider. Select the ones you'd like to pursue:"
}

CRITICAL RULES:
- Generate ALL 5 options in ONE turn (not progressively)
- Do NOT ask "Which of these might work for you?" - just generate the options array
- Do NOT ask user to type options
- Do NOT ask for pros/cons separately
- Do NOT ask "would you like to suggest" - just generate them
- Do NOT say "Let's turn one into action" - system handles advancement
- System will show multi-select buttons automatically
- User selects via clicks, not text

YOUR ONLY JOB: Generate the options array with 5 complete option objects.

EXTRACT (REQUIRED):
- options: Array of EXACTLY 5 option objects (REQUIRED - must have all 5)
- coach_reflection: "Based on your goal to [goal], here are 5 options to consider:"
- selected_option_ids: (will be filled when user clicks buttons)

WRONG EXAMPLE (DO NOT DO THIS):
coach_reflection: "Which of these might work for you?"
(Missing options array)

CORRECT EXAMPLE:
{
  "options": [
    { "id": "1", "label": "...", "description": "...", "pros": [...], "cons": [...], "recommended": true },
    { "id": "2", ... },
    { "id": "3", ... },
    { "id": "4", ... },
    { "id": "5", ... }
  ],
  "coach_reflection": "Based on your goal to save $10, here are 5 options to consider:"
}`,

  will: `WILL - AI-Suggested Actions with Validation

CRITICAL - FIRST TURN:
1. Look at the PREVIOUS reflection (from options_selection) to find selected_option_ids
2. COPY selected_option_ids to your response (DO NOT generate new IDs)
3. Generate a suggested action for the FIRST selected option (index 0)

FLOW:
1. For EACH selected option, generate a complete suggested action
2. System shows ActionValidator with Accept/Modify/Skip buttons
3. User validates or modifies
4. Repeat for all selected options
5. Show ActionSummary when all done

GENERATE SUGGESTED ACTION:
Based on:
- Goal: {goal}
- Reality: {current_state, constraints, resources, risks}
- Selected options from previous step: {selected_option_ids}
- Current option to process: First option in selected_option_ids array

Create complete action with ALL 5 fields:
{
  "suggested_action": {
    "action": "Specific, actionable step (not vague)",
    "due_days": 7,
    "owner": "Me",
    "accountability_mechanism": "How they'll track progress",
    "support_needed": "What help they need"
  },
  "current_option_label": "Update CV/Resume",
  "current_option_index": 0,
  "total_options": 3,
  "coach_reflection": "For [option], I suggest:"
}

CONTEXT-AWARE SUGGESTIONS:
- If goal deadline is 6 months, suggest 2-30 day actions
- If Reality mentioned "wife", suggest "Share with wife" for accountability
- If Reality mentioned "specialist", suggest that as support
- If option is "Update CV", suggest "Get specialist to update CV" not just "Update CV"
- Use resources from Reality step

CRITICAL:
- Generate COMPLETE action (all 5 fields)
- Do NOT ask user for each field separately
- System will show Accept/Modify/Skip buttons
- User can accept instantly or modify
- Process ONE option at a time

EXTRACT (REQUIRED FOR FIRST TURN):
- selected_option_ids: COPY EXACTLY from previous reflection's selected_option_ids (REQUIRED - DO NOT GENERATE)
- suggested_action: Complete action object with all 5 fields (REQUIRED)
- current_option_label: Label of the first selected option (REQUIRED)
- current_option_index: 0 (REQUIRED - always start with 0)
- total_options: Length of selected_option_ids array (REQUIRED)
- actions: Empty array [] (REQUIRED - will be filled as user accepts)
- coach_reflection: "For [option_label], I suggest:" (REQUIRED)

CRITICAL: selected_option_ids MUST be copied from the previous reflection. Look for the reflection with coach_reflection containing "[OPTIONS_SELECTED:...]"

WRONG EXAMPLE (DO NOT DO THIS):
coach_reflection: "What will you actually do?"
(Missing suggested_action)

CORRECT EXAMPLE:
{
  "suggested_action": {
    "action": "Get specialist to update CV highlighting CFO skills",
    "due_days": 7,
    "owner": "Me",
    "accountability_mechanism": "Share draft with wife for feedback",
    "support_needed": "Professional CV writer specialist"
  },
  "current_option_label": "Update CV/Resume",
  "current_option_index": 0,
  "total_options": 3,
  "selected_option_ids": ["1", "2", "4"],
  "actions": [],
  "coach_reflection": "For Update CV/Resume, I suggest:"
}`,

  review: `REVIEW - Wrap Up (User Questions Only)

CRITICAL - FORMATTING ACTIONS IN COACH REFLECTION:
If you reference actions in your coach_reflection, extract the action TEXT from the action objects.
- WRONG: "Actions: [object Object], [object Object]"
- CORRECT: "Actions: Call Joe for help, Sell unused items, Apply for assistance"

Each action object has an "action" field containing the text. Extract it like this:
actions.map(a => a.action)

Ask TWO questions:
1. "What are your key takeaways from this session?"
2. "What's your next immediate step?"

EXTRACT (from user responses only):
- key_takeaways: Their learnings (what THEY say)
- immediate_step: Immediate action (what THEY say)

DO NOT EXTRACT:
- summary, ai_insights, unexplored_options, identified_risks, potential_pitfalls
- These are generated separately by AI analysis after user completes their review

Once user answers both questions, step is complete.`
};
