# Testing Workflow

**IMPORTANT**: Always follow this workflow before committing and pushing changes to ensure quality and prevent breaking production.

## Pre-Commit Testing Checklist

Before running `git commit`, complete ALL steps below:

### 1. Build Verification
```bash
npm run build
```
- ✅ Build must complete without errors
- ✅ Check for TypeScript errors
- ✅ Check for linting warnings
- ✅ Verify all imports resolve correctly

### 2. Local Testing
```bash
npm run dev
```
- ✅ Server starts without errors
- ✅ No console errors on startup
- ✅ Visit http://localhost:3000

### 3. Browser UX Testing

**Basic Functionality:**
- [ ] Page loads successfully (< 5 seconds)
- [ ] Map renders with OpenStreetMap tiles
- [ ] No console errors in DevTools
- [ ] No network errors in DevTools Network tab

**Data Loading:**
- [ ] Incidents load from Seattle Fire API
- [ ] Statistics panel shows correct counts
- [ ] Incidents list appears in sidebar
- [ ] Map markers appear for geocoded incidents

**Filtering:**
- [ ] Date picker works and updates data
- [ ] Incident type dropdown filters correctly
- [ ] Incident level dropdown filters correctly
- [ ] Location search filters correctly
- [ ] "Clear Filters" button resets all filters
- [ ] Statistics update when filters change

**Map Interaction:**
- [ ] Can zoom in/out on map
- [ ] Can pan/drag map
- [ ] Clicking markers shows incident details popup
- [ ] Popup displays all incident information

**Mobile Responsiveness:**
- [ ] Resize browser to mobile width (< 768px)
- [ ] Sidebar and map layout adapts properly
- [ ] All controls remain accessible
- [ ] Map remains functional on small screens

### 4. Check for Breaking Changes

**API Route:**
- [ ] `/api/incidents` responds successfully
- [ ] Returns valid JSON
- [ ] Contains expected incident fields
- [ ] Geocoding works (check console for cache hits/misses)

**Database:**
- [ ] Supabase connection works
- [ ] Can read from geocoded_addresses table
- [ ] Can write to geocoded_addresses table
- [ ] RLS policies allow necessary operations

**Environment Variables:**
- [ ] All required vars are set in `.env.local`
- [ ] No hard-coded secrets in code
- [ ] `.env.local.example` is up to date

### 5. Verify Deployment Readiness

**Before pushing to GitHub:**
- [ ] All tests pass locally
- [ ] No `console.log` debugging statements left in code
- [ ] No commented-out code blocks (clean up)
- [ ] Dependencies in package.json are up to date
- [ ] README/SETUP.md reflect any new setup steps

**After pushing to GitHub:**
- [ ] Wait for Vercel deployment to complete
- [ ] Check deployment logs for errors
- [ ] Visit production URL: https://seattle-response-map.vercel.app/
- [ ] Repeat browser UX testing on production
- [ ] Verify environment variables are set in Vercel

## When Testing Workflow Was Not Followed

**Issue**: Changes pushed without local testing
**Result**: 
- Breaking changes deployed to production
- Users experience errors
- Need emergency rollback or hotfix
- Lost time debugging in production

**Lesson**: Always test locally BEFORE commit/push

## Quick Test Command

Create a quick test script to run before commits:

```bash
# Add to package.json scripts:
"precommit": "npm run build && npm run lint"
```

Then before committing:
```bash
npm run precommit && npm run dev
# Test in browser, then:
git add -A && git commit -m "..."
```

## Emergency Rollback

If you pushed breaking changes:

1. **Immediate**: Roll back in Vercel
   - Go to Vercel deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Fix**: Revert commit locally
   ```bash
   git revert HEAD
   git push
   ```

3. **Proper Fix**: Test the fix thoroughly before pushing again

## Notes

- Testing locally takes 5-10 minutes
- Fixing production issues takes hours
- **Always test before pushing!**
