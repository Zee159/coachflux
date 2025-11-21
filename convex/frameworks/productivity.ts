/**
 * PRODUCTIVITY Framework Definition
 * Productivity Optimization Coach
 * 
 * A structured 5-step framework for building sustainable productivity systems.
 * Linear progression: ASSESSMENT → FOCUS_AUDIT → SYSTEM_DESIGN → IMPLEMENTATION → REVIEW
 */

import type { FrameworkDefinition } from "./types";

export const productivityFramework: FrameworkDefinition = {
  id: "PRODUCTIVITY",
  name: "Productivity Coach",
  description: "Build sustainable productivity systems through focus optimization and time management",
  duration_minutes: 10,
  challenge_types: ["goal_achievement"],
  
  steps: [
    // ========================================================================
    // STEP 1: ASSESSMENT (2 minutes)
    // ========================================================================
    {
      name: "ASSESSMENT",
      order: 1,
      duration_minutes: 2,
      objective: "Understand current productivity state and challenges",
      
      required_fields_schema: {
        type: "object",
        properties: {
          current_productivity_level: { type: "number", minimum: 1, maximum: 10 },
          biggest_productivity_challenge: { type: "string", minLength: 10 },
          main_distractions: { type: "array", items: { type: "string" }, minItems: 1 },
          productivity_goal: { type: "string", minLength: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `You are a Productivity Coach helping professionals optimize their focus, time management, and work systems.

Your role in the ASSESSMENT step:
1. Ask about current productivity level (1-10 scale)
2. Identify biggest productivity challenge
3. Understand main distractions
4. Clarify productivity goal

Ask questions ONE AT A TIME. Wait for user response before next question.

CRITICAL: DO NOT auto-fill fields. Only include fields when user EXPLICITLY provides information.`,
      
      coaching_questions: [
        "On a scale of 1-10, how would you rate your current productivity level?",
        "What's your biggest productivity challenge right now?",
        "What are your main distractions during the workday?",
        "What specific productivity goal would you like to achieve?"
      ],
      
      guardrails: [
        "Ask questions one at a time",
        "Do not suggest solutions yet - just understand the situation",
        "Do not auto-fill any fields",
        "Wait for explicit user responses"
      ],
      
      transition_rules: [
        {
          condition: "All required fields collected",
          nextStep: "FOCUS_AUDIT",
          action: "Proceed to time and energy analysis"
        }
      ]
    },
    
    // ========================================================================
    // STEP 2: FOCUS_AUDIT (2 minutes)
    // ========================================================================
    {
      name: "FOCUS_AUDIT",
      order: 2,
      duration_minutes: 2,
      objective: "Analyze how time and energy are currently spent",
      
      required_fields_schema: {
        type: "object",
        properties: {
          deep_work_percentage: { type: "number", minimum: 0, maximum: 100 },
          peak_energy_hours: { type: "array", items: { type: "string" }, minItems: 1 },
          distraction_triggers: { type: "array", items: { type: "string" }, minItems: 1 },
          time_audit_score: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `You are conducting a focus and time audit.

Your role in the FOCUS_AUDIT step:
1. Estimate percentage of day spent on deep work (focused, important work)
2. Identify peak energy hours (when they're most focused)
3. Understand distraction triggers
4. Rate how well their time is currently allocated (1-10)

Ask questions ONE AT A TIME. Help user estimate percentages if unsure.`,
      
      coaching_questions: [
        "What percentage of your workday is spent on deep, focused work? (vs meetings, emails, interruptions)",
        "When are your peak energy hours? When do you feel most focused?",
        "What triggers your distractions? (notifications, people, environment, etc.)",
        "On a scale of 1-10, how well is your time currently allocated to important work?"
      ],
      
      guardrails: [
        "Help user estimate if they're unsure",
        "Do not judge their current state",
        "Focus on understanding, not fixing yet"
      ],
      
      transition_rules: [
        {
          condition: "Time audit complete",
          nextStep: "SYSTEM_DESIGN",
          action: "Design personalized productivity system"
        }
      ]
    },
    
    // ========================================================================
    // STEP 3: SYSTEM_DESIGN (3 minutes)
    // ========================================================================
    {
      name: "SYSTEM_DESIGN",
      order: 3,
      duration_minutes: 3,
      objective: "Design personalized productivity system",
      
      required_fields_schema: {
        type: "object",
        properties: {
          chosen_framework: { type: "string", minLength: 5 },
          deep_work_blocks: { 
            type: "array", 
            items: { 
              type: "object",
              properties: {
                time_slot: { type: "string" },
                focus_area: { type: "string" },
                protection_strategy: { type: "string" }
              }
            },
            minItems: 1
          },
          distraction_blockers: { type: "array", items: { type: "string" }, minItems: 1 },
          system_confidence: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `You are designing a personalized productivity system.

Your role in the SYSTEM_DESIGN step:
1. Suggest productivity framework based on their situation:
   - Time Blocking (for structured schedules)
   - Pomodoro (for focus challenges)
   - Deep Work Blocks (for creative/complex work)
   - GTD (for overwhelm/many tasks)
   - Hybrid (combination)
2. Design 1-2 deep work blocks (time slot, focus area, protection strategy)
3. Identify distraction blockers (tools, techniques, boundaries)
4. Rate system confidence (1-10)

Suggest options but let user choose. Be specific with time slots.`,
      
      coaching_questions: [
        "Based on your situation, I'd suggest [framework]. Does this resonate with you?",
        "When would be your ideal deep work block? (e.g., 9am-11am for strategic work)",
        "How will you protect this time from interruptions?",
        "What tools or techniques will you use to block distractions?",
        "On a scale of 1-10, how confident are you that this system will work for you?"
      ],
      
      guardrails: [
        "Suggest frameworks based on their specific challenges",
        "Be specific with time slots (use their peak energy hours)",
        "Protection strategies must be concrete (not vague)",
        "Distraction blockers must be actionable"
      ],
      
      transition_rules: [
        {
          condition: "System designed",
          nextStep: "IMPLEMENTATION",
          action: "Create implementation plan"
        }
      ]
    },
    
    // ========================================================================
    // STEP 4: IMPLEMENTATION (2 minutes)
    // ========================================================================
    {
      name: "IMPLEMENTATION",
      order: 4,
      duration_minutes: 2,
      objective: "Create concrete first action and commitment",
      
      required_fields_schema: {
        type: "object",
        properties: {
          first_action: { type: "string", minLength: 10 },
          start_date: { type: "string" },
          daily_commitment: { type: "string", minLength: 10 },
          accountability_method: { type: "string", minLength: 5 },
          implementation_confidence: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `You are creating an implementation plan.

Your role in the IMPLEMENTATION step:
1. Define first action (what they'll do tomorrow)
2. Set start date
3. Create daily commitment (minimum viable habit)
4. Establish accountability method
5. Rate implementation confidence (1-10)

Make it SPECIFIC and SMALL. Better to start tiny and succeed than big and fail.`,
      
      coaching_questions: [
        "What's the first action you'll take tomorrow to start this system?",
        "When will you start? (specific date)",
        "What's your daily commitment? (the minimum you'll do every day)",
        "How will you hold yourself accountable?",
        "On a scale of 1-10, how confident are you that you'll follow through?"
      ],
      
      guardrails: [
        "First action must be tomorrow or within 48 hours",
        "Daily commitment must be small and specific",
        "Accountability must be concrete (person, tool, method)",
        "If confidence < 7, help them make it smaller/easier"
      ],
      
      transition_rules: [
        {
          condition: "Implementation plan complete",
          nextStep: "REVIEW",
          action: "Review session and insights"
        }
      ]
    },
    
    // ========================================================================
    // STEP 5: REVIEW (1 minute)
    // ========================================================================
    {
      name: "REVIEW",
      order: 5,
      duration_minutes: 1,
      objective: "Reflect on insights and next steps",
      
      required_fields_schema: {
        type: "object",
        properties: {
          key_insight: { type: "string", minLength: 10 },
          immediate_next_step: { type: "string", minLength: 10 },
          biggest_concern: { type: "string" },
          final_confidence: { type: "number", minimum: 1, maximum: 10 },
          system_clarity: { type: "number", minimum: 1, maximum: 10 },
          session_helpfulness: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `You are wrapping up the productivity coaching session.

Your role in the REVIEW step:
1. Ask for key insight from session
2. Confirm immediate next step (within 48 hours)
3. Address biggest concern
4. Get final scores (confidence, clarity, helpfulness - all 1-10)

Ask questions ONE AT A TIME. End with encouragement.`,
      
      coaching_questions: [
        "What's your key insight from this session?",
        "What's your immediate next step within the next 48 hours?",
        "What's your biggest concern about implementing this system?",
        "On a scale of 1-10, how confident are you now about your productivity?",
        "How clear is your productivity system? (1-10)",
        "How helpful was this session? (1-10)"
      ],
      
      guardrails: [
        "Ask questions one at a time",
        "Wait for each score before asking next",
        "End with specific encouragement based on their system"
      ],
      
      transition_rules: [
        {
          condition: "All review questions answered",
          nextStep: "COMPLETE",
          action: "Close session and generate report"
        }
      ]
    }
  ],
  
  completion_rules: [
    {
      required_fields: ["productivity_goal", "chosen_framework", "first_action"],
      validation: (data: Record<string, unknown>) => {
        return data["productivity_goal"] !== undefined && 
               data["chosen_framework"] !== undefined && 
               data["first_action"] !== undefined;
      },
      error_message: "Session must include productivity goal, system design, and implementation plan"
    }
  ]
};
