/**
 * AI Nudge Library for COMPASS Framework
 * 18 nudge types with templates and trigger detection
 */

import type { NudgeType } from './types';

// Re-export for convenience
export type { NudgeType } from './types';

/**
 * Nudge definition with template and triggers
 */
export interface NudgeDefinition {
  type: NudgeType;
  category: string;
  name: string;
  description: string;
  useWhen: string;
  template: string;
  triggers: string[];
  stage: ('clarity' | 'ownership' | 'mapping' | 'practice')[];
}

/**
 * Complete library of 18 AI nudges organized by category
 */
export const NUDGE_LIBRARY: Record<NudgeType, NudgeDefinition> = {
  // ============================================================================
  // Category 1: Control & Agency
  // ============================================================================
  
  control_clarification: {
    type: 'control_clarification',
    category: 'Control & Agency',
    name: 'Control Clarification',
    description: 'Help user see what they CAN control vs. external factors',
    useWhen: 'User feels helpless or says "I can\'t control anything"',
    template: 'You can\'t control [external change], but you CAN control [your response/learning/attitude/requests]. That\'s more power than it feels like.',
    triggers: [
      'i can\'t control',
      'nothing i can do',
      'helpless',
      'powerless',
      'out of my hands',
      'no control',
      'can\'t do anything'
    ],
    stage: ['clarity']
  },

  sphere_of_influence: {
    type: 'sphere_of_influence',
    category: 'Control & Agency',
    name: 'Sphere of Influence',
    description: 'Focus user on their circle of control',
    useWhen: 'User overwhelmed by big picture',
    template: 'Let\'s focus on your sphere of control. What\'s one thing completely within your control right now?',
    triggers: [
      'overwhelming',
      'too much',
      'everything is',
      'all at once',
      'so many things'
    ],
    stage: ['clarity', 'mapping']
  },

  // ============================================================================
  // Category 2: Specificity & Clarity
  // ============================================================================

  specificity_push: {
    type: 'specificity_push',
    category: 'Specificity & Clarity',
    name: 'Specificity Push',
    description: 'Push for concrete details instead of vague language',
    useWhen: 'User is vague about the change',
    template: 'Let\'s get specific. What exactly [will you be doing differently/is changing/needs to happen]?',
    triggers: [
      'everything',
      'things',
      'stuff',
      'a lot',
      'somehow',
      'eventually'
    ],
    stage: ['clarity', 'mapping']
  },

  concretize_action: {
    type: 'concretize_action',
    category: 'Specificity & Clarity',
    name: 'Concretize Action',
    description: 'Make vague actions specific with day/time',
    useWhen: 'User commits to vague action',
    template: 'Let\'s make this concrete: Which day? What time? What exactly will you do?',
    triggers: [
      'i\'ll try',
      'soon',
      'later',
      'at some point',
      'when i can',
      'eventually'
    ],
    stage: ['mapping', 'practice']
  },

  reduce_scope: {
    type: 'reduce_scope',
    category: 'Specificity & Clarity',
    name: 'Reduce Scope',
    description: 'Help user break down action into smaller steps',
    useWhen: 'User proposes action that\'s too large',
    template: 'That\'s great long-term. What\'s the 10-minute version you could do THIS WEEK?',
    triggers: [
      'i need to learn',
      'master',
      'completely',
      'fully',
      'everything about'
    ],
    stage: ['mapping', 'practice']
  },

  // ============================================================================
  // Category 3: Confidence Building
  // ============================================================================

  past_success_mining: {
    type: 'past_success_mining',
    category: 'Confidence Building',
    name: 'Past Success Mining',
    description: 'Activate user\'s past success stories',
    useWhen: 'User has low confidence but relevant history',
    template: 'You said you [past success]. You\'ve done hard things before. What makes this different?',
    triggers: [
      'i don\'t think i can',
      'not confident',
      'i\'ll fail',
      'can\'t do this',
      'not capable'
    ],
    stage: ['ownership']
  },

  evidence_confrontation: {
    type: 'evidence_confrontation',
    category: 'Confidence Building',
    name: 'Evidence Confrontation',
    description: 'Point out contradiction between belief and evidence',
    useWhen: 'User contradicts their own evidence',
    template: 'You called yourself [limiting belief], but you just told me you [contradicting evidence]. What if that story isn\'t accurate?',
    triggers: [
      'i\'m not good at',
      'i\'m bad at',
      'i can\'t',
      'i\'m too',
      'i\'m not smart'
    ],
    stage: ['ownership']
  },

  strength_identification: {
    type: 'strength_identification',
    category: 'Confidence Building',
    name: 'Strength Identification',
    description: 'Help user see their existing strengths',
    useWhen: 'User can\'t see their capabilities',
    template: 'What strengths did you use when you [past success]? Could those help here?',
    triggers: [
      'i don\'t have',
      'i lack',
      'i\'m not skilled',
      'no strengths'
    ],
    stage: ['ownership', 'mapping']
  },

  // ============================================================================
  // Category 4: Reframing
  // ============================================================================

  threat_to_opportunity: {
    type: 'threat_to_opportunity',
    category: 'Reframing',
    name: 'Threat to Opportunity',
    description: 'Reframe change from threat to opportunity',
    useWhen: 'User only sees negatives',
    template: 'What if this isn\'t happening TO you, but FOR you? What might you gain?',
    triggers: [
      'happening to me',
      'doing this to',
      'forcing me',
      'stuck with',
      'unfair'
    ],
    stage: ['ownership']
  },

  resistance_cost: {
    type: 'resistance_cost',
    category: 'Reframing',
    name: 'Resistance Cost',
    description: 'Help user see cost of resistance',
    useWhen: 'User stuck in resistance',
    template: 'What\'s resistance costing you? Is fighting this using more energy than adapting?',
    triggers: [
      'i don\'t want to',
      'i refuse',
      'i won\'t',
      'not doing it',
      'hate this'
    ],
    stage: ['ownership']
  },

  story_challenge: {
    type: 'story_challenge',
    category: 'Reframing',
    name: 'Story Challenge',
    description: 'Challenge limiting narratives',
    useWhen: 'User has limiting beliefs',
    template: 'What story are you telling yourself? Is that story helping you or hurting you?',
    triggers: [
      'i always',
      'i never',
      'that\'s just who i am',
      'i\'m just not',
      'that\'s how i am'
    ],
    stage: ['ownership']
  },

  catastrophe_reality_check: {
    type: 'catastrophe_reality_check',
    category: 'Reframing',
    name: 'Catastrophe Reality Check',
    description: 'Ground catastrophic thinking in reality',
    useWhen: 'User catastrophizing',
    template: 'What\'s the worst that could REALISTICALLY happen? And if that happened, how would you handle it?',
    triggers: [
      'i\'ll fail',
      'disaster',
      'ruin everything',
      'terrible',
      'everyone will judge',
      'humiliated'
    ],
    stage: ['ownership', 'mapping']
  },

  // ============================================================================
  // Category 5: Action Support
  // ============================================================================

  build_in_backup: {
    type: 'build_in_backup',
    category: 'Action Support',
    name: 'Build in Backup',
    description: 'Add support person/backup plan',
    useWhen: 'User planning to struggle alone',
    template: 'Who could help if you get stuck? Let\'s build in a backup plan.',
    triggers: [
      'i\'ll figure it out',
      'on my own',
      'by myself',
      'don\'t want to bother',
      'handle it alone'
    ],
    stage: ['mapping']
  },

  perfect_to_progress: {
    type: 'perfect_to_progress',
    category: 'Action Support',
    name: 'Perfect to Progress',
    description: 'Shift from perfection to learning mindset',
    useWhen: 'Perfectionism blocking action',
    template: 'This is about LEARNING, not perfection. What would you learn even if it goes imperfectly?',
    triggers: [
      'get it right',
      'do it perfectly',
      'can\'t mess up',
      'has to be perfect',
      'look stupid'
    ],
    stage: ['mapping', 'practice']
  },

  lower_the_bar: {
    type: 'lower_the_bar',
    category: 'Action Support',
    name: 'Lower the Bar',
    description: 'Reduce action threshold to increase commitment',
    useWhen: 'User hesitant despite good plan',
    template: 'You don\'t need to feel ready. You just need to take one step. Can you commit to trying?',
    triggers: [
      'not ready',
      'don\'t feel ready',
      'need more time',
      'when i\'m ready',
      'not sure i can'
    ],
    stage: ['mapping', 'practice']
  },

  future_self_anchor: {
    type: 'future_self_anchor',
    category: 'Action Support',
    name: 'Future Self Anchor',
    description: 'Anchor user to post-action success state',
    useWhen: 'Locking in commitment',
    template: 'When you complete this [day], how will you feel? What will you have proven?',
    triggers: [
      'i\'ll try',
      'i guess i can',
      'okay',
      'fine',
      'i\'ll do it'
    ],
    stage: ['practice']
  },

  // ============================================================================
  // Category 6: Insight Amplification
  // ============================================================================

  reflect_breakthrough: {
    type: 'reflect_breakthrough',
    category: 'Insight Amplification',
    name: 'Reflect Breakthrough',
    description: 'Mirror back user\'s insight to amplify it',
    useWhen: 'User has insight but hasn\'t fully internalized it',
    template: 'You just said something powerful: "[their words]". How does that change everything?',
    triggers: [
      'actually',
      'wait',
      'maybe',
      'i guess',
      'i didn\'t think about'
    ],
    stage: ['ownership', 'mapping', 'practice']
  },

  confidence_progress_highlight: {
    type: 'confidence_progress_highlight',
    category: 'Insight Amplification',
    name: 'Confidence Progress Highlight',
    description: 'Highlight confidence increase to reinforce progress',
    useWhen: 'Measuring confidence change',
    template: 'Your confidence went from [X] to [Y]. What shifted? What do you see differently now?',
    triggers: [
      // Auto-trigger when confidence increases by 2+ points
    ],
    stage: ['ownership', 'practice']
  }
};

