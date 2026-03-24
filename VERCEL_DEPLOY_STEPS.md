# Quick Vercel Deployment Steps

## Before Deploying - Database Setup

**IMPORTANT**: Vercel is serverless and doesn't support SQLite. You need a PostgreSQL database.

### Option 1: Use Vercel Postgres (Easiest)

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` connection string
4. Keep it for Step 3 below

### Option 2: Use Neon (Free, Recommended)

1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string
4. Keep it for Step 3 below

## Deployment Steps

### Step 1: Update Prisma Schema

Replace the contents of `prisma/schema.prisma` with `prisma/schema-postgres.prisma`:

```bash
cp prisma/schema-postgres.prisma prisma/schema.prisma
```

Or manually change line 7 in `prisma/schema.prisma`:
```
provider = "postgresql"  // Change from "sqlite"
```

### Step 2: Commit Changes

```bash
git add prisma/schema.prisma
git commit -m "Update schema for PostgreSQL"
```

### Step 3: Deploy to Vercel

```bash
vercel
```

Follow the prompts and select default options.

### Step 4: Add Environment Variables

In the Vercel dashboard or via CLI:

```bash
# Add Gemini API Key
vercel env add GEMINI_API_KEY production
# Paste: AIzaSyClYKtHFM299pUJtVSjtqU94ARB9e11-DY

# Add Database URL
vercel env add DATABASE_URL production
# Paste your PostgreSQL connection string
```

### Step 5: Initialize Database

Run this locally with your production database URL:

```bash
DATABASE_URL="your_postgres_url" npx prisma db push
```

### Step 6: Deploy to Production

```bash
vercel --prod
```

## Done!

Your app will be live at: `https://your-project.vercel.app`

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables in settings
5. Deploy!

Vercel will auto-deploy on every push to main/master.
