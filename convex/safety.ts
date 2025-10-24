/**
 * Psychosocial Safety System for CoachFlux
 * 5-Level Safety Protocol with Geo-Specific Emergency Resources
 */

export interface EmergencyResource {
  country: string;
  countryCode: string;
  emergency: string;
  crisis: string;
  suicide: string;
  description: string;
}

/**
 * Geo-specific emergency numbers by country
 */
export const EMERGENCY_RESOURCES: Record<string, EmergencyResource> = {
  US: {
    country: 'United States',
    countryCode: 'US',
    emergency: '911',
    crisis: '988',
    suicide: '988',
    description: '988 - Suicide & Crisis Lifeline (24/7, phone/chat/text)'
  },
  CA: {
    country: 'Canada',
    countryCode: 'CA',
    emergency: '911',
    crisis: '988',
    suicide: '988',
    description: '988 - Suicide Crisis Helpline (24/7)'
  },
  UK: {
    country: 'United Kingdom',
    countryCode: 'UK',
    emergency: '999 or 112',
    crisis: '116 123',
    suicide: '116 123',
    description: '116 123 - Samaritans (24/7, free)'
  },
  AU: {
    country: 'Australia',
    countryCode: 'AU',
    emergency: '000',
    crisis: '13 11 14',
    suicide: '13 11 14',
    description: '13 11 14 - Lifeline Australia (24/7)'
  },
  NZ: {
    country: 'New Zealand',
    countryCode: 'NZ',
    emergency: '111',
    crisis: '1737',
    suicide: '0508 828 865',
    description: '1737 - Need to Talk? (24/7, free, text or call) | 0508 828 865 - Suicide Crisis Helpline'
  },
  IE: {
    country: 'Ireland',
    countryCode: 'IE',
    emergency: '112 or 999',
    crisis: '116 123',
    suicide: '116 123',
    description: '116 123 - Samaritans Ireland (24/7, free)'
  },
  DE: {
    country: 'Germany',
    countryCode: 'DE',
    emergency: '112',
    crisis: '0800 111 0 111',
    suicide: '0800 111 0 111',
    description: '0800 111 0 111 - Telefonseelsorge (24/7, free)'
  },
  FR: {
    country: 'France',
    countryCode: 'FR',
    emergency: '112',
    crisis: '3114',
    suicide: '3114',
    description: '3114 - Numéro national de prévention du suicide (24/7)'
  },
  ES: {
    country: 'Spain',
    countryCode: 'ES',
    emergency: '112',
    crisis: '024',
    suicide: '024',
    description: '024 - Línea de Atención a la Conducta Suicida (24/7)'
  },
  IT: {
    country: 'Italy',
    countryCode: 'IT',
    emergency: '112',
    crisis: '800 86 00 22',
    suicide: '800 86 00 22',
    description: '800 86 00 22 - Telefono Amico (Daily 10am-midnight)'
  },
  IN: {
    country: 'India',
    countryCode: 'IN',
    emergency: '112',
    crisis: '9152987821',
    suicide: '9152987821',
    description: '9152987821 - AASRA (24/7) | iCALL: 9152987821'
  },
  JP: {
    country: 'Japan',
    countryCode: 'JP',
    emergency: '110 (police) or 119 (medical)',
    crisis: '0120-783-556',
    suicide: '0120-783-556',
    description: '0120-783-556 - よりそいホットライン (24/7, free)'
  },
  SG: {
    country: 'Singapore',
    countryCode: 'SG',
    emergency: '999',
    crisis: '1-767',
    suicide: '1-767',
    description: '1-767 - Samaritans of Singapore (24/7)'
  },
  ZA: {
    country: 'South Africa',
    countryCode: 'ZA',
    emergency: '10111 or 112',
    crisis: '0800 567 567',
    suicide: '0800 567 567',
    description: '0800 567 567 - SADAG (8am-8pm, 7 days)'
  },
  BR: {
    country: 'Brazil',
    countryCode: 'BR',
    emergency: '190 (police) or 192 (medical)',
    crisis: '188',
    suicide: '188',
    description: '188 - CVV Centro de Valorização da Vida (24/7)'
  },
  MX: {
    country: 'Mexico',
    countryCode: 'MX',
    emergency: '911',
    crisis: '800 911 2000',
    suicide: '800 911 2000',
    description: '800 911 2000 - Línea de la Vida (24/7)'
  }
};

