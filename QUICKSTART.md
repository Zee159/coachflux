# CoachFlux Quick Start

Get running in 5 minutes.

## Step 1: Install Dependencies
```bash
pnpm install
```

## Step 2: Initialize Convex
```bash
pnpm convex:dev
```

This will:
- Open the Convex dashboard
- Create your development deployment
- Generate `.env.local` with your `VITE_CONVEX_URL`

## Step 3: Set OpenAI API Key

In the Convex dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add variable:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-proj-...` (your OpenAI API key)
3. Click **Save**

## Step 4: Start Development Server

In a new terminal:
```bash
pnpm dev
```

Visit: `http://localhost:3000`

## Step 5: Run Demo

1. Click **Start Demo** on setup page
2. Enter your organization name and display name
3. Click **New Session** to start a GROW coaching session
4. Follow the prompts through each step:
   - **Goal**: What do you want to achieve?
   - **Reality**: What's your current situation?
   - **Options**: What are your possible approaches?
   - **Will**: What specific actions will you take?
   - **Review**: Summary and alignment score

## Troubleshooting

### "OPENAI_API_KEY not configured"
- Make sure you set the environment variable in Convex dashboard
- Wait a few seconds for the deployment to update
- Refresh your browser

### "Failed to fetch"
- Ensure `pnpm convex:dev` is still running
- Check that `.env.local` has the correct `VITE_CONVEX_URL`
- Restart both servers

### Rate Limiting
- Demo mode has no rate limits
- Production limits: 1 active session per user, 20 LLM calls/day

## Next Steps

- Review `COACHFLUX_MVP_GUIDE.md` for full implementation details
- Customize org values in `DemoSetup.tsx`
- Adjust prompts in `convex/prompts.ts`
- Add your own coaching frameworks in `src/frameworks/`
- Run evaluation tests in `tests/evals/`

## Architecture Overview

```
User Input (800 char limit)
    ↓
Primary LLM Call (temp=0, JSON mode)
    ↓
Validator LLM Call (checks schema + banned terms)
    ↓
✓ Pass → Store reflection + advance step
✗ Fail → Log safety incident + show error
```

**Key Files:**
- `convex/schema.ts` - Database tables
- `convex/coach.ts` - LLM coordinator
- `convex/prompts.ts` - System prompts
- `src/components/SessionView.tsx` - Main UI

---

**Ready to ship? See `DEPLOYMENT.md` for production setup.**
