# CoachFlux Analytics & Tracking Plan

## Analytics Platform: PostHog

**Why PostHog:**
- Open source, privacy-friendly
- Self-hosted or cloud options
- Event tracking, session recording, feature flags
- A/B testing built-in
- GDPR compliant
- Generous free tier

**Alternatives:**
- Mixpanel (more expensive)
- Plausible (simpler, privacy-focused)
- Amplitude (enterprise-focused)

---

## Key Metrics Dashboard

### **North Star Metric**
**Weekly Active Coaching Sessions** - Users completing at least one full coaching session per week

### **Primary Metrics**

**Acquisition:**
- New user signups
- Traffic sources
- Landing page conversion rate
- Newsletter signups

**Activation:**
- First session completion rate
- Time to first session
- Onboarding completion rate

**Engagement:**
- Sessions per user per week
- Session completion rate
- Framework diversity
- Action items created

**Retention:**
- Day 7, 30, 90 retention
- Churn rate
- Session frequency

**Revenue:**
- Free to paid conversion
- MRR, ARR
- LTV, CAC
- Discount code usage

---

## Event Tracking Schema

### **User Events**

```typescript
// User Registration
posthog.capture('user_registered', {
  provider: 'email' | 'google' | 'linkedin',
  source: 'landing' | 'session_report' | 'newsletter',
  has_discount: boolean,
});

// User Login
posthog.capture('user_logged_in', {
  method: 'password' | 'magic_link' | 'oauth',
  device_type: 'desktop' | 'mobile' | 'tablet',
});

// Email Verification
posthog.capture('email_verified', {
  time_to_verify: number, // seconds
});
```

### **Session Events**

```typescript
// Session Started
posthog.capture('session_started', {
  framework: string,
  is_anonymous: boolean,
  source: 'onboarding' | 'dashboard' | 'direct',
});

// Session Step Completed
posthog.capture('session_step_completed', {
  framework: string,
  step: string,
  time_spent: number, // seconds
  character_count: number,
});

// Session Completed
posthog.capture('session_completed', {
  framework: string,
  total_time: number,
  steps_completed: number,
  is_anonymous: boolean,
});

// Session Abandoned
posthog.capture('session_abandoned', {
  framework: string,
  last_step: string,
  time_spent: number,
  reason: 'timeout' | 'user_exit' | 'error',
});
```

### **Conversion Events**

```typescript
// Report Emailed
posthog.capture('report_emailed', {
  framework: string,
  newsletter_opted_in: boolean,
});

// Newsletter Signup
posthog.capture('newsletter_signup', {
  source: 'report_email' | 'footer' | 'popup',
  discount_code: string,
});

// Upgrade Prompt Shown
posthog.capture('upgrade_prompt_shown', {
  trigger: 'session_count' | 'feature_lock' | 'manual',
  session_count: number,
});

// Checkout Started
posthog.capture('checkout_started', {
  plan: 'pro_monthly' | 'pro_annual',
  has_coupon: boolean,
  coupon_code: string,
});

// Subscription Created
posthog.capture('subscription_created', {
  plan: string,
  amount: number,
  currency: string,
  trial: boolean,
});
```

### **Engagement Events**

```typescript
// Action Item Created
posthog.capture('action_item_created', {
  session_id: string,
  has_due_date: boolean,
  priority: 'low' | 'medium' | 'high',
});

// Action Item Completed
posthog.capture('action_item_completed', {
  days_to_complete: number,
  on_time: boolean,
});

// Framework Switched
posthog.capture('framework_switched', {
  from_framework: string,
  to_framework: string,
  reason: 'recommendation' | 'manual',
});

// Resource Downloaded
posthog.capture('resource_downloaded', {
  resource_type: string,
  resource_name: string,
});
```

---

## Conversion Funnels

### **Funnel 1: Anonymous to Paid**

```
Landing Page View
  ↓ (60%)
Session Started
  ↓ (70%)
Session Completed
  ↓ (30%)
Report Emailed
  ↓ (25%)
Newsletter Signup
  ↓ (10%)
Account Created
  ↓ (40%)
Subscription Started
```

**Target Conversion:** 0.6 × 0.7 × 0.3 × 0.25 × 0.1 × 0.4 = 0.126% (1.26 per 1000 visitors)

### **Funnel 2: Direct Registration to Paid**

```
Registration
  ↓ (80%)
First Session Completed
  ↓ (60%)
Second Session Started
  ↓ (50%)
Upgrade Prompt Clicked
  ↓ (40%)
Checkout Started
  ↓ (70%)
Subscription Created
```

**Target Conversion:** 0.8 × 0.6 × 0.5 × 0.4 × 0.7 = 6.72%

---

## User Properties