/**
 * Get emergency resources for user's country (defaults to US if unknown)
 */
export function getEmergencyResources(countryCode?: string): EmergencyResource {
  const code = (countryCode !== null && countryCode !== undefined && countryCode !== '') 
    ? countryCode.toUpperCase() 
    : 'US';
  const resource = EMERGENCY_RESOURCES[code];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return resource ?? EMERGENCY_RESOURCES['US']!; // US resources always exist as fallback
}

/**
 * Safety level classification
 */
export type SafetyLevel = 
  | 'safe'              // Normal coaching - no concerns
  | 'anxiety'           // Level 1: Manageable anxiety/stress
  | 'agitation'         // Level 2: Anger/frustration
  | 'redundancy'        // Level 3: Job loss fears
  | 'severe'            // Level 4: Severe dysfunction
  | 'crisis';           // Level 5: Immediate crisis (self-harm/suicide)

/**
 * Safety keywords for monitoring
 */
export const SAFETY_KEYWORDS: Record<SafetyLevel, string[]> = {
  safe: [],
  anxiety: [
    'anxious', 'anxiety', 'worried', 'stressed', 'overwhelming', 
    'nervous', 'scared', 'worried about', 'stress', 'overwhelm'
  ],
  agitation: [
    'angry', 'furious', 'pissed', 'rage', 'frustrated', 
    'so angry', 'really angry', 'bullshit', 'this is bullshit'
  ],
  redundancy: [
    'redundant', 'redundancy', 'fired', 'laid off', 'job loss', 
    'losing my job', 'lose my job', 'terminated', 'termination',
    'layoff', 'layoffs', 'getting fired', 'being fired'
  ],
  severe: [
    'panic attack', 'panic attacks', 'can\'t sleep', 'can\'t breathe', 
    'chest pain', 'drinking to cope', 'constant crying', 'can\'t function',
    'haven\'t slept', 'can\'t eat', 'can\'t get out of bed'
  ],
  crisis: [
    'suicide', 'suicidal', 'kill myself', 'self-harm', 'hurt myself', 
    'end it all', 'don\'t want to live', 'better off dead', 
    'no point living', 'want to die', 'wish I was dead',
    'everyone would be better off', 'end my life'
  ]
};

/**
 * Detect safety level from user message
 */
export function detectSafetyLevel(message: string): SafetyLevel {
  const lower = message.toLowerCase();
  
  // Check crisis first (highest priority)
  for (const keyword of SAFETY_KEYWORDS.crisis) {
    if (lower.includes(keyword)) {
      return 'crisis';
    }
  }
  
  // Check severe dysfunction
  for (const keyword of SAFETY_KEYWORDS.severe) {
    if (lower.includes(keyword)) {
      return 'severe';
    }
  }
  
  // Check redundancy
  for (const keyword of SAFETY_KEYWORDS.redundancy) {
    if (lower.includes(keyword)) {
      return 'redundancy';
    }
  }
  
  // Check agitation
  for (const keyword of SAFETY_KEYWORDS.agitation) {
    if (lower.includes(keyword)) {
      return 'agitation';
    }
  }
  
  // Check anxiety
  for (const keyword of SAFETY_KEYWORDS.anxiety) {
    if (lower.includes(keyword)) {
      return 'anxiety';
    }
  }
  
  return 'safe';
}

/**
 * Generate safety response based on level
 */
