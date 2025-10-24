/**
 * GROW Framework Report Generator
 * 
 * Generates goal-achievement focused reports with action tracking
 */

import type {
  SessionReportData,
  FormattedReport,
  ReportSection,
  ReflectionPayload,
  FrameworkReportGenerator
} from './types';
import { getString, getArray, formatDate, formatDuration } from './base';

/**
 * Extract goal information from GROW session
 */
function extractGoalInfo(reflections: Array<{ step: string; payload: ReflectionPayload }>): {
  goal?: string;
  why_now?: string;
  success_criteria?: string[];
  timeframe?: string;
} {
  const goalReflection = reflections.find(r => r.step === 'goal');
  if (goalReflection === undefined || goalReflection === null) {
    return {};
  }
  
  return {
    goal: getString(goalReflection.payload, 'goal'),
    why_now: getString(goalReflection.payload, 'why_now'),
    success_criteria: getArray<string>(goalReflection.payload, 'success_criteria'),
    timeframe: getString(goalReflection.payload, 'timeframe')
  };
}

/**
 * Extract current state from reality step
 */
function extractRealityInfo(reflections: Array<{ step: string; payload: ReflectionPayload }>): {
  current_state?: string;
  constraints?: string[];
  resources?: string[];
  risks?: string[];
} {
  const realityReflection = reflections.find(r => r.step === 'reality');
  if (realityReflection === undefined || realityReflection === null) {
    return {};
  }
  
  return {
    current_state: getString(realityReflection.payload, 'current_state'),
    constraints: getArray<string>(realityReflection.payload, 'constraints'),
    resources: getArray<string>(realityReflection.payload, 'resources'),
    risks: getArray<string>(realityReflection.payload, 'risks')
  };
}

/**
 * Extract options explored
 */
function extractOptionsInfo(reflections: Array<{ step: string; payload: ReflectionPayload }>): {
  options?: Array<{ label: string; pros?: string[]; cons?: string[] }>;
} {
  const optionsReflection = reflections.find(r => r.step === 'options');
  if (optionsReflection === undefined || optionsReflection === null) {
    return {};
  }
  
  const options = optionsReflection.payload['options'];
  return {
    options: Array.isArray(options) ? options as Array<{ label: string; pros?: string[]; cons?: string[] }> : undefined
  };
}

/**
 * Extract action plan from will step
 */
function extractActionPlan(reflections: Array<{ step: string; payload: ReflectionPayload }>): {
  chosen_option?: string;
  actions?: Array<{ title: string; owner?: string; due_days?: number }>;
  action_plan_timeframe?: string;
} {
  const willReflection = reflections.find(r => r.step === 'will');
  if (willReflection === undefined || willReflection === null) {
    return {};
  }
  
  const actions = willReflection.payload['actions'];
  return {
    chosen_option: getString(willReflection.payload, 'chosen_option'),
    actions: Array.isArray(actions) ? actions as Array<{ title: string; owner?: string; due_days?: number }> : undefined,
    action_plan_timeframe: getString(willReflection.payload, 'action_plan_timeframe')
  };
}

/**
 * Extract review takeaways
 */
function extractReviewInfo(reflections: Array<{ step: string; payload: ReflectionPayload }>): {
  key_takeaways?: string;
  immediate_step?: string;
  summary?: string;
  ai_insights?: string;
  unexplored_options?: string[];
  identified_risks?: string[];
  potential_pitfalls?: string[];
} {
  const reviewReflection = reflections.find(r => r.step === 'review');
  if (reviewReflection === undefined || reviewReflection === null) {
    return {};
  }
  
  return {
    key_takeaways: getString(reviewReflection.payload, 'key_takeaways'),
    immediate_step: getString(reviewReflection.payload, 'immediate_step'),
    summary: getString(reviewReflection.payload, 'summary'),
    ai_insights: getString(reviewReflection.payload, 'ai_insights'),
    unexplored_options: getArray<string>(reviewReflection.payload, 'unexplored_options'),
    identified_risks: getArray<string>(reviewReflection.payload, 'identified_risks'),
    potential_pitfalls: getArray<string>(reviewReflection.payload, 'potential_pitfalls')
  };
}

/**
 * Generate GROW-specific report
 */
