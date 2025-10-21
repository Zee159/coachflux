# CoachFlux Email System Design

## Overview

CoachFlux email system handles transactional emails (authentication, receipts), session reports, newsletter communications, and automated sequences to nurture and convert users.

---

## Email Service Provider

### **Recommended: Resend**

**Why Resend:**
- Developer-friendly API
- React Email templates
- Excellent deliverability
- Generous free tier (3,000 emails/month)
- Built-in analytics
- Domain verification

**Alternatives:**
- **SendGrid** - Enterprise-grade, more complex
- **Postmark** - Excellent for transactional
- **AWS SES** - Cheapest, requires more setup

---

## Email Categories

### **1. Transactional Emails**

**Authentication:**
- Welcome email
- Email verification
- Password reset
- Magic link login
- Account deletion confirmation

**Billing:**
- Subscription confirmation
- Payment receipt
- Payment failed
- Subscription canceled
- Refund processed

**Product:**
- Session report delivery
- Action item reminders
- Feature announcements

### **2. Marketing Emails**

**Newsletter:**
- Weekly coaching tips
- Framework guides
- Success stories
- Product updates

**Nurture Sequences:**
- Welcome series (5 emails)
- Trial reminder series (3 emails)
- Re-engagement series (3 emails)

### **3. Notification Emails**

**User Activity:**
- New device login
- Security alerts
- Session milestones
- Action item due dates

---

## Email Templates

### **Template System: React Email**

```typescript
// Example: Welcome Email Template
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to CoachFlux - Verify your email</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to CoachFlux, {name}! 👋</Heading>
          
          <Text style={text}>
            We're excited to have you on board. CoachFlux helps you achieve
            your goals through structured coaching conversations.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Your Email
            </Button>
          </Section>

          <Text style={text}>
            This link expires in 24 hours. If you didn't create this account,
            you can safely ignore this email.
          </Text>

          <Text style={footer}>
            Questions? Just reply to this email.
            <br />
            - The CoachFlux Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const buttonContainer = {
  padding: "27px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
};
```

---

## Email Sending Implementation