/**
 * Detect which nudges might be appropriate for user message
 */
export function detectApplicableNudges(
  message: string,
  stage: 'clarity' | 'ownership' | 'mapping' | 'practice'
): NudgeDefinition[] {
  const lower = message.toLowerCase();
  const applicable: NudgeDefinition[] = [];
  
  for (const nudge of Object.values(NUDGE_LIBRARY)) {
    // Check if nudge is applicable to current stage
    if (!nudge.stage.includes(stage)) {
      continue;
    }
    
    // Check if any trigger words are present
    for (const trigger of nudge.triggers) {
      if (lower.includes(trigger)) {
        applicable.push(nudge);
        break;
      }
    }
  }
  
  return applicable;
}

/**
 * Get nudge template by type
 */
export function getNudgeTemplate(type: NudgeType): string {
  return NUDGE_LIBRARY[type].template;
}

/**
 * Get nudge guidance for AI coach
 */
export function getNudgeGuidance(type: NudgeType): string {
  const nudge = NUDGE_LIBRARY[type];
  return `**${nudge.name}** (${nudge.category})
  
Use when: ${nudge.useWhen}

Template: "${nudge.template}"

Description: ${nudge.description}`;
}

/**
 * Get all nudges for a specific stage
 */
export function getNudgesForStage(
  stage: 'clarity' | 'ownership' | 'mapping' | 'practice'
): NudgeDefinition[] {
  return Object.values(NUDGE_LIBRARY).filter(nudge => 
    nudge.stage.includes(stage)
  );
}

/**
 * Generate nudge prompt for AI coach based on context
 */
export function generateNudgePrompt(
  _stage: 'clarity' | 'ownership' | 'mapping' | 'practice',
  applicableNudges: NudgeType[]
): string {
  if (applicableNudges.length === 0) {
    return '';
  }
  
  const nudgeDescriptions = applicableNudges
    .slice(0, 3) // Limit to top 3 to avoid overwhelming the AI
    .map(type => {
      const nudge = NUDGE_LIBRARY[type];
      return `- **${nudge.name}**: ${nudge.template}`;
    })
    .join('\n');
  
  return `
⚡ **Suggested Coaching Nudges:**

The user's message suggests these nudges might be helpful:

${nudgeDescriptions}

Consider using one of these reframes or questions if it fits naturally in your coaching.`;
}