export function generateSafetyResponse(
  level: SafetyLevel, 
  countryCode?: string
): string | null {
  if (level === 'safe') {
    return null;
  }
  
  const resources = getEmergencyResources(countryCode);
  
  switch (level) {
    case 'anxiety':
      return `I hear that you're feeling anxious about this change - that's completely normal. Before we continue, would it help to take a moment to ground yourself?

Here are two quick breathing exercises:

**Box Breathing (2 minutes):**
- Breathe in for 4 counts
- Hold for 4 counts
- Breathe out for 4 counts
- Hold for 4 counts
- Repeat 4 times

**5-4-3-2-1 Grounding (2 minutes):**
- Name 5 things you can see
- Name 4 things you can touch
- Name 3 things you can hear
- Name 2 things you can smell
- Name 1 thing you can taste

Take a few minutes to try one of these, then come back when you're ready to continue. I'll be here.`;

    case 'agitation':
      return `I can hear you're really upset about this change. That's understandable - change can bring up strong emotions.

However, I want to make sure you get the right support. When emotions are running this high, it might help to talk with someone trained in handling workplace stress.

Your company likely has an Employee Assistance Program (EAP) that offers free, confidential counseling. This might be a good resource for processing these feelings.

Would you like to take some time to cool down and come back to this conversation later? I'm here when you're ready.`;

    case 'redundancy':
      return `Job security concerns are really stressful. Let me ask:

Has anyone officially told you that your job is at risk, or is this a fear you're having based on the change?

[Please let me know, and I'll provide appropriate guidance based on your situation]`;

    case 'severe':
      return `I'm concerned about what you're describing. These symptoms lasting this long suggest this is beyond normal change stress.

I'm a coaching tool, not a therapist, and I want to make sure you get the right help. You should speak with:

**Immediate Resources:**
- Your doctor/GP for medical assessment
- Your company's Employee Assistance Program (EAP) - free confidential counseling
- A mental health professional

**Find Help:**
- Emergency Medical: ${resources.emergency}
- Crisis Support: ${resources.crisis}
- ${resources.description}

These symptoms need professional attention. Please reach out to one of these resources today.

I'll be here when you're feeling better and ready to work on adapting to workplace change, but right now, please prioritize getting proper support.`;

    case 'crisis':
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆘 IMMEDIATE SUPPORT NEEDED

I'm very concerned about what you're sharing. This is beyond what coaching can help with, and I want you to get immediate support.

PLEASE CONTACT CRISIS SUPPORT NOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 **Call ${resources.crisis}** - ${resources.description}

💬 **Text:** Available in many regions

🚨 **If immediate danger:** Call ${resources.emergency}

🌍 **International:** findahelpline.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These services are free, confidential, and staffed by trained professionals who can help right now. Please reach out to them.

I care about your wellbeing, and you deserve professional support for what you're experiencing. Our coaching session will be here when you're ready, but right now, please contact crisis support.`;

    default:
      return null;
  }
}

/**
 * Session start disclaimer
 */
export function getSessionDisclaimer(countryCode?: string): string {
  const resources = getEmergencyResources(countryCode);
  
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ BEFORE WE BEGIN

CoachFlux helps you navigate workplace change through action planning and confidence building.

I AM NOT:
- A therapist or mental health counselor
- A crisis intervention service
- A substitute for medical advice
- HR or legal guidance

IF YOU'RE EXPERIENCING:
- Thoughts of self-harm or suicide → Call ${resources.crisis} immediately
- Severe anxiety, panic, or depression → Contact your doctor/EAP
- Workplace harassment or safety issues → Contact HR

For workplace change coaching, type 'CONTINUE' to begin.
For crisis support, type 'CRISIS' for immediate resources.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Should we stop the session based on safety level?
 */
export function shouldStopSession(level: SafetyLevel): boolean {
  return level === 'crisis' || level === 'severe';
}

/**
 * Safety check result
 */
export interface SafetyCheck {
  level: SafetyLevel;
  shouldStop: boolean;
  response: string | null;
  flagged: boolean;
  detected_keywords: string[];
}

/**
 * Perform complete safety check on user message
 */
export function performSafetyCheck(
  message: string,
  countryCode?: string
): SafetyCheck {
  const level = detectSafetyLevel(message);
  const shouldStop = shouldStopSession(level);
  const response = generateSafetyResponse(level, countryCode);
  const flagged = level !== 'safe';
  
  // Extract detected keywords
  const detected_keywords: string[] = [];
  const messageLower = message.toLowerCase();
  
  for (const [keyword, _safetyLevel] of Object.entries(SAFETY_KEYWORDS)) {
    if (messageLower.includes(keyword.toLowerCase())) {
      detected_keywords.push(keyword);
    }
  }
  
  return {
    level,
    shouldStop,
    response,
    flagged,
    detected_keywords
  };
}