export function generateGrowReport(data: SessionReportData): FormattedReport {
  const sections: ReportSection[] = [];
  
  // Extract all data
  const goalInfo = extractGoalInfo(data.reflections);
  const realityInfo = extractRealityInfo(data.reflections);
  const optionsInfo = extractOptionsInfo(data.reflections);
  const actionPlan = extractActionPlan(data.reflections);
  const reviewInfo = extractReviewInfo(data.reflections);
  
  // Goal Section
  if (goalInfo.goal !== undefined) {
    const goalParts: string[] = [`🎯 YOUR GOAL:\n${goalInfo.goal}`];
    
    if (goalInfo.why_now !== undefined) {
      goalParts.push(`\n💭 WHY NOW:\n${goalInfo.why_now}`);
    }
    
    if (goalInfo.success_criteria !== undefined && goalInfo.success_criteria.length > 0) {
      goalParts.push(`\n✅ SUCCESS CRITERIA:\n${goalInfo.success_criteria.map(c => `• ${c}`).join('\n')}`);
    }
    
    if (goalInfo.timeframe !== undefined) {
      goalParts.push(`\n⏰ TIMEFRAME: ${goalInfo.timeframe}`);
    }
    
    sections.push({
      heading: '🎯 YOUR GOAL',
      content: goalParts.join('\n'),
      type: 'text'
    });
  }
  
  // Reality Section
  if (realityInfo.current_state !== undefined) {
    const realityParts: string[] = [`📍 CURRENT STATE:\n${realityInfo.current_state}`];
    
    if (realityInfo.constraints !== undefined && realityInfo.constraints.length > 0) {
      realityParts.push(`\n🚧 CONSTRAINTS:\n${realityInfo.constraints.map(c => `• ${c}`).join('\n')}`);
    }
    
    if (realityInfo.resources !== undefined && realityInfo.resources.length > 0) {
      realityParts.push(`\n💪 RESOURCES:\n${realityInfo.resources.map(r => `• ${r}`).join('\n')}`);
    }
    
    if (realityInfo.risks !== undefined && realityInfo.risks.length > 0) {
      realityParts.push(`\n⚠️ RISKS:\n${realityInfo.risks.map(r => `• ${r}`).join('\n')}`);
    }
    
    sections.push({
      heading: '📍 REALITY CHECK',
      content: realityParts.join('\n'),
      type: 'text'
    });
  }
  
  // Options Section
  if (optionsInfo.options !== undefined && optionsInfo.options.length > 0) {
    const optionsParts: string[] = ['💡 OPTIONS EXPLORED:'];
    
    for (const option of optionsInfo.options) {
      optionsParts.push(`\n\n${option.label}`);
      if (option.pros !== undefined && option.pros.length > 0) {
        optionsParts.push(`  ✅ Pros: ${option.pros.join(', ')}`);
      }
      if (option.cons !== undefined && option.cons.length > 0) {
        optionsParts.push(`  ⚠️  Cons: ${option.cons.join(', ')}`);
      }
    }
    
    sections.push({
      heading: '💡 OPTIONS EXPLORED',
      content: optionsParts.join('\n'),
      type: 'text'
    });
  }
  
  // Action Plan Section
  if (actionPlan.chosen_option !== undefined) {
    const actionParts: string[] = [`🎬 CHOSEN PATH:\n${actionPlan.chosen_option}`];
    
    if (actionPlan.actions !== undefined && actionPlan.actions.length > 0) {
      actionParts.push(`\n\n📋 ACTION PLAN:`);
      for (let i = 0; i < actionPlan.actions.length; i++) {
        const action = actionPlan.actions[i];
        if (action !== undefined) {
          let actionLine = `${i + 1}. ${action.title}`;
          if (action.owner !== undefined) {
            actionLine += ` (Owner: ${action.owner})`;
          }
          if (action.due_days !== undefined) {
            actionLine += ` [Due: ${action.due_days} days]`;
          }
          actionParts.push(actionLine);
        }
      }
    }
    
    if (actionPlan.action_plan_timeframe !== undefined) {
      actionParts.push(`\n⏰ TIMEFRAME: ${actionPlan.action_plan_timeframe}`);
    }
    
    sections.push({
      heading: '🎬 YOUR ACTION PLAN',
      content: actionParts.join('\n'),
      type: 'actions',
      data: actionPlan
    });
  }
  
  // Review Section
  if (reviewInfo.key_takeaways !== undefined || reviewInfo.immediate_step !== undefined) {
    const reviewParts: string[] = [];
    
    if (reviewInfo.key_takeaways !== undefined) {
      reviewParts.push(`💡 KEY TAKEAWAYS:\n${reviewInfo.key_takeaways}`);
    }
    
    if (reviewInfo.immediate_step !== undefined) {
      reviewParts.push(`\n🚀 IMMEDIATE NEXT STEP:\n${reviewInfo.immediate_step}`);
    }
    
    sections.push({
      heading: '💡 SESSION REVIEW',
      content: reviewParts.join('\n'),
      type: 'text'
    });
  }
  
  // AI Insights Section
  if (reviewInfo.ai_insights !== undefined) {
    const insightsParts: string[] = [reviewInfo.ai_insights];
    
    if (reviewInfo.unexplored_options !== undefined && reviewInfo.unexplored_options.length > 0) {
      insightsParts.push(`\n\n🔍 UNEXPLORED OPTIONS:\n${reviewInfo.unexplored_options.map(o => `• ${o}`).join('\n')}`);
    }
    
    if (reviewInfo.identified_risks !== undefined && reviewInfo.identified_risks.length > 0) {
      insightsParts.push(`\n\n⚠️ IDENTIFIED RISKS:\n${reviewInfo.identified_risks.map(r => `• ${r}`).join('\n')}`);
    }
    
    if (reviewInfo.potential_pitfalls !== undefined && reviewInfo.potential_pitfalls.length > 0) {
      insightsParts.push(`\n\n🚨 POTENTIAL PITFALLS:\n${reviewInfo.potential_pitfalls.map(p => `• ${p}`).join('\n')}`);
    }
    
    sections.push({
      heading: '🤖 AI COACH INSIGHTS',
      content: insightsParts.join('\n'),
      type: 'insights'
    });
  }
  
  // Session metadata
  const duration = formatDuration(data.duration_minutes);
  const completedAt = formatDate(data.completed_at);
  
  sections.push({
    heading: '📊 SESSION INFO',
    content: `Duration: ${duration}\nCompleted: ${completedAt}`,
    type: 'text'
  });
  
  // Generate summary
  let summary = 'Goal achievement session completed';
  if (goalInfo.goal !== undefined) {
    summary = `Goal: ${goalInfo.goal.substring(0, 60)}${goalInfo.goal.length > 60 ? '...' : ''}`;
  }
  
  return {
    title: 'GROW Session Report',
    summary,
    sections
  };
}

/**
 * GROW Report Generator Class
 * Implements FrameworkReportGenerator interface
 */
export class GROWReportGenerator implements FrameworkReportGenerator {
  generateReport(data: SessionReportData): FormattedReport {
    return generateGrowReport(data);
  }
}

// Export singleton instance
export const growReportGenerator = new GROWReportGenerator();

