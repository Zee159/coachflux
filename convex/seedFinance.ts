/**
 * Financial Planning Knowledge Base - 5 Scenarios
 * 
 * Run this to load scenarios:
 *   npx convex run seedFinance:seed
 */

/* eslint-disable no-console */
import { action } from "./_generated/server";
import { api } from "./_generated/api";

const FINANCE_SCENARIOS = [
  {
    source: "financial_planning",
    category: "budgeting",
    title: "Creating a Sustainable Budget",
    content: `How to manage your money effectively:

The 50/30/20 Rule:
- 50% Needs (housing, utilities, groceries, transportation)
- 30% Wants (dining out, entertainment, hobbies)
- 20% Savings & Debt (emergency fund, retirement, extra payments)

Budget Creation Process:

Step 1: Track Current Spending (1 month)
Step 2: Calculate Your Income (after-tax)
Step 3: List All Expenses (fixed, variable, periodic)
Step 4: Set Spending Limits
Step 5: Track and Adjust

Common Mistakes:
❌ Being too restrictive → ✅ Allow flexibility
❌ Forgetting irregular expenses → ✅ Budget monthly for annual costs
❌ Not tracking small purchases → ✅ Every dollar counts

Budgeting Methods:
1. Envelope System - Cash in envelopes per category
2. Pay Yourself First - Savings comes out first
3. Percentage-Based - Allocate by percentages
4. Zero-Based Budget - Every dollar has a job

Weekly Money Date (30 min):
- Review spending
- Adjust categories
- Plan upcoming expenses
- Celebrate wins

Remember: A budget is permission to spend guilt-free within your limits.`,
    tags: ["budgeting", "money_management", "50_30_20_rule", "financial_planning", "personal_finance"]
  },
  {
    source: "financial_planning",
    category: "emergency_fund",
    title: "Building an Emergency Fund",
    content: `How to create financial security:

How Much to Save:

Starter Fund: $1,000
- Covers most small emergencies
- Build this first before extra debt payments

Full Fund: 3-6 Months Expenses
- 3 months: Dual income, stable jobs
- 6 months: Single income, variable income
- 9-12 months: Self-employed

Calculate Your Target:
Essential expenses × months needed
Example: $3,000/month × 6 = $18,000 target

Building Strategy:

Phase 1: Starter Fund
- Save $100-200/month = 5-10 months
- Use tax refund or bonus
- Open separate savings account

Phase 2: Full Fund
- Save 10-20% of income
- Automate transfers
- Takes 1-3 years typically

Where to Keep It:

High-Yield Savings Account:
✅ FDIC insured
✅ Easy access (1-2 days)
✅ Earns interest (4-5%)
✅ Separate from checking

❌ NOT in checking (too accessible)
❌ NOT in investments (too volatile)

Using Your Emergency Fund:

✅ True Emergencies:
- Lost job
- Medical emergency
- Essential car repair
- Urgent home repair

❌ Not Emergencies:
- Want new phone
- Sale on something
- Vacation

After Using It:
1. Don't feel guilty (that's what it's for)
2. Pause other goals temporarily
3. Rebuild as fast as possible

Remember: Emergency fund = peace of mind and financial security.`,
    tags: ["emergency_fund", "savings", "financial_security", "personal_finance", "money_management"]
  },
  {
    source: "financial_planning",
    category: "debt_reduction",
    title: "Getting Out of Debt",
    content: `How to eliminate debt strategically:

Two Main Strategies:

1. Debt Snowball (Psychological)
- Pay off smallest balance first
- Quick wins build momentum
- Best for: Need motivation

2. Debt Avalanche (Math Optimal)
- Pay off highest interest first
- Saves most money
- Best for: Disciplined savers

The Debt Snowball Process:

Step 1: List All Debts
Step 2: Order by Balance (Smallest to Largest)
Step 3: Pay Minimums on All
Step 4: Attack Smallest with Extra Money
Step 5: Roll Payment to Next Debt

Example Snowball:
- Credit Card A: $500 → Pay off first
- Medical Bill: $1,200 → Then this
- Credit Card B: $3,000 → Then this
- Car Loan: $8,000 → Then this
- Student Loan: $25,000 → Finally this

Finding Extra Money:

1. Budget Optimization - Cut unnecessary expenses
2. Increase Income - Side hustle, overtime
3. Windfalls - Tax refunds, bonuses
4. Sell Items - Unused possessions

Staying Motivated:

- Visual progress tracking (debt thermometer)
- Celebrate each debt paid off
- Find accountability partner
- Join debt-free community

Avoiding New Debt:

1. Cut up credit cards (keep one for emergencies)
2. Use cash or debit only
3. Wait 24-48 hours for purchases
4. Build $1,000 emergency fund first

Common Mistakes:

❌ Not having emergency fund → ✅ Save $1,000 first
❌ Continuing to use credit cards → ✅ Stop adding debt
❌ Only paying minimums → ✅ Pay extra on target debt
❌ Giving up after setback → ✅ Adjust and continue

Life After Debt:

What to do with freed-up money:
1. Build full emergency fund (3-6 months)
2. Invest 15% for retirement
3. Save for goals (house, car)
4. Build wealth

Remember: Debt is a problem with a solution. Stay focused and consistent.`,
    tags: ["debt_reduction", "debt_snowball", "debt_avalanche", "financial_freedom", "money_management"]
  },
  {
    source: "financial_planning",
    category: "investing",
    title: "Investing 101: Getting Started",
    content: `How to start building wealth:

Before You Invest:

Prerequisites (In Order):
1. ✅ Emergency fund (3-6 months)
2. ✅ No high-interest debt (>7%)
3. ✅ Stable income
4. ✅ Long-term mindset (5+ years)

The Power of Compound Interest:

$500/month at 8% return:
- 10 years: $91,000
- 20 years: $294,000
- 30 years: $745,000
- 40 years: $1,745,000

Start early, even small amounts matter!

Types of Investments:

1. Stocks - Higher risk, higher return (10% avg)
2. Bonds - Lower risk, lower return (3-5% avg)
3. Index Funds - Diversified, low fees (RECOMMENDED)
4. Target-Date Funds - Auto-adjusts risk by age

Where to Invest:

1. Employer 401(k)
- Invest enough for full match (free money!)
- Pre-tax contributions
- Grows tax-deferred
- $23,000/year limit

2. Roth IRA
- After-tax contributions
- Grows tax-free forever
- $7,000/year limit
- Withdraw contributions anytime

3. Traditional IRA
- Pre-tax contributions
- Tax deduction now
- Pay taxes in retirement
- $7,000/year limit

Simple Investment Strategy:

For Beginners:
- Target-Date Fund (choose year near retirement)
- Example: "Target 2055 Fund"
- Automatically diversified
- Rebalances itself

OR

Three-Fund Portfolio:
- 60% Total Stock Market Index
- 30% International Stock Index
- 10% Bond Index

Investment Rules:

1. Start Early - Time is your biggest asset
2. Invest Consistently - Dollar-cost averaging
3. Keep Fees Low - <0.20% expense ratio
4. Don't Time Market - Stay invested through ups and downs
5. Diversify - Don't put all eggs in one basket

Common Mistakes:

❌ Waiting to invest → ✅ Start now, even small
❌ Trying to pick stocks → ✅ Use index funds
❌ Selling when market drops → ✅ Stay invested, buy more
❌ High fees → ✅ Use low-cost index funds

Remember: Investing is for long-term wealth building. Stay the course.`,
    tags: ["investing", "retirement", "index_funds", "compound_interest", "wealth_building"]
  },
  {
    source: "financial_planning",
    category: "retirement",
    title: "Planning for Retirement",
    content: `How to prepare for financial independence:

How Much Do You Need?

The 4% Rule:
- Withdraw 4% of savings annually
- Example: $1M saved = $40K/year
- Historically safe for 30+ years

Calculate Your Number:
Annual expenses × 25 = Retirement goal
Example: $60K/year × 25 = $1.5M needed

Retirement Accounts:

1. 401(k) / 403(b)
- Employer-sponsored
- Contribute enough for match
- $23,000/year limit ($30,500 if 50+)

2. IRA (Traditional or Roth)
- Individual account
- $7,000/year limit ($8,000 if 50+)

3. HSA (Health Savings Account)
- Triple tax advantage
- $4,150 individual, $8,300 family

How Much to Save:

General Guidelines:
- 15% of gross income minimum
- Start in 20s: 10-15%
- Start in 30s: 15-20%
- Start in 40s: 20-25%
- Start in 50s: 25-30%

Investment Strategy by Age:

20s-30s: Aggressive
- 90% stocks, 10% bonds
- Focus on growth

40s-50s: Moderate
- 70% stocks, 30% bonds
- Balance growth and stability

60s+: Conservative
- 50% stocks, 50% bonds
- Preserve capital

Social Security:

When to Claim:
- Age 62: Reduced (70% of full)
- Age 67: Full benefits (100%)
- Age 70: Maximum (124%)

Strategy: Delay if possible (8% increase per year)

Healthcare in Retirement:

Medicare (Age 65+):
- Part A: Hospital (usually free)
- Part B: Medical ($174/month)
- Part D: Prescription drugs
- Medigap: Supplemental coverage

Before 65: COBRA, ACA marketplace, or spouse's plan

Common Mistakes:

❌ Starting too late → ✅ Start now
❌ Cashing out 401(k) when changing jobs → ✅ Roll over to IRA
❌ Not diversifying → ✅ Use target-date funds
❌ Underestimating healthcare → ✅ Plan for $300K+

Remember: Retirement planning is a marathon. Start early, save consistently, invest wisely.`,
    tags: ["retirement", "401k", "ira", "financial_planning", "social_security", "4_percent_rule"]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Seeding Finance scenarios...\n");
    
    let loaded = 0;
    let errors = 0;
    
    for (const scenario of FINANCE_SCENARIOS) {
      try {
        console.log(`Loading: ${scenario.title}`);
        
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, {
          source: scenario.source,
          category: scenario.category,
          title: scenario.title,
          content: scenario.content,
          tags: scenario.tags
        });
        
        loaded++;
        console.log(`  ✅ Loaded`);
        
      } catch (error) {
        errors++;
        console.error(`  ❌ Error:`, error);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  Loaded: ${loaded}`);
    console.log(`  Errors: ${errors}`);
    console.log(`  Total: ${FINANCE_SCENARIOS.length}`);
    
    return {
      loaded,
      errors,
      total: FINANCE_SCENARIOS.length
    };
  },
});
