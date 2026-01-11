# Setup Guide: Mapbox + Supabase Geocoding

This guide will help you set up the geocoding system with Mapbox and Supabase caching.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: seattle-response-map
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your users (West US recommended)
4. Click **"Create new project"** (takes ~2 minutes)

## Step 2: Set Up Database Table

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the contents of `database/schema.sql` into the editor
4. Click **"Run"** to create the table

## Step 3: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Publishable key** (labeled as "Publishable key" - safe to use in browser with RLS enabled)

## Step 4: Create Mapbox Account

1. Go to [mapbox.com](https://mapbox.com) and sign up
2. After signup, you'll be taken to your account dashboard
3. Click **"Tokens"** in the top navigation
4. Your **Default Public Token** is already created - copy it
   - OR click **"Create a token"** if you want a dedicated one
   - Name it: "Seattle Response Map"
   - Scopes needed: just the default (Geocoding Forward is included)

## Step 5: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Fill in your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-default-key-here
MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token-here
```

⚠️ **Important**: Never commit `.env.local` to Git (it's already in `.gitignore`)

## Step 6: Configure Vercel Environment Variables

For production deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add these three variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` = your Supabase Publishable key
   - `MAPBOX_ACCESS_TOKEN` = your Mapbox access token
4. Click **"Save"** for each

## Step 7: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and check:
- Console logs should show "Cache miss, geocoding: [address]" for first requests
- Console logs should show "Cache hit for: [address]" for subsequent requests
- Map markers should appear for incidents
- Page should load in < 3 seconds

## Step 8: Deploy

```bash
git add -A
git commit -m "Add Mapbox + Supabase geocoding with caching"
git push
```

Vercel will automatically deploy. Check deployment at:
- https://seattle-response-map.vercel.app/

## Verify It's Working

1. Open your production site
2. Open browser DevTools > Network tab
3. Refresh the page
4. Look for `incidents` API call - should complete in < 3 seconds
5. Check map - should show blue markers for incident locations
6. In Supabase dashboard, go to **Table Editor** > **geocoded_addresses**
   - You should see addresses being cached with coordinates

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists and has correct values
- Restart dev server after creating `.env.local`

### "MAPBOX_ACCESS_TOKEN not configured" error
- Check that your Mapbox token is in `.env.local`
- Token should start with `pk.`

### No map markers appearing
- Check console for errors
- Verify Supabase table was created correctly
- Check that environment variables are set in Vercel (for production)

### Slow page loads (> 5 seconds)
- First load will be slower as it geocodes new addresses
- Subsequent loads should be fast (< 2 seconds) thanks to caching
- Check Supabase table is filling up with cached addresses

## Cost Monitoring

### Mapbox
- Dashboard: https://account.mapbox.com/
- Check usage under "Statistics"
- You get 100,000 requests/month FREE
- Your estimated usage: ~3,000/month

### Supabase
- Dashboard: Project > Settings > Usage
- You get 500MB database FREE
- Cache table should use < 1MB even with thousands of addresses

## Next Steps

After setup, the geocoding cache will build up automatically:
- Day 1: ~50-100 new addresses cached
- Week 1: ~500-700 addresses cached
- Month 1: ~95%+ cache hit rate = sub-second page loads!
