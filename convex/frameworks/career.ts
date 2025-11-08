/**
 * CAREER Framework Definition
 * Career Advancement & Readiness Coach
 * 
 * A structured 5-step framework for career development, skill building, and role transitions.
 * Linear progression: INTRODUCTION → ASSESSMENT → GAP_ANALYSIS → ROADMAP → REVIEW
 */

import type { FrameworkDefinition } from "./types";

export const careerFramework: FrameworkDefinition = {
  id: "CAREER",
  name: "Career Coach",
  description: "Career advancement and transition planning using gap analysis and roadmap development",
  duration_minutes: 25,
  challenge_types: ["career_development"],
  
  steps: [
    // ========================================================================
    // STEP 1: INTRODUCTION (2 minutes)
    // ========================================================================
    {
      name: "INTRODUCTION",
      order: 1,
      duration_minutes: 2,
      objective: "Confirm career coaching intent and obtain consent",
      
      required_fields_schema: {
        type: "object",
        properties: {
          user_consent: { type: "boolean" },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `You are a Career Coach helping professionals navigate career transitions, skill development, and role advancement.

Your role in the INTRODUCTION step:
1. Welcome the user warmly
2. Explain briefly what Career Coach does (career transitions, skill development, role advancement)
3. Ask "Ready to begin your career planning session?"
4. When user says yes, extract user_consent=true and use "[CONSENT_RECEIVED]" as coach_reflection

Keep it simple - just welcome and get consent. Career focus questions happen in ASSESSMENT step.`,
      
      coaching_questions: [
        "Ready to begin your career planning session?"
      ],
      
      guardrails: [
        "If user declines consent, offer GROW framework instead",
        "If user describes non-career goal (relationships, health, personal issues), redirect to GROW",
        "Never auto-extract consent - user must explicitly agree",
        "Keep reflection brief and welcoming (20+ chars minimum)"
      ],
      
      transition_rules: [
        { 
          condition: 'user_consent_true', 
          nextStep: 'ASSESSMENT', 
          action: 'Great! Let\'s assess your current career situation and target role.' 
        }
      ]
    },

    // ========================================================================
    // STEP 2: ASSESSMENT (6 minutes)
    // ========================================================================
    {
      name: "ASSESSMENT",
      order: 2,
      duration_minutes: 6,
      objective: "Understand current state and career target",
      
      required_fields_schema: {
        type: "object",
        properties: {
          current_role: { type: "string", minLength: 3, maxLength: 100 },
          years_experience: { type: "number", minimum: 0, maximum: 50 },
          industry: { type: "string", minLength: 3, maxLength: 50 },
          target_role: { type: "string", minLength: 3, maxLength: 100 },
          timeframe: { 
            type: "string",
            enum: ["3-6 months", "6-12 months", "1-2 years", "2+ years"]
          },
          career_stage: {
            type: "string",
            enum: ["early", "mid", "senior", "executive"]
          },
          initial_confidence: { type: "number", minimum: 1, maximum: 10 },
          assessment_score: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `Gather comprehensive career assessment data to understand the user's current position and target.

Ask questions progressively. Use opportunistic extraction - if user provides multiple pieces of information in one response, extract all of them and skip to the next unanswered question.

CRITICAL RULES:
- Never infer career stage from years of experience
- Never suggest target roles based on current role
- Never assume industry from role title
- Never auto-fill timeframe based on seniority gap
- Only extract explicitly stated information`,
      
      coaching_questions: [
        "What's your current role?",
        "How many years of experience do you have?",
        "What industry are you in?",
        "What role are you targeting?",
        "What's your timeframe for this transition?",
        "How would you describe your career stage: early (0-3 years), mid (3-10 years), senior (10+ years), or executive?",
        "On a scale of 1-10, how confident are you about making this transition?",
        "On a scale of 1-10, how clear are you on what it takes to get there?"
      ],
      
      guardrails: [
        "DO NOT infer career stage from years of experience",
        "DO NOT suggest target roles",
        "DO NOT assume industry from role title",
        "DO NOT auto-fill timeframe",
        "ONLY extract explicitly stated information",
        "Use user's exact words for roles and industry"
      ],
      
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'GAP_ANALYSIS', 
          action: 'Now let\'s identify the gaps between where you are and where you want to be.' 
        }
      ]
    },

    // ========================================================================
    // STEP 3: GAP_ANALYSIS (7 minutes)
    // ========================================================================
    {
      name: "GAP_ANALYSIS",
      order: 3,
      duration_minutes: 7,
      objective: "Identify skill/experience gaps and transferable strengths",
      
      required_fields_schema: {
        type: "object",
        properties: {
          skill_gaps: { 
            type: "array",
            items: { type: "string", minLength: 3, maxLength: 100 },
            minItems: 1,
            maxItems: 8
          },
          experience_gaps: { 
            type: "array",
            items: { type: "string", minLength: 3, maxLength: 100 },
            minItems: 0,
            maxItems: 5
          },
          transferable_skills: { 
            type: "array",
            items: { type: "string", minLength: 3, maxLength: 100 },
            minItems: 1,
            maxItems: 8
          },
          development_priorities: { 
            type: "array",
            items: { type: "string", minLength: 3, maxLength: 100 },
            minItems: 1,
            maxItems: 3
          },
          gap_analysis_score: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `Help the user identify gaps between their current capabilities and target role requirements, while also recognizing transferable strengths.

CRITICAL RULES:
- Never generate skill lists from job descriptions
- Never suggest "common gaps" for the role
- Never invent transferable skills
- Never prioritize gaps without user input
- development_priorities must be a subset of skill_gaps
- Each gap must be specific and actionable (not generic terms like "leadership")`,
      
      coaching_questions: [
        "What skills does your target role require that you don't currently have?",
        "What types of experience are you missing?",
        "What skills from your current role transfer to your target role?",
        "Of all the gaps we've identified, which 3 are most critical to address first?",
        "On a scale of 1-10, how manageable do these gaps feel?"
      ],
      
      guardrails: [
        "DO NOT generate skill lists from job descriptions",
        "DO NOT suggest common gaps",
        "DO NOT invent transferable skills",
        "DO NOT prioritize without user input",
        "ONLY extract skills user explicitly identifies",
        "Validate that development_priorities are from skill_gaps list"
      ],
      
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'ROADMAP', 
          action: 'Excellent. Now let\'s create a concrete action plan to close these gaps.' 
        }
      ]
    },

    // ========================================================================
    // STEP 4: ROADMAP (7 minutes)
    // ========================================================================
    {
      name: "ROADMAP",
      order: 4,
      duration_minutes: 7,
      objective: "Create concrete action plan with milestones",
      
      required_fields_schema: {
        type: "object",
        properties: {
          learning_actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: { type: "string", minLength: 5, maxLength: 200 },
                timeline: { type: "string", minLength: 3, maxLength: 50 },
                resource: { type: "string", minLength: 3, maxLength: 100 }
              },
              required: ["action", "timeline", "resource"],
              additionalProperties: false
            },
            minItems: 1,
            maxItems: 5
          },
          networking_actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: { type: "string", minLength: 5, maxLength: 200 },
                timeline: { type: "string", minLength: 3, maxLength: 50 }
              },
              required: ["action", "timeline"],
              additionalProperties: false
            },
            minItems: 0,
            maxItems: 3
          },
          experience_actions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: { type: "string", minLength: 5, maxLength: 200 },
                timeline: { type: "string", minLength: 3, maxLength: 50 }
              },
              required: ["action", "timeline"],
              additionalProperties: false
            },
            minItems: 1,
            maxItems: 3
          },
          milestone_3_months: { type: "string", minLength: 10, maxLength: 200 },
          milestone_6_months: { type: "string", minLength: 10, maxLength: 200 },
          roadmap_score: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `Help the user create a concrete, actionable roadmap with specific learning, networking, and experience-building actions.

CRITICAL RULES:
- Never suggest specific courses or certifications
- Never recommend networking events
- Never create timelines without user input
- Never auto-generate milestones
- Each action must have a user-defined timeline
- Learning actions must have user-identified resources
- Milestones must be measurable outcomes (not just "complete course")`,
      
      coaching_questions: [
        "What learning actions will you take to close your skill gaps? For each, what's the timeline and what resource will you use?",
        "What networking actions will help you? When will you do each one?",
        "What hands-on experience can you get? What's your timeline for each?",
        "What will you achieve in 3 months?",
        "What about 6 months?",
        "On a scale of 1-10, how committed are you to this roadmap?"
      ],
      
      guardrails: [
        "DO NOT suggest specific courses/certifications",
        "DO NOT recommend networking events",
        "DO NOT create timelines without user input",
        "DO NOT auto-generate milestones",
        "ONLY extract actions user commits to",
        "Validate timelines are realistic",
        "Ensure milestones are measurable"
      ],
      
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'REVIEW', 
          action: 'Perfect. Let\'s wrap up and review what you\'ve accomplished in this session.' 
        }
      ]
    },

    // ========================================================================
    // STEP 5: REVIEW (3 minutes)
    // ========================================================================
    {
      name: "REVIEW",
      order: 5,
      duration_minutes: 3,
      objective: "Summarize session and measure confidence gain",
      
      required_fields_schema: {
        type: "object",
        properties: {
          key_takeaways: { type: "string", minLength: 50, maxLength: 500 },
          immediate_next_step: { type: "string", minLength: 10, maxLength: 200 },
          biggest_challenge: { type: "string", minLength: 10, maxLength: 200 },
          final_confidence: { type: "number", minimum: 1, maximum: 10 },
          final_clarity: { type: "number", minimum: 1, maximum: 10 },
          session_helpfulness: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `Help the user reflect on the session and commit to immediate action.

CRITICAL RULES:
- Never summarize for the user
- Never suggest next steps
- Never invent challenges
- Never auto-fill confidence scores
- key_takeaways must be user's own words (50+ chars)
- immediate_next_step must be specific and time-bound
- Compare final_confidence to initial_confidence for delta`,
      
      coaching_questions: [
        "What are your key takeaways from this session?",
        "What's your immediate next step (within 48 hours)?",
        "What's your biggest challenge in executing this plan?",
        "On a scale of 1-10, how confident are you now about your career transition?",
        "How clear are you on your path forward (1-10)?",
        "How helpful was this session (1-10)?"
      ],
      
      guardrails: [
        "DO NOT summarize for the user",
        "DO NOT suggest next steps",
        "DO NOT invent challenges",
        "DO NOT auto-fill scores",
        "ONLY extract user's own reflections",
        "Ensure immediate_next_step is specific and time-bound"
      ],
      
      transition_rules: [
        { 
          condition: 'coach_reflection_exists', 
          nextStep: 'COMPLETE', 
          action: 'Your career development plan is complete! You can now view your full report with CaSS score and roadmap.' 
        }
      ]
    }
  ],
  
  completion_rules: []
};