```typescript
// Set user properties
posthog.identify(userId, {
  email: string,
  name: string,
  subscription_status: string,
  subscription_plan: string,
  sessions_completed: number,
  frameworks_used: string[],
  action_items_completed: number,
  ltv: number,
  signup_date: string,
  last_session_date: string,
  preferred_framework: string,
  newsletter_subscriber: boolean,
});
```

---

## Cohort Analysis

### **Cohorts to Track**

**By Signup Source:**
- Newsletter subscribers
- Direct signups
- Referrals
- Organic search
- Paid ads

**By Behavior:**
- Power users (5+ sessions/month)
- Casual users (1-4 sessions/month)
- Inactive users (0 sessions last 30 days)
- Trial users
- Paid users

**By Framework:**
- GROW users
- COMPASS users
- Multi-framework users

---

## A/B Testing Strategy

### **Tests to Run**

**Landing Page:**
- Conversational Void vs Traditional Hero
- CTA copy variations
- Pricing display

**Onboarding:**
- Quick Start vs Explore default
- Intent questions vs Direct selection
- Framework recommendation acceptance

**Pricing:**
- Monthly vs Annual emphasis
- Discount visibility
- Free trial vs Freemium

**Email:**
- Subject line variations
- Send time optimization
- Discount amount (30% vs 50%)

### **Implementation**

```typescript
// Feature flag for A/B test
const variant = posthog.getFeatureFlag('landing_page_test');

if (variant === 'conversational_void') {
  // Show conversational void
} else {
  // Show traditional hero
}

// Track variant
posthog.capture('landing_page_viewed', {
  variant,
});
```

---

## Session Recording

### **When to Record**

- First 3 sessions per user
- Sessions with errors
- Sessions from paid users
- Random 10% sample

### **Privacy Considerations**

- Mask sensitive input (passwords, emails)
- Exclude payment pages
- Allow users to opt-out
- Auto-delete after 30 days

```typescript
// Configure PostHog recording
posthog.init('YOUR_API_KEY', {
  api_host: 'https://app.posthog.com',
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '.sensitive',
  },
});
```

---

## Custom Dashboards

### **Executive Dashboard**

- MRR/ARR trend
- New signups (daily)
- Active users (WAU, MAU)
- Conversion rate (free → paid)
- Churn rate
- LTV:CAC ratio

### **Product Dashboard**

- Session completion rate
- Framework popularity
- Average session time
- Feature usage
- Error rate
- User feedback score

### **Marketing Dashboard**

- Traffic sources
- Landing page conversion
- Email open/click rates
- Newsletter growth
- Referral conversions
- CAC by channel

---

## Implementation

```typescript
// Initialize PostHog
import posthog from 'posthog-js';

posthog.init('YOUR_PROJECT_API_KEY', {
  api_host: 'https://app.posthog.com',
  autocapture: false, // Manual event tracking
  capture_pageview: true,
  capture_pageleave: true,
  session_recording: {
    enabled: true,
    maskAllInputs: true,
  },
});

// Track event helper
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  posthog.capture(eventName, properties);
}

// Identify user
export function identifyUser(
  userId: string,
  properties: Record<string, any>
) {
  posthog.identify(userId, properties);
}

// Usage in components
import { trackEvent } from '@/lib/analytics';

function SessionView() {
  const handleSessionStart = () => {
    trackEvent('session_started', {
      framework: 'GROW',
      is_anonymous: !user,
    });
  };
}
```

---

## Privacy & GDPR Compliance

### **Data Collection Consent**

```typescript
// Cookie consent banner
const [consent, setConsent] = useState<boolean | null>(null);

useEffect(() => {
  const savedConsent = localStorage.getItem('analytics_consent');
  if (savedConsent === 'true') {
    posthog.opt_in_capturing();
  } else if (savedConsent === 'false') {
    posthog.opt_out_capturing();
  }
}, []);

const handleAccept = () => {
  localStorage.setItem('analytics_consent', 'true');
  posthog.opt_in_capturing();
  setConsent(true);
};

const handleDecline = () => {
  localStorage.setItem('analytics_consent', 'false');
  posthog.opt_out_capturing();
  setConsent(false);
};
```

### **Data Deletion**

```typescript
// Delete user data from PostHog
export const deleteUserAnalytics = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Call PostHog API to delete user data
    await fetch('https://app.posthog.com/api/person/delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
      },
      body: JSON.stringify({
        distinct_id: args.userId,
      }),
    });
  },
});
```

---

## Monitoring & Alerts

### **Alerts to Set Up**

- Conversion rate drops >20%
- Error rate increases >5%
- Session completion rate drops >10%
- Payment failures spike
- Churn rate increases

### **Weekly Reports**

- Email summary to team
- Key metrics comparison (WoW)
- Top performing channels
- Issues to investigate

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Planning Complete
