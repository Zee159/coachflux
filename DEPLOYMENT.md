# CoachFlux Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Anthropic API key configured in Convex dashboard
- [ ] Production Convex deployment created
- [ ] Frontend build configured with production URLs
- [ ] CSP headers configured for hosting platform

### 2. Data Seeding
- [ ] Seed initial organizations with values
- [ ] Create admin users
- [ ] Test data in place (optional)

### 3. Security Review
- [ ] Rate limits configured
- [ ] Input validation tested
- [ ] Safety incident logging verified
- [ ] No PII in logs confirmed
- [ ] Banned terms list reviewed

### 4. Testing
- [ ] Run all evaluation harness tests
- [ ] Manual QA through full GROW flow
- [ ] Test error handling and edge cases
- [ ] Load testing (10-50 concurrent users)

## Backend Deployment (Convex)

### Step 1: Deploy Backend
```bash
# From project root
pnpm convex:deploy
```

This will:
- Push schema to production
- Deploy all functions (queries, mutations, actions)
- Generate production API URL

### Step 2: Set Environment Variables
1. Go to Convex Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   OPENAI_API_KEY=sk-proj-...
   ```
3. Save and redeploy if needed

### Step 3: Verify Deployment
```bash
# Test a query from CLI
npx convex run queries:getOrg '{"orgId":"..."}'
```

## Frontend Deployment

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
pnpm build
vercel --prod
```

**Environment Variables in Vercel:**
```
VITE_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

**Vercel Config** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https://your-deployment.convex.cloud; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Option B: Netlify

```bash
# Build
pnpm build

# Deploy
netlify deploy --prod --dir=dist
```

**Environment Variables:**
```
VITE_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

**Netlify Config** (`netlify.toml`):
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self' https://your-deployment.convex.cloud"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
```

### Option C: Static Hosting (AWS S3, Cloudflare Pages, etc.)
```bash
pnpm build
# Upload contents of /dist to your static host
```

## Post-Deployment

### 1. Seed Production Data
```bash
# Create initial org
npx convex run mutations:createOrg '{
  "name": "Pilot Organization",
  "values": [
    {"key": "Integrity", "description": "We act with honesty"},
    {"key": "Innovation", "description": "We embrace change"},
    {"key": "Collaboration", "description": "We work together"},
    {"key": "Excellence", "description": "We strive for quality"},
    {"key": "Customer-First", "description": "Customers are our priority"}
  ]
}'
```

### 2. Create Pilot Users
```bash
# For each pilot user
npx convex run mutations:createUser '{
  "authId": "user@company.com",
  "orgId": "...",
  "role": "member",
  "displayName": "User Name"
}'
```

### 3. Set Up Monitoring

**Convex Dashboard:**
- Enable function logs
- Set up alerts for errors
- Monitor token usage

**Custom Monitoring:**
```typescript
// Add to convex/metrics.ts
export const validatorFailureRate = query({
  args: { windowHours: v.number() },
  handler: async (ctx, args) => {
    const from = Date.now() - args.windowHours * 3600000;
    const incidents = await ctx.db
      .query("safetyIncidents")
      .filter((q) => q.gte(q.field("createdAt"), from))
      .collect();
    
    const total = incidents.length;
    const highSeverity = incidents.filter(i => i.severity === "high").length;
    
    return { total, highSeverity, rate: total / args.windowHours };
  }
});
```

**Alert Rule:**
- If validator failure rate > 10% in 24h → Alert ops team

### 4. Legal and Compliance

**Add Disclaimers:**
- Terms of Service
- Privacy Policy
- Safety Notice: "This is not therapy. For urgent matters, contact HR or a healthcare professional."

**Example Banner Component:**
```tsx
function SafetyBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <p className="text-sm text-yellow-800">
        <strong>Important:</strong> CoachFlux is a reflection tool, not therapy
        or medical advice. For urgent matters, please contact your HR department
        or a licensed healthcare professional.
      </p>
    </div>
  );
}
```

## Rollback Plan

If issues arise:

1. **Revert Convex Deployment:**
   ```bash
   # List deployments
   npx convex deployments list
   
   # Rollback to previous
   npx convex deployments rollback [deployment-id]
   ```

2. **Revert Frontend:**
   - Vercel/Netlify: Revert to previous deployment in dashboard
   - Static: Re-upload previous build

3. **Database Issues:**
   - Convex maintains automatic backups
   - Contact Convex support for point-in-time recovery

## Scaling Considerations

### Rate Limits
Current limits (per user):
- 1 active session
- 20 LLM calls/day

To increase:
```typescript
// convex/rateLimits.ts
const DAILY_LIMIT = 50; // Increase from 20
const CONCURRENT_SESSIONS = 2; // Increase from 1
```

### Cost Management
- Anthropic Claude Sonnet 4: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Estimate: 1000 tokens per session × 50 sessions/day = ~$0.75/day
- Monitor usage in Anthropic Console

### Performance
- Convex auto-scales
- Frontend is static (no server load)
- LLM calls are the bottleneck (~2-5s each)
- Consider caching common responses (future optimization)

## Maintenance

### Weekly
- [ ] Review safety incidents
- [ ] Check validator failure rate
- [ ] Monitor token usage and costs

### Monthly
- [ ] Review user feedback
- [ ] Update prompts if needed
- [ ] Run evaluation harness
- [ ] Review and update org values

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Feature prioritization
- [ ] Cost optimization

## Support Contacts

- **Convex Issues:** support@convex.dev
- **Anthropic Issues:** support@anthropic.com
- **Internal Team:** [Your team contact]

---

**Remember: Ship incrementally, monitor closely, iterate quickly.**
