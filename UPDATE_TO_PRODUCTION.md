# Switch to Production Environment

## ✅ Production Deployment Complete

Your schema has been successfully deployed to production:
- **Production URL**: `https://original-owl-376.convex.cloud`
- **Dev URL**: `https://canny-wren-312.convex.cloud`

The `feedback` table with all indexes is now live in **production**! 🎉

## Update Environment Variables

### Option 1: Manual Update (Recommended for Local Dev)

Edit `.env.local` and change:

```bash
# FROM (Dev):
VITE_CONVEX_URL=https://canny-wren-312.convex.cloud
CONVEX_DEPLOYMENT=dev:canny-wren-312

# TO (Production):
VITE_CONVEX_URL=https://original-owl-376.convex.cloud
CONVEX_DEPLOYMENT=prod:original-owl-376
```

### Option 2: Use PowerShell Command

Run this in your terminal:

```powershell
# Update .env.local to production
@"
# Deployment used by npx convex dev
CONVEX_DEPLOYMENT=prod:original-owl-376 # team: al-singh, project: coachflux
VITE_CONVEX_URL=https://original-owl-376.convex.cloud
"@ | Set-Content .env.local
```

### Option 3: Create Separate Production File

Keep both environments:

**`.env.local`** (for development):
```bash
CONVEX_DEPLOYMENT=dev:canny-wren-312
VITE_CONVEX_URL=https://canny-wren-312.convex.cloud
```

**`.env.production`** (for production builds):
```bash
CONVEX_DEPLOYMENT=prod:original-owl-376
VITE_CONVEX_URL=https://original-owl-376.convex.cloud
```

Then build with:
```bash
pnpm build --mode production
```

## Verify Production Deployment

1. **Check Convex Dashboard**: 
   - Go to https://dashboard.convex.dev/d/original-owl-376
   - You should see the `feedback` table listed

2. **Test the App**:
   ```bash
   # Restart your dev server to pick up new env vars
   pnpm dev
   ```

3. **Submit Test Feedback**:
   - Open a session
   - Click feedback widget
   - Submit feedback
   - Check production dashboard for the entry

## Environment Comparison

| Environment | URL | Use Case |
|------------|-----|----------|
| **Dev** | `canny-wren-312.convex.cloud` | Local development & testing |
| **Prod** | `original-owl-376.convex.cloud` | Live application |

## Important Notes

⚠️ **Data Separation**: Dev and prod have separate databases. Data in dev won't appear in prod.

✅ **Schema Synced**: Both environments now have the same schema with the `feedback` table.

🔄 **Switching**: You can switch between environments by changing `VITE_CONVEX_URL` in `.env.local`

## Recommended Workflow

1. **Development**: Use dev environment (`canny-wren-312`)
2. **Testing**: Test features in dev first
3. **Deploy**: Run `npx convex deploy` to push to prod
4. **Production**: Update `.env.local` to prod URL for final testing
5. **Build**: Run `pnpm build` for production deployment

---

**Current Status**: 
- ✅ Schema deployed to production
- ✅ `feedback` table created in prod
- ✅ All indexes added
- ⏳ Update `.env.local` to use production URL
