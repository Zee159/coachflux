# CoachFlux Payment & Subscription Architecture

## Overview

CoachFlux uses Stripe for payment processing and subscription management. The system supports monthly and annual subscriptions, discount codes, free trials, and seamless upgrade/downgrade flows.

---

## Subscription Tiers

### **Free Tier**
- **Price:** £0
- **Features:** Anonymous sessions, email reports
- **Limitations:** No history, no tracking
- **Target:** Trial users, one-time needs

### **Pro Monthly**
- **Price:** £9.99/month
- **Features:** Full access to all Pro features
- **Billing:** Monthly, auto-renewing
- **Target:** Regular users

### **Pro Annual**
- **Price:** £99/year (save £20)
- **Features:** Same as Pro Monthly
- **Billing:** Annual, auto-renewing
- **Target:** Committed users

### **Enterprise (Future)**
- **Price:** Custom (£5-15/user/month)
- **Features:** Team features, SSO, custom branding
- **Billing:** Annual contract
- **Target:** Companies, 50+ users

---

## Stripe Integration

### **Stripe Products & Prices**

```typescript
// Create products in Stripe Dashboard or via API
const products = {
  pro_monthly: {
    id: "prod_ProMonthly",
    name: "CoachFlux Pro",
    description: "Unlimited coaching sessions with full features",
    prices: {
      gbp: "price_ProMonthlyGBP", // £9.99
      usd: "price_ProMonthlyUSD", // $12.99
      eur: "price_ProMonthlyEUR", // €11.99
    },
  },
  pro_annual: {
    id: "prod_ProAnnual",
    name: "CoachFlux Pro Annual",
    description: "Annual subscription with 2 months free",
    prices: {
      gbp: "price_ProAnnualGBP", // £99
      usd: "price_ProAnnualUSD", // $129
      eur: "price_ProAnnualEUR", // €119
    },
  },
};
```

### **Stripe Customer Creation**

```typescript
// Create Stripe customer on user registration
export const createStripeCustomer = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user._id,
        source: "coachflux_app",
      },
    });

    await ctx.db.patch(user._id, {
      stripeCustomerId: customer.id,
    });

    return customer.id;
  },
});
```

---

## Checkout Flow

### **Subscription Checkout**

```typescript
// Create Stripe Checkout Session
export const createCheckoutSession = mutation({
  args: {
    userId: v.id("users"),
    priceId: v.string(),
    couponCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      customerId = await createStripeCustomer(ctx, { userId: user._id });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: args.priceId,
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      metadata: {
        userId: user._id,
      },
      subscription_data: {
        metadata: {
          userId: user._id,
        },
      },
    };

    // Apply coupon if provided
    if (args.couponCode) {
      sessionParams.discounts = [{ coupon: args.couponCode }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return { url: session.url };
  },
});
```

### **Checkout UI Flow**

```
Pricing Page → Select Plan → Checkout → Payment → Success → Dashboard
```

**Checkout Page:**
```
┌─────────────────────────────────────────┐
│  Complete Your Purchase                 │
│                                         │
│  CoachFlux Pro - Monthly                │
│  £9.99/month                            │
│                                         │
│  Have a coupon code?                    │
│  [________________] [Apply]             │
│                                         │
│  💳 Payment Method                      │
│  [Stripe Checkout Embedded]             │
│                                         │
│  By subscribing, you agree to our       │
│  Terms of Service and Privacy Policy    │
│                                         │
│  [Complete Purchase]                    │
└─────────────────────────────────────────┘
```

---

## Webhook Handling

### **Stripe Webhooks**

```typescript
// Handle Stripe webhooks
export const handleStripeWebhook = httpAction(async (ctx, request) => {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(ctx, event.data.object);
      break;

    case "customer.subscription.created":
      await handleSubscriptionCreated(ctx, event.data.object);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(ctx, event.data.object);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(ctx, event.data.object);
      break;

    case "invoice.payment_succeeded":
      await handlePaymentSucceeded(ctx, event.data.object);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(ctx, event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
```

### **Webhook Handlers**

