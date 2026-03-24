# Complete GitHub + Vercel Deployment Guide

## Part 1: Create GitHub Repository

### Step 1: Create Repo on GitHub

1. Go to https://github.com/new
2. Repository name: `ai-teacher` (or any name you like)
3. Description: "Full Stack AI Teacher - Personalized learning with Gemini AI"
4. Keep it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Push Your Code

GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-teacher.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Part 2: Set Up Database

### Option A: Neon (Recommended - Free Forever)

1. Go to https://console.neon.tech
2. Sign up with GitHub
3. Click "Create a project"
4. Name: `ai-teacher`
5. Region: Choose closest to you
6. Click "Create project"
7. **Copy the connection string** - it looks like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
8. Save this for later!

### Option B: Vercel Postgres

1. Go to https://vercel.com/dashboard/stores
2. Click "Create Database"
3. Select "Postgres"
4. Name: `ai-teacher-db`
5. Region: Choose closest to you
6. Click "Create"
7. Copy the `DATABASE_URL` from the ".env.local" tab

## Part 3: Deploy to Vercel

### Step 1: Import Project

1. Go to https://vercel.com/new
2. Click "Import" next to your `ai-teacher` repository
3. Click "Import"

### Step 2: Configure Project

- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `./`
- **Build Command**: Leave default or set to `prisma generate && next build`
- **Install Command**: `npm install`

Click "Deploy" (it will fail - that's expected!)

### Step 3: Add Environment Variables

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

**Variable 1:**
- Name: `GEMINI_API_KEY`
- Value: `AIzaSyClYKtHFM299pUJtVSjtqU94ARB9e11-DY`
- Environment: Check all three (Production, Preview, Development)
- Click "Save"

**Variable 2:**
- Name: `DATABASE_URL`
- Value: Your PostgreSQL connection string from Part 2
- Environment: Check all three (Production, Preview, Development)
- Click "Save"

### Step 4: Initialize Database Schema

On your local machine, run:

```bash
DATABASE_URL="your_postgres_connection_string" npx prisma db push
```

Replace `your_postgres_connection_string` with the actual URL from Part 2.

This creates all the necessary tables in your production database.

### Step 5: Redeploy

1. Go to "Deployments" tab in Vercel
2. Click the three dots (•••) on the failed deployment
3. Click "Redeploy"
4. Wait 1-2 minutes for build to complete

## Part 4: Test Your Live App

1. Once deployment succeeds, click "Visit" or go to your deployment URL
2. It will be something like: `https://ai-teacher-app.vercel.app`
3. Test the full flow:
   - Enter student name and class
   - Select Math → Fractions → Basic Fractions
   - Chat with the AI teacher
   - Complete homework
   - View report

## Your App is Live!

Share your URL: `https://your-project.vercel.app`

## Automatic Deployments

Now whenever you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically deploy the changes!

## Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Monitoring

- **Logs**: Vercel Dashboard → Logs
- **Analytics**: Vercel Dashboard → Analytics  
- **Database**: Neon Dashboard (if using Neon)

## Costs

- **Vercel**: Free tier (100GB bandwidth, unlimited deployments)
- **Gemini API**: Free tier (15 RPM, 1M requests/day)
- **Neon**: Free tier (3GB storage, always-on)

Total cost: **$0** for MVP! 🎉

## Need Help?

If deployment fails:
1. Check build logs in Vercel
2. Verify environment variables are set
3. Make sure database schema was pushed
4. Check that your Gemini API key is valid

## Next Steps After Deployment

1. Test all features on production
2. Share with friends/students
3. Monitor usage and performance
4. Add more subjects and classes
5. Consider adding authentication for multi-user support
