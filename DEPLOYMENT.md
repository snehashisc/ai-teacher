# Deployment Guide for Vercel

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. Your Gemini API key

## Database Setup for Production

Since Vercel is serverless, we can't use SQLite. You have two options:

### Option 1: Vercel Postgres (Recommended - Free Tier Available)

1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

### Option 2: Other Postgres Providers

- **Neon** (https://neon.tech) - Free tier, excellent for serverless
- **Supabase** (https://supabase.com) - Free tier with additional features
- **Railway** (https://railway.app) - Simple setup

## Deployment Steps

### Step 1: Update Prisma Schema for PostgreSQL

Edit `prisma/schema.prisma` and change the datasource:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 2: Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

### Step 3: Login to Vercel

```bash
vercel login
```

### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **ai-teacher** (or your preferred name)
- In which directory is your code located? **./**
- Want to override settings? **N**

### Step 5: Set Environment Variables

After deployment, set your environment variables:

```bash
vercel env add GEMINI_API_KEY
# Paste your Gemini API key when prompted

vercel env add DATABASE_URL
# Paste your Postgres connection string when prompted
```

Or set them in the Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `DATABASE_URL`: Your Postgres connection string

### Step 6: Run Database Migrations

After setting environment variables, redeploy to run migrations:

```bash
vercel --prod
```

## Post-Deployment

### Initialize Database Schema

You'll need to push the schema to your production database. You can do this by:

1. **Locally with production DATABASE_URL**:
```bash
# Temporarily set production DATABASE_URL
DATABASE_URL="your_production_postgres_url" npx prisma db push
```

2. **Or add a postbuild script** (already configured in package.json):
The build will automatically run `prisma generate` before building.

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables Needed

- `GEMINI_API_KEY`: Your Google Gemini API key
- `DATABASE_URL`: PostgreSQL connection string (format: `postgresql://user:password@host:port/database`)

## Monitoring

- View logs in Vercel Dashboard → Your Project → Logs
- Monitor usage in Vercel Dashboard → Your Project → Analytics

## Quick Deploy Button

You can also use this one-click deploy (after pushing to GitHub):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-teacher)

## Troubleshooting

### Build Fails
- Make sure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Make sure your Postgres instance allows connections from Vercel IPs
- For Vercel Postgres, connection pooling is automatic

### API Errors
- Check that `GEMINI_API_KEY` is set in Vercel environment variables
- Verify the API key has proper permissions

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, unlimited API routes
- **Gemini API**: Free tier includes 15 RPM, 1M requests/day
- **Vercel Postgres**: Free tier includes 256MB storage, 60 hours compute
- **Alternative**: Use Neon free tier (512MB storage, always-on)

## Production Optimizations

After deployment, consider:

1. **Add caching** for curriculum data
2. **Implement rate limiting** to prevent abuse
3. **Add authentication** for multi-user support
4. **Enable Vercel Analytics** for insights
5. **Set up error tracking** (Sentry, LogRocket)

## Updating Deployment

After making changes:

```bash
git add .
git commit -m "Your changes"
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy (if connected).