```typescript
async function handleCheckoutCompleted(
  ctx: ActionCtx,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  // Update user subscription status
  await ctx.runMutation(internal.mutations.updateUserSubscription, {
    userId,
    status: "active",
    stripeSubscriptionId: session.subscription as string,
  });

  // Send welcome email
  await sendEmail({
    to: session.customer_email!,
    template: "subscription_welcome",
    data: { name: session.customer_details?.name },
  });
}

async function handleSubscriptionUpdated(
  ctx: ActionCtx,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await ctx.runMutation(internal.mutations.updateUserSubscription, {
    userId,
    status: subscription.status,
    currentPeriodEnd: subscription.current_period_end,
  });
}

async function handlePaymentFailed(
  ctx: ActionCtx,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;
  const user = await ctx.runQuery(internal.queries.getUserByStripeCustomer, {
    customerId,
  });

  if (!user) return;

  // Send payment failed email
  await sendEmail({
    to: user.email,
    template: "payment_failed",
    data: {
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      invoiceUrl: invoice.hosted_invoice_url,
    },
  });

  // Update subscription status
  await ctx.runMutation(internal.mutations.updateUserSubscription, {
    userId: user._id,
    status: "past_due",
  });
}
```

---

## Discount Codes & Coupons

### **Coupon Types**

**Newsletter Signup (WELCOME50):**
- 50% off for 3 months
- One-time use per customer
- Auto-applied from newsletter link

**Referral (REFER5):**
- £5 credit for referrer
- £5 off for referee
- Unlimited uses

**Seasonal (SUMMER25):**
- 25% off first month
- Limited time offer
- Multiple uses allowed

### **Creating Coupons in Stripe**

```typescript
// Create coupon via Stripe API
const coupon = await stripe.coupons.create({
  id: "WELCOME50",
  percent_off: 50,
  duration: "repeating",
  duration_in_months: 3,
  max_redemptions: 10000,
  metadata: {
    source: "newsletter_signup",
  },
});
```

### **Applying Coupons**

```typescript
// Apply coupon at checkout
const session = await stripe.checkout.sessions.create({
  // ... other params
  discounts: [
    {
      coupon: "WELCOME50",
    },
  ],
});

// Or apply to existing subscription
const subscription = await stripe.subscriptions.update(subscriptionId, {
  coupon: "WELCOME50",
});
```

---

## Subscription Management

### **Customer Portal**

Stripe provides a hosted billing portal for customers to:
- Update payment method
- View invoices
- Download receipts
- Cancel subscription
- Update billing information

```typescript
// Create portal session
export const createPortalSession = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user?.stripeCustomerId) {
      throw new Error("No Stripe customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${BASE_URL}/dashboard/settings`,
    });

    return { url: session.url };
  },
});
```

### **Upgrade/Downgrade Flow**

**Monthly → Annual:**
```typescript
// Prorate and switch to annual
const subscription = await stripe.subscriptions.update(subscriptionId, {
  items: [
    {
      id: subscription.items.data[0].id,
      price: "price_ProAnnualGBP",
    },
  ],
  proration_behavior: "create_prorations",
});
```

**Cancel Subscription:**
```typescript
// Cancel at period end (no immediate cancellation)
const subscription = await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true,
});

