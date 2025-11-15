/**
 * ENHANCED Financial Mastery Scenarios
 *
 * Each scenario delivers ~1,200 words of step-by-step frameworks, scripts, templates, troubleshooting, and real examples.
 * Run: npx convex run seedFinanceEnhanced:seed
 */

import { action } from "./_generated/server";
import { api } from "./_generated/api";

interface FinanceEnhancedScenario {
  source: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

export const FINANCE_SCENARIOS_ENHANCED: FinanceEnhancedScenario[] = [
  {
    source: "finance_enhanced",
    category: "budgeting",
    title: "Designing a 360° Cashflow System: Beyond the Traditional Budget",
    content: `Budgets that stick are living systems with rituals, real-time visibility, and built-in flexibility. This playbook shows you how to architect a 360° cashflow system that funds your priorities, protects against surprises, and keeps everyone aligned—even if you have variable income or shared finances.

MISSION SNAPSHOT
North Star: Every dollar has a job, and no surprise can derail you for more than 48 hours.
Cadence: Quarterly blueprint refresh, monthly calibrations, weekly money dates, daily micro check-ins (2 minutes).
Deliverables: Cashflow Command Center, Priority-Based Spending Plan, Automation Map, Troubleshooting Decision Tree.

PHASE 1: FINANCIAL MRI (90 MINUTES)
1. Income Mapping (30 minutes)
   - Document every income stream: salary, freelance, rental, stipends. Capture net amounts and deposit dates.
   - Identify volatility: note commissions, seasonal spikes. Flag any income with variance above 15%.
   - Script for partner discussion: “Let’s list our inflows over the past three months so we can design a plan that works even when payments shift.”

2. Expense X-Ray (30 minutes)
   - Export last 90 days from checking, credit cards, cash apps. Use CSV and pivot tables to spot patterns.
   - Categorize into: Baseline Needs, Growth Investments, Personal Joy, Future Planning, Leakage.
   - Template: Expense Audit Sheet (columns: Date, Vendor, Amount, Category, Recurrence, Notes, Rating 1-5 for satisfaction). Highlight recurring subscriptions and forgotten fees.

3. Emotional Audit (15 minutes)
   - Journal prompts: “Where does my money plan feel suffocating?” “Where do I feel out of control?”
   - Rate stress vs. confidence on scale 1-10. Goal is to move confidence +3 points by end of quarter.
   - Breathing routine before money talk: inhale 4, hold 4, exhale 6, repeat four times to lower resistance.

4. Value Clarification (15 minutes)
   - Identify Top 5 funding priorities (e.g., debt freedom, adventure travel, skill development, family care, wealth building).
   - Document why each matters and the consequence of neglecting it.
   - Align with household: share “Values Vision Board” using collaborative doc or whiteboard.

PHASE 2: CASHFLOW COMMAND CENTER BUILD (120 MINUTES)
1. Core Accounts Architecture
   - Operating Hub: Checking account for baseline needs; keep 4-6 weeks of expenses.
   - Vault Accounts: Separate high-yield savings for emergency fund, sinking funds (vacations, taxes, medical), and opportunity fund.
   - Freedom Card Strategy: Choose credit cards only when benefits > interest risk; set auto-pay in full.

2. Automation Blueprint
   - Pay Yourself First: Automate transfers on pay day—Emergency Fund, Investments, Debt Overpayments.
   - Bills Carousel: Group bills into two cycles (1st and 15th) to match income cadence.
   - Automation Map Template: Columns for Account, Source, Destination, Amount, Date, Confirmation Method.

3. Priority-Based Spending Plan (PBS Plan)
   - Replace static percentages with Priority Buckets:
     Bucket 1 Security (mortgage, groceries, insurance) – fund 100% automatically.
     Bucket 2 Growth (investing, education) – autopilot contributions.
     Bucket 3 Meaningful Living (gifts, hobbies, experiences) – funded after buckets 1 and 2.
     Bucket 4 Flex Float (unplanned opportunities) – 5% of income to reduce guilt.
   - Use the PBS Board in Notion/Airtable: lanes for bucket, monthly allocation, actual, variance.

4. Envelope 2.0 (Digital Edition)
   - For tactile learners: use separate cards or digital envelopes (e.g., Qube Money, budgeting apps) for categories where overspending triggers (dining, shopping).
   - Script when envelope empty: “Future-me already planned this. Let’s move the dinner to the cooking list or fund it from Flex Float if it still feels right.”

PHASE 3: RITUALS FOR RESILIENCE
1. Weekly Money Date (45 minutes)
   Agenda:
     5 minutes – Emotional check-in (How are we feeling about money?)
     15 minutes – Review dashboards (spending vs. plan, upcoming expenses)
     10 minutes – Celebrate wins (“We fully funded the travel sinking fund!”)
     10 minutes – Adjust plan (move allocations, decline/approve new requests)
     5 minutes – Document action items in shared tracker.
   - Conversation starter: “What financial moment gave you energy this week?”

2. Monthly Calibration Meeting (60 minutes)
   - Review Key Metrics: Savings rate, debt payoff velocity, investment contributions, unplanned expenses.
   - Run Scenario Drill: “If income dropped 20%, what changes kick in?” Use pre-written adjustment menu.
   - Update Sinking Funds: Replenish any categories used; recalibrate for upcoming events.
   - produce Summary email template: “Highlights, Adjustments, Next Month Focus, Questions.”

3. Quarterly Deep Dive (90 minutes)
   - Refresh Values Board and PBS allocations based on life changes.
   - Conduct Subscription Cull (list all auto-renewals, rate usage, decide keep/pause/cancel).
   - Evaluate progress toward major goals (house down payment, sabbatical fund). Use Milestone Tracker with progress bars.

TOOLS & TEMPLATES
1. Cashflow Command Center Template (Spreadsheet)
   - Tabs: Income Tracker, Expense Planner, Sinking Funds, Automation Map, Metrics Dashboard.
   - Conditional formatting for overspend warnings (>10% variance).

2. Priority Decision Matrix
   - Axes: Impact on Values vs. Cost to Maintain. Items in high impact/low cost quadrant get funded first.

3. First 14-Day Quick Win Plan
   Day 1: Set up automation for emergency fund.
   Day 3: Audit subscriptions.
   Day 5: Draft PBS buckets.
   Day 7: Run first money date.
   Day 10: Negotiation script for bill reduction.
   Day 14: Celebrate progress with pre-budgeted experience.

4. Bill Negotiation Script
   - “Hi, I’ve been a customer for X years and noticed competitor pricing at Y. What retention offers can you extend so I can stay with you?”
   - Record outcomes in Negotiation Log (provider, current rate, new rate, next follow-up).

5. Shared Slack/WhatsApp Money Channel
   - Use dedicated channel for money updates (invoice paid, transfer done). Keeps communication transparent.

TROUBLESHOOTING MATRIX
Issue: Variable income causes shortfalls.
   - Solution: Fund Irregular Income Buffer equal to 1.5x average month variance. Use rolling 3-month average to set Base Pay, stash surplus into buffer.

Issue: Partner disengaged.
   - Solution: Use Values-Based Kickoff instead of spreadsheets. Share future vision storyboard (vacations, debt-free date). Schedule 20-minute walk-and-talk before formal review.

Issue: Overspending on impulse purchases.
   - Solution: Implement 24-hour pause rule. Create “Wishlist Parking Lot” doc. Add reward system: if item stays after 30 days and finances allow, approve intentionally.

Issue: Major unexpected expense (car, medical).
   - Solution: Trigger Emergency Protocol—tap emergency fund, adjust PBS bucket order (pause Bucket 3), schedule 15-minute resilience meeting to re-plan within 48 hours.

Issue: Tracking fatigue.
   - Solution: Switch from manual tracking to automated app integration (Tiller, Monarch). Define Minimum Viable Tracking: weekly snapshot vs. daily.

CASE STUDY: FREELANCE DESIGNER WITH IRREGULAR INCOME
Situation: Income swings from $3K to $12K monthly; felt guilt about vacations.
Actions:
   - Built Base Pay of $4K from Buffer.
   - Automation: 10% to taxes, 20% to emergency, 15% to investments.
   - Weekly money date shifted to Monday mornings. Introduced project pipeline tracker to forecast cash.
Results after 6 months:
   - Emergency fund fully funded at $18K.
   - Took two pre-planned trips without credit card balance.
   - Confidence score rose from 4 to 8.

COACHING PROMPTS
   - “What is the purpose of each dollar I earned this month?”
   - “Where am I pre-spending my energy on decisions a system could automate?”
   - “How will future-me thank me for today’s allocation?”
   - “What happens if I do nothing? What happens if I execute this plan for 90 days?”

Remember: A 360° cashflow system is not about deprivation; it is about directing resources toward the life you choose. When visibility, automation, and rituals align, spending becomes an expression of values—not a source of anxiety.`,
    tags: [
      "budgeting",
      "cashflow_management",
      "automation",
      "financial_planning",
      "money_dates"
    ]
  },
  {
    source: "finance_enhanced",
    category: "emergency_fund",
    title: "Emergency Fund Power Stack: Building Liquidity That Actually Protects You",
    content: `An emergency fund is more than a number in a savings account; it is a comprehensive liquidity strategy that keeps you calm when life punches first. This manual helps you define the right tier of reserves, automate contributions even with competing goals, and deploy funds without derailing long-term plans.

MISSION SNAPSHOT
Objective: Hold strategic cash reserves that cover 3-12 months of essential expenses plus a rapid-access line for catastrophic events.
Frameworks Included: Tiered Liquidity Ladder, Funding Acceleration Protocol, Replenishment Sprint, Emotional Safety Scripts, Real-World Case Libraries.

PHASE 1: DESIGN YOUR LIQUIDITY LADDER (75 MINUTES)
1. Define Essential Expense Baseline
   - List all non-negotiable expenses: housing, utilities, food, insurance, debt minimums, medical, transportation, caregiving.
   - Use the Essential Expense Calculator template (monthly average, seasonal variance, quarterly items).
   - Calculate Baseline Needed: average monthly essentials × desired months (minimum 3, stretch 6, stability 9, entrepreneurial 12).

2. Build Tier Structure
   Tier 1 Micro-Cushion (Days 0-1)
     - Amount: $500-$1,500 accessible instantly.
     - Location: Checking account with separate nickname (“Safety Buffer”). Auto-refill monthly.
   Tier 2 Core Emergency Fund (Days 1-3)
     - Amount: 3-6 months essentials.
     - Location: High-yield savings (FDIC insured). Link only to primary checking.
   Tier 3 Strategic Reserves (Days 3-7)
     - Amount: Additional 3-6 months for entrepreneurs or single-income households.
     - Location: Money market, short-term treasury ladder, or cash management account.
   Tier 4 Credit Backstop (Only if disciplined)
     - Tools: 0% credit line, HELOC, business line of credit. Use as final resort while Tier 2 or 3 replenish.

3. Risk Profiling
   - Assess volatility factors: job stability, dependents, health conditions, region-specific risks (natural disasters).
   - Decision Matrix: High risk → aim Tier 3; Low risk → Tier 2 sufficient.

PHASE 2: FUNDING STRATEGIES (90 MINUTES)
1. Quickstart Sprint (First 30 days)
   - Objective: Reach $1,000-$2,500 quickly.
   - Actions: Sell unused items, redirect one-time windfalls (tax refund), pause discretionary subscriptions, take short-term gig.
   - Script for household rally: “Our first milestone protects us from using credit cards when life happens. Let’s power through together for 30 days.”

2. Automation Engine
   - Determine Contribution Rate: Target fund total ÷ target months = monthly contribution.
   - Split contributions across paychecks to reduce perception of loss.
   - Use variable income formula: contribute percentage of each deposit (e.g., 15%). Use rule-based transfer in banking app.

3. Contribution Accelerators
   - Employer programs: payroll splits, direct deposit to savings.
   - Savings challenge: 52-week ladder (start $10, increase $5 weekly).
   - Round-up automation with weekly sweep to Tier 1.

4. Competing Priority Negotiation
   - Decision framework: If consumer debt interest > fund interest, maintain minimum contributions while paying debt. Use blended approach (70% debt, 30% emergency).
   - Template conversation with financial coach: “Based on my risk profile, here is the minimum cash cushion I need while accelerating debt payoff—can we stress test this plan?”

PHASE 3: ACTIVATION & REPLENISHMENT PROTOCOLS
1. Emergency Activation Criteria Checklist
   - Does the event threaten shelter, transportation, health, or income continuity?
   - Is the expense unavoidable and time-sensitive?
   - Have alternative funding sources been explored (insurance, warranties)?
   - If yes to first two and no to third, authorize withdrawal.

2. Deployment Script
   - “We built this fund for moments like this. We are authorizing $2,400 to cover the transmission rebuild. Our peace of mind is more valuable than keeping the account untouched.”
   - Document withdrawal in Emergency Log (date, reason, amount, plan to replenish).

3. Replenishment Sprint Roadmap
   - Stage 1 (First 7 days): Pause non-essential lifestyle inflators. Channel freed cash to refuel.
   - Stage 2 (30 days): Add temporary side income or overtime. Allocate 80% of extra earnings to fund, 20% to rest to avoid burnout.
   - Stage 3 (90 days): Resume standard contributions once balance restored.
   - Include motivational checkpoints: celebrate at 33%, 66%, 100% replenishment.

4. Emotional Recovery Plan
   - Use journaling prompts: “How did this fund cushion the stress?” “What systems worked well?”
   - Schedule appreciation ritual: share gratitude with partner/team for staying disciplined earlier.

TOOLS & TEMPLATES
1. Emergency Fund Tracker Dashboard
   - Visual progress bars for each tier.
   - Auto-calc: months of expenses covered, date to full funding at current contribution rate.
   - Alert rules for dropping below thresholds.

2. Risk Scenario Playbook
   - Table listing top 10 risks (job loss, medical, pet emergency). Columns: probability, potential cost, mitigation plan, required documentation.

3. Conversation Scripts
   - Negotiating medical bills: “I’d like to discuss financial assistance or payment options. Here is the amount I can commit monthly.”
   - Asking family to respect boundaries: “We’re prioritizing replenishing our emergency savings. We can’t lend money right now without compromising our safety net.”

4. Insurance Synergy Checklist
   - Ensure health, disability, renter’s/home insurance align with cash reserves strategy.
   - Example: If high-deductible health plan, ensure Tier 2 covers deductible + out-of-pocket maximum.

CASE LIBRARY
Case 1: Dual-income household facing layoffs
   - Built Tier 2 to 5 months in 10 months through automated transfers and bonus allocation.
   - When one partner laid off, fund covered expenses for 4 months while job search concluded. Avoided credit card debt completely.

Case 2: Entrepreneur with seasonal revenue
   - Tier 1: $2,000 buffer in checking.
   - Tier 2: $24,000 across two high-yield accounts.
   - Tier 3: $30,000 in treasury ladder staggering maturities every month.
   - During slow quarter, activated Tier 3 to cover payroll; replenished within 6 months post-peak season.

Case 3: Single parent
   - Leveraged micro-savings (round-ups) and tax credits to build starter fund.
   - Created Community Support Matrix listing childcare backups, meal trains, grant resources.
   - Emergency fund provided emotional confidence to pursue better job.

TROUBLESHOOTING MATRIX
Issue: Contributions stall after first month.
   - intervention: switch to smaller weekly transfers; set progress notifications via banking app.

Issue: Temptation to raid fund for non-emergencies.
   - intervention: rename account “Crisis Shield”. Place visual reminder of goals near desk. Enforce 48-hour rule with accountability partner.

Issue: Unexpected dual emergency (home + medical).
   - intervention: deploy Tier 2 and Tier 4, immediately request payment plans, notify insurance, set 6-month replenishment sprint with targeted side income.

Issue: Fear of depleted fund causes paralysis.
   - intervention: pre-plan re-entry actions, maintain line of credit unused but available, schedule coach session to rebuild confidence.

Remember: The power of an emergency fund lies in certainty. When you know exactly how to activate, replenish, and protect it, crises become setbacks—not financial catastrophes.`,
    tags: [
      "emergency_fund",
      "savings_strategy",
      "financial_resilience",
      "risk_management",
      "cash_reserves"
    ]
  },
  {
    source: "finance_enhanced",
    category: "debt_reduction",
    title: "The Debt Freedom Flight Plan: Strategy, Scripts, and Momentum",
    content: `Debt payoff succeeds when you have mission clarity, a tactical repayment order, and a support system that keeps you engaged. This flight plan guides you through building a payoff command center, choosing snowball or avalanche with data and psychology, negotiating better terms, and sustaining motivation through setbacks.

MISSION SNAPSHOT
Call Sign: Operation Debt Freedom.
Timeline: Phase gates at 30, 90, and 180 days; full payoff horizon tailored via payoff calculator.
Instrumentation: Debt Dashboard, Payment Automation Map, Motivation Arsenal, Relapse Recovery Framework.

PHASE 1: DIAGNOSE & STRATEGIZE (120 MINUTES)
1. Comprehensive Debt Inventory (30 minutes)
   - Gather statements for every obligation: credit cards, personal loans, medical bills, student loans, auto, buy-now-pay-later.
   - Record in Debt Dashboard Template: lender, balance, APR, minimum payment, due date, compounding type, promotional terms.
   - Identify any delinquencies or accounts in collections.

2. Cashflow Readiness Assessment (20 minutes)
   - Determine available surplus by subtracting essential expenses from net income.
   - Set baseline emergency cushion ($1,000-$2,500) to prevent relapses.
   - If negative cashflow, implement quick wins: renegotiate bills, pause discretionary categories for 30 days, pursue temporary income boost.

3. Strategy Selection Lab (35 minutes)
   - Run numbers in Payoff Simulator for both Snowball and Avalanche strategies.
   - Snowball advantage: quicker wins, emotional reinforcement. Avalanche advantage: interest savings.
   - Hybrid approach: Snowball for first three accounts, then switch to Avalanche for large balances.
   - Document rationale and communicate with accountability partner.

4. Timeline & Milestone Planning (15 minutes)
   - Use Gantt-style visual showing target payoff dates per debt.
   - Insert celebration milestones at each paid-off account and every $5K eliminated.

5. Stakeholder Communication (20 minutes)
   - Script for partner or family: “We’re committing to pay off $35,000 in 30 months. Here’s the plan, what support I’ll need, and how we’ll celebrate along the way.”
   - If co-signers involved, align expectations early.

PHASE 2: EXECUTION SYSTEMS (90 MINUTES)
1. Payment Automation Map
   - Schedule minimum payments with autopay to prevent late fees.
   - Direct extra payments via manual transfer on pay day to maintain sense of control.
   - Use cascade method: once debt A cleared, automate its payment amount to debt B within 24 hours.

2. Negotiation Playbook
   - Interest rate reduction call script: “I’ve been a customer for X years, payment history solid. Are there hardship programs or rate reductions available?”
   - Balance settlement negotiation: “I can offer lump sum of Y, contingent on written agreement marking the account paid in full.”
   - Re-age delinquent accounts: request lenders to re-age after three consecutive on-time payments.
   - Document outcomes in Negotiation Log.

3. Trigger-Based Budget Adjustments
   - Build “What if” table: if car repair >$600, reduce entertainment by $200 for two months.
   - Maintain Sinking Funds for predictable expenses (car maintenance, holidays) to avoid new debt.

4. Accountability Structure
   - Debt freedom command center in Trello/Notion: lanes for Debts, Actions Completed, Upcoming Calls, Wins.
   - Weekly check-in with accountability buddy; share screenshot of balances.
   - Monthly email update to supportive community or coach summarizing progress.

PHASE 3: MINDSET & MOTIVATION
1. Identity Shift Exercises
   - Affirmation anchored in action: “I am someone who keeps promises to future-me by paying XXX today.”
   - Visualization routine: picture mailbox empty of bills, bank account growing.

2. Motivation Arsenal
   - Create Debt Thermometer visuals for each account; color in as balance drops.
   - Playlist of energizing songs for payment sessions.
   - “Why Wall” with photos representing freedom goals (travel, family stability, philanthropy).

3. Relapse Recovery Framework
   - Step 1: Acknowledge slip without shame (“I used credit for an unplanned expense; time to activate recovery.”).
   - Step 2: Analyze trigger (fatigue, social pressure, emergency). Document in Trigger Journal.
   - Step 3: Adjust plan: increase payments next month, temporarily increase income.
   - Step 4: Reaffirm goal with partner/coach within 24 hours.

4. Emotional Safety Scripts
   - Dealing with unsupportive friend: “I’m choosing debt freedom over brunch this month. Let’s plan a low-cost hang instead.”
   - Declining impulse buys: “Not in the plan. I’ll revisit after I clear the next milestone.”

TOOLS & TEMPLATES
1. Debt Freedom Spreadsheet
   - Auto-calculates interest saved vs. minimum payments only.
   - Scenario tab for side income injection (e.g., $400 extra = months saved).

2. Bill Reduction Tracker
   - Columns: Provider, Current Rate, Negotiated Rate, Savings per Year, Next Review Date.

3. Side Income Idea Bank
   - Tiered by effort (Micro gigs vs. Contract work).
   - Include hourly rate, upfront cost, ramp time, energy impact.

4. Mini-Debt Challenges
   - 7-Day No-Spend Sprint with daily prompts.
   - 30-Day Sell Something Challenge (list one item daily on marketplace).

CASE STUDIES
Case 1: $42K credit card debt, dual income
   - Strategy: Hybrid (Snowball first three cards, Avalanche afterward).
   - Negotiated 4% APR reduction, saved $3,200 interest.
   - Added $600 monthly freelance income.
   - Paid off in 26 months, credit score improved 110 points.

Case 2: Medical debt in collections
   - Sent debt validation letter, negotiated pay-for-delete at 55% balance.
   - Used HSA reimbursement to cover portion; remainder addressed via payment plan.

Case 3: Student loans across multiple servicers
   - Consolidated federal loans for single payment, kept access to income-driven repayment.
   - Channeled employer student loan benefit ($100/month) into extra payment.
   - Joined public accountability group, completed challenge to pay $12K extra in one year.

TROUBLESHOOTING MATRIX
Issue: Motivation dips after initial excitement.
   - intervention: Schedule success reminders, revisit Why Wall, book call with mentor, gamify progress by unlocking rewards (movie night) after each $1K reduction.

Issue: Surprise expense forces new debt.
   - intervention: activate emergency protocol, negotiate payment plans, increase income temporarily, recommit to plan, adjust payoff timeline without abandoning.

Issue: Partner resists spending cuts.
   - intervention: Align on shared goal, use values-based conversation, co-create fun low-cost activities, agree on personal fun money to reduce friction.

Issue: Mental burnout from frugality.
   - intervention: Introduce “Joy Surcharge” (5% of extra income reserved for fun). Ensure plan sustainable.

Remember: Debt freedom is the compound effect of consistent choices amplified by systems. Build the cockpit, follow your instruments, and celebrate every mile marker—because the destination is financial sovereignty.`,
    tags: [
      "debt_reduction",
      "debt_snowball",
      "debt_avalanche",
      "negotiation",
      "financial_mindset"
    ]
  },
  {
    source: "finance_enhanced",
    category: "investing",
    title: "Investing Launchpad: From First Dollar to Confident Portfolio Steward",
    content: `Investing is a system you design once and refine quarterly. This launchpad equips you to build a diversified, low-maintenance portfolio with clear contribution schedules, risk guardrails, and scripts for market turbulence, so you can grow wealth without losing sleep.

MISSION SNAPSHOT
Objective: Establish automated, tax-optimized investing across retirement and brokerage accounts tailored to time horizon and goals.
Components: Investor Identity Blueprint, Account Prioritization Ladder, Model Portfolios, Rebalancing Calendar, Emotional Discipline Toolkit.

PHASE 1: DEFINE YOUR INVESTOR DNA (75 MINUTES)
1. Clarify Goals & Time Horizons
   - Goals Matrix: list each goal (retirement, down payment, education fund, sabbatical). Note target amount, deadline, flexibility.
   - Classify horizon: short (<3 years), mid (3-7), long (7+). Investing is for mid/long horizons.

2. Risk Profile Assessment
   - Evaluate risk capacity (financial ability) and risk tolerance (emotional comfort).
   - Use Stress Test Worksheet: “How did I feel during past downturns?” “What percentage drop can I stomach before panic?”
   - Assign risk persona (Conservative, Balanced, Growth, Aggressive Growth).

3. Investor Policy Statement (IPS)
   - Draft 1-page IPS capturing goals, asset allocation targets, contribution plan, rules for when to adjust.
   - Example clause: “I will not sell equities during a downturn unless fundamentals change or my goals shift drastically.”

PHASE 2: ACCOUNT PRIORITIZATION & FUNDING
1. Account Ladder
   - Step 1: Employer plan up to match (free return).
   - Step 2: Roth IRA or Traditional IRA based on tax bracket.
   - Step 3: HSA if eligible (triple tax advantage).
   - Step 4: Taxable brokerage for additional investing.
   - Document contribution limits and deadlines in Contribution Calendar.

2. Automation Setup
   - Payroll deferrals for employer plan.
   - Monthly or bi-weekly auto-transfers to IRAs/brokerage.
   - Use “set and escalate” plan: increase contributions 1% every six months.

3. Fund Selection Playbook
   - Core: Low-cost index funds (Total US Market, Total International, Total Bond).
   - Evaluate expense ratios (<0.10%), tracking error, fund size.
   - Avoid overlapping funds that duplicate exposure.

4. Model Portfolios (examples)
   Conservative (70% bonds/30% stocks) / Balanced (60/40) / Growth (80/20) / Aggressive (90/10).
   - Provide ticker examples (VTI, VXUS, BND) or equivalents in employer plans.

PHASE 3: OPERATE YOUR PORTFOLIO
1. Contribution Rituals
   - Automate contributions on payroll dates.
   - Quarterly “Top-Up Day” to invest windfalls or leftover cash.

2. Rebalancing Protocol
   - Frequency: semi-annual or when allocation deviates by >5%.
   - Use Rebalance Checklist: check tax implications, prefer rebalancing within tax-advantaged accounts, use new contributions to correct drift.

3. Performance Review Meeting (Quarterly, 45 minutes)
   Agenda:
     - Review account balances vs. goals.
     - Update net worth tracker.
     - Confirm contributions on pace.
     - Log qualitative notes (confidence level, lessons).

4. Tax Optimization
   - Use tax-loss harvesting in taxable accounts to offset gains (document rules regarding wash sales).
   - Asset location strategy: bonds in tax-deferred, equities in Roth, REITs in tax-advantaged.

PHASE 4: BEHAVIORAL DEFENSES
1. Market Turbulence Scripts
   - “Markets are down 15%; what do we do?” Response: “We stick to IPS, invest on schedule, and rebalance if band breached.”
   - Pre-written letter to self: “Remember March 2020. Staying invested captured recovery.”

2. Noise Reduction Protocol
   - Limit market news to scheduled windows (e.g., 20 minutes Friday). Turn off push alerts.
   - Maintain curated list of trusted sources (Company investor relations, Bogleheads forum guides).

3. Accountability Mechanisms
   - Investment buddy or advisor review annually.
   - Document changes with reason: no spontaneous allocation shifts.

TOOLS & TEMPLATES
1. Investor Launch Checklist
   - Steps from opening accounts to first contributions, including beneficiary designations.

2. Portfolio Tracking Dashboard
   - Display asset allocation vs. target, contributions year-to-date, internal rate of return.

3. Market Event Playbook
   - Outline actions for scenarios: correction (-10%), bear market (-20%), job loss, large bonus.

4. Education Library
   - Curated resources per level: beginner (books, podcasts), intermediate (whitepapers), advanced (factor investing guides).

CASE STUDIES
Case 1: 28-year-old professional starting from zero
   - Set contributions: 10% 401(k) plus Roth IRA maxed.
   - 90/10 allocation using target-date fund in 401(k), three-fund portfolio in IRA.
   - Automated quarterly increase of 1%. After two years, saving 16% of income.

Case 2: Couple with uneven risk tolerance
   - Created joint IPS aligning on 70/30 allocation.
   - Used separate accounts but shared dashboard.
   - Added “Sleep Well Fund”: 6 months cash to prevent panic selling. Maintained discipline through 2022 volatility.

Case 3: Business owner with irregular income
   - Implemented Solo 401(k) with profit-sharing component.
   - Used variable contribution formula: 20% of net business profit quarterly.
   - Added quarterly dividend sweep into brokerage.

TROUBLESHOOTING MATRIX
Issue: Analysis paralysis choosing funds.
   - intervention: default to low-cost target-date fund or three-fund portfolio. Set review in six months.

Issue: Market crash triggers fear.
   - intervention: revisit IPS, review market history chart, talk with accountability partner, refrain from logging into account for predetermined cooling period.

Issue: Over-diversification with overlapping funds.
   - intervention: consolidate to core funds, sell redundant positions in tax-advantaged accounts first.

Issue: Cash drag building up.
   - intervention: schedule automatic sweep of checking surplus above threshold to brokerage monthly.

Remember: Wealth grows when systems run regardless of mood. Define your investor identity, automate contributions, and let disciplined routines outrun market noise.`,
    tags: [
      "investing",
      "wealth_building",
      "portfolio_management",
      "financial_planning",
      "behavioral_finance"
    ]
  },
  {
    source: "finance_enhanced",
    category: "retirement",
    title: "Retirement Architect Blueprint: Designing a Lifetime Income Engine",
    content: `Retirement readiness goes beyond hitting a number—it requires coordinated savings, tax strategy, income modeling, and lifestyle planning. This blueprint walks you through building a comprehensive retirement architecture from accumulation to decumulation, so you can transition confidently without guesswork.

MISSION SNAPSHOT
Vision: Replace at least 80% of pre-retirement lifestyle costs with diversified income streams by a chosen retirement age.
Components: Retirement Readiness Dashboard, Future Lifestyle Canvas, Tax Diversification Map, Withdrawal Order Playbook, Contingency Plans.

PHASE 1: IMAGINE YOUR FUTURE LIFE (90 MINUTES)
1. Lifestyle Visioning
   - Use the “Retirement Lifestyle Canvas” to define daily rhythms, locations, roles, health priorities, relationships, contribution goals.
   - Write Future Headlines: “It’s 2035. We spend mornings volunteering at the community garden, afternoons consulting twice a week.”
   - Estimate lifestyle costs using scenario planner: Essential (housing, food, healthcare), Discretionary (travel, hobbies), Legacy (gifts, philanthropy).

2. Gap Analysis
   - Calculate current annual living cost. Projections add 2.2% inflation baseline.
   - Determine desired replacement ratio (70-90% typical, adjust for debt-free status and lifestyle changes).
   - Inventory existing assets: retirement accounts, brokerage, equity in business/property, pensions, Social Security estimates.

3. Retirement Readiness Score
   - Use Monte Carlo simulation or financial planning software to assess probability of success at current savings rate.
   - Score categories: Red (<60% success), Yellow (60-85%), Green (85%+). Set improvement plan accordingly.

PHASE 2: BUILD YOUR SAVINGS ENGINE
1. Contribution Strategy
   - Save minimum 15% of gross income; adjust higher if starting after age 35.
   - Catch-up contributions after age 50 ($7,500 additional 401(k), $1,000 IRA).
   - Establish automatic annual increase aligned with raises.

2. Tax Diversification Map
   - Build across Tax-Deferred (401(k), Traditional IRA), Tax-Free (Roth IRA, Roth 401(k)), Taxable accounts.
   - Aim for balance to provide withdrawal flexibility later.

3. Investment Allocation by Life Stage
   - Accumulation Phase: Growth-focused (80-90% stocks) with global diversification.
   - Pre-Retirement (5-10 years out): gradually shift to 60-70% stocks, increase bonds/cash for stability.
   - Decumulation (retirement years): bucket strategy—Bucket 1 (cash 1-2 years expenses), Bucket 2 (bonds for 3-7 years), Bucket 3 (equities for 7+ years).

4. Health Savings Strategy
   - Maximize HSA for future healthcare costs; invest HSA funds for long-term growth while covering current health costs via cash flow if feasible.

PHASE 3: PLAN THE TRANSITION
1. Retirement Date Stress Test
   - model retiring at 62, 65, 68. Evaluate impact on Social Security, portfolio longevity, lifestyle.
   - Create “Retirement Rehearsal” weekend: live on projected retirement budget for 30 days to validate assumptions.

2. Social Security Optimization
   - Use benefit estimator; compare claiming at 62 vs. FRA vs. 70.
   - Strategy: Higher earner delays to 70 to maximize survivor benefit; coordinate spousal claims.

3. Pension & Annuity Decisions
   - Evaluate lump-sum vs. annuity options; consider inflation riders.
   - Spreadsheet: compare net present value, break-even age, survivor benefits.

4. Debt Elimination Timeline
   - Target entering retirement with no high-interest debt. Determine final paydown schedule for mortgage, HELOC, student loans.

PHASE 4: DE-CUMULATION PLAYBOOK
1. Withdrawal Order Framework
   - Years 1-5: Tap taxable accounts first (harvest long-term gains strategically).
   - Next: Draw from tax-deferred up to standard deduction to optimize taxes.
   - Delay Roth withdrawals to grow tax-free unless rebalancing tolerance or legacy goals.

2. Safe Withdrawal Rate Customization
   - Start with 4% rule baseline, adjust for longevity, flexibility, expected large expenses.
   - Build “Guardrail Strategy”: increase spending up to 10% when portfolio exceeds benchmarks, reduce by 10% if markets underperform.

3. Annual Retirement Operating System
   - January: Update net worth, confirm spending plan, adjust withholding.
   - April: Evaluate tax strategies (Roth conversions, Qualified Charitable Distributions).
   - July: Mid-year review of spending vs. plan.
   - October: Medicare open enrollment decisions.

4. Contingency Planning
   - Create “What If” matrix for healthcare shock, market crash, widowhood.
   - Set up estate plan: wills, powers of attorney, beneficiary updates, digital assets inventory.

TOOLS & TEMPLATES
1. Retirement Dashboard (Spreadsheet or App)
   - Sections for contributions, investment performance, probability of success, healthcare fund status, action items.

2. Conversation Scripts
   - Discussing retirement timeline with partner: “I’m targeting 65, because it aligns with pension vesting. Let’s walk through how this impacts your goals.”
   - Talking to adult children about expectations: “Here’s what support we can provide, what we can’t, and how we’re securing our own future.”

3. Income Bridge Planner
   - Chart bridging gap between retirement date and Social Security/pension start using cash bucket, part-time work, rental income.

4. Lifestyle Experiment Planner
   - Schedule sabbatical-style experiments (month in new city, volunteer commitments) before retiring fully.

CASE STUDIES
Case 1: Corporate professional aiming for retirement at 60
   - Increased contributions to 20%, maxed HSA, executed Roth conversions during low-income sabbatical.
   - Built bucket strategy; cash bucket covers first 24 months.
   - Achieved 92% success probability in plan.

Case 2: Small business owners
   - Sold business with installment payments providing first five years of income.
   - Invested proceeds according to guardrail strategy.
   - Coordinated glide path to delay Social Security until 70.

Case 3: Late starter at age 45
   - Aggressive savings rate (30%), downsized home, used catch-up contributions, part-time consulting planned post-retirement.
   - Focused on building Roth space via backdoor contributions.

TROUBLESHOOTING MATRIX
Issue: Behind on savings
   - intervention: increase savings rate, delay retirement date, explore part-time work, reduce lifestyle expectations.

Issue: Market downturn near retirement
   - intervention: execute contingency plan—pause retirement for 1-2 years if feasible, shift to bond/cash buckets, avoid selling equities at bottom.

Issue: Fear of spending in retirement (bag lady syndrome)
   - intervention: set up guaranteed income streams (annuities), implement guardrails, work with advisor/coach for accountability.

Issue: Healthcare cost shock
   - intervention: maintain long-term care plan, fund HSA, evaluate hybrid insurance.

Remember: Retirement success is engineered, not guessed. Architect your income engine, test it before launch, and review annually to stay in control no matter how life, markets, or health evolve.`,
    tags: [
      "retirement_planning",
      "financial_independence",
      "tax_strategy",
      "withdrawal_strategy",
      "lifestyle_design"
    ]
  }
];

export const seed = action({
  args: {},
  handler: async (ctx) => {
    let loaded = 0;
    let errors = 0;
    const results: Array<{ title: string; success: boolean; error?: string }> = [];

    for (const scenario of FINANCE_SCENARIOS_ENHANCED) {
      try {
        await ctx.runAction(api.embeddings.generateKnowledgeEmbedding, {
          source: scenario.source,
          category: scenario.category,
          title: scenario.title,
          content: scenario.content,
          tags: scenario.tags
        });

        loaded++;
        results.push({ title: scenario.title, success: true });
      } catch (error) {
        errors++;
        results.push({
          title: scenario.title,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return {
      loaded,
      errors,
      total: FINANCE_SCENARIOS_ENHANCED.length,
      results
    };
  }
});
