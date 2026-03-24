# Deploy to Vercel - Step by Step

## Quick Deploy (Easiest Method)

### Step 1: Set Up Database (Choose One)

#### Option A: Neon (Recommended - Free Forever)
1. Go to https://neon.tech
2. Sign up with Google/GitHub
3. Click "Create Project"
4. Name it "ai-teacher"
5. Copy the connection string (looks like: `postgresql://user:pass@host/db`)

#### Option B: Vercel Postgres
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Name it "ai-teacher-db"
4. Copy the `DATABASE_URL`

### Step 2: Push to GitHub (Easiest Deployment)

```bash
# Create a new repo on GitHub (https://github.com/new)
# Name it: ai-teacher

# Then run these commands:
git remote add origin https://github.com/YOUR_USERNAME/ai-teacher.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Click "Import" next to your GitHub repo
3. Click "Deploy"
4. Wait for initial deployment (will fail - that's ok!)

### Step 4: Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these two variables:

1. **GEMINI_API_KEY**
   - Value: ''
   - Environment: Production, Preview, Development

2. **DATABASE_URL**
   - Value: Your PostgreSQL connection string from Step 1
   - Environment: Production, Preview, Development

### Step 5: Initialize Database

On your local machine, run:

```bash
# Use your production database URL
DATABASE_URL="your_postgres_url_here" npx prisma db push
```

This creates all the tables in your production database.

### Step 6: Redeploy

In Vercel Dashboard:
1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"

OR just push a new commit:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Alternative: Deploy via CLI

If you prefer CLI:

```bash
# Deploy (will prompt for project setup)
vercel

# Add environment variables via dashboard (easier than CLI)
# Then deploy to production
vercel --prod
```

## Your App Will Be Live At:

`https://ai-teacher-app.vercel.app` (or your custom URL)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure Prisma schema is set to PostgreSQL

### Database Connection Error
- Verify DATABASE_URL is correct
- Make sure you ran `prisma db push` with production URL

### API Key Error
- Verify GEMINI_API_KEY is set in Vercel environment variables
- Make sure it's set for "Production" environment

## After Deployment

Test your live app:
1. Visit your Vercel URL
2. Create a student profile
3. Select a subject and start learning!

## Monitoring

- **Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Vercel Dashboard → Your Project → Analytics
- **Database**: Check your Neon/Vercel Postgres dashboard

## Need Help?

Check the full deployment guide in `DEPLOYMENT.md`