// Immediate cancellation (with refund if applicable)
const subscription = await stripe.subscriptions.cancel(subscriptionId, {
  prorate: true,
});
```

---

## Free Trial

### **7-Day Free Trial**

```typescript
// Create subscription with trial
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  trial_period_days: 7,
  payment_behavior: "default_incomplete",
  expand: ["latest_invoice.payment_intent"],
});
```

### **Trial Reminder Emails**

**Day 5:** "Your trial ends in 2 days"
**Day 7:** "Your trial has ended - welcome to Pro!"

```typescript
// Schedule trial reminder emails
export const scheduleTrialReminders = internalMutation({
  args: { userId: v.id("users"), trialEndDate: v.number() },
  handler: async (ctx, args) => {
    const day5 = args.trialEndDate - 2 * 24 * 60 * 60 * 1000;
    const day7 = args.trialEndDate;

    await ctx.scheduler.runAt(day5, internal.emails.sendTrialReminder, {
      userId: args.userId,
      daysLeft: 2,
    });

    await ctx.scheduler.runAt(day7, internal.emails.sendTrialEnded, {
      userId: args.userId,
    });
  },
});
```

---

## Invoice & Receipt Generation

### **Invoice Email**

Stripe automatically sends invoice emails, but we can customize:

```typescript
// Customize invoice email
const invoice = await stripe.invoices.create({
  customer: customerId,
  auto_advance: true,
  collection_method: "charge_automatically",
  custom_fields: [
    {
      name: "Session Count",
      value: "12 sessions this month",
    },
  ],
});
```

### **Receipt Download**

```typescript
// Generate receipt PDF
export const downloadReceipt = query({
  args: { invoiceId: v.string() },
  handler: async (ctx, args) => {
    const invoice = await stripe.invoices.retrieve(args.invoiceId);
    return {
      pdfUrl: invoice.invoice_pdf,
      number: invoice.number,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
    };
  },
});
```

---

## Refund Policy & Processing

### **Refund Policy**

- **30-day money-back guarantee**
- Full refund if requested within 30 days
- Prorated refund for annual plans
- No questions asked

### **Processing Refunds**

```typescript
// Issue refund
export const issueRefund = mutation({
  args: {
    userId: v.id("users"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user?.stripeSubscriptionId) {
      throw new Error("No active subscription");
    }

    // Get latest invoice
    const invoices = await stripe.invoices.list({
      subscription: user.stripeSubscriptionId,
      limit: 1,
    });

    const latestInvoice = invoices.data[0];
    if (!latestInvoice?.payment_intent) {
      throw new Error("No payment found");
    }

    // Issue refund
    const refund = await stripe.refunds.create({
      payment_intent: latestInvoice.payment_intent as string,
      reason: "requested_by_customer",
      metadata: {
        userId: user._id,
        reason: args.reason,
      },
    });

    // Cancel subscription
    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    // Update user status
    await ctx.db.patch(user._id, {
      subscriptionStatus: "canceled",
    });

    // Send confirmation email
    await sendEmail({
      to: user.email,
      template: "refund_processed",
      data: {
        amount: refund.amount / 100,
        currency: refund.currency,
      },
    });

    return { success: true, refundId: refund.id };
  },
});
```

---

## Failed Payment Recovery

### **Dunning Strategy**

**Day 1:** Payment failed - retry automatically
**Day 3:** Email reminder with link to update payment
**Day 7:** Final reminder - subscription will be canceled
**Day 10:** Cancel subscription

```typescript
// Handle failed payment
async function handlePaymentFailed(
  ctx: ActionCtx,
  invoice: Stripe.Invoice
) {
  const user = await getUserByStripeCustomer(invoice.customer);
  if (!user) return;

  // Send immediate email
  await sendEmail({
    to: user.email,
    template: "payment_failed",
    data: {
      amount: invoice.amount_due / 100,
      updateUrl: `${BASE_URL}/billing/update`,
    },
  });

  // Schedule follow-up emails
  await ctx.scheduler.runAfter(
    3 * 24 * 60 * 60 * 1000,
    internal.emails.sendPaymentReminder,
    { userId: user._id, attempt: 2 }
  );

  await ctx.scheduler.runAfter(
    7 * 24 * 60 * 60 * 1000,
    internal.emails.sendPaymentFinalReminder,
    { userId: user._id }
  );
}
```

---

## Multi-Currency Support

### **Supported Currencies**

- GBP (£) - Primary
- USD ($)
- EUR (€)

### **Currency Detection**

```typescript
// Detect user currency from IP
export const detectCurrency = query({
  handler: async (ctx) => {
    // Use IP geolocation or browser locale
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    
    if (locale.startsWith("en-GB")) return "gbp";
    if (locale.startsWith("en-US")) return "usd";
    if (locale.startsWith("de") || locale.startsWith("fr")) return "eur";
    
    return "gbp"; // Default
  },
});
```

---

## Convex Schema

```typescript
export default defineSchema({
  subscriptions: defineTable({
    userId: v.id("users"),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("trialing"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("unpaid")
    ),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    trialEnd: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_id", ["stripeSubscriptionId"]),

  invoices: defineTable({
    userId: v.id("users"),
    stripeInvoiceId: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    paidAt: v.optional(v.number()),
    invoicePdf: v.optional(v.string()),
  })
    .index("by_user", ["userId"]),

  coupons: defineTable({
    code: v.string(),
    stripeCouponId: v.string(),
    percentOff: v.optional(v.number()),
    amountOff: v.optional(v.number()),
    duration: v.string(),
    durationInMonths: v.optional(v.number()),
    maxRedemptions: v.optional(v.number()),
    timesRedeemed: v.number(),
    active: v.boolean(),
  })
    .index("by_code", ["code"]),
});
```

---

## Implementation Checklist

### **Phase 1: Basic Setup (Week 1)**
- [ ] Stripe account setup
- [ ] Create products and prices
- [ ] Webhook endpoint configuration
- [ ] Customer creation on registration

### **Phase 2: Checkout (Week 2)**
- [ ] Checkout session creation
- [ ] Success/cancel page handling
- [ ] Webhook event processing
- [ ] Subscription status updates

### **Phase 3: Management (Week 3)**
- [ ] Customer portal integration
- [ ] Upgrade/downgrade flows
- [ ] Cancellation handling
- [ ] Invoice generation

### **Phase 4: Advanced (Week 4)**
- [ ] Discount code system
- [ ] Free trial implementation
- [ ] Failed payment recovery
- [ ] Refund processing

---

**Document Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Planning Complete