### **Resend Integration**

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send email function
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "CoachFlux <hello@coachflux.com>",
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error("Email send error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

// Usage
await sendEmail({
  to: user.email,
  subject: "Welcome to CoachFlux",
  react: WelcomeEmail({
    name: user.name,
    verificationUrl: `${BASE_URL}/verify?token=${token}`,
  }),
});
```

---

## Transactional Email Templates

### **1. Email Verification**

```typescript
export function EmailVerificationEmail({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Verify your CoachFlux email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hi {name},</Heading>
          
          <Text style={text}>
            Please verify your email address to get started with CoachFlux.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this URL into your browser:
            <br />
            {verificationUrl}
          </Text>

          <Text style={text}>
            This link expires in 24 hours.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### **2. Password Reset**

```typescript
export function PasswordResetEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset your CoachFlux password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          
          <Text style={text}>
            Hi {name}, we received a request to reset your password.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link expires in 1 hour. If you didn't request this,
            you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### **3. Session Report Email**

```typescript
export function SessionReportEmail({
  name,
  framework,
  summary,
  reportUrl,
}: {
  name: string;
  framework: string;
  summary: string;
  reportUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your {framework} coaching session report</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Session Report</Heading>
          
          <Text style={text}>
            Hi {name}, here's your {framework} coaching session report.
          </Text>

          <Section style={summaryBox}>
            <Text style={summaryText}>{summary}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={reportUrl}>
              View Full Report
            </Button>
          </Section>

          <Text style={text}>
            Want to save your sessions and track progress over time?
            <br />
            <a href={`${BASE_URL}/pricing`} style={link}>
              Upgrade to CoachFlux Pro
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### **4. Payment Receipt**

```typescript
export function PaymentReceiptEmail({
  name,
  amount,
  currency,
  date,
  invoiceUrl,
}: {
  name: string;
  amount: number;
  currency: string;
  date: string;
  invoiceUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Payment receipt from CoachFlux</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Received</Heading>
          
          <Text style={text}>
            Hi {name}, thank you for your payment.
          </Text>

          <Section style={receiptBox}>
            <Text style={receiptItem}>
              <strong>Amount:</strong> {currency.toUpperCase()} {amount}
            </Text>
            <Text style={receiptItem}>
              <strong>Date:</strong> {date}
            </Text>
            <Text style={receiptItem}>
              <strong>Plan:</strong> CoachFlux Pro
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={invoiceUrl}>
              Download Invoice
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## Newsletter System

### **Newsletter Provider: ConvertKit**

**Why ConvertKit:**
- Creator-focused
- Powerful automation
- Tagging and segmentation
- Landing pages included
- Free up to 1,000 subscribers

### **Newsletter Integration**

```typescript
// Add subscriber to ConvertKit
export async function addToNewsletter({
  email,
  name,
  tags = [],
}: {
  email: string;
  name?: string;
  tags?: string[];
}) {
  const response = await fetch(
    `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email,
        first_name: name,
        tags,
      }),
    }
  );

  return response.json();
}

// Usage
await addToNewsletter({
  email: user.email,
  name: user.name,
  tags: ["session_report", "discount_eligible"],
});
```

### **Newsletter Content Calendar**

**Week 1:** Welcome + discount code
**Week 2:** "How to use GROW framework" guide
**Week 3:** Success story + testimonial
**Week 4:** New framework announcement
**Week 5:** Coaching tips + resources
**Week 6:** Product update + upgrade prompt

---

## Email Automation Sequences

### **1. Welcome Sequence (New User)**

**Email 1 - Day 0: Welcome**
- Subject: "Welcome to CoachFlux! Here's your discount code"
- Content: Introduction, discount code (WELCOME50), getting started guide
- CTA: Start your first session

**Email 2 - Day 3: Getting Started**
- Subject: "How to get the most from CoachFlux"
- Content: Tips for effective coaching sessions, framework overview
- CTA: Try a different framework

**Email 3 - Day 7: Success Story**
- Subject: "How Sarah achieved her career goals with CoachFlux"
- Content: User testimonial, results achieved
- CTA: Upgrade to Pro

**Email 4 - Day 14: Framework Deep Dive**
- Subject: "Master the GROW framework in 5 minutes"
- Content: Detailed framework guide, examples
- CTA: Download framework template

**Email 5 - Day 21: Upgrade Prompt**
- Subject: "Ready to unlock your full potential?"
- Content: Pro features, testimonials, limited-time offer
- CTA: Upgrade now

### **2. Trial Reminder Sequence**

**Email 1 - Day 5: Trial Ending Soon**
- Subject: "Your trial ends in 2 days"
- Content: Reminder, what you'll lose, upgrade benefits
- CTA: Continue with Pro

**Email 2 - Day 7: Trial Ended**
- Subject: "Welcome to CoachFlux Pro!"
- Content: Thank you, Pro features overview, support info
- CTA: Start a session

**Email 3 - Day 14: Check-in**
- Subject: "How's your CoachFlux journey going?"
- Content: Tips, resources, feedback request
- CTA: Share feedback

### **3. Re-engagement Sequence (Inactive Users)**

**Email 1 - Day 30: We Miss You**
- Subject: "We noticed you haven't been around..."
- Content: What's new, new frameworks, special offer
- CTA: Come back

**Email 2 - Day 45: Special Offer**
- Subject: "Come back to CoachFlux - 50% off for 2 months"
- Content: Discount code, success stories, what they're missing
- CTA: Reactivate account

**Email 3 - Day 60: Final Attempt**
- Subject: "One last thing before you go..."
- Content: Feedback request, alternative resources, goodbye
- CTA: Tell us why you left

---

## Email Preferences & Unsubscribe

### **Preference Center**

```typescript
interface EmailPreferences {
  userId: string;
  transactional: boolean; // Cannot unsubscribe
  productUpdates: boolean;
  newsletter: boolean;
  actionReminders: boolean;
  marketingEmails: boolean;
}

// Update preferences
export const updateEmailPreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.object({
      productUpdates: v.boolean(),
      newsletter: v.boolean(),
      actionReminders: v.boolean(),
      marketingEmails: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      emailPreferences: args.preferences,
    });
  },
});
```

### **Unsubscribe Flow**

```
Email → Unsubscribe Link → Preference Center → Update Preferences → Confirmation
```

**Unsubscribe Page:**
```
┌─────────────────────────────────────────┐
│  We're sorry to see you go              │
│                                         │
│  ☑ Product updates                      │
│  ☑ Newsletter                           │
│  ☑ Action reminders                     │
│  ☐ Marketing emails                     │
│                                         │
│  [Save Preferences]                     │
│                                         │
│  Or: [Unsubscribe from all]            │
└─────────────────────────────────────────┘
```

---

## Email Analytics

### **Metrics to Track**

**Delivery Metrics:**
- Delivery rate
- Bounce rate (hard vs soft)
- Spam complaints

**Engagement Metrics:**
- Open rate
- Click-through rate (CTR)
- Conversion rate

**Revenue Metrics:**
- Revenue per email
- Conversion value
- ROI

### **Resend Analytics**

```typescript
// Get email analytics
const analytics = await resend.emails.get(emailId);

console.log({
  status: analytics.status, // sent, delivered, opened, clicked
  opens: analytics.opens,
  clicks: analytics.clicks,
  bounced: analytics.bounced,
});
```

---

## Email Testing

### **Pre-Send Checklist**

- [ ] Subject line < 50 characters
- [ ] Preview text compelling
- [ ] All links working
- [ ] Images loading
- [ ] Mobile responsive
- [ ] Spam score < 5
- [ ] Unsubscribe link present
- [ ] Sender name/email correct

### **Testing Tools**

**Litmus / Email on Acid:**
- Test across email clients
- Spam score checking
- Accessibility testing

**Manual Testing:**
- Gmail (desktop & mobile)
- Outlook (desktop & web)
- Apple Mail (iOS & macOS)
- Dark mode testing

---

## Deliverability Best Practices

### **Domain Setup**

**SPF Record:**
```
v=spf1 include:_spf.resend.com ~all
```

**DKIM:**
- Set up via Resend dashboard
- Verify DNS records

**DMARC:**
```
v=DMARC1; p=none; rua=mailto:dmarc@coachflux.com
```

### **Content Best Practices**

- Avoid spam trigger words ("free", "urgent", "act now")
- Maintain text-to-image ratio (60:40)
- Include plain text version
- Personalize content
- Clean email list regularly
- Honor unsubscribes immediately

---

## Implementation Checklist

### **Phase 1: Setup (Week 1)**
- [ ] Choose email provider (Resend)
- [ ] Set up domain authentication (SPF, DKIM, DMARC)
- [ ] Create email templates (React Email)
- [ ] Test email sending

### **Phase 2: Transactional (Week 2)**
- [ ] Welcome email
- [ ] Email verification
- [ ] Password reset
- [ ] Session report email
- [ ] Payment receipts

### **Phase 3: Newsletter (Week 3)**
- [ ] ConvertKit integration
- [ ] Newsletter signup form
- [ ] Welcome sequence
- [ ] Content calendar

### **Phase 4: Automation (Week 4)**
- [ ] Trial reminder sequence
- [ ] Re-engagement sequence
- [ ] Action item reminders
- [ ] Preference center

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Planning Complete
