/**
 * GROW Framework Definition
 * 
 * Goal-Reality-Options-Will coaching model for general-purpose goal achievement.
 * Extracted from coach.ts hardcoded definition for modular architecture.
 */

import { FrameworkDefinition, LegacyFramework } from './types';

/**
 * Legacy GROW definition - matches current coach.ts implementation exactly
 * This ensures zero regression during migration
 */
export const growFrameworkLegacy: LegacyFramework = {
  id: "GROW",
  steps: [
    {
      name: "introduction",
      system_objective: "Welcome user, explain GROW framework, and get consent before starting session.",
      required_fields_schema: {
        type: "object",
        properties: {
          user_consent_given: { type: "boolean" },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      }
    },
    {
      name: "goal",
      system_objective: "Clarify the desired outcome and timeframe.",
      required_fields_schema: {
        type: "object",
        properties: {
          goal: { type: "string", minLength: 8, maxLength: 240 },
          why_now: { type: "string", minLength: 8, maxLength: 240 },
          success_criteria: { type: "array", items: { type: "string", minLength: 3 }, minItems: 1, maxItems: 5 },
          timeframe: { type: "string", minLength: 3, maxLength: 100 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
        },
        required: ["coach_reflection"],
        additionalProperties: true
      }
    },
    {
      name: "reality",
      system_objective: "Surface current constraints, facts, and risks without judgement.",
      required_fields_schema: {
        type: "object",
        properties: {
          current_state: { type: "string", minLength: 8, maxLength: 320 },
          constraints: { type: "array", items: { type: "string" }, maxItems: 6 },
          resources: { type: "array", items: { type: "string" }, maxItems: 6 },
          risks: { type: "array", items: { type: "string" }, maxItems: 6 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
        },
        required: ["current_state", "coach_reflection"],
        additionalProperties: false
      }
    },
    {
      name: "options",
      system_objective: "Facilitate user discovering at least two viable options (user-generated or AI-suggested) with pros and cons.",
      required_fields_schema: {
        type: "object",
        properties: {
          options: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string", minLength: 3, maxLength: 60 },
                pros: { type: "array", items: { type: "string" }, maxItems: 5 },
                cons: { type: "array", items: { type: "string" }, maxItems: 5 }
              },
              required: ["label"],
              additionalProperties: false
            },
            minItems: 1,
            maxItems: 5
          },
          user_ready_to_proceed: { type: "boolean" },
          coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      }
    },
    {
      name: "will",
      system_objective: "Select one option and define SMART actions with overall timeline.",
      required_fields_schema: {
        type: "object",
        properties: {
          chosen_option: { type: "string" },
          actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string", minLength: 4, maxLength: 120 },
                owner: { type: "string" },
                due_days: { type: "integer", minimum: 1 }
              },
              required: ["title"],
              additionalProperties: false
            },
            minItems: 0,
            maxItems: 3
          },
          action_plan_timeframe: { type: "string", minLength: 2, maxLength: 100 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      }
    },
    {
      name: "review",
      system_objective: "Two-phase: First ask user review questions, then provide AI insights.",
      required_fields_schema: {
        type: "object",
        properties: {
          key_takeaways: { type: "string", minLength: 10, maxLength: 500 },
          immediate_step: { type: "string", minLength: 5, maxLength: 300 },
          summary: { type: "string", minLength: 16, maxLength: 400 },
          ai_insights: { type: "string", minLength: 20, maxLength: 400 },
          unexplored_options: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
          identified_risks: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
          potential_pitfalls: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 300 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      }
    }
  ]
};

/**
 * Future modular GROW definition (for Phase 2)
 * This will replace the legacy version once registry is fully tested
 */
export const growFramework: FrameworkDefinition = {
  id: 'GROW',
  name: 'GROW Model',
  description: 'Goal-Reality-Options-Will for any goal or challenge',
  duration_minutes: 20,
  challenge_types: ['goal_achievement'],
  steps: [
    {
      name: 'introduction',
      order: 0,
      duration_minutes: 2,
      objective: 'Welcome user, explain GROW framework, and get consent before starting session.',
      required_fields_schema: {
        type: 'object',
        properties: {
          user_consent_given: { type: 'boolean' },
          coach_reflection: { type: 'string', minLength: 20, maxLength: 500 }
        },
        required: ['coach_reflection'],
        additionalProperties: false
      },
      system_prompt: 'You are a GROW coach. Welcome the user and explain the framework.',
      coaching_questions: [
        'Does this framework feel right for what you want to work on today?'
      ],
      guardrails: [
        'DO NOT start Goal phase without user consent',
        'Keep introduction under 150 words',
        'Make it conversational and warm'
      ],
      transition_rules: [
        { 
          condition: 'user_consent_given_true', 
          nextStep: 'goal', 
          action: 'Advance to Goal step' 
        }
      ]
    },
    {
      name: 'goal',
      order: 1,
      duration_minutes: 4,
      objective: 'Clarify the desired outcome and timeframe.',
      required_fields_schema: {
        type: 'object',
        properties: {
          goal: { type: 'string', minLength: 8, maxLength: 240 },
          why_now: { type: 'string', minLength: 8, maxLength: 240 },
          success_criteria: { 
            type: 'array', 
            items: { type: 'string', minLength: 3 }, 
            minItems: 1, 
            maxItems: 5 
          },
          timeframe: { type: 'string', minLength: 3, maxLength: 100 },
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: ['coach_reflection'],
        additionalProperties: true
      },
      system_prompt: 'You are a GROW coach. Clarify the desired outcome and timeframe.',
      coaching_questions: [
        'What would you like to achieve?',
        'Why is this important to you right now?',
        'How will you know when you\'ve succeeded?',
        'What\'s your timeframe for this goal?'
      ],
      guardrails: [
        'Keep questions open-ended',
        'Avoid suggesting solutions',
        'Focus on clarity, not complexity'
      ],
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'reality', 
          action: 'Advance to Reality step' 
        }
      ]
    },
    {
      name: 'reality',
      order: 2,
      duration_minutes: 4,
      objective: 'Surface current constraints, facts, and risks without judgement.',
      required_fields_schema: {
        type: 'object',
        properties: {
          current_state: { type: 'string', minLength: 8, maxLength: 320 },
          constraints: { type: 'array', items: { type: 'string' }, maxItems: 6 },
          resources: { type: 'array', items: { type: 'string' }, maxItems: 6 },
          risks: { type: 'array', items: { type: 'string' }, maxItems: 6 },
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: ['current_state', 'coach_reflection'],
        additionalProperties: false
      },
      system_prompt: 'You are a GROW coach. Surface current constraints, facts, and risks without judgement.',
      coaching_questions: [
        'What\'s your current situation?',
        'What constraints are you facing?',
        'What resources do you already have?',
        'What risks do you see?'
      ],
      guardrails: [
        'Stay neutral and non-judgmental',
        'Focus on facts, not interpretations',
        'Explore both obstacles and resources'
      ],
      transition_rules: [
        { 
          condition: 'current_state_and_reflection_exist', 
          nextStep: 'options', 
          action: 'Advance to Options step' 
        }
      ]
    },
    {
      name: 'options',
      order: 3,
      duration_minutes: 4,
      objective: 'Facilitate user discovering at least two viable options with pros and cons.',
      required_fields_schema: {
        type: 'object',
        properties: {
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string', minLength: 3, maxLength: 60 },
                pros: { type: 'array', items: { type: 'string' }, maxItems: 5 },
                cons: { type: 'array', items: { type: 'string' }, maxItems: 5 }
              },
              required: ['label'],
              additionalProperties: false
            },
            minItems: 1,
            maxItems: 5
          },
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: ['coach_reflection'],
        additionalProperties: false
      },
      system_prompt: 'You are a GROW coach. Facilitate discovering viable options with pros and cons.',
      coaching_questions: [
        'What options do you see?',
        'What are the pros and cons of each?',
        'What else could you try?',
        'What would you do if you had unlimited resources?'
      ],
      guardrails: [
        'Generate at least 2 options',
        'Encourage creative thinking',
        'Balance optimism with realism'
      ],
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'will', 
          action: 'Advance to Will step' 
        }
      ]
    },
    {
      name: 'will',
      order: 4,
      duration_minutes: 4,
      objective: 'Select one option and define SMART actions with timeline.',
      required_fields_schema: {
        type: 'object',
        properties: {
          chosen_option: { type: 'string' },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string', minLength: 4, maxLength: 120 },
                owner: { type: 'string' },
                due_days: { type: 'integer', minimum: 1 }
              },
              required: ['title'],
              additionalProperties: false
            },
            minItems: 0,
            maxItems: 3
          },
          action_plan_timeframe: { type: 'string', minLength: 2, maxLength: 100 },
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: ['coach_reflection'],
        additionalProperties: false
      },
      system_prompt: 'You are a GROW coach. Help select an option and define SMART actions.',
      coaching_questions: [
        'Which option will you choose?',
        'What specific actions will you take?',
        'Who will do what, and by when?',
        'What\'s your first step?'
      ],
      guardrails: [
        'Ensure actions are specific and measurable',
        'Confirm commitment level',
        'Identify potential obstacles'
      ],
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'review', 
          action: 'Advance to Review step' 
        }
      ]
    },
    {
      name: 'review',
      order: 5,
      duration_minutes: 4,
      objective: 'Two-phase: First ask user review questions, then provide AI insights.',
      required_fields_schema: {
        type: 'object',
        properties: {
          key_takeaways: { type: 'string', minLength: 10, maxLength: 500 },
          immediate_step: { type: 'string', minLength: 5, maxLength: 300 },
          summary: { type: 'string', minLength: 16, maxLength: 400 },
          ai_insights: { type: 'string', minLength: 20, maxLength: 400 },
          unexplored_options: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4 },
          identified_risks: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4 },
          potential_pitfalls: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4 },
          coach_reflection: { type: 'string', minLength: 20, maxLength: 300 }
        },
        required: ['coach_reflection'],
        additionalProperties: false
      },
      system_prompt: 'You are a GROW coach. First ask review questions, then provide AI insights.',
      coaching_questions: [
        'What are your key takeaways?',
        'What will you do first?',
        'How confident do you feel about your plan?',
        'What support do you need?'
      ],
      guardrails: [
        'Celebrate progress',
        'Provide constructive insights',
        'Highlight risks without discouraging'
      ],
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'COMPLETE', 
          action: 'Complete session' 
        }
      ]
    }
  ],
  completion_rules: [
    {
      required_fields: ['goal', 'current_state', 'options', 'actions'],
      validation: (data: Record<string, unknown>): boolean => {
        const hasGoal = 'goal' in data && typeof data['goal'] === 'string';
        const hasCurrentState = 'current_state' in data && typeof data['current_state'] === 'string';
        return hasGoal && hasCurrentState;
      },
      error_message: 'Goal and current state are required to complete session'
    }
  ]
};
