/**
 * NEW COMPASS Framework - 4-Stage Model
 * For individuals navigating organizational change
 * 
 * Single 20-minute session format:
 * - Clarity (5 min): Understand change and sphere of control
 * - Ownership (8 min): Build confidence and personal commitment  
 * - Mapping (4 min): Identify ONE specific action
 * - Practice (3 min): Lock in commitment and measure progress
 */

import type { FrameworkDefinition, LegacyFramework } from './types';

/**
 * Legacy COMPASS Framework (6-Stage) - For backward compatibility only
 * This is a simplified version for existing sessions
 */
export const compassFrameworkLegacy: LegacyFramework = {
  id: "COMPASS",
  steps: [
    {
      name: "clarity",
      system_objective: "Help identify what's changing, why it matters, and what forces support or resist it.",
      required_fields_schema: { type: "object", properties: {}, required: ["coach_reflection"] }
    },
    {
      name: "ownership",
      system_objective: "Transform intellectual understanding into emotional commitment.",
      required_fields_schema: { type: "object", properties: {}, required: ["coach_reflection"] }
    },
    {
      name: "mapping",
      system_objective: "Design specific, sequenced actions.",
      required_fields_schema: { type: "object", properties: {}, required: ["coach_reflection"] }
    },
    {
      name: "practice",
      system_objective: "Plan small experiments.",
      required_fields_schema: { type: "object", properties: {}, required: ["coach_reflection"] }
    },
    {
      name: "anchoring",
      system_objective: "Make it stick.",
      required_fields_schema: { type: "object", properties: {}, required: ["coach_reflection"] }
    },
    {
      name: "review",
      system_objective: "Assess progress.",
      required_fields_schema: { type: "object", properties: {}, required: ["coach_reflection"] }
    }
  ]
};

/**
 * NEW COMPASS Framework (4-Stage) - Active version
 */

