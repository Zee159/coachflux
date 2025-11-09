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
            enum: ["entry_level", "middle_manager", "senior_manager", "executive", "founder"]
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
          ai_wants_suggestions: { type: "boolean" },
          ai_suggested_gaps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                type: { type: "string", enum: ["skill", "experience"] },
                gap: { type: "string", minLength: 3, maxLength: 100 },
                rationale: { type: "string", minLength: 10, maxLength: 200 },
                priority: { type: "string", enum: ["high", "medium", "low"] },
                difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                typical_time_to_acquire: { type: "string", minLength: 5, maxLength: 50 }
              },
              required: ["id", "type", "gap", "rationale", "priority", "difficulty", "typical_time_to_acquire"],
              additionalProperties: false
            },
            minItems: 0,
            maxItems: 5
          },
          selected_gap_ids: {
            type: "array",
            items: { type: "string" },
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
            maxItems: 5
          },
          gap_analysis_score: { type: "number", minimum: 1, maximum: 10 },
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: false
      },
      
      system_prompt: `Help the user identify gaps between their current capabilities and target role requirements, while also recognizing transferable strengths.

🚨 MANDATORY QUESTION SEQUENCE (END EACH WITH A QUESTION, NOT A STATEMENT):
1. ASK: "What skills does your target role require that you don't currently have?"
2. ASK: "What types of experience are you missing?" (optional)
3. ⚠️ ALWAYS ASK: "Would you like me to suggest additional gaps based on your career transition?"
   - Set ai_wants_suggestions = true/false based on response
   - If true, generate ai_suggested_gaps and present via GapSelector
   - If false, skip to transferable_skills
4. ASK: "What skills from your current role transfer to your target role?"
5. ASK: "Of all the gaps we've identified, which ones are most critical to address first?"
6. ASK: "On a scale of 1-10, how manageable do these gaps feel?"

⚠️ DO NOT say "Now let's identify..." or "Let's talk about..." - END WITH A DIRECT QUESTION.

CRITICAL RULES:
- NEVER skip the AI suggestion question (step 3)
- Never generate skill lists from job descriptions
- Never suggest "common gaps" for the role
- Never invent transferable skills
- Never prioritize gaps without user input
- development_priorities must be a subset of skill_gaps
- Each gap must be specific and actionable (not generic terms like "leadership")`,
      
      coaching_questions: [
        "What skills does your target role require that you don't currently have?",
        "What types of experience are you missing?",
        "Would you like me to suggest additional gaps based on your career transition?",
        "[If yes] Here are some potential gaps I've identified. Select the ones that resonate with you.",
        "What skills from your current role transfer to your target role?",
        "Of all the gaps we've identified, which ones are most critical to address first?",
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
          // AI-suggested comprehensive roadmap
          ai_suggested_roadmap: {
            type: "object",
            properties: {
              gap_cards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    gap_id: { type: "string" },
                    gap_name: { type: "string", minLength: 3, maxLength: 100 },
                    learning_actions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          action: { type: "string", minLength: 5, maxLength: 200 },
                          timeline: { type: "string", minLength: 3, maxLength: 50 },
                          resource: { type: "string", minLength: 10, maxLength: 150 }
                        },
                        required: ["id", "action", "timeline", "resource"],
                        additionalProperties: false
                      },
                      minItems: 1,
                      maxItems: 5
                    }
                  },
                  required: ["gap_id", "gap_name", "learning_actions"],
                  additionalProperties: false
                },
                minItems: 1,
                maxItems: 5
              },
              learning_actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    gap_id: { type: "string" },
                    gap_name: { type: "string", minLength: 3, maxLength: 100 },
                    action: { type: "string", minLength: 5, maxLength: 200 },
                    timeline: { type: "string", minLength: 3, maxLength: 50 },
                    resource: { type: "string", minLength: 10, maxLength: 150 }
                  },
                  required: ["id", "gap_id", "gap_name", "action", "timeline", "resource"],
                  additionalProperties: false
                },
                minItems: 2,
                maxItems: 10
              },
              networking_actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    action: { type: "string", minLength: 5, maxLength: 200 },
                    timeline: { type: "string", minLength: 3, maxLength: 50 }
                  },
                  required: ["id", "action", "timeline"],
                  additionalProperties: false
                },
                minItems: 3,
                maxItems: 5
              },
              experience_actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    action: { type: "string", minLength: 5, maxLength: 200 },
                    timeline: { type: "string", minLength: 3, maxLength: 50 }
                  },
                  required: ["id", "action", "timeline"],
                  additionalProperties: false
                },
                minItems: 3,
                maxItems: 5
              },
            milestone_3_months: { type: "string", minLength: 20, maxLength: 200 },
            milestone_6_months: { type: "string", minLength: 20, maxLength: 200 },
            current_gap_index: { type: "number", minimum: 0 },
            total_gaps: { type: "number", minimum: 1 }
          },
          required: [],
          additionalProperties: true
          },
          
          // User feedback for refinement (optional)
          roadmap_user_feedback: {
            type: "object",
            properties: {
              actions_too_ambitious: { type: "boolean" },
              actions_too_basic: { type: "boolean" },
              missing_areas: { type: "array", items: { type: "string" } },
              refinement_requested: { type: "boolean" }
            },
            additionalProperties: false
          },
          
          // Commitment score
          roadmap_score: { type: "number", minimum: 1, maximum: 10 },
          roadmap_completed: { type: "boolean" },
          
          coach_reflection: { type: "string", minLength: 20, maxLength: 500 }
        },
        required: ["coach_reflection"],
        additionalProperties: true
      },
      
      system_prompt: `Generate a comprehensive, AI-suggested roadmap for the user's career transition.

🚨 CRITICAL: Your response MUST include BOTH fields:

{
  "coach_reflection": "Let me create a comprehensive roadmap for your transition...",
  "ai_suggested_roadmap": {
    "learning_actions": [
      {"id": "learn1", "gap_id": "gap_0", "gap_name": "Financial modeling", "action": "Complete comprehensive financial modeling course", "timeline": "2 months", "resource": "Online course"},
      {"id": "learn2", "gap_id": "gap_0", "gap_name": "Financial modeling", "action": "Practice with real datasets", "timeline": "6 weeks", "resource": "Practice exercises"}
    ],
    "networking_actions": [
      {"id": "network1", "action": "Connect with 5 CFOs on LinkedIn", "timeline": "Next 2 weeks"},
      {"id": "network2", "action": "Join finance leaders community", "timeline": "This month"}
    ],
    "experience_actions": [
      {"id": "exp1", "action": "Lead quarterly budget planning", "timeline": "Next quarter"},
      {"id": "exp2", "action": "Shadow CFO in board meeting", "timeline": "Within 2 months"}
    ],
    "milestone_3_months": "Complete 2 courses and connect with 5 industry leaders",
    "milestone_6_months": "Lead first major budget cycle and apply for CFO roles"
  }
}

RULES:
- Use development_priorities from conversation history
- Create 2-3 learning actions for EACH priority gap
- Include realistic timelines (e.g., "2 months", "6 weeks")
- Specify resource types (e.g., "Online course", "Book", "Mentor")
- Make networking/experience actions specific to THEIR transition
- Make milestones measurable and achievable
- DO NOT suggest specific course names or platforms`,
      
      coaching_questions: [
        "Let me create a comprehensive roadmap for your transition. I'll suggest learning actions for each gap, networking opportunities, hands-on experiences, and milestones.",
        "[AI generates complete roadmap with all actions and milestones]",
        "[User curates selections via RoadmapBuilder UI]",
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
