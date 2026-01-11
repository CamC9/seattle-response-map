# Deployment and Testing Workflow

## Production Deployment

This project is deployed on Vercel at: **https://seattle-response-map.vercel.app/**

## Testing Workflow

After pushing changes to the main branch, follow these steps to verify the deployment:

### 1. Check Deployment Status
Visit the Vercel deployments page:
- **URL**: https://vercel.com/camerons-projects-79ac799b/seattle-response-map/deployments
- Verify that the latest deployment has completed successfully
- Check for any build errors or warnings

### 2. End-to-End Testing
Once the deployment is successful, test the production site:
- **Production URL**: https://seattle-response-map.vercel.app/

#### Test Checklist:
- [ ] Page loads without errors
- [ ] Map renders correctly
- [ ] Date picker works and defaults to today's date
- [ ] Incidents are fetched and displayed
- [ ] Map markers appear for geocoded incidents
- [ ] Click on markers to view incident details
- [ ] Filter by incident type works
- [ ] Filter by incident level works
- [ ] Location search filters correctly
- [ ] Clear filters button resets all filters
- [ ] Statistics panel shows correct counts
- [ ] Responsive design works on mobile
- [ ] No console errors in browser developer tools

### 3. Common Issues to Check
- **Geocoding timeouts**: Check console for geocoding errors
- **API failures**: Verify Seattle Fire Department API is accessible
- **Map rendering**: Ensure Leaflet CSS loads correctly
- **Filter functionality**: Test all filter combinations

## Development vs Production

- **Local Development**: `npm run dev` → http://localhost:3000
- **Production**: Automatic deployment on push to `main` branch → https://seattle-response-map.vercel.app/

## Deployment Configuration

Vercel automatically builds and deploys from the `main` branch. The deployment includes:
- Next.js 15 with Turbopack
- TypeScript compilation
- Tailwind CSS processing
- Environment variables (if configured)

## Rollback Procedure

If a deployment introduces issues:
1. Visit the Vercel deployments page
2. Find the last working deployment
3. Click "Promote to Production" on that deployment
4. Fix the issue locally and push a new update

---

**Note**: Always verify production deployment after pushing to main to ensure all features work correctly in the live environment.