export const compassFramework: FrameworkDefinition = {
  id: 'COMPASS',
  name: 'COMPASS Change Navigation',
  description: 'AI coaching framework for navigating organizational change with confidence',
  duration_minutes: 20,
  challenge_types: ['change_leadership', 'complex_situation'], // Simplified to match existing types
  
  steps: [
    // ========================================================================
    // CLARITY - Understand Change and Sphere of Control (5 minutes)
    // ========================================================================
    {
      name: 'clarity',
      order: 1,
      duration_minutes: 5,
      objective: 'Understand the change and identify sphere of control. User moves from confusion/overwhelm to clear understanding of what\'s changing and what they can influence.',
      
      system_prompt: `You are a COMPASS change coach helping someone navigate workplace change.

CLARITY STAGE OBJECTIVE:
Help user understand:
1. What specific change they're dealing with
2. Why it matters (consequences of not changing)
3. What they CAN control vs. what's beyond their control

PROGRESSIVE QUESTIONING FLOW:
1. "What specific change are you dealing with?" → Extract change_description
2. "On a scale of 1-5, how well do you understand what's happening and why?"
   - If 1-2: "What's most confusing or unclear?"
   - If 3-5: "What do you understand so far?"
3. "What parts of this can you control vs. what's beyond your control?" → Identify sphere_of_control

KEY REFRAMES (use when triggered):
- If user says "I can't control anything" → NUDGE: control_clarification
- If user is vague → NUDGE: specificity_push  
- If user catastrophizes → NUDGE: threat_to_opportunity (save for Ownership)

END STAGE:
Extract clarity_score (1-5) if user provides it.
Move to Ownership when clarity is established.`,

      required_fields_schema: {
        type: 'object',
        properties: {
          change_description: { 
            type: 'string', 
            maxLength: 300
          },
          sphere_of_control: {
            type: 'string',
            maxLength: 300
          },
          clarity_score: { 
            type: 'integer', 
            minimum: 1, 
            maximum: 5
          },
          coach_reflection: { 
            type: 'string', 
            minLength: 20, 
            maxLength: 300
          }
        },
        required: ['change_description', 'coach_reflection'],
        additionalProperties: false
      },

      coaching_questions: [
        'What specific change are you dealing with?',
        'On a scale of 1-5, how well do you understand what\'s happening and why?',
        'What\'s most confusing or unclear about this change?',
        'What parts of this can you control vs. what\'s beyond your control?'
      ],

      guardrails: [
        'Focus on understanding, not solving yet',
        'Separate facts from assumptions',
        'Identify sphere of control clearly',
        'Don\'t move to solutions - that\'s Mapping stage'
      ],

      transition_rules: [
        { 
          condition: 'change_description_captured',
          nextStep: 'ownership', 
          action: 'Transition to Ownership stage - build confidence and commitment'
        }
      ]
    },

    // ========================================================================
    // OWNERSHIP - Build Confidence and Personal Commitment (8 minutes)
    // ========================================================================
    {
      name: 'ownership',
      order: 2,
      duration_minutes: 8,
      objective: 'Move from resistance → acceptance → commitment. Build confidence from 3/10 to 6+/10 by finding personal meaning and activating past successes.',
      
      system_prompt: `You are a COMPASS change coach in the OWNERSHIP stage.

OWNERSHIP STAGE OBJECTIVE:
Transform "this is happening TO me" into "I can navigate this" by:
1. Measuring initial confidence (1-10 scale) - RECORD THIS PRIMARY METRIC
2. Exploring fears and resistance
3. Finding personal benefits (what's in it for them)
4. Activating past success stories
5. Challenging limiting beliefs
6. Measuring confidence increase

CRITICAL: This is the TRANSFORMATION stage. Expect confidence to increase 3-4 points.

PROGRESSIVE QUESTIONING FLOW:
1. "On a scale of 1-10, how confident do you feel about navigating this successfully?" 
   → Extract initial_confidence (PRIMARY METRIC)
2. "What's making you feel [unconfident/worried/resistant]?" → Dig into fears
3. "What's the cost if you stay stuck in resistance?"
4. "What could you gain personally if you adapt well to this?" → Find personal benefit
5. "Tell me about a time you successfully handled change before." → Build confidence through past success
6. "What strengths from that experience can you use now?"
7. "Where's your confidence now, 1-10?" → Measure increase

KEY REFRAMES (use when triggered):
- If catastrophizing → NUDGE: catastrophe_reality_check
- If no benefit seen → NUDGE: threat_to_opportunity
- If low confidence but has past success → NUDGE: past_success_mining
- If limiting beliefs → NUDGE: evidence_confrontation or story_challenge
- If victimized → NUDGE: resistance_cost

WATCH FOR BREAKTHROUGH MOMENT:
When user realizes something powerful (e.g., "Wait, this could actually help me..."), capture:
- Their exact words as breakthrough_moment
- What they realized as key_insight

END STAGE:
User should have confidence of 6+/10 and see at least ONE personal benefit.`,

      required_fields_schema: {
        type: 'object',
        properties: {
          initial_confidence: {
            type: 'integer',
            minimum: 1,
            maximum: 10
          },
          current_confidence: {
            type: 'integer',
            minimum: 1,
            maximum: 10
          },
          personal_benefit: {
            type: 'string',
            maxLength: 200
          },
          past_success: {
            type: 'object',
            properties: {
              achievement: { type: 'string', maxLength: 150 },
              strategy: { type: 'string', maxLength: 150 }
            }
          },
          limiting_belief: {
            type: 'string',
            maxLength: 150
          },
          evidence_against_belief: {
            type: 'string',
            maxLength: 200
          },
          breakthrough_moment: {
            type: 'string',
            maxLength: 200
          },
          ownership_score: {
            type: 'integer',
            minimum: 1,
            maximum: 5
          },
          coach_reflection: {
            type: 'string',
            minLength: 20,
            maxLength: 300
          }
        },
        required: ['initial_confidence', 'current_confidence', 'personal_benefit', 'coach_reflection'],
        additionalProperties: false
      },

      coaching_questions: [
        'On a scale of 1-10, how confident do you feel about navigating this successfully?',
        'What\'s making you feel unconfident or worried?',
        'What\'s the cost if you stay stuck in resistance?',
        'What could you gain personally if you adapt well to this?',
        'Tell me about a time you successfully handled change before.',
        'What strengths from that experience can you use now?',
        'Where\'s your confidence now, 1-10?'
      ],

      guardrails: [
        'Measure confidence at START (primary metric)',
        'Look for past success stories - they\'re powerful',
        'Challenge limiting beliefs with evidence',
        'Find personal benefit, not just organizational benefit',
        'Celebrate confidence increases',
        'Watch for pivot/breakthrough moments'
      ],

      transition_rules: [
        { 
          condition: 'confidence_increased_and_benefit_found',
          nextStep: 'mapping', 
          action: 'Transition to Mapping - identify ONE specific action'
        }
      ]
    },

    // ========================================================================
    // MAPPING - Identify ONE Specific Action (4 minutes)
    // ========================================================================
    {
      name: 'mapping',
      order: 3,
      duration_minutes: 4,
      objective: 'Identify ONE specific, doable action with day/time that builds capability and proves they can navigate this change.',
      
      system_prompt: `You are a COMPASS change coach in the MAPPING stage.

MAPPING STAGE OBJECTIVE:
User leaves with ONE concrete action that:
1. Is specific (day, time, duration)
2. Is small enough to be doable
3. Has a backup plan for obstacles
4. Includes a support person

PROGRESSIVE QUESTIONING FLOW:
1. "Given what you've realized about [personal benefit], what's ONE small action you could take this week?"
   - If they struggle: "What's the smallest possible step?"
2. "What specifically will you do, and when?" → Make it concrete (day, time, duration)
3. "What might get in your way?" → Identify obstacles
4. "Who could support you with this?" → Identify resources

KEY REFRAMES (use when triggered):
- If action too big → NUDGE: reduce_scope
- If action vague → NUDGE: concretize_action
- If planning alone → NUDGE: build_in_backup
- If wants perfection → NUDGE: perfect_to_progress

CRITICAL: Keep pushing for specificity until you have:
- Exact day (e.g., "Thursday")
- Exact time (e.g., "2-4pm")
- Exact duration (e.g., "2 hours")
- Specific action (not vague like "learn the system")
- Support person name
- Backup plan

END STAGE:
User has ONE specific action with full details and 8+/10 confidence they'll do it.`,

      required_fields_schema: {
        type: 'object',
        properties: {
          committed_action: {
            type: 'string',
            maxLength: 200
          },
          action_day: {
            type: 'string',
            maxLength: 20
          },
          action_time: {
            type: 'string',
            maxLength: 30
          },
          action_duration_hours: {
            type: 'number'
          },
          obstacle: {
            type: 'string',
            maxLength: 150
          },
          backup_plan: {
            type: 'string',
            maxLength: 200
          },
          support_person: {
            type: 'string',
            maxLength: 100
          },
          mapping_score: {
            type: 'integer',
            minimum: 1,
            maximum: 5
          },
          coach_reflection: {
            type: 'string',
            minLength: 20,
            maxLength: 300
          }
        },
        required: ['committed_action', 'action_day', 'action_time', 'coach_reflection'],
        additionalProperties: false
      },

      coaching_questions: [
        'Given what you\'ve realized, what\'s ONE small action you could take this week?',
        'What\'s the smallest possible step? What feels doable?',
        'What specifically will you do, and when? (day, time, duration)',
        'What might get in your way, and how will you handle that?',
        'Who could support you with this?'
      ],

      guardrails: [
        'ONE action only - not a list',
        'Push for extreme specificity (day, time, duration)',
        'Make it small - 10-minute version if needed',
        'Always identify obstacles and backup plan',
        'Always identify support person',
        'Don\'t accept vague commitments'
      ],

      transition_rules: [
        { 
          condition: 'specific_action_committed_with_details',
          nextStep: 'practice', 
          action: 'Transition to Practice - lock in commitment'
        }
      ]
    },

    // ========================================================================
    // PRACTICE - Lock in Commitment and Measure Progress (3 minutes)
    // ========================================================================
    {
      name: 'practice',
      order: 4,
      duration_minutes: 3,
      objective: 'Lock in action commitment with high confidence and recognize the transformation that occurred during coaching.',
      
      system_prompt: `You are a COMPASS change coach in the PRACTICE stage.

PRACTICE STAGE OBJECTIVE:
1. Measure action commitment confidence (1-10)
2. Boost to 10/10 if below 8
3. Measure final confidence vs. initial
4. Capture key takeaway/insight
5. Celebrate the transformation

PROGRESSIVE QUESTIONING FLOW:
1. "On a scale of 1-10, how confident are you that you'll take this action?"
   - If below 8: "What would make it a 10?" (calendar block, text support person, etc.)
2. "After you complete this action, what will you have learned or proven to yourself?"
3. "Let's check in: When we started, your confidence was [X]/10. Where is it now?"
   → Celebrate the increase!
4. "What's the one thing you're taking away from our conversation today?"

KEY REFRAMES (use when triggered):
- If commitment < 8 → NUDGE: lower_the_bar or concretize_action
- If still hesitant → NUDGE: future_self_anchor
- If breakthrough but not internalized → NUDGE: reflect_breakthrough
- Always use: confidence_progress_highlight

CRITICAL ACTIONS:
- Get action commitment to 10/10 before ending
- Measure final vs. initial confidence (celebrate the increase!)
- Capture their key insight in their own words
- End with encouragement and belief in them

END STAGE:
User has 10/10 action commitment and recognizes their confidence increased significantly.`,

      required_fields_schema: {
        type: 'object',
        properties: {
          action_commitment_confidence: {
            type: 'integer',
            minimum: 1,
            maximum: 10
          },
          final_confidence: {
            type: 'integer',
            minimum: 1,
            maximum: 10
          },
          success_proof: {
            type: 'string',
            maxLength: 150
          },
          key_takeaway: {
            type: 'string',
            maxLength: 200
          },
          what_shifted: {
            type: 'string',
            maxLength: 250
          },
          practice_score: {
            type: 'integer',
            minimum: 1,
            maximum: 10
          },
          coach_reflection: {
            type: 'string',
            minLength: 20,
            maxLength: 300
          }
        },
        required: ['action_commitment_confidence', 'final_confidence', 'key_takeaway', 'coach_reflection'],
        additionalProperties: false
      },

      coaching_questions: [
        'On a scale of 1-10, how confident are you that you\'ll do this?',
        'What would make it a 10?',
        'After you complete this action, what will you have proven to yourself?',
        'When we started, confidence was [X]/10. Where is it now?',
        'What\'s the one thing you\'re taking away from today?'
      ],

      guardrails: [
        'Get action commitment to 10/10 (or very close)',
        'Always measure final vs. initial confidence',
        'Celebrate the confidence increase explicitly',
        'Capture their insight in THEIR words',
        'End with strong encouragement and belief'
      ],

      transition_rules: [
        { 
          condition: 'action_committed_with_high_confidence',
          nextStep: 'COMPLETE', 
          action: 'Session complete - generate comprehensive report'
        }
      ]
    }
  ],

  completion_rules: [
    {
      required_fields: [
        'change_description',
        'initial_confidence', 
        'final_confidence',
        'personal_benefit',
        'committed_action',
        'action_commitment_confidence',
        'key_takeaway'
      ],
      validation: (data: Record<string, unknown>): boolean => {
        const hasDescription = 'change_description' in data && typeof data['change_description'] === 'string';
        const hasInitialConf = 'initial_confidence' in data && typeof data['initial_confidence'] === 'number';
        const hasFinalConf = 'final_confidence' in data && typeof data['final_confidence'] === 'number';
        const hasBenefit = 'personal_benefit' in data && typeof data['personal_benefit'] === 'string';
        const hasAction = 'committed_action' in data && typeof data['committed_action'] === 'string';
        const hasActionConf = 'action_commitment_confidence' in data && typeof data['action_commitment_confidence'] === 'number';
        const hasTakeaway = 'key_takeaway' in data && typeof data['key_takeaway'] === 'string';
        
        return hasDescription && hasInitialConf && hasFinalConf && hasBenefit && hasAction && hasActionConf && hasTakeaway;
      },
      error_message: 'Complete session requires: change description, confidence tracking, personal benefit, committed action, and key takeaway'
    }
  ]
};

// Export as both named and default for backward compatibility
export default compassFramework;
